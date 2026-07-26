#!/usr/bin/env node

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DEFAULT_MAX_TEXT_BYTES = 1024 * 1024;
const SCRIPT_EXTENSIONS = new Set([
  '.bat', '.cmd', '.js', '.mjs', '.ps1', '.py', '.rb', '.sh', '.ts',
]);
const BINARY_EXTENSIONS = new Set([
  '.app', '.class', '.dll', '.dmg', '.exe', '.jar', '.msi', '.node', '.so',
]);
const ARCHIVE_EXTENSIONS = new Set([
  '.7z', '.bz2', '.gz', '.rar', '.tar', '.tgz', '.xz', '.zip',
]);
const MANIFEST_NAMES = new Set([
  'cargo.toml', 'composer.json', 'deno.json', 'deno.jsonc', 'gemfile',
  'go.mod', 'package.json', 'pipfile', 'pyproject.toml', 'requirements.txt',
]);
const ALLOWED_DOTFILES = new Set([
  '.gitignore', '.gitattributes', '.npmignore',
]);
const SEVERITY_ORDER = new Map([
  ['high', 0],
  ['medium', 1],
  ['low', 2],
]);
const TEXT_RISK_PATTERNS = [
  {
    id: 'download-and-execute',
    severity: 'high',
    pattern: /(?:curl|wget|invoke-webrequest|invoke-restmethod|\birm\b)[^\r\n]{0,240}(?:\|\s*(?:bash|sh|zsh|iex|invoke-expression)|\b(?:bash|sh|zsh)\s+-c\b)/i,
  },
  {
    id: 'destructive-delete',
    severity: 'high',
    pattern: /(?:\brm\s+-[^\r\n]*r[^\r\n]*f\b|\bremove-item\b[^\r\n]*(?:-recurse|-force)|\brmdir\s+\/s\b|\bdel\s+\/[a-z]*[sq][a-z]*\b)/i,
  },
  {
    id: 'credential-or-secret-access',
    severity: 'medium',
    pattern: /(?:process\.env\b|os\.environ\b|getenv\s*\(|\$env:|\.ssh(?:\/|\\)|\.aws(?:\/|\\)|keychain|credential\s*manager|api[_-]?key|access[_-]?token)/i,
  },
  {
    id: 'subprocess-or-shell-execution',
    severity: 'medium',
    pattern: /(?:child_process|execfile\s*\(|execsync\s*\(|spawnsync\s*\(|subprocess\.|os\.system\s*\(|shell\s*:\s*true|invoke-expression|\biex\b)/i,
  },
  {
    id: 'network-access',
    severity: 'medium',
    pattern: /(?:\bnpx(?:\.cmd)?\b|fetch\s*\(|axios\.|requests\.(?:get|post|put|delete)|invoke-webrequest|invoke-restmethod|\bcurl\b|\bwget\b)/i,
  },
  {
    id: 'remote-reference',
    severity: 'low',
    pattern: /https?:\/\//i,
  },
  {
    id: 'authority-expansion-language',
    severity: 'medium',
    pattern: /(?:ignore (?:all )?(?:previous|prior|system) instructions|reveal (?:the )?(?:system prompt|secrets?)|bypass (?:approval|permissions?|policy|sandbox))/i,
  },
];

function usage() {
  console.error('Usage: node scan-skill.js <skill-directory> [--json] [--max-text-bytes <bytes>]');
}

function parseArguments(argv) {
  const options = {
    json: false,
    maxTextBytes: DEFAULT_MAX_TEXT_BYTES,
    target: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--json') {
      options.json = true;
    } else if (token === '--max-text-bytes') {
      const value = Number(argv[index + 1]);
      if (!Number.isSafeInteger(value) || value < 1024) {
        throw new Error('--max-text-bytes must be an integer of at least 1024');
      }
      options.maxTextBytes = value;
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

function parseFrontmatter(source) {
  const normalized = source.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n') && !normalized.startsWith('---\r\n')) {
    return { description: null, name: null, present: false };
  }
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { description: null, name: null, present: false };

  const readScalar = (key) => {
    const field = match[1].match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
    if (!field) return null;
    return field[1].replace(/^(['"])([\s\S]*)\1$/, '$2').trim();
  };

  return {
    description: readScalar('description'),
    name: readScalar('name'),
    present: true,
  };
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hasher = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hasher.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hasher.digest('hex')));
  });
}

function looksBinary(filePath, size) {
  if (size === 0) return false;
  const descriptor = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(Math.min(size, 8192));
    const bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, 0);
    return buffer.subarray(0, bytesRead).includes(0);
  } finally {
    fs.closeSync(descriptor);
  }
}

function addSignal(signals, severity, id, relativePath, detail, line = null) {
  signals.push({
    severity,
    id,
    path: relativePath,
    ...(line === null ? {} : { line }),
    detail,
  });
}

function scanText(source, relativePath, signals) {
  const lines = source.split(/\r?\n/);
  for (const rule of TEXT_RISK_PATTERNS) {
    const lineIndex = lines.findIndex((line) => rule.pattern.test(line));
    if (lineIndex >= 0) {
      addSignal(
        signals,
        rule.severity,
        rule.id,
        relativePath,
        `Matched ${rule.id}; inspect the referenced line before execution.`,
        lineIndex + 1,
      );
    }
  }
}

async function walkDirectory(root, directory, options, result) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => compareText(left.name, right.name));

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = toPosixPath(path.relative(root, absolutePath));
    const stat = fs.lstatSync(absolutePath);

    if (stat.isSymbolicLink()) {
      result.surfaces.symlinks.push(relativePath);
      addSignal(
        result.signals,
        'high',
        'symbolic-link',
        relativePath,
        'Symbolic links are not followed because they may escape the package boundary.',
      );
      continue;
    }

    if (stat.isDirectory()) {
      await walkDirectory(root, absolutePath, options, result);
      continue;
    }

    if (!stat.isFile()) {
      addSignal(
        result.signals,
        'high',
        'special-file',
        relativePath,
        'Non-regular filesystem entries require quarantine and manual review.',
      );
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    const lowerName = entry.name.toLowerCase();
    const binary = looksBinary(absolutePath, stat.size);
    const fileRecord = {
      path: relativePath,
      bytes: stat.size,
      sha256: await hashFile(absolutePath),
      kind: binary ? 'binary' : 'text',
    };
    result.files.push(fileRecord);
    result.totalBytes += stat.size;

    if (entry.name.startsWith('.') && !ALLOWED_DOTFILES.has(entry.name)) {
      result.surfaces.hidden.push(relativePath);
      addSignal(result.signals, 'medium', 'hidden-file', relativePath, 'Unexpected dotfile requires review.');
    }
    if (SCRIPT_EXTENSIONS.has(extension) || (stat.mode & 0o111) !== 0) {
      result.surfaces.scripts.push(relativePath);
    }
    if (BINARY_EXTENSIONS.has(extension) || binary) {
      result.surfaces.binaries.push(relativePath);
      addSignal(result.signals, 'high', 'binary-or-executable', relativePath, 'Opaque or binary content cannot be approved by text inspection.');
    }
    if (ARCHIVE_EXTENSIONS.has(extension)) {
      result.surfaces.archives.push(relativePath);
      addSignal(result.signals, 'medium', 'archive', relativePath, 'Archive contents must be inventoried separately before use.');
    }
    if (MANIFEST_NAMES.has(lowerName) || lowerName.endsWith('.lock')) {
      result.surfaces.dependencyManifests.push(relativePath);
    }

    if (!binary) {
      if (stat.size > options.maxTextBytes) {
        addSignal(
          result.signals,
          'low',
          'text-scan-size-limit',
          relativePath,
          `Text content exceeds the ${options.maxTextBytes}-byte scan limit; only its hash and metadata were recorded.`,
        );
      } else {
        scanText(fs.readFileSync(absolutePath, 'utf8'), relativePath, result.signals);
      }
    }
  }
}

function compareSignals(left, right) {
  return (SEVERITY_ORDER.get(left.severity) - SEVERITY_ORDER.get(right.severity)) ||
    compareText(left.path, right.path) ||
    compareText(left.id, right.id);
}

function dispositionFor(signals) {
  if (signals.some((signal) => signal.severity === 'high')) {
    return {
      status: 'stop-and-review',
      next_skill: 'skill-security-review',
      reason: 'High-risk or opaque package content needs focused review before execution or installation.',
    };
  }
  if (signals.some((signal) => signal.severity === 'medium')) {
    return {
      status: 'needs-review',
      next_skill: 'skill-audit',
      reason: 'The scan found behavior or package surfaces that require semantic review.',
    };
  }
  return {
    status: 'continue',
    next_skill: 'skill-lint',
    reason: 'No blocking first-pass signal was found; deterministic lint is the next gate.',
  };
}

function renderHuman(report) {
  const lines = [
    `Skill scan: ${report.skill.folder}`,
    `Disposition: ${report.disposition.status} -> ${report.disposition.next_skill}`,
    `Files: ${report.inventory.file_count}; bytes: ${report.inventory.total_bytes}`,
    `Scripts: ${report.surfaces.scripts.length}; binaries: ${report.surfaces.binaries.length}; archives: ${report.surfaces.archives.length}; signals: ${report.signals.length}`,
  ];

  if (!report.skill.frontmatter_present) lines.push('HIGH missing-frontmatter SKILL.md');
  if (!report.skill.folder_matches_name) {
    lines.push(`MEDIUM folder-name-mismatch expected=${report.skill.name || '(missing)'}`);
  }
  for (const signal of report.signals) {
    lines.push(
      `${signal.severity.toUpperCase()} ${signal.id} ${signal.path}${signal.line ? `:${signal.line}` : ''}`,
    );
  }
  lines.push(`Reason: ${report.disposition.reason}`);
  lines.push('Limitations: static triage only; dependencies, runtime behavior, network destinations, and safety approval are not proven.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    usage();
    console.error(error.message);
    process.exitCode = 2;
    return;
  }

  const target = path.resolve(options.target);
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    console.error(`Skill directory does not exist: ${target}`);
    process.exitCode = 2;
    return;
  }
  const realTarget = fs.realpathSync(target);

  const result = {
    files: [],
    signals: [],
    surfaces: {
      archives: [],
      binaries: [],
      dependencyManifests: [],
      hidden: [],
      scripts: [],
      symlinks: [],
    },
    totalBytes: 0,
  };

  await walkDirectory(realTarget, realTarget, options, result);
  const skillFile = path.join(realTarget, 'SKILL.md');
  let frontmatter = { description: null, name: null, present: false };
  if (fs.existsSync(skillFile) && fs.statSync(skillFile).isFile()) {
    frontmatter = parseFrontmatter(fs.readFileSync(skillFile, 'utf8'));
  } else {
    addSignal(result.signals, 'high', 'missing-skill-file', 'SKILL.md', 'The package has no regular SKILL.md file.');
  }

  const folder = path.basename(realTarget);
  result.files.sort((left, right) => compareText(left.path, right.path));
  for (const values of Object.values(result.surfaces)) values.sort(compareText);
  result.signals.sort(compareSignals);

  const report = {
    schema_version: 1,
    scan_mode: 'read-only-static-triage',
    skill: {
      folder,
      name: frontmatter.name,
      description_present: Boolean(frontmatter.description),
      frontmatter_present: frontmatter.present,
      folder_matches_name: Boolean(frontmatter.name) && frontmatter.name === folder,
    },
    inventory: {
      file_count: result.files.length,
      total_bytes: result.totalBytes,
      files: result.files,
    },
    surfaces: result.surfaces,
    signals: result.signals,
    disposition: dispositionFor(result.signals),
    limitations: [
      'No dependency resolution or vulnerability lookup was performed.',
      'No script, network request, external action, or bundled executable was run.',
      'A clean scan is not a security approval or release certification.',
    ],
  };

  process.stdout.write(options.json ? `${JSON.stringify(report, null, 2)}\n` : renderHuman(report));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 2;
});
