# Markdown Benchmarking

This workspace includes a repeatable benchmark + threshold gate for markdown rendering.

## Commands

```bash
npm run test:markdown
npm run bench:markdown
npm run perf:markdown
```

## What Each Command Does

- `npm run test:markdown`: runs markdown unit tests.
- `npm run bench:markdown`: runs Vitest benchmark files under `src/app/shared/ui/markdown/benchmarks`.
- `npm run perf:markdown`: generates `.tmp/markdown-bench.json` and checks it against `docs/perf/markdown-thresholds.json`.

## Thresholds

Current thresholds are defined in `docs/perf/markdown-thresholds.json`:

- `maxP95Ms`: max estimated p95 latency across markdown benchmarks.
- `maxHeapDeltaMb`: max allowed heap delta if heap metrics are present in benchmark output.
- `maxStreamingStepMs`: max mean latency for streaming-related benchmark steps.

## Expected Output

When the gate passes, `npm run perf:markdown` prints:

- Markdown perf summary with measured values.
- `Markdown perf gate passed.`

When the gate fails, it exits non-zero and prints each exceeded threshold.
