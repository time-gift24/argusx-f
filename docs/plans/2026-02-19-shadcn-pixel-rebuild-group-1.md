# Shadcn Pixel Rebuild Group 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 Group 1 的 10 个组件像素级复刻，并输出每个组件三件套产物。

**Architecture:** 使用 @shadcn-pixel-rebuild-worktree 作为唯一门禁流程。每个组件走固定流水线：子代理实现 -> 构建/测试 -> 像素门禁 -> 产物校验 -> 提交。`aspect-ratio` 先做基础补齐（当前缺 preview route + preview component）。

**Tech Stack:** Angular 20, TypeScript, Vitest, Playwright, Node scripts, shadcn-preview-capture

---

### Task 1: Session Bootstrap

**Files:**
- Create: `/Users/wanyaozhong/Projects/argusx-f/docs/plans/2026-02-19-shadcn-pixel-rebuild-group-1.md`
- Modify: 无
- Test: 无

**Step 1: 创建独立 worktree**

Run:
```bash
cd /Users/wanyaozhong/Projects/argusx-f
git worktree add .worktrees/pixel-g1 -b codex/pixel-g1 main
```
Expected: worktree 创建成功，分支为 `codex/pixel-g1`

**Step 2: 安装并检查依赖**

Run:
```bash
cd /Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1
npm ci
```
Expected: 依赖安装完成，无致命错误

**Step 3: 预检脚本可执行**

Run:
```bash
test -x .argus/skills/shadcn-pixel-rebuild-worktree/scripts/run_rebuild_workflow.sh
```
Expected: exit code 0

**Step 4: 建立组件队列文件**

Run:
```bash
cat > .tmp/group1-components.txt <<'EOF'
aspect-ratio
alert
avatar
badge
breadcrumb
button-group
chart
checkbox
collapsible
combobox
EOF
```
Expected: 文件存在且顺序正确

**Step 5: 提交 bootstrap**

Run:
```bash
git add .tmp/group1-components.txt
git commit -m "chore: bootstrap pixel rebuild queue for group1"
```
Expected: 1 个 bootstrap 提交

### Task 2: Aspect-Ratio Bootstrap (先补缺失入口)

**Files:**
- Create: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/shared/ui/aspect-ratio/aspect-ratio.component.ts`
- Create: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/shared/ui/aspect-ratio/index.ts`
- Create: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts`
- Create: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/preview/aspect-ratio-preview.component.ts`
- Modify: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/app.routes.ts`
- Test: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts`

**Step 1: 写 failing test**

新增 spec，至少覆盖：
- `data-slot="aspect-ratio"`
- 默认比例 `16/9`
- 自定义 ratio 生效
- host class 合并

**Step 2: 跑 test 验证失败**

Run:
```bash
npx vitest run src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts
```
Expected: FAIL（组件未实现）

**Step 3: 实现最小组件与 preview 路由**

最小实现约束：
- selector: `app-aspect-ratio`
- host 必须有 `data-slot="aspect-ratio"`
- host style 必须绑定 `[style.aspect-ratio]`
- 使用 `input()` + `computed()` + OnPush
- route 新增 `path: 'aspect-ratio'`
- preview 页面导入并使用 `AspectRatioComponent`

**Step 4: 再跑 test 验证通过**

Run:
```bash
npx vitest run src/app/shared/ui/aspect-ratio/aspect-ratio.component.spec.ts
npm run build
```
Expected: PASS + build 成功

**Step 5: 提交 aspect-ratio bootstrap**

Run:
```bash
git add src/app/shared/ui/aspect-ratio src/app/preview/aspect-ratio-preview.component.ts src/app/app.routes.ts
git commit -m "feat: add aspect-ratio ui + preview route baseline"
```
Expected: bootstrap 提交完成

### Task 3: Component Loop (10 components)

**Files:**
- Modify: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/preview/{component}-preview.component.ts`
- Modify: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/src/app/shared/ui/{component}/*`
- Read: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/previews/shadcn/{component}/*`
- Output: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/component-comparisons/{component}/*`

组件顺序（严格按此顺序）：
1. aspect-ratio
2. alert
3. avatar
4. badge
5. breadcrumb
6. button-group
7. chart
8. checkbox
9. collapsible
10. combobox

每个组件执行以下 8 步（必须完整执行）：

**Step 1: Dispatch subagent with template prompt**

Prompt 模板：
`Use $shadcn-pixel-rebuild-worktree to rebuild component {component} with 1:1 pixel matching from previews/shadcn/{component}. Follow query URL localhost:{port}/preview?component={component}, use branch-stable random port, auto-capture baseline if png missing, and output visual-diff.json, interaction-results.json, best-of-plan.json.`

**Step 2: 跑构建校验**

Run:
```bash
npm run build
```
Expected: build 成功

**Step 3: 跑组件相关 spec（若存在）**

Run:
```bash
npx vitest run "src/app/shared/ui/{component}/**/*.spec.ts" "src/app/preview/{component}-preview.component.spec.ts"
```
Expected: 有测试则 PASS；无匹配文件则记录 “no spec for component”

**Step 4: 跑像素门禁 workflow**

Run:
```bash
bash .argus/skills/shadcn-pixel-rebuild-worktree/scripts/run_rebuild_workflow.sh \
  --component "{component}" \
  --repo-root "/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1" \
  --branch "codex/pixel-g1"
```
Expected: 成功输出本组件三件套

**Step 5: 校验三件套存在**

Run:
```bash
test -f component-comparisons/{component}/visual-diff.json
test -f component-comparisons/{component}/interaction-results.json
test -f component-comparisons/{component}/best-of-plan.json
```
Expected: 全部存在

**Step 6: 校验 JSON pass 字段**

Run:
```bash
node -e "const fs=require('fs');const c='{component}';const d='component-comparisons/'+c;const v=JSON.parse(fs.readFileSync(d+'/visual-diff.json','utf8'));const i=JSON.parse(fs.readFileSync(d+'/interaction-results.json','utf8'));if(!v.overallPass||!i.pass)process.exit(1);"
```
Expected: exit code 0

**Step 7: 提交该组件改动**

Run:
```bash
git add src/app component-comparisons/{component}
git commit -m "feat(pixel): align {component} with shadcn baseline"
```
Expected: 每组件 1 提交

**Step 8: 失败处理**

若 Step 4/6 失败：
- 只允许修改当前组件相关文件
- 必须重新执行 Step 2-7 直到通过
- 不允许跳过阈值检查

### Task 4: Group 1 收尾校验

**Files:**
- Create: `/Users/wanyaozhong/Projects/argusx-f/.worktrees/pixel-g1/component-comparisons/group1-summary.md`
- Modify: 无
- Test: 全组产物检查

**Step 1: 汇总结果**

汇总每组件：
- visual overallPass
- interaction pass
- threshold
- commit hash

**Step 2: 全组最终构建**

Run:
```bash
npm run build
```
Expected: PASS

**Step 3: 全组 artifact spot-check**

随机抽查 3 个组件 JSON 可读性与字段完整

**Step 4: 提交 summary**

Run:
```bash
git add component-comparisons/group1-summary.md
git commit -m "docs: add group1 pixel rebuild summary"
```
Expected: summary 提交完成
