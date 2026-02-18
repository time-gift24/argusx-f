# ArgusX-F 40+ 组件 Preview 升级实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development with 3 parallel agents.

**Goal:** 对 40+ Angular 组件进行代码升级 + Preview 像素级复刻，每个组件完成后调用 Codex CLI 进行代码质量检查。

**Architecture:** 分 3 批次执行，每批次 10-15 个组件，3 个 subagent 并行处理。

**Tech Stack:** Angular 20+, Tailwind CSS v4, Codex CLI, Playwright

---

## 组件批次划分

### Batch 1: 待增强 + 基础组件 (10 个)

| 序号 | 组件 | 状态 | 优先级 |
|------|------|------|--------|
| 1 | carousel | 待增强 | 高 |
| 2 | pagination | 待增强 | 高 |
| 3 | sidebar | 待增强 | 高 |
| 4 | resizable | 待增强 | 高 |
| 5 | empty | 基础 | 中 |
| 6 | kbd | 基础 | 中 |
| 7 | progress | 基础 | 中 |
| 8 | spinner | 基础 | 中 |
| 9 | table | 基础 | 中 |
| 10 | toggle | 基础 | 中 |

### Batch 2: 完整组件 A-L (15 个)

| 序号 | 组件 | 状态 |
|------|------|------|
| 11 | alert | 完整 |
| 12 | avatar | 完整 |
| 13 | badge | 完整 |
| 14 | breadcrumb | 完整 |
| 15 | button-group | 完整 |
| 16 | chart | 完整 |
| 17 | checkbox | 完整 |
| 18 | collapsible | 完整 |
| 19 | combobox | 完整 |
| 20 | command | 完整 |
| 21 | drawer | 完整 |
| 22 | dropdown-menu | 完整 |
| 23 | field | 完整 |
| 24 | hover-card | 完整 |
| 25 | input-group | 完整 |

### Batch 3: 完整组件 M-Z (15 个)

| 序号 | 组件 | 状态 |
|------|------|------|
| 26 | input-otp | 完整 |
| 27 | label | 完整 |
| 28 | menubar | 完整 |
| 29 | native-select | 完整 |
| 30 | popover | 完整 |
| 31 | radio-group | 完整 |
| 32 | scroll-area | 完整 |
| 33 | separator | 完整 |
| 34 | sheet | 完整 |
| 35 | skeleton | 完整 |
| 36 | sonner/toast | 完整 |
| 37 | tabs | 完整 |
| 38 | textarea | 完整 |
| 39 | toggle-group | 完整 |
| 40 | tooltip | 完整 |

---

## 单组件工作流程（每个 subagent 执行）

### Step 1: 读取调研文档

**Command:**
```bash
# 读取 analysis.md（优先）或 capability-analysis.md
cat previews/shadcn/<component>/analysis.md
cat previews/shadcn/<component>/capability-analysis.md 2>/dev/null || echo "Not found"
```

**Expected:** 获取组件的 Gap 列表、改造任务、参考资源

### Step 2: 检查现有组件代码

**Command:**
```bash
# 读取主组件
cat src/app/shared/ui/<component>/<component>.component.ts
```

**Expected:** 了解当前实现状态

### Step 3: 检查现有 Preview

**Command:**
```bash
# 读取 preview
cat src/app/preview/<component>-preview.component.ts
```

**Expected:** 了解当前 preview 状态

### Step 4: 检查 shadcn 截图

**Command:**
```bash
# 列出所有截图
ls -la previews/shadcn/<component>/*.png
```

**Expected:** 了解目标效果（default, interactive, hover, drag 等状态）

### Step 5: 执行代码升级（根据 Gap）

**根据 analysis.md 或 capability-analysis.md 中的 Gap 列表，执行以下改造：**

1. **API 补齐** - 添加缺失的 input/output
2. **状态语义统一** - 统一 data-* 属性、ARIA
3. **功能增强** - 根据建议实现新功能

### Step 6: 调整 Preview 像素级复刻

**修改:** `src/app/preview/<component>-preview.component.ts`

**目标:** 1:1 对齐 `previews/shadcn/<component>/*.png` 截图效果

### Step 7: 启动服务验证

**Command:**
```bash
# 启动开发服务器（后台）
npm run start &
sleep 15

# 验证页面可访问
curl -s http://localhost:4200/preview/<component> | head -20
```

### Step 8: Codex CLI 代码质量检查

**Command:**
```bash
# 进入项目目录
cd /Users/wanyaozhong/Projects/argusx-f

# 检查组件代码质量
codex exec -- "Review the code in src/app/shared/ui/<component>/<component>.component.ts for:
1. Angular 20+ best practices (signals, OnPush, standalone)
2. TypeScript strict mode compliance
3. Memory leak prevention
4. Accessibility (ARIA, keyboard navigation)
5. Tailwind CSS usage (no hardcoded values)
Provide a detailed report with specific issues and fixes."

# 检查 Preview 代码质量
codex exec -- "Review src/app/preview/<component>-preview.component.ts for:
1. Proper component structure
2. Correct signal usage
3. Template best practices
4. Accessibility in demos
Provide specific issues if any."
```

### Step 9: 截图对比验证（如需要）

**Command:**
```bash
# 可选：使用 Playwright 截取当前 preview 截图
# 与 previews/shadcn/<component>/*.png 对比
```

### Step 10: 提交代码

**Command:**
```bash
git add src/app/shared/ui/<component>/ src/app/preview/<component>-preview.component.ts
git commit -m "feat(<component>): upgrade and align with shadcn preview"
```

---

## 实施命令

### 启动 Subagent 驱动开发

**For subagent-driven-development:**
```bash
# 使用 superpowers:subagent-driven-development skill
# 配置 3 个并行 agent
# 每个 agent 处理 1 个组件
```

### 验证命令

```bash
# 启动开发服务器
npm run start

# 运行测试
npm run test

# 代码检查
npm run lint

# 构建
npm run build
```

---

## 排除组件（不在范围内）

- accordion
- alert-dialog
- button
- calendar
- card
- context-menu
- dialog
- input
- select
- liquid-glass
- llm-chat
- markdown
- slider（已完成）
- switch（已完成）

---

## 成功标准

1. 所有 40 个组件的代码按照 Gap 文档完成升级
2. 所有 40 个组件的 Preview 1:1 对齐 shadcn 截图
3. Codex CLI 代码质量检查通过（或生成可执行的修复建议）
4. `npm run start` 可正常启动所有预览页面
5. 无 TypeScript 编译错误

---

## 关键参考文档

- **项目规范**: CLAUDE.md
- **组件分析汇总**: previews/shadcn/ANALYSIS_SUMMARY.md
- **单组件分析**: previews/shadcn/<component>/analysis.md
- **详细 Gap 报告**: previews/shadcn/<component>/capability-analysis.md
- **截图参考**: previews/shadcn/<component>/*.png

---

## 批次执行顺序建议

| 批次 | 建议时间 | 理由 |
|------|----------|------|
| Batch 1 | 第 1-2 天 | 待增强组件需要更多代码改动 |
| Batch 2 | 第 3-4 天 | 完整组件主要是 Preview 对齐 |
| Batch 3 | 第 5-6 天 | 收尾剩余组件 |
