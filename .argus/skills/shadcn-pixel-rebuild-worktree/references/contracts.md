# Contracts

## Input Context

The workflow consumes one component at a time.

```json
{
  "component": "aspect-ratio",
  "branch": "codex/review-aspect-ratio",
  "previewPort": 1420,
  "localPreviewUrl": "http://localhost:1420/preview?component=aspect-ratio",
  "localFrameUrl": "http://localhost:1420/preview/aspect-ratio?v=123",
  "baselineDir": "/repo/previews/shadcn/aspect-ratio",
  "artifactsDir": "/repo/component-comparisons/aspect-ratio"
}
```

## Required Artifacts

All three files are mandatory for success:

1. `component-comparisons/{component}/visual-diff.json`
2. `component-comparisons/{component}/interaction-results.json`
3. `component-comparisons/{component}/best-of-plan.json`

## visual-diff.json

```json
{
  "component": "aspect-ratio",
  "threshold": 0.003,
  "overallPass": true,
  "totalCompared": 2,
  "failed": 0,
  "entries": [
    {
      "file": "aspect-ratio-default.png",
      "width": 1440,
      "height": 1200,
      "diffPixels": 201,
      "mismatchRatio": 0.0001163,
      "pass": true,
      "diffImage": "/repo/component-comparisons/aspect-ratio/diffs/aspect-ratio-default.diff.png"
    }
  ]
}
```

## interaction-results.json

```json
{
  "component": "aspect-ratio",
  "pass": true,
  "scenarioPath": "/repo/previews/shadcn/aspect-ratio/capture.scenario.json",
  "capturedFiles": [
    "aspect-ratio-default.png",
    "aspect-ratio-interactive.png"
  ]
}
```

## best-of-plan.json

```json
{
  "component": "aspect-ratio",
  "hasAnalysis": true,
  "hasCapabilityAnalysis": true,
  "topGaps": [
    {
      "title": "Gap-1: API coverage gap",
      "evidence": ["E-LOCAL-1", "E-SHADCN-1"],
      "suggestions": [
        "修改 src/app/shared/ui/aspect-ratio/aspect-ratio.component.ts"
      ]
    }
  ],
  "recommendedActions": [
    "补齐 API 并加默认值",
    "收敛交互语义",
    "新增回归测试"
  ]
}
```
