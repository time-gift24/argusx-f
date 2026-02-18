#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function extractGaps(content) {
  const gaps = [];
  const regex = /###\s*(Gap-\d+:[^\n]+)\n([\s\S]*?)(?=\n###\s*Gap-\d+:|\n##\s*\d+\.|\s*$)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[2].trim();
    const evidenceLine = body.match(/证据[:：]\s*([^\n]+)/);
    const evidence = evidenceLine
      ? evidenceLine[1].split(',').map((part) => part.trim()).filter(Boolean)
      : [];
    const suggestions = [];
    const suggestionBlock = body.match(/本地改造建议[:：]\s*([\s\S]*?)(?=\n###|\n##|\s*$)/);
    if (suggestionBlock) {
      for (const line of suggestionBlock[1].split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ')) {
          suggestions.push(trimmed.slice(2).trim());
        }
      }
    }

    gaps.push({ title, evidence, suggestions });
  }
  return gaps.slice(0, 3);
}

function extractEntrySummary(content, maxLines = 8) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines);
  return lines;
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = resolve(args['repo-root'] ?? process.cwd());
  const component = args.component;
  if (!component) {
    throw new Error('Missing --component');
  }

  const baselineDir = resolve(args['baseline-dir'] ?? `${repoRoot}/previews/shadcn/${component}`);
  const analysisPath = resolve(`${baselineDir}/analysis.md`);
  const capabilityPath = resolve(`${baselineDir}/capability-analysis.md`);

  const analysisExists = existsSync(analysisPath);
  const capabilityExists = existsSync(capabilityPath);

  const analysisContent = analysisExists ? await readFile(analysisPath, 'utf8') : '';
  const capabilityContent = capabilityExists ? await readFile(capabilityPath, 'utf8') : '';

  const topGaps = capabilityExists ? extractGaps(capabilityContent) : [];
  const recommendedActions = [];
  for (const gap of topGaps) {
    for (const suggestion of gap.suggestions) {
      if (!recommendedActions.includes(suggestion)) {
        recommendedActions.push(suggestion);
      }
    }
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push('补齐关键 API 与默认值');
    recommendedActions.push('对齐交互语义与可访问性');
    recommendedActions.push('补齐核心回归测试');
  }

  const result = {
    component,
    baselineDir,
    hasAnalysis: analysisExists,
    hasCapabilityAnalysis: capabilityExists,
    analysisEntrySummary: analysisExists ? extractEntrySummary(analysisContent) : [],
    topGaps,
    recommendedActions: recommendedActions.slice(0, 8),
    generatedAt: new Date().toISOString(),
  };

  if (args.out) {
    await writeFile(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  console.error(`derive_best_of_plan failed: ${error.message}`);
  process.exit(1);
});
