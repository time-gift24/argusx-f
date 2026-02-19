#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const reportPath = resolve(projectRoot, process.argv[2] ?? '.tmp/markdown-bench.json');
const defaultThresholds = {
  maxP95Ms: 3000,
  maxHeapDeltaMb: 256,
  maxStreamingStepMs: 2000,
};

const parseJsonFile = (path) => JSON.parse(readFileSync(path, 'utf8'));
const asNumber = (value, fallback = NaN) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const resolveExistingPath = (path) =>
  path && existsSync(resolve(projectRoot, path))
    ? resolve(projectRoot, path)
    : null;

const findThresholdsPath = () => {
  const cliPath = process.argv[3];
  const envPath = process.env.MARKDOWN_PERF_THRESHOLDS;
  return (
    resolveExistingPath(cliPath) ??
    resolveExistingPath(envPath) ??
    resolveExistingPath('.tmp/markdown-thresholds.json')
  );
};

const thresholdsPath = findThresholdsPath();
const thresholds = thresholdsPath
  ? { ...defaultThresholds, ...parseJsonFile(thresholdsPath) }
  : defaultThresholds;
const report = parseJsonFile(reportPath);

const benches = (report.files ?? []).flatMap((file) =>
  (file.groups ?? []).flatMap((group) =>
    (group.benchmarks ?? []).map((benchmark) => ({
      name: benchmark.name,
      meanMs: asNumber(benchmark.mean),
      p95Ms: asNumber(benchmark.p95, asNumber(benchmark.p99, asNumber(benchmark.mean))),
    }))
  )
);

if (benches.length === 0) {
  console.error(`No benchmarks found in ${reportPath}`);
  process.exit(1);
}

const observedP95Ms = Math.max(...benches.map((bench) => bench.p95Ms));
const streamingBenches = benches.filter((bench) =>
  bench.name.toLowerCase().includes('streaming')
);
const observedStreamingStepMs =
  streamingBenches.length > 0
    ? Math.max(...streamingBenches.map((bench) => bench.meanMs))
    : 0;

const observedHeapDeltaMb = asNumber(
  report.heapDeltaMb ??
    report.summary?.heapDeltaMb ??
    report.memory?.heapDeltaMb ??
    0,
  0
);

const failures = [];

if (observedP95Ms > thresholds.maxP95Ms) {
  failures.push(
    `observed max p95 ${observedP95Ms.toFixed(2)}ms > threshold ${thresholds.maxP95Ms.toFixed(2)}ms`
  );
}

if (observedHeapDeltaMb > thresholds.maxHeapDeltaMb) {
  failures.push(
    `observed heap delta ${observedHeapDeltaMb.toFixed(2)}MB > threshold ${thresholds.maxHeapDeltaMb.toFixed(2)}MB`
  );
}

if (observedStreamingStepMs > thresholds.maxStreamingStepMs) {
  failures.push(
    `observed streaming step ${observedStreamingStepMs.toFixed(2)}ms > threshold ${thresholds.maxStreamingStepMs.toFixed(2)}ms`
  );
}

console.log('Markdown perf summary:');
console.log(`- max p95 (estimated): ${observedP95Ms.toFixed(2)}ms`);
console.log(`- heap delta: ${observedHeapDeltaMb.toFixed(2)}MB`);
console.log(`- max streaming step (mean): ${observedStreamingStepMs.toFixed(2)}ms`);

if (failures.length > 0) {
  console.error('Markdown perf gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Markdown perf gate passed.');
