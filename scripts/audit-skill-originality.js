#!/usr/bin/env node

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const { TextDecoder } = require('node:util');
const { computeReferenceLock } = require('./verify-skill-sources');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = 'skills.json';
const MANIFEST_PATH = 'scripts/data/skill-reference-sources.json';
const REFERENCE_LOCK_PATH = 'scripts/data/skill-reference-lock.json';
const MINIMUM_LINE_CHARACTERS = 60;
const MINIMUM_PHRASE_WORDS = 12;
const MINIMUM_CJK_PHRASE_CHARACTERS = 32;
const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 3;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const REVISION_PATTERN = /^[0-9a-f]{40}$/;
const BLOB_PATTERN = /^[0-9a-f]{40}$/;
const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KNOWN_TEXT_EXTENSIONS = new Set([
  '.bash', '.bat', '.cjs', '.cmd', '.conf', '.css', '.csv', '.fish', '.gql',
  '.graphql', '.htm', '.html', '.ini', '.java', '.js', '.json', '.jsonc',
  '.jsx', '.kt', '.kts', '.less', '.md', '.mdx', '.mjs', '.ps1', '.psd1',
  '.psm1', '.py', '.rb', '.rs', '.sass', '.scss', '.sh', '.sql', '.svelte',
  '.text', '.toml', '.ts', '.tsv', '.tsx', '.txt', '.vue', '.xml', '.yaml',
  '.yml', '.zsh',
]);
const KNOWN_TEXT_FILENAMES = new Set([
  'changelog', 'dockerfile', 'license', 'makefile', 'notice', 'readme', 'skill.md',
]);
const STRUCTURAL_FRONTMATTER_KEYS = new Set([
  'author', 'blob', 'commit', 'component', 'license', 'name', 'revision',
  'schema_version', 'source', 'tags', 'target', 'tree', 'version',
]);
const STRUCTURAL_FRONTMATTER_CONTAINERS = new Set([
  'metadata', 'ownership', 'reference',
]);
const RETRYABLE_NETWORK_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'EAI_AGAIN',
  'ENETUNREACH',
  'ETIMEDOUT',
]);

function usage() {
  console.log(`Usage: node scripts/audit-skill-originality.js

Fetches each referenced Skill's pinned raw GitHub sources and rejects suspicious
verbatim overlap with every text file in the canonical Skill package. The audit
checks normalized lines of at least ${MINIMUM_LINE_CHARACTERS} characters and
exact phrases of at least ${MINIMUM_PHRASE_WORDS} words or
${MINIMUM_CJK_PHRASE_CHARACTERS} CJK characters. Known text files must be
NUL-free UTF-8; unknown formats are skipped only when they decode as binary.`);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read ${label}: ${error.message}`);
  }
}

function stripFrontmatter(text) {
  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  return withoutBom.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
}

function filterStructuralFrontmatter(text) {
  const withoutBom = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const lines = withoutBom.split(/\r?\n/);
  if (lines[0] !== '---') return withoutBom;

  const closingIndex = lines.findIndex((line, index) => index > 0 && line === '---');
  if (closingIndex === -1) return withoutBom;

  const filtered = [];
  let skippedBlockIndent = null;
  for (const rawLine of lines.slice(1, closingIndex)) {
    const trimmed = rawLine.trim();
    const indentation = rawLine.match(/^ */)[0].length;
    if (skippedBlockIndent !== null) {
      if (trimmed === '' || indentation > skippedBlockIndent) continue;
      skippedBlockIndent = null;
    }

    const keyMatch = rawLine.match(/^( *)([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!keyMatch) {
      filtered.push(rawLine);
      continue;
    }

    const key = keyMatch[2].toLowerCase();
    const value = keyMatch[3].trim();
    if (STRUCTURAL_FRONTMATTER_CONTAINERS.has(key)) {
      if (value !== '') skippedBlockIndent = indentation;
      continue;
    }
    if (STRUCTURAL_FRONTMATTER_KEYS.has(key)) {
      if (value === '' || /^[>|][-+]?\s*(?:#.*)?$/.test(value)) {
        skippedBlockIndent = indentation;
      }
      continue;
    }
    filtered.push(rawLine);
  }

  return [...filtered, '', ...lines.slice(closingIndex + 1)].join('\n');
}

function tokens(value) {
  return value.normalize('NFKC').toLowerCase()
    .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
}

function isBoilerplateLine(rawLine) {
  const trimmed = rawLine.trim();
  return trimmed === ''
    || /^#{1,6}(?:\s|$)/.test(trimmed)
    || /^```/.test(trimmed)
    || /^~~~/.test(trimmed)
    || /^<!--.*-->$/.test(trimmed)
    || /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(trimmed)
    || /^\[[^\]]+\]:\s*(?:https?:\/\/|\.{0,2}\/)/i.test(trimmed)
    || /^\[!\[/.test(trimmed)
    || /^SPDX-License-Identifier\s*:/i.test(trimmed);
}

function isListItem(rawLine) {
  return /^\s{0,3}(?:[-+*]|\d+[.)])\s+/.test(rawLine);
}

