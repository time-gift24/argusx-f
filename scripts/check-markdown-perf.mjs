#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const thresholdsPath = resolve(projectRoot, 'docs/perf/markdown-thresholds.json');
const reportPath = resolve(projectRoot, process.argv[2] ?? '.tmp/markdown-bench.json');

const parseJsonFile = (path) => JSON.parse(readFileSync(path, 'utf8'));
const asNumber = (value, fallback = NaN) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const thresholds = parseJsonFile(thresholdsPath);
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
