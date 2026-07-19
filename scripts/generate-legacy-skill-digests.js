#!/usr/bin/env node

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'scripts', 'data', 'legacy-skill-content-sha256.tsv');
const firstInstallerCommit = '3e5d15ebf81bcdc53bf187cad734020875e4d560';
const lastNoDigestCommit = 'e66a7ff4f6978f430cfccae34a7f7018e5d20498';
const historyRange = `${firstInstallerCommit}^..${lastNoDigestCommit}`;
const digestNamespace = 'craftroster-skill-content-v1';
const checkOnly = process.argv.includes('--check');

function git(args, options = {}) {
  return execFileSync(
    'git',
    ['-c', `safe.directory=${root.replace(/\\/g, '/')}`, ...args],
    {
      cwd: root,
      encoding: options.encoding ?? null,
      input: options.input,
      maxBuffer: 256 * 1024 * 1024,
      windowsHide: true,
    },
  );
}

function parseTree(buffer) {
  const entries = [];
  for (const record of buffer.toString('utf8').split('\0')) {
    if (!record) continue;
    const match = /^(\d+) blob ([0-9a-f]+)\t(.+)$/.exec(record);
    if (!match) continue;
    entries.push({ mode: match[1], object: match[2], path: match[3] });
  }
  return entries;
}

function skillLocation(filePath) {
  let match = /^skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(.+)$/.exec(filePath);
  if (match) return { name: match[1], relativePath: match[2] };
  match = /^([a-z0-9]+(?:-[a-z0-9]+)*)\/(.+)$/.exec(filePath);
  if (match) return { name: match[1], relativePath: match[2] };
  return null;
}

function collectSnapshots(commits) {
  const snapshotsBySkill = new Map();
  const blobIds = new Set();

  for (const commit of commits) {
    const groups = new Map();
    for (const entry of parseTree(git(['ls-tree', '-r', '-z', '--full-tree', commit]))) {
      const location = skillLocation(entry.path);
      if (!location || location.relativePath === '.skill-meta.json') continue;
      if (entry.mode !== '100644' && entry.mode !== '100755') {
        throw new Error(`Unsupported historical Skill file mode ${entry.mode}: ${commit}:${entry.path}`);
      }
      const files = groups.get(location.name) || [];
      files.push({ relativePath: location.relativePath, object: entry.object });
      groups.set(location.name, files);
    }

    for (const [name, files] of groups) {
      if (!files.some((file) => file.relativePath === 'SKILL.md')) continue;
      files.sort((left, right) => Buffer.compare(
        Buffer.from(left.relativePath, 'utf8'),
        Buffer.from(right.relativePath, 'utf8'),
      ));
      const signature = files.map((file) => `${file.relativePath}\0${file.object}`).join('\0');
      const snapshots = snapshotsBySkill.get(name) || new Map();
      if (!snapshots.has(signature)) snapshots.set(signature, files);
      snapshotsBySkill.set(name, snapshots);
      files.forEach((file) => blobIds.add(file.object));
    }
  }

  return { snapshotsBySkill, blobIds };
}

function readBlobs(blobIds) {
  const ids = [...blobIds];
  const output = git(['cat-file', '--batch'], { input: Buffer.from(`${ids.join('\n')}\n`, 'ascii') });
  const blobs = new Map();
  let offset = 0;

  for (const expectedId of ids) {
    const lineEnd = output.indexOf(0x0a, offset);
    if (lineEnd < 0) throw new Error(`Missing cat-file header for ${expectedId}`);
    const header = output.subarray(offset, lineEnd).toString('ascii');
    const match = /^([0-9a-f]+) blob (\d+)$/.exec(header);
    if (!match || match[1] !== expectedId) throw new Error(`Unexpected cat-file header: ${header}`);
    const size = Number(match[2]);
    const contentStart = lineEnd + 1;
    const contentEnd = contentStart + size;
    if (!Number.isSafeInteger(size) || size < 0 || output[contentEnd] !== 0x0a) {
      throw new Error(`Invalid cat-file payload for ${expectedId}`);
    }
    blobs.set(expectedId, output.subarray(contentStart, contentEnd));
    offset = contentEnd + 1;
  }
  if (offset !== output.length) throw new Error('Unexpected trailing cat-file output');
  return blobs;
}

function snapshotDigest(files, blobs) {
  const hasher = crypto.createHash('sha256');
  hasher.update(digestNamespace, 'utf8');
  hasher.update(Buffer.from([0]));
  for (const file of files) {
    const content = blobs.get(file.object);
    if (!content) throw new Error(`Missing historical blob ${file.object}`);
    hasher.update(file.relativePath, 'utf8');
    hasher.update(Buffer.from([0]));
    hasher.update(String(content.length), 'ascii');
    hasher.update(Buffer.from([0]));
    hasher.update(content);
    hasher.update(Buffer.from([0]));
  }
  return hasher.digest('hex');
}

function buildManifest() {
  const commits = git(['rev-list', '--reverse', historyRange], { encoding: 'utf8' })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  if (commits.length === 0 || commits[0] !== firstInstallerCommit || commits.at(-1) !== lastNoDigestCommit) {
    throw new Error(`Historical range is incomplete: ${historyRange}`);
  }

  const { snapshotsBySkill, blobIds } = collectSnapshots(commits);
  const blobs = readBlobs(blobIds);
  const rows = [];
  for (const name of [...snapshotsBySkill.keys()].sort()) {
    const digests = new Set();
    for (const files of snapshotsBySkill.get(name).values()) {
      digests.add(snapshotDigest(files, blobs));
    }
    for (const digest of [...digests].sort()) rows.push(`${name}\t${digest}`);
  }

  return [
    '# craftroster-verified-legacy-skill-content-v1',
    `# digest-namespace: ${digestNamespace}`,
    `# history-range: ${historyRange}`,
    `# skills: ${snapshotsBySkill.size}`,
    `# entries: ${rows.length}`,
    ...rows,
    '',
  ].join('\n');
}

const generated = buildManifest();
if (checkOnly) {
  const existing = fs.readFileSync(manifestPath, 'utf8').replace(/\r\n/g, '\n');
  if (existing !== generated) {
    console.error(`Legacy Skill digest manifest is stale: ${path.relative(root, manifestPath)}`);
    process.exit(1);
  }
  console.log('Legacy Skill digest manifest is current');
} else {
  fs.writeFileSync(manifestPath, generated, 'utf8');
  console.log(`Wrote ${path.relative(root, manifestPath)}`);
}