function candidateParagraphs(text) {
  const results = [];
  let paragraphLines = [];

  const flush = () => {
    if (paragraphLines.length === 0) return;
    const raw = paragraphLines.map((line) => line.trim()).join(' ');
    const words = tokens(raw);
    results.push({ raw, words });
    paragraphLines = [];
  };

  for (const rawLine of filterStructuralFrontmatter(text).split(/\r?\n/)) {
    if (isBoilerplateLine(rawLine)) {
      flush();
      continue;
    }
    if (isListItem(rawLine) && paragraphLines.length > 0) flush();
    paragraphLines.push(rawLine);
  }
  flush();
  return results;
}

function candidateLines(text) {
  const results = [];
  for (const rawLine of filterStructuralFrontmatter(text).split(/\r?\n/)) {
    if (isBoilerplateLine(rawLine)) continue;
    const words = tokens(rawLine);
    if (words.length === 0) continue;
    results.push({
      normalized: words.join(' '),
      raw: rawLine.trim(),
      words,
    });
  }
  return results;
}

function comparableLines(text) {
  const lines = new Map();
  for (const candidate of candidateLines(text)) {
    if (candidate.normalized.length < MINIMUM_LINE_CHARACTERS) continue;
    if (!lines.has(candidate.normalized)) lines.set(candidate.normalized, candidate.raw);
  }
  return lines;
}

function phrases(text) {
  const results = new Map();
  for (const candidate of candidateParagraphs(text)) {
    for (let index = 0; index <= candidate.words.length - MINIMUM_PHRASE_WORDS; index += 1) {
      const phrase = candidate.words.slice(index, index + MINIMUM_PHRASE_WORDS).join(' ');
      if (!results.has(phrase)) results.set(phrase, candidate.raw);
    }
  }
  return results;
}

function cjkCharacters(value) {
  return value.normalize('NFKC').toLowerCase()
    .match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu) || [];
}

function cjkPhrases(text) {
  const results = new Map();
  for (const candidate of candidateParagraphs(text)) {
    const characters = cjkCharacters(candidate.raw);
    for (
      let index = 0;
      index <= characters.length - MINIMUM_CJK_PHRASE_CHARACTERS;
      index += 1
    ) {
      const phrase = characters.slice(index, index + MINIMUM_CJK_PHRASE_CHARACTERS).join('');
      if (!results.has(phrase)) results.set(phrase, candidate.raw);
    }
  }
  return results;
}

function firstOverlap(canonicalText, upstreamText) {
  const upstreamLines = comparableLines(upstreamText);
  for (const [normalized, localEvidence] of comparableLines(canonicalText)) {
    const upstreamEvidence = upstreamLines.get(normalized);
    if (upstreamEvidence) {
      return {
        kind: 'line',
        matchedText: normalized,
        localEvidence,
        upstreamEvidence,
      };
    }
  }

  const upstreamPhrases = phrases(upstreamText);
  for (const [phrase, localEvidence] of phrases(canonicalText)) {
    const upstreamEvidence = upstreamPhrases.get(phrase);
    if (upstreamEvidence) {
      return {
        kind: `${MINIMUM_PHRASE_WORDS}-word phrase`,
        matchedText: phrase,
        localEvidence,
        upstreamEvidence,
      };
    }
  }

  const upstreamCjkPhrases = cjkPhrases(upstreamText);
  for (const [phrase, localEvidence] of cjkPhrases(canonicalText)) {
    const upstreamEvidence = upstreamCjkPhrases.get(phrase);
    if (upstreamEvidence) {
      return {
        kind: `${MINIMUM_CJK_PHRASE_CHARACTERS}-CJK-character phrase`,
        matchedText: phrase,
        localEvidence,
        upstreamEvidence,
      };
    }
  }
  return null;
}

