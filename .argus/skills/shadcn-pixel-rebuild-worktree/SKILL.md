---
name: shadcn-pixel-rebuild-worktree
description: 在隔离 worktree 中按组件执行 shadcn preview 1:1 像素复刻流程，强制使用 query 预览 URL、分支稳定随机端口、缺图自动补抓和像素 diff 门禁。Use when 需要根据 previews/shadcn/component 下的 analysis、capability-analysis、capture.scenario 和 png 基线重建本地 Preview 与 shared/ui 组件，并输出 visual-diff、interaction-results、best-of-plan 产物。
---

# Shadcn Pixel Rebuild Worktree

## Overview

对单个组件执行“证据驱动重建”，目标是把本地 `Preview + shared/ui` 实现与 `previews/shadcn/{component}` 基线做到像素级对齐。  
流程默认失败优先：任何关键证据缺失、补抓失败、交互截图失败、像素阈值超限都必须直接判定失败。

## Mandatory Inputs

- `component`: 组件名，例如 `aspect-ratio`
- `repoRoot`: 仓库根目录
- `branch`: 当前工作分支
- `artifactsDir`: 推荐 `component-comparisons/{component}`

## Hard Rules

1. 先使用 `using-git-worktrees` 在隔离分支执行，禁止直接在主工作区改实现。
2. 本地预览地址只能是 query 形式：`http://localhost:{port}/preview?component={component}`。
3. `port` 必须走分支稳定随机算法，范围固定 `1420-2419`。
4. 若 `previews/shadcn/{component}` 下没有任何 png，必须先调用 `shadcn-preview-capture` 补抓。
5. 只在“缺图”时补抓，不主动覆盖已有基线图。
6. 像素门槛固定 `mismatch ratio <= 0.003`，任一状态超限即失败。
7. 成功必须同时产出：
- `visual-diff.json`
- `interaction-results.json`
- `best-of-plan.json`

## Workflow

1. 在目标分支执行端口分配：

```bash
node .argus/skills/shadcn-pixel-rebuild-worktree/scripts/allocate_branch_port.mjs \
  --repo-root "$REPO_ROOT" \
  --branch "$BRANCH"
```

2. 启动本地 preview server（后台）：

```bash
node .argus/skills/shadcn-pixel-rebuild-worktree/scripts/start_preview_server.mjs \
  --repo-root "$REPO_ROOT" \
  --branch "$BRANCH" \
  --port "$PORT"
```

3. 保障基线图存在（缺图自动补抓）：

```bash
node .argus/skills/shadcn-pixel-rebuild-worktree/scripts/ensure_baseline_images.mjs \
  --repo-root "$REPO_ROOT" \
  --component "$COMPONENT"
```

4. 从分析文档提炼 best-of 设计清单：

```bash
node .argus/skills/shadcn-pixel-rebuild-worktree/scripts/derive_best_of_plan.mjs \
  --component "$COMPONENT" \
  --repo-root "$REPO_ROOT" \
  --out "$ARTIFACTS_DIR/best-of-plan.json"
```

5. 解析 query 页中的 iframe URL：

```bash
node .argus/skills/shadcn-pixel-rebuild-worktree/scripts/resolve_local_urls.mjs \
  --preview-url "http://localhost:${PORT}/preview?component=${COMPONENT}" \
  --out "$ARTIFACTS_DIR/local-urls.json"
```

6. 使用 `shadcn-preview-capture` 脚本对本地 iframe 抓状态图并执行交互断言：

```bash
node .argus/skills/shadcn-preview-capture/scripts/capture_interactions.mjs \
  --url "$LOCAL_FRAME_URL" \
  --scenario "previews/shadcn/${COMPONENT}/capture.scenario.json" \
  --out-dir "$ARTIFACTS_DIR/local-captures" \
  --viewport 1440x1200 \
  --full-page
```

7. 对比基线和本地截图：

```bash
node .argus/skills/shadcn-pixel-rebuild-worktree/scripts/compare_pixel_sets.mjs \
  --baseline-dir "previews/shadcn/${COMPONENT}" \
  --actual-dir "$ARTIFACTS_DIR/local-captures" \
  --scenario "previews/shadcn/${COMPONENT}/capture.scenario.json" \
  --threshold 0.003 \
  --out-dir "$ARTIFACTS_DIR/diffs" \
  --report "$ARTIFACTS_DIR/visual-diff.json"
```

8. 推荐直接运行总入口：

```bash
bash .argus/skills/shadcn-pixel-rebuild-worktree/scripts/run_rebuild_workflow.sh \
  --component "$COMPONENT" \
  --repo-root "$REPO_ROOT"
```

## Output Contract

- 完整契约见 `references/contracts.md`
- 失败策略见 `references/failure-policy.md`

## Notes

- 该技能是单组件技能。批量处理时按组件逐个执行。
- 如果 `capture.scenario.json` 缺失且发生缺图补抓，会自动生成仅默认态的最小 scenario。
