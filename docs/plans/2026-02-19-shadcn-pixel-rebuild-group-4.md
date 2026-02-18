# Shadcn Pixel Rebuild Group 4 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 Group 4 的 9 个组件像素级复刻，并输出每个组件三件套产物。

**Architecture:** 与 Group 2/3 同构。`toast` 当前 baseline 缺失，必须依赖工作流内置 auto-capture 先补基线再比对。

**Tech Stack:** Angular 20, TypeScript, Vitest, Playwright, Node scripts, shadcn-preview-capture

---

### Task 1: Session Bootstrap
执行方式与 Group 1 Task 1 完全一致，仅替换：
- worktree: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g4`
- branch: `codex/pixel-g4`
- queue file: `.tmp/group4-components.txt`

组件队列：
skeleton, spinner, table, tabs, textarea, toast, toggle, toggle-group, tooltip

### Task 2: Component Loop (9 components)
沿用 Group 1 Task 3 的 8 步模板，组件顺序严格如下：
1. skeleton
2. spinner
3. table
4. tabs
5. textarea
6. toast
7. toggle
8. toggle-group
9. tooltip

对 `toast` 增加硬性检查：
- workflow 首次执行后必须出现 `previews/shadcn/toast/capture.scenario.json`（若之前不存在）
- baseline png 至少 1 张
- 之后再次运行 workflow，确保 `visual-diff.json` 可比较并通过阈值

### Task 3: Group 4 收尾校验
沿用 Group 1 Task 4，输出：
`/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g4/component-comparisons/group4-summary.md`