function decodeTextBuffer(buffer) {
  if (buffer.includes(0)) return null;
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return null;
  }
}

function textDecodeError(buffer) {
  if (buffer.includes(0)) return 'contains NUL bytes';
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    return null;
  } catch {
    return 'is not valid UTF-8';
  }
}

function isKnownTextFile(filePath) {
  const basename = path.basename(filePath).toLowerCase();
  return KNOWN_TEXT_FILENAMES.has(basename)
    || KNOWN_TEXT_EXTENSIONS.has(path.extname(basename));
}

function listTextFiles(skillDirectory, repoRoot) {
  const files = [];

  function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const filePath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`Refusing to follow symbolic link in Skill package: ${path.relative(repoRoot, filePath)}`);
      }
      if (entry.isDirectory()) {
        walk(filePath);
        continue;
      }
      if (!entry.isFile()) continue;
      const buffer = fs.readFileSync(filePath);
      const decodeError = textDecodeError(buffer);
      if (decodeError !== null) {
        if (isKnownTextFile(filePath)) {
          const relativePath = path.relative(repoRoot, filePath).split(path.sep).join('/');
          throw new Error(`Known text file ${relativePath} ${decodeError}`);
        }
        continue;
      }
      const text = decodeTextBuffer(buffer);
      files.push({
        absolutePath: filePath,
        path: path.relative(repoRoot, filePath).split(path.sep).join('/'),
        text,
      });
    }
  }

  walk(skillDirectory);
  return files;
}

