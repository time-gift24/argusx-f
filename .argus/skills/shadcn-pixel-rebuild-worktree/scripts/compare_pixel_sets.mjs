#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, basename, extname } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

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

function toRelativePath(path, cwd) {
  const normalized = path.replace(/\\/g, '/');
  const root = `${cwd.replace(/\\/g, '/')}/`;
  return normalized.startsWith(root) ? normalized.slice(root.length) : normalized;
}

async function listPngFiles(dir) {
  const files = await readdir(dir);
  return files.filter((name) => name.toLowerCase().endsWith('.png')).sort();
}

async function expectedFiles(args, baselineDir) {
  if (!args.scenario) {
    return listPngFiles(baselineDir);
  }
  const scenarioPath = resolve(args.scenario);
  if (!existsSync(scenarioPath)) {
    return listPngFiles(baselineDir);
  }

  const scenario = JSON.parse(await readFile(scenarioPath, 'utf8'));
  const shots = Array.isArray(scenario.shots) ? scenario.shots : [];
  const files = [];
  for (const shot of shots) {
    if (!shot || typeof shot !== 'object' || typeof shot.name !== 'string') continue;
    const fileName = shot.screenshot?.file ?? `${shot.name}.png`;
    if (!files.includes(fileName)) {
      files.push(fileName);
    }
  }
  return files;
}

async function readPng(path) {
  const data = await readFile(path);
  return PNG.sync.read(data);
}

async function main() {
  const args = parseArgs(process.argv);
  const baselineDir = resolve(args['baseline-dir'] ?? '');
  const actualDir = resolve(args['actual-dir'] ?? '');
  const outDir = resolve(args['out-dir'] ?? '');
  const reportPath = resolve(args.report ?? `${outDir}/visual-diff.json`);
  const threshold = Number(args.threshold ?? 0.003);
  const cwd = process.cwd();

  if (!existsSync(baselineDir)) throw new Error(`baseline-dir not found: ${baselineDir}`);
  if (!existsSync(actualDir)) throw new Error(`actual-dir not found: ${actualDir}`);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw new Error(`Invalid threshold: ${args.threshold}`);
  }

  await mkdir(outDir, { recursive: true });
  const diffDir = resolve(outDir, 'diffs');
  await mkdir(diffDir, { recursive: true });

  const files = await expectedFiles(args, baselineDir);
  if (files.length === 0) {
    throw new Error(`No expected screenshot files found for ${baselineDir}`);
  }

  const entries = [];
  for (const file of files) {
    const baselinePath = resolve(baselineDir, file);
    const actualPath = resolve(actualDir, file);
    const diffPath = resolve(diffDir, `${basename(file, extname(file))}.diff.png`);

    if (!existsSync(baselinePath) || !existsSync(actualPath)) {
      entries.push({
        file,
        baselineExists: existsSync(baselinePath),
        actualExists: existsSync(actualPath),
        pass: false,
        mismatchRatio: 1,
        reason: 'missing-file',
      });
      continue;
    }

    const baseline = await readPng(baselinePath);
    const actual = await readPng(actualPath);
    if (baseline.width !== actual.width || baseline.height !== actual.height) {
      entries.push({
        file,
        baselineExists: true,
        actualExists: true,
        baselineSize: `${baseline.width}x${baseline.height}`,
        actualSize: `${actual.width}x${actual.height}`,
        pass: false,
        mismatchRatio: 1,
        reason: 'dimension-mismatch',
      });
      continue;
    }

    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const diffPixels = pixelmatch(
      baseline.data,
      actual.data,
      diff.data,
      baseline.width,
      baseline.height,
      { threshold: 0.1, includeAA: true }
    );
    const mismatchRatio = diffPixels / (baseline.width * baseline.height);
    const pass = mismatchRatio <= threshold;
    await writeFile(diffPath, PNG.sync.write(diff));

    entries.push({
      file,
      baselineExists: true,
      actualExists: true,
      width: baseline.width,
      height: baseline.height,
      diffPixels,
      mismatchRatio,
      pass,
      diffImage: toRelativePath(diffPath, cwd),
    });
  }

  const overallPass = entries.every((entry) => entry.pass);
  const report = {
    threshold,
    overallPass,
    totalCompared: entries.length,
    failed: entries.filter((entry) => !entry.pass).length,
    entries,
    generatedAt: new Date().toISOString(),
  };

  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (!overallPass) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`compare_pixel_sets failed: ${error.message}`);
  process.exit(1);
});
