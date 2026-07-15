#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const here = path.dirname(scriptPath);
const dataPath = path.resolve(here, '..', 'references', 'design-knowledge.json');

function usage() {
  return `Usage:
  node scripts/search-design-intelligence.mjs <query> [options]

Options:
  --query <text>       Supply query text explicitly
  --domain <name>      Hard-filter by domain; repeatable
  --stack <name>       Hard-filter by stack; repeatable
  --limit <1-50>       Maximum results (default: 8)
  --json               Emit machine-readable JSON
  --list-domains       List available domains and stacks
  --help               Show this help`;
}

function fail(message) {
  console.error(`Error: ${message}`);
  console.error(usage());
  process.exit(2);
}

function requireValue(args, index, flag) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) fail(`${flag} requires a value`);
  return value;
}

function parseArgs(args) {
  const options = {
    queryParts: [],
    domains: [],
    stacks: [],
    limit: 8,
    json: false,
    listDomains: false,
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help') options.help = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--list-domains') options.listDomains = true;
    else if (arg === '--query') {
      options.queryParts.push(requireValue(args, index, arg));
      index += 1;
    } else if (arg === '--domain') {
      options.domains.push(requireValue(args, index, arg).toLowerCase());
      index += 1;
    } else if (arg === '--stack') {
      options.stacks.push(requireValue(args, index, arg).toLowerCase());
      index += 1;
    } else if (arg === '--limit') {
      const raw = requireValue(args, index, arg);
      const parsed = Number.parseInt(raw, 10);
      if (!/^\d+$/.test(raw) || parsed < 1 || parsed > 50) fail('--limit must be an integer from 1 to 50');
      options.limit = parsed;
      index += 1;
    } else if (arg.startsWith('--')) {
      fail(`unknown option ${arg}`);
    } else {
      options.queryParts.push(arg);
    }
  }

  options.query = options.queryParts.join(' ').trim();
  return options;
}

function readDataset() {
  let raw;
  let parsed;
  try {
    raw = fs.readFileSync(dataPath, 'utf8');
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`unable to read design knowledge: ${error.message}`);
  }

  if (!parsed || typeof parsed.revision !== 'string' || parsed.revision.trim() === '' || !Array.isArray(parsed.records)) {
    fail('design knowledge must contain a revision and records array');
  }

  const required = ['id', 'domain', 'evidenceLevel', 'title', 'summary', 'signals', 'avoidWhen', 'evidence', 'tags', 'keywords', 'stacks', 'sources'];
  const evidenceLevels = new Set(['heuristic', 'standard-backed', 'research-backed']);
  const ids = new Set();
  for (const record of parsed.records) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) fail('every design knowledge record must be an object');
    for (const field of required) {
      if (!(field in record)) fail(`record ${record.id || '(unknown)'} is missing ${field}`);
    }
    for (const field of ['id', 'domain', 'evidenceLevel', 'title', 'summary']) {
      if (typeof record[field] !== 'string' || record[field].trim() === '') fail(`record ${record.id || '(unknown)'}.${field} must be a non-empty string`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)) fail(`invalid record id ${record.id}`);
    if (ids.has(record.id)) fail(`duplicate record id ${record.id}`);
    ids.add(record.id);
    if (!evidenceLevels.has(record.evidenceLevel)) fail(`${record.id}.evidenceLevel is invalid`);
    for (const field of ['signals', 'avoidWhen', 'evidence', 'tags', 'keywords', 'stacks', 'sources']) {
      if (!Array.isArray(record[field])) fail(`${record.id}.${field} must be an array`);
      if (record[field].some((value) => typeof value !== 'string' || value.trim() === '')) fail(`${record.id}.${field} must contain only non-empty strings`);
    }
    for (const field of ['signals', 'avoidWhen', 'evidence', 'tags', 'keywords', 'stacks']) {
      if (record[field].length === 0) fail(`${record.id}.${field} must not be empty`);
    }
  }
  return {
    ...parsed,
    datasetSha256: createHash('sha256').update(raw).digest('hex'),
    scriptSha256: createHash('sha256').update(fs.readFileSync(scriptPath)).digest('hex')
  };
}

function normalize(value) {
  return String(value).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function tokenize(value) {
  const chunks = normalize(value).match(/[\p{Script=Han}]+|[\p{L}\p{N}]+/gu) || [];
  const tokens = [];
  for (const chunk of chunks) {
    if (/^[\p{Script=Han}]+$/u.test(chunk)) {
      const characters = [...chunk];
      if (characters.length === 1) tokens.push(chunk);
      for (let size = 2; size <= Math.min(4, characters.length); size += 1) {
        for (let index = 0; index <= characters.length - size; index += 1) {
          tokens.push(characters.slice(index, index + size).join(''));
        }
      }
    } else if ([...chunk].length >= 2) {
      tokens.push(chunk);
    }
  }
  return [...new Set(tokens)];
}

function includesPhrase(text, phrase) {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return false;
  if (/\p{Script=Han}/u.test(normalizedPhrase)) return normalizedText.includes(normalizedPhrase);
  const escaped = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'u').test(normalizedText);
}

