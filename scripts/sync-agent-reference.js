#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'agents.json');
const outputPath = path.join(__dirname, 'data', 'wshobson-agent-inventory.json');
const sourceRepo = 'wshobson/agents';
const sourceBranch = 'main';

function getJson(url) {
  return new Promise((resolve, reject) => {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'Autoverse-Agent-Inventory' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
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
  const treeUrl = `https://api.github.com/repos/${sourceRepo}/git/trees/${sourceBranch}?recursive=1`;
  const tree = await getJson(treeUrl);
  if (tree.truncated) throw new Error('GitHub returned a truncated tree; refusing to write an incomplete inventory');

  const sourceFiles = tree.tree
    .filter((entry) => entry.type === 'blob' && /^plugins\/[^/]+\/agents\/[^/]+\.md$/.test(entry.path))
    .sort((left, right) => left.path.localeCompare(right.path));
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const byReferencePath = new Map(catalog.agents.map((agent) => [agent.reference.path, agent]));

  const definitions = sourceFiles.map((entry) => {
    const [, plugin, sourceNameWithExtension] = entry.path.match(/^plugins\/([^/]+)\/agents\/([^/]+\.md)$/);
    const sourceName = path.basename(sourceNameWithExtension, '.md');
    const id = `${plugin}/${sourceName}`;
    const targetPath = `agents/${plugin}/${sourceName}.md`;
    const runtimeName = `${plugin}-${sourceName}`;
    const catalogEntry = byReferencePath.get(entry.path);
    const rewritten = catalogEntry
      && catalogEntry.id === id
      && catalogEntry.name === runtimeName
      && catalogEntry.path === targetPath;
    return {
      id,
      plugin,
      sourceName,
      runtimeName,
      status: rewritten ? 'rewritten' : 'pending',
      sourcePath: entry.path,
      sourceBlobSha: entry.sha,
      targetPath
    };
  });

  const roleCounts = new Map();
  for (const definition of definitions) {
    roleCounts.set(definition.sourceName, (roleCounts.get(definition.sourceName) || 0) + 1);
  }
  const rewritten = definitions.filter((definition) => definition.status === 'rewritten').length;
  const inventory = {
    sourceRepo,
    sourceBranch,
    sourceTreeSha: tree.sha,
    generatedAt: new Date().toISOString(),
    policy: 'Upstream file paths, role names, and high-level responsibilities are reference inputs only. Every Autoverse prompt is independently rewritten, strengthened, and published as first-party HsinPu Apache-2.0 content.',
    totals: {
      definitions: definitions.length,
      uniqueRoleNames: roleCounts.size,
      repeatedRoleNames: [...roleCounts.values()].filter((count) => count > 1).length,
      repeatedDefinitions: definitions.length - roleCounts.size,
      uniqueSourceBlobs: new Set(definitions.map((definition) => definition.sourceBlobSha)).size,
      rewritten,
      remaining: definitions.length - rewritten
    },
    definitions
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
  console.log(`Agent reference synced: ${definitions.length} definitions, ${roleCounts.size} role names, ${rewritten} rewritten, ${definitions.length - rewritten} remaining`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
