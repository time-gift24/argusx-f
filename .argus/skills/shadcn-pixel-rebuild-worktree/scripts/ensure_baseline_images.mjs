#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
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

function buildShadcnPreviewUrl(component) {
  const item = encodeURIComponent(`${component}-example`);
  return `https://ui.shadcn.com/preview/radix/${component}-example?item=${item}&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite`;
}

async function countPngFiles(dir) {
  if (!existsSync(dir)) return 0;
  const files = await readdir(dir);
  return files.filter((name) => name.toLowerCase().endsWith('.png')).length;
}

async function ensureScenarioFile(scenarioPath, component) {
  if (existsSync(scenarioPath)) {
    return { scenarioPath, generated: false };
  }

  const scenario = {
    waitAfterLoadMs: 1200,
    networkIdleTimeoutMs: 4000,
    shots: [
      {
        name: `${component}-default`,
        screenshot: {
          file: `${component}-default.png`,
          fullPage: true,
        },
      },
    ],
  };
  await writeFile(scenarioPath, `${JSON.stringify(scenario, null, 2)}\n`, 'utf8');
  return { scenarioPath, generated: true };
}

function runCommand(command, args, cwd) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, { cwd, env: process.env });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('close', (exitCode) => {
      resolvePromise({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = resolve(args['repo-root'] ?? process.cwd());
  const component = args.component;
  if (!component) {
    throw new Error('Missing --component');
  }

  const baselineDir = resolve(args['baseline-dir'] ?? `${repoRoot}/previews/shadcn/${component}`);
  const scenarioPath = resolve(args.scenario ?? `${baselineDir}/capture.scenario.json`);
  await mkdir(baselineDir, { recursive: true });

  const existingPngCount = await countPngFiles(baselineDir);
  if (existingPngCount > 0) {
    const result = {
      component,
      baselineDir,
      pngCount: existingPngCount,
      captured: false,
      scenarioPath: existsSync(scenarioPath) ? scenarioPath : null,
      message: 'Baseline PNG exists. Skip auto capture.',
    };
    if (args.out) {
      await writeFile(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    }
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const scenarioResult = await ensureScenarioFile(scenarioPath, component);
  const previewUrl = buildShadcnPreviewUrl(component);
  const captureScript = resolve(
    repoRoot,
    '.argus/skills/shadcn-preview-capture/scripts/capture_interactions.mjs'
  );

  const run = await runCommand(
    'node',
    [
      captureScript,
      '--url',
      previewUrl,
      '--scenario',
      scenarioPath,
      '--out-dir',
      baselineDir,
      '--viewport',
      '1440x1200',
      '--full-page',
    ],
    repoRoot
  );

  if (run.exitCode !== 0) {
    throw new Error(
      `Baseline auto-capture failed for ${component}: ${run.stderr || run.stdout || 'unknown error'}`
    );
  }

  const finalPngCount = await countPngFiles(baselineDir);
  if (finalPngCount === 0) {
    throw new Error(`Auto-capture completed but no PNG was generated in ${baselineDir}`);
  }

  const result = {
    component,
    baselineDir,
    pngCount: finalPngCount,
    captured: true,
    scenarioPath,
    generatedScenario: scenarioResult.generated,
    previewUrl,
  };
  if (args.out) {
    await writeFile(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  console.error(`ensure_baseline_images failed: ${error.message}`);
  process.exit(1);
});
