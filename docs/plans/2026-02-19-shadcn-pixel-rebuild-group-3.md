# Shadcn Pixel Rebuild Group 3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 Group 3 的 9 个组件像素级复刻，并输出每个组件三件套产物。

**Architecture:** 与 Group 2 同构，逐组件执行同一模板。组件间不得并行改同一文件。

**Tech Stack:** Angular 20, TypeScript, Vitest, Playwright, Node scripts, shadcn-preview-capture

---

### Task 1: Session Bootstrap
执行方式与 Group 1 Task 1 完全一致，仅替换：
- worktree: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g3`
- branch: `codex/pixel-g3`
- queue file: `.tmp/group3-components.txt`

组件队列：
menubar, native-select, popover, progress, radio-group, resizable, scroll-area, separator, sheet

### Task 2: Component Loop (9 components)
沿用 Group 1 Task 3 的 8 步模板，组件顺序严格如下：
1. menubar
2. native-select
3. popover
4. progress
5. radio-group
6. resizable
7. scroll-area
8. separator
9. sheet

### Task 3: Group 3 收尾校验
沿用 Group 1 Task 4，输出：
`/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g3/component-comparisons/group3-summary.md`