function validRepositoryPath(value) {
  if (typeof value !== 'string' || value === '' || value.includes('\\') || value.startsWith('/')) return false;
  const segments = value.split('/');
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

function repositoryKey(value) {
  return typeof value === 'string' ? value.toLowerCase() : value;
}

function validateReferenceLock(manifest, lock, errors) {
  if (
    !lock
    || typeof lock !== 'object'
    || Array.isArray(lock)
    || lock.schema_version !== 1
    || !Number.isInteger(lock.repositoryCount)
    || !Number.isInteger(lock.referencedSkillCount)
    || !Number.isInteger(lock.referencePathCount)
    || !/^[0-9a-f]{64}$/.test(lock.evidenceSha256 || '')
  ) {
    errors.push(
      `${REFERENCE_LOCK_PATH} must use schema_version 1 with integer counts and a lowercase SHA-256 evidenceSha256`
    );
    return;
  }

  const computed = computeReferenceLock(manifest);
  for (const field of [
    'schema_version',
    'repositoryCount',
    'referencedSkillCount',
    'referencePathCount',
    'evidenceSha256',
  ]) {
    if (lock[field] !== computed[field]) {
      errors.push(
        `${REFERENCE_LOCK_PATH} ${field} does not match ${MANIFEST_PATH}; `
        + 'provenance changes require an explicit lock update and owner review'
      );
    }
  }
}

function buildAuditPlan(repoRoot = ROOT) {
  const catalog = readJson(path.join(repoRoot, CATALOG_PATH), CATALOG_PATH);
  const manifest = readJson(path.join(repoRoot, ...MANIFEST_PATH.split('/')), MANIFEST_PATH);
  const referenceLock = readJson(
    path.join(repoRoot, ...REFERENCE_LOCK_PATH.split('/')),
    REFERENCE_LOCK_PATH
  );
  const errors = [];

  if (!catalog || !Array.isArray(catalog.skills)) {
    throw new Error(`${CATALOG_PATH} must contain a skills array`);
  }
  if (!manifest || !Array.isArray(manifest.repositories)) {
    throw new Error(`${MANIFEST_PATH} must contain a repositories array`);
  }
  validateReferenceLock(manifest, referenceLock, errors);

  const sources = new Map();
  for (const [index, source] of manifest.repositories.entries()) {
    const label = `repositories[${index}]`;
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    const validRepo = REPOSITORY_PATTERN.test(source.repo || '');
    const sourceKey = repositoryKey(source.repo);
    if (!validRepo) errors.push(`${label}.repo is invalid`);
    if (!REVISION_PATTERN.test(source.commit || '')) errors.push(`${source.repo || label}: commit must be a full lowercase SHA`);
    if (!source.skills || typeof source.skills !== 'object' || Array.isArray(source.skills)) {
      errors.push(`${source.repo || label}: skills must be an object`);
    }
    if (validRepo && sources.has(sourceKey)) {
      errors.push(`${source.repo}: duplicate manifest repository (GitHub repository names are case-insensitive)`);
    } else if (validRepo) {
      sources.set(sourceKey, source);
    }
  }

  const items = [];
  const catalogNames = new Set();
  const referencedMappings = new Set();
  for (const [index, skill] of catalog.skills.entries()) {
    const label = `skills[${index}]`;
    if (!skill || typeof skill !== 'object' || Array.isArray(skill) || !SKILL_NAME_PATTERN.test(skill.name || '')) {
      errors.push(`${label}.name is invalid`);
      continue;
    }
    if (catalogNames.has(skill.name)) {
      errors.push(`${skill.name}: duplicate catalog entry`);
      continue;
    }
    catalogNames.add(skill.name);
    if (!skill.reference) continue;

    const reference = skill.reference;
    if (!reference || typeof reference !== 'object' || Array.isArray(reference)) {
      errors.push(`${skill.name}: reference must be an object`);
      continue;
    }
    if (!REPOSITORY_PATTERN.test(reference.source || '')) {
      errors.push(`${skill.name}: reference.source is invalid`);
      continue;
    }
    if (!REVISION_PATTERN.test(reference.revision || '')) {
      errors.push(`${skill.name}: reference.revision must be a full lowercase SHA`);
      continue;
    }

    const sourceKey = repositoryKey(reference.source);
    const source = sources.get(sourceKey);
    if (!source) {
      errors.push(`${skill.name}: ${reference.source} is missing from ${MANIFEST_PATH}`);
      continue;
    }
    if (source.repo !== reference.source) {
      errors.push(`${skill.name}: reference source casing must exactly match manifest repository ${source.repo}`);
    }
    if (source.commit !== reference.revision) {
      errors.push(`${skill.name}: catalog revision does not match ${reference.source} manifest commit`);
    }
    const evidence = source.skills && source.skills[skill.name];
    if (!Array.isArray(evidence) || evidence.length === 0) {
      errors.push(`${skill.name}: manifest mapping must list at least one upstream path`);
      continue;
    }

    const upstreamFiles = [];
    const upstreamPaths = new Set();
    for (const [evidenceIndex, entry] of evidence.entries()) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry) || !validRepositoryPath(entry.path)) {
        errors.push(`${reference.source}/${skill.name}[${evidenceIndex}].path is invalid`);
        continue;
      }
      if (!BLOB_PATTERN.test(entry.blob || '')) {
        errors.push(`${reference.source}/${skill.name}[${evidenceIndex}].blob must be a full lowercase SHA`);
      }
      if (upstreamPaths.has(entry.path)) {
        errors.push(`${reference.source}/${skill.name}: duplicate upstream path ${entry.path}`);
        continue;
      }
      upstreamPaths.add(entry.path);
      upstreamFiles.push({
        repo: reference.source,
        commit: reference.revision,
        path: entry.path,
      });
    }

    const skillDirectory = path.join(repoRoot, 'skills', skill.name);
    if (!fs.existsSync(skillDirectory) || !fs.statSync(skillDirectory).isDirectory()) {
      errors.push(`${skill.name}: canonical Skill package directory is missing`);
      continue;
    }
    let localFiles;
    try {
      localFiles = listTextFiles(skillDirectory, repoRoot);
    } catch (error) {
      errors.push(`${skill.name}: ${error.message}`);
      continue;
    }
    if (localFiles.length === 0) errors.push(`${skill.name}: canonical Skill package has no text files to audit`);
    referencedMappings.add(`${sourceKey}\0${skill.name}`);
    items.push({
      skill: skill.name,
      repo: reference.source,
      commit: reference.revision,
      localFiles,
      upstreamFiles,
    });
  }

  for (const source of manifest.repositories) {
    if (!source || !source.skills || typeof source.skills !== 'object' || Array.isArray(source.skills)) continue;
    for (const skillName of Object.keys(source.skills)) {
      if (!referencedMappings.has(`${repositoryKey(source.repo)}\0${skillName}`)) {
        errors.push(`${source.repo}/${skillName}: manifest mapping is not referenced by skills.json`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Skill originality audit plan is invalid:\n- ${errors.join('\n- ')}`);
  }

  return {
    items,
    referencedSkillCount: items.length,
    sourceCount: new Set(items.map((item) => item.repo)).size,
    localFileCount: items.reduce((total, item) => total + item.localFiles.length, 0),
    upstreamPathCount: items.reduce((total, item) => total + item.upstreamFiles.length, 0),
  };
}

function buildRawUrl({ repo, commit, path: referencePath }) {
  if (!REPOSITORY_PATTERN.test(repo || '')) throw new Error(`Invalid GitHub repository: ${repo}`);
  if (!REVISION_PATTERN.test(commit || '')) throw new Error(`Invalid pinned GitHub commit: ${commit}`);
  if (!validRepositoryPath(referencePath)) throw new Error(`Invalid GitHub repository path: ${referencePath}`);
  const encodedRepo = repo.split('/').map(encodeURIComponent).join('/');
  const encodedPath = referencePath.split('/').map(encodeURIComponent).join('/');
  return `https://raw.githubusercontent.com/${encodedRepo}/${commit}/${encodedPath}`;
}

function createAbortError(message = 'Request aborted') {
  const error = new Error(message);
  error.name = 'AbortError';
  error.code = 'ABORT_ERR';
  return error;
}

function requestRawText(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? MAX_RESPONSE_BYTES;
  const signal = options.signal;

  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(createAbortError());
      return;
    }

    let settled = false;
    let request;
    const settle = (callback, value) => {
      if (settled) return;
      settled = true;
      if (signal) signal.removeEventListener('abort', abortRequest);
      callback(value);
    };
    const abortRequest = () => {
      if (request) request.destroy(createAbortError());
      else settle(reject, createAbortError());
    };

    request = https.get(url, {
      headers: {
        Accept: 'text/plain, application/json;q=0.9, */*;q=0.1',
        'User-Agent': 'CraftRoster-Skill-Originality-Auditor',
      },
    }, (response) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        const error = new Error(`Raw GitHub request returned ${response.statusCode}: ${url}`);
        error.statusCode = response.statusCode;
        error.retryable = response.statusCode === 408
          || response.statusCode === 429
          || response.statusCode >= 500;
        response.resume();
        settle(reject, error);
        return;
      }

      const chunks = [];
      let receivedBytes = 0;
      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        if (receivedBytes > maxBytes) {
          const error = new Error(`Raw GitHub response exceeds ${maxBytes} bytes: ${url}`);
          error.code = 'ERESPONSETOOLARGE';
          response.destroy(error);
          return;
        }
        chunks.push(chunk);
      });
      response.on('end', () => {
        const body = Buffer.concat(chunks);
        const text = decodeTextBuffer(body);
        if (text === null) {
          settle(reject, new Error(`Raw GitHub response is not UTF-8 text: ${url}`));
          return;
        }
        settle(resolve, text);
      });
      response.on('aborted', () => {
        const error = new Error(`Raw GitHub response was aborted: ${url}`);
        error.code = 'ECONNRESET';
        error.retryable = true;
        settle(reject, error);
      });
      response.on('error', (error) => settle(reject, error));
    });

    request.setTimeout(timeoutMs, () => {
      const error = new Error(`Raw GitHub request timed out after ${timeoutMs}ms: ${url}`);
      error.code = 'ETIMEDOUT';
      error.retryable = true;
      request.destroy(error);
    });
    request.on('error', (error) => settle(reject, error));
    if (signal) {
      signal.addEventListener('abort', abortRequest, { once: true });
      if (signal.aborted) abortRequest();
    }
  });
}