function scoreRecord(record, query) {
  if (!query) return { score: 1, matchedOn: ['filter-only'], contraMatchedOn: [], contraMatches: [] };

  const phrase = normalize(query);
  const queryTokens = [...new Set(tokenize(query))];
  const fields = [
    ['title', [record.title], 12],
    ['tags', record.tags, 10],
    ['keywords', record.keywords, 10],
    ['signals', record.signals, 6],
    ['summary', [record.summary], 5],
    ['evidence', record.evidence, 3]
  ];

  let score = 0;
  const matchedOn = [];
  for (const [name, values, weight] of fields) {
    const text = normalize(values.join(' '));
    const fieldTokens = new Set(tokenize(text));
    let fieldScore = 0;
    if (phrase && includesPhrase(text, phrase)) fieldScore += weight * 2;
    for (const token of queryTokens) {
      if (fieldTokens.has(token)) fieldScore += weight;
    }
    if (fieldScore > 0) {
      score += fieldScore;
      matchedOn.push(name);
    }
  }
  const avoidText = normalize(record.avoidWhen.join(' '));
  const avoidTokens = new Set(tokenize(avoidText));
  const contraMatches = queryTokens.filter((token) => avoidTokens.has(token));
  const exactContraMatch = Boolean(phrase && includesPhrase(avoidText, phrase));
  const strongTokenContraMatch = contraMatches.length >= 2
    && contraMatches.length / Math.max(1, queryTokens.length) >= 0.5;
  let contraScore = 0;
  if (exactContraMatch) contraScore += 12;
  if (strongTokenContraMatch) {
    contraScore += contraMatches.length * 6;
  }
  return {
    score: Math.max(0, score - contraScore),
    matchedOn,
    contraMatchedOn: contraScore > 0 ? ['avoidWhen'] : [],
    contraMatches: contraScore > 0 ? contraMatches : []
  };
}

function matchesFilters(record, options) {
  if (options.domains.length > 0 && !options.domains.includes(record.domain.toLowerCase())) return false;
  if (options.stacks.length > 0) {
    const recordStacks = record.stacks.map((stack) => stack.toLowerCase());
    if (!options.stacks.some((stack) => recordStacks.includes(stack) || recordStacks.includes('agnostic'))) return false;
  }
  return true;
}

function listVocabulary(dataset, asJson) {
  const domains = [...new Set(dataset.records.map((record) => record.domain))].sort();
  const stacks = [...new Set(dataset.records.flatMap((record) => record.stacks))].sort();
  const output = {
    revision: dataset.revision,
    datasetSha256: dataset.datasetSha256,
    scriptSha256: dataset.scriptSha256,
    domains,
    stacks
  };
  if (asJson) console.log(JSON.stringify(output, null, 2));
  else {
    console.log(`Dataset revision: ${dataset.revision}`);
    console.log(`Dataset SHA-256: ${dataset.datasetSha256}`);
    console.log(`Script SHA-256: ${dataset.scriptSha256}`);
    console.log(`Domains: ${domains.join(', ')}`);
    console.log(`Stacks: ${stacks.join(', ')}`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const dataset = readDataset();
  if (options.listDomains) {
    listVocabulary(dataset, options.json);
    return;
  }
  if (!options.query && options.domains.length === 0 && options.stacks.length === 0) {
    fail('provide a query or at least one domain or stack filter');
  }

  const matches = dataset.records
    .filter((record) => matchesFilters(record, options))
    .map((record) => ({ ...record, ...scoreRecord(record, options.query) }))
    .filter((record) => record.score > 0)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, options.limit);

  const result = {
    revision: dataset.revision,
    datasetSha256: dataset.datasetSha256,
    scriptSha256: dataset.scriptSha256,
    query: options.query,
    filters: { domains: options.domains, stacks: options.stacks },
    count: matches.length,
    matches,
    guidance: matches.length === 0
      ? ['No local lexical match was found. Broaden the query or remove a hard filter; do not fabricate a recommendation.']
      : ['Scores rank lexical relevance inside this seed dataset; validate every candidate against product evidence.']
  };

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Dataset revision: ${result.revision}`);
  console.log(`Dataset SHA-256: ${result.datasetSha256}`);
  console.log(`Script SHA-256: ${result.scriptSha256}`);
  console.log(`Query: ${result.query || '(filter-only)'}`);
  console.log(`Matches: ${result.count}`);
  for (const match of matches) {
    console.log(`\n${match.id} [${match.domain}] score=${match.score}`);
    console.log(match.title);
    console.log(match.summary);
    console.log(`Evidence level: ${match.evidenceLevel}`);
    console.log(`Matched on: ${match.matchedOn.join(', ')}`);
    if (match.contraMatchedOn.length > 0) console.log(`Counter-signal matched: ${match.contraMatchedOn.join(', ')} (${match.contraMatches.join(', ')})`);
    console.log(`Signals: ${match.signals.join('; ')}`);
    console.log(`Avoid when: ${match.avoidWhen.join('; ')}`);
    console.log(`Evidence prompts: ${match.evidence.join('; ')}`);
    console.log(`Sources: ${match.sources.length > 0 ? match.sources.join('; ') : '(none; original heuristic)'}`);
  }
  if (matches.length === 0) console.log(`\n${result.guidance[0]}`);
}

main();
