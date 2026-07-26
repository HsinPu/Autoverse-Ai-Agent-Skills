#!/usr/bin/env node

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function usage() {
  console.error(
    'Usage: node build-certification-manifest.js <skill-directory> --version <version> ' +
    '--source-sha <40-or-64-hex-sha> --evidence <file> [--evidence <file> ...] [--output <file>]',
  );
}

function parseArguments(argv) {
  const options = {
    evidence: [],
    output: null,
    sourceSha: null,
    target: null,
    version: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--version' || token === '--source-sha' || token === '--evidence' || token === '--output') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${token} requires a value`);
      if (token === '--version') options.version = value;
      else if (token === '--source-sha') options.sourceSha = value;
      else if (token === '--evidence') options.evidence.push(value);
      else options.output = value;
      index += 1;
    } else if (token.startsWith('-')) {
      throw new Error(`Unknown option: ${token}`);
    } else if (options.target === null) {
      options.target = token;
    } else {
      throw new Error(`Unexpected argument: ${token}`);
    }
  }

  if (!options.target) throw new Error('A Skill directory is required');
  if (!options.version || !options.version.trim()) throw new Error('--version is required');
  if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/.test(options.sourceSha || '')) {
    throw new Error('--source-sha must be a lowercase 40- or 64-character hexadecimal digest');
  }
  if (options.evidence.length === 0) throw new Error('At least one --evidence file is required');
  return options;
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function parseSkillName(source) {
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const field = match[1].match(/^name:\s*(.+?)\s*$/m);
  if (!field) return null;
  return field[1].replace(/^(['"])([\s\S]*)\1$/, '$2').trim();
}

function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function readFileRecord(filePath, label) {
  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink()) throw new Error(`Refusing symbolic link: ${label}`);
  if (!stat.isFile()) throw new Error(`Expected a regular file: ${label}`);
  const content = fs.readFileSync(filePath);
  return {
    bytes: content.length,
    sha256: hashBuffer(content),
    content,
  };
}

function collectPackageFiles(root, directory, outputPath, records) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => compareText(left.name, right.name));

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = toPosixPath(path.relative(root, absolutePath));
    const stat = fs.lstatSync(absolutePath);
    if (stat.isSymbolicLink()) throw new Error(`Refusing symbolic link in package: ${relativePath}`);
    if (outputPath && absolutePath === outputPath) continue;
    if (stat.isDirectory()) {
      collectPackageFiles(root, absolutePath, outputPath, records);
    } else if (stat.isFile()) {
      const record = readFileRecord(absolutePath, relativePath);
      records.push({
        path: relativePath,
        bytes: record.bytes,
        sha256: record.sha256,
      });
    } else {
      throw new Error(`Refusing non-regular package entry: ${relativePath}`);
    }
  }
}

function packageDigest(records) {
  const hasher = crypto.createHash('sha256');
  hasher.update('craftroster-skill-certification-package-v1\0', 'utf8');
  for (const record of records) {
    hasher.update(record.path, 'utf8');
    hasher.update('\0', 'utf8');
    hasher.update(String(record.bytes), 'ascii');
    hasher.update('\0', 'utf8');
    hasher.update(record.sha256, 'ascii');
    hasher.update('\0', 'utf8');
  }
  return hasher.digest('hex');
}

function evidenceLabel(filePath, index) {
  return `${String(index + 1).padStart(2, '0')}-${path.basename(filePath)}`;
}

function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    usage();
    console.error(error.message);
    process.exitCode = 2;
    return;
  }

  const target = fs.realpathSync(path.resolve(options.target));
  if (!fs.statSync(target).isDirectory()) throw new Error(`Skill directory does not exist: ${target}`);
  const skillFile = path.join(target, 'SKILL.md');
  if (!fs.existsSync(skillFile) || !fs.statSync(skillFile).isFile()) {
    throw new Error('The package must contain a regular SKILL.md file');
  }
  const skillName = parseSkillName(fs.readFileSync(skillFile, 'utf8'));
  if (!skillName || skillName !== path.basename(target)) {
    throw new Error('SKILL.md name must match the package directory');
  }

  let outputPath = null;
  if (options.output) {
    outputPath = path.resolve(options.output);
    if (isWithin(target, outputPath)) {
      throw new Error('Write the certification manifest outside the Skill package so it cannot change its own digest');
    }
    if (!fs.existsSync(path.dirname(outputPath)) || !fs.statSync(path.dirname(outputPath)).isDirectory()) {
      throw new Error('The manifest output directory must already exist');
    }
    if (fs.existsSync(outputPath)) {
      throw new Error(`Refusing to overwrite an existing manifest: ${outputPath}`);
    }
  }

  const packageFiles = [];
  collectPackageFiles(target, target, outputPath, packageFiles);
  packageFiles.sort((left, right) => compareText(left.path, right.path));
  const evidence = options.evidence.map((filePath, index) => {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`Evidence file does not exist: ${filePath}`);
    const record = readFileRecord(absolutePath, filePath);
    return {
      label: evidenceLabel(filePath, index),
      bytes: record.bytes,
      sha256: record.sha256,
    };
  });

  const baseManifest = {
    schema_version: 1,
    kind: 'skill-certification-candidate-manifest',
    status: 'unsigned-unapproved',
    skill: {
      name: skillName,
      version: options.version.trim(),
      source_sha: options.sourceSha,
    },
    package: {
      file_count: packageFiles.length,
      total_bytes: packageFiles.reduce((sum, record) => sum + record.bytes, 0),
      sha256: packageDigest(packageFiles),
      files: packageFiles,
    },
    evidence,
    claims: {
      deterministic_gates_passed: false,
      semantic_evaluation_passed: false,
      security_review_passed: false,
      runtime_proof_passed: false,
    },
    exceptions: [],
  };
  const canonical = JSON.stringify(baseManifest);
  const manifest = {
    ...baseManifest,
    manifest_sha256: hashBuffer(Buffer.from(canonical, 'utf8')),
  };
  const output = `${JSON.stringify(manifest, null, 2)}\n`;

  if (outputPath) {
    fs.writeFileSync(outputPath, output, { encoding: 'utf8', flag: 'wx' });
    console.error(`Wrote unsigned candidate manifest: ${outputPath}`);
  } else {
    process.stdout.write(output);
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 2;
}