function delay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(createAbortError());
      return;
    }
    const timer = setTimeout(() => {
      if (signal) signal.removeEventListener('abort', abortDelay);
      resolve();
    }, milliseconds);
    const abortDelay = () => {
      clearTimeout(timer);
      reject(createAbortError());
    };
    if (signal) signal.addEventListener('abort', abortDelay, { once: true });
  });
}

async function fetchPinnedText(reference, options = {}) {
  const attempts = options.attempts ?? MAX_ATTEMPTS;
  const baseDelayMs = options.baseDelayMs ?? 250;
  const request = options.request ?? requestRawText;
  const signal = options.signal;
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > MAX_ATTEMPTS) {
    throw new Error(`attempts must be an integer from 1 to ${MAX_ATTEMPTS}`);
  }
  const url = buildRawUrl(reference);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request(url, {
        timeoutMs: options.timeoutMs,
        maxBytes: options.maxBytes,
        signal,
      });
    } catch (error) {
      lastError = error;
      const retryable = error.retryable || RETRYABLE_NETWORK_CODES.has(error.code);
      if (error.name === 'AbortError' || attempt === attempts || !retryable) throw error;
      await delay(baseDelayMs * (2 ** (attempt - 1)), signal);
    }
  }
  throw lastError;
}

async function auditRepository(repoRoot = ROOT, options = {}) {
  const plan = buildAuditPlan(repoRoot);
  const fetchText = options.fetchText || ((reference) => fetchPinnedText(reference, options));
  const upstreamCache = new Map();
  const findings = [];
  let comparisons = 0;

  for (const item of plan.items) {
    for (const upstreamFile of item.upstreamFiles) {
      const cacheKey = `${upstreamFile.repo}\0${upstreamFile.commit}\0${upstreamFile.path}`;
      let upstreamTextPromise = upstreamCache.get(cacheKey);
      if (!upstreamTextPromise) {
        upstreamTextPromise = Promise.resolve().then(() => fetchText(upstreamFile));
        upstreamCache.set(cacheKey, upstreamTextPromise);
      }
      let upstreamText;
      try {
        upstreamText = await upstreamTextPromise;
      } catch (error) {
        throw new Error(
          `${item.skill}: unable to fetch ${upstreamFile.repo}@${upstreamFile.commit}/${upstreamFile.path}: ${error.message}`
        );
      }
      for (const localFile of item.localFiles) {
        comparisons += 1;
        const overlap = firstOverlap(localFile.text, upstreamText);
        if (!overlap) continue;
        findings.push({
          skill: item.skill,
          localPath: localFile.path,
          upstreamRepo: upstreamFile.repo,
          upstreamCommit: upstreamFile.commit,
          upstreamPath: upstreamFile.path,
          ...overlap,
        });
      }
    }
  }

  return {
    ...plan,
    findings,
    comparisons,
    fetchedPathCount: upstreamCache.size,
  };
}

