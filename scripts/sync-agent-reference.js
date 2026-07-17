#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'agents.json');
const outputPath = path.join(__dirname, 'data', 'wshobson-agent-inventory.json');
const sourceRepo = 'wshobson/agents';
const sourceBranch = 'main';
const excludedDefinitions = new Map([
  [
    'plugins/runapi-mcp/agents/task-executor.md',
    'Product-specific RunAPI media-task executor; intentionally excluded from the general repository implementation role.'
  ]
]);

function getJson(url) {
  return new Promise((resolve, reject) => {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'CraftRoster-Agent-Inventory' };
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    https.get(url, { headers }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        getJson(response.headers.location).then(resolve, reject);
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`GitHub API returned ${response.statusCode}: ${body}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error(`Unable to parse GitHub response: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const commitUrl = `https://api.github.com/repos/${sourceRepo}/commits/${sourceBranch}`;
  const commit = await getJson(commitUrl);
  const treeSha = commit && commit.commit && commit.commit.tree && commit.commit.tree.sha;
  if (!/^[0-9a-f]{40}$/.test(commit.sha || '') || !/^[0-9a-f]{40}$/.test(treeSha || '')) {
    throw new Error('GitHub commit response did not include valid commit and tree SHAs');
  }
  const treeUrl = `https://api.github.com/repos/${sourceRepo}/git/trees/${treeSha}?recursive=1`;
  const tree = await getJson(treeUrl);
  if (tree.truncated) throw new Error('GitHub returned a truncated tree; refusing to write an incomplete inventory');

  const sourceFiles = tree.tree
    .filter((entry) => entry.type === 'blob' && /^plugins\/[^/]+\/agents\/[^/]+\.md$/.test(entry.path))
    .sort((left, right) => left.path.localeCompare(right.path));
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const byReferencePath = new Map(catalog.agents.flatMap((agent) =>
    (agent.references.paths || []).map((referencePath) => [referencePath, agent])));

  const definitions = sourceFiles.map((entry) => {
    const [, plugin, sourceNameWithExtension] = entry.path.match(/^plugins\/([^/]+)\/agents\/([^/]+\.md)$/);
    const sourceName = path.basename(sourceNameWithExtension, '.md');
    const id = `${plugin}/${sourceName}`;
    const catalogEntry = byReferencePath.get(entry.path);
    const targetPath = catalogEntry ? catalogEntry.path : `agents/${sourceName}.md`;
    const runtimeName = catalogEntry ? catalogEntry.name : sourceName;
    const consolidated = catalogEntry
      && catalogEntry.id === runtimeName
      && catalogEntry.name === runtimeName
      && catalogEntry.path === targetPath;
    const exclusionReason = excludedDefinitions.get(entry.path);
    return {
      id,
      plugin,
      sourceName,
      runtimeName,
      status: exclusionReason ? 'excluded' : (consolidated ? 'consolidated' : 'pending'),
      ...(exclusionReason ? { exclusionReason } : {}),
      sourcePath: entry.path,
      sourceBlobSha: entry.sha,
      targetPath
    };
  });

  const roleCounts = new Map();
  for (const definition of definitions) {
    roleCounts.set(definition.sourceName, (roleCounts.get(definition.sourceName) || 0) + 1);
  }
  const consolidated = definitions.filter((definition) => definition.status === 'consolidated').length;
  const excluded = definitions.filter((definition) => definition.status === 'excluded').length;
  const inventory = {
    sourceRepo,
    sourceBranch,
    sourceCommitSha: commit.sha,
    sourceTreeSha: tree.sha,
    generatedAt: new Date().toISOString(),
    policy: 'Upstream paths, role names, and high-level responsibilities are reference inputs only. Duplicate or semantically overlapping upstream definitions may map to one independently rewritten, strengthened, first-party HsinPu Apache-2.0 Agent. Product-specific definitions that do not belong in the general catalog remain explicitly excluded with a reason.',
    totals: {
      definitions: definitions.length,
      uniqueRoleNames: roleCounts.size,
      repeatedRoleNames: [...roleCounts.values()].filter((count) => count > 1).length,
      repeatedDefinitions: definitions.length - roleCounts.size,
      uniqueSourceBlobs: new Set(definitions.map((definition) => definition.sourceBlobSha)).size,
      consolidated,
      excluded,
      remaining: definitions.length - consolidated - excluded
    },
    definitions
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
  console.log(`Agent reference synced: ${definitions.length} definitions, ${roleCounts.size} unique roles, ${consolidated} consolidated, ${excluded} excluded, ${definitions.length - consolidated - excluded} remaining`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
