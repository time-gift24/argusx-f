# Shadcn Pixel Rebuild Group 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 Group 2 的 10 个组件像素级复刻，并输出每个组件三件套产物。

**Architecture:** 使用与 Group 1 相同的固定流水线，不新增组件入口；逐组件 dispatch-subagent 并以像素门禁结果为唯一通过标准。

**Tech Stack:** Angular 20, TypeScript, Vitest, Playwright, Node scripts, shadcn-preview-capture

---

### Task 1: Session Bootstrap
执行方式与 Group 1 Task 1 完全一致，仅替换：
- worktree: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g2`
- branch: `codex/pixel-g2`
- queue file: `.tmp/group2-components.txt`

组件队列：
command, drawer, dropdown-menu, empty, field, hover-card, input-group, input-otp, kbd, label

### Task 2: Component Loop (10 components)
沿用 Group 1 Task 3 的 8 步模板，组件顺序严格如下：
1. command
2. drawer
3. dropdown-menu
4. empty
5. field
6. hover-card
7. input-group
8. input-otp
9. kbd
10. label

所有命令中的 `repo-root` 与 `branch` 替换为 Group 2 值。

### Task 3: Group 2 收尾校验
沿用 Group 1 Task 4，输出：
`/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g2/component-comparisons/group2-summary.md`