function clipEvidence(value, maximum = 320) {
  return value.length <= maximum ? value : `${value.slice(0, maximum - 1)}…`;
}

async function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.length > 0) {
    if (argumentsList.length === 1 && ['--help', '-h'].includes(argumentsList[0])) {
      usage();
      return;
    }
    throw new Error(`Unknown argument: ${argumentsList.join(' ')}`);
  }

  const result = await auditRepository(ROOT);
  if (result.findings.length > 0) {
    console.error(`Skill originality audit failed with ${result.findings.length} suspicious overlap(s):`);
    for (const finding of result.findings) {
      console.error(`- ${finding.skill}: ${finding.localPath}`);
      console.error(`  upstream: ${finding.upstreamRepo}@${finding.upstreamCommit}/${finding.upstreamPath}`);
      console.error(`  match: ${finding.kind}: ${clipEvidence(finding.matchedText)}`);
      console.error(`  local evidence: ${clipEvidence(finding.localEvidence)}`);
      console.error(`  upstream evidence: ${clipEvidence(finding.upstreamEvidence)}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Skill originality audit passed: ${result.referencedSkillCount} Skills, `
    + `${result.localFileCount} local text files, ${result.fetchedPathCount} pinned upstream files, `
    + `${result.comparisons} comparisons`
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Skill originality audit failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  MAX_ATTEMPTS,
  MAX_RESPONSE_BYTES,
  MINIMUM_CJK_PHRASE_CHARACTERS,
  MINIMUM_LINE_CHARACTERS,
  MINIMUM_PHRASE_WORDS,
  REQUEST_TIMEOUT_MS,
  auditRepository,
  buildAuditPlan,
  buildRawUrl,
  candidateParagraphs,
  candidateLines,
  cjkPhrases,
  comparableLines,
  decodeTextBuffer,
  fetchPinnedText,
  filterStructuralFrontmatter,
  firstOverlap,
  phrases,
  requestRawText,
  stripFrontmatter,
  tokens,
  validateReferenceLock,
};
