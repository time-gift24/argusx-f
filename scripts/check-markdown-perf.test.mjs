import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(
  readFileSync(new URL('../docs/perf/markdown-thresholds.json', import.meta.url))
);
assert.equal(typeof cfg.maxP95Ms, 'number');
assert.equal(typeof cfg.maxHeapDeltaMb, 'number');
