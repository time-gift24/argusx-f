---
name: shadcn-component-alignment-worktree
description: Orchestrate parallel subagents to align local preview components against shadcn baseline screenshots using repository-local .worktrees, with strict post-test pixel-perfect evidence gating. Use when reviewing unmarked preview items, dispatching up to 5 component tasks in parallel, and enforcing visual + interaction proof before success.
---

# Shadcn Component Alignment Worktree

## Overview

Drive a main-process orchestration workflow for preview component review.  
Main process dispatches subagents (max parallel 5), each subagent works on one component in a dedicated local `.worktrees` directory, then returns structured JSON for merge and tracking.

## Mandatory Rules

1. Use repository-local `.worktrees` only:
   - `/Users/wanyaozhong/Projects/argusx-f/.worktrees`
   - Never use `/.worktrees`.
2. One component per subagent.
3. Subagent success requires both:
   - visual pass (`checks.visualPass === true`)
   - interaction pass (`checks.interactionPass === true`)
4. Subagent success must include artifact paths:
   - `artifacts.visualDiffJson`
   - `artifacts.interactionResultsJson`
5. Main process must challenge any “test passed but no 1:1 pixel evidence” result and fail that task.
6. Before coding, subagent must read baseline evidence from `previews/shadcn/{component}` and compare against online preview page.

## Main Process Workflow

1. Build queue from `src/app/preview/preview-layout.component.ts`.
2. Select only items without manual-review marker.
3. Dispatch subagents with max concurrency `5`.
4. Provide each subagent with:
   - `baselineDir` (`previews/shadcn/{component}`)
   - `onlinePreviewUrl` (shadcn preview URL)
   - `localPreviewUrl` (local preview route)
5. Track task states (`pending/running/success/failed`) and progress fields (`isRunning`, `agentCompleted`).
6. Validate subagent output contract strictly.
7. For success tasks, cherry-pick returned commits.
8. Continue even if some tasks fail, then output final summary.

## Post-Test Interrogation Gate

After a subagent reports success, main process MUST ask and enforce:

1. Where is `visualDiffJson` proving 1:1 pixel-level replica?
2. Where is `interactionResultsJson` proving interaction checks pass?
3. If tests passed, why is pixel-level proof missing?
4. Why should this be accepted as success without visual evidence?

If any question cannot be answered by concrete artifact files, mark task as `failed`.

## Subagent Input Contract

Use JSON with fields:

- `component`
- `repoRoot`
- `worktreeRoot`
- `branch`
- `worktreePath`
- `baselineDir`
- `onlinePreviewUrl`
- `localPreviewUrl`
- `artifactDir`
- `verification.visualThreshold`
- `verification.requireInteractionChecks`

## Subagent Baseline Comparison Procedure

Subagent must execute this order:

1. Read local baseline directory: `previews/shadcn/{component}`.
2. Inspect baseline screenshots and scenario/doc files in that directory.
3. Open `onlinePreviewUrl` and compare visual state against baseline screenshots.
4. If baseline is stale vs online preview, update evidence first, then start implementation.
5. Only after baseline is trusted, do local implementation and validation.

## Subagent Output Contract

Success:

```json
{
  "component": "popover",
  "status": "success",
  "branch": "codex/review-popover",
  "worktreePath": "/Users/wanyaozhong/Projects/argusx-f/.worktrees/review-popover",
  "commitSha": "abc123",
  "checks": {
    "visualPass": true,
    "interactionPass": true
  },
  "artifacts": {
    "visualDiffJson": "component-comparisons/popover/visual-diff.json",
    "interactionResultsJson": "component-comparisons/popover/interaction-results.json",
    "runStateJson": "component-comparisons/popover/run-state.json"
  }
}
```

Failure:

```json
{
  "component": "popover",
  "status": "failed",
  "branch": "codex/review-popover",
  "worktreePath": "/Users/wanyaozhong/Projects/argusx-f/.worktrees/review-popover",
  "error": "Failure reason with context",
  "artifacts": {
    "visualDiffJson": "component-comparisons/popover/visual-diff.json",
    "interactionResultsJson": "component-comparisons/popover/interaction-results.json"
  }
}
```

## Execution Entry

Use:

```bash
npm run review:orchestrate -- \
  --watch \
  --concurrency 5 \
  --worktree-root /Users/wanyaozhong/Projects/argusx-f/.worktrees \
  --subagent-cmd "<your subagent command template>"
```

## Validation

Before claiming completion:

1. Run `npm run test:review-orchestrator`.
2. Confirm task tracking files are produced:
   - `component-comparisons/review-runs/<run-id>/tasks.json`
   - `component-comparisons/review-runs/<run-id>/tasks.md`
3. Confirm failed tasks include interrogation-style errors when visual evidence is missing.
