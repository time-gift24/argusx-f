---
name: ui-component-capability-analyzer
description: 比对本地 Angular UI 组件与 shadcn (React)、zardui (React) 实现的能力差异，生成包含功能完整性、性能、易用性、API 设计、可访问性等维度的对比分析报告。用于指导组件开发优先级和设计决策。
---

# UI 组件能力分析器

## 概述

本 skill 指导如何对比分析三个 UI 组件库的能力差异：
- **本地组件**: `src/app/shared/ui/` 目录下的 Angular 组件
- **shadcn UI**: 通过 shadcn MCP 工具获取的 React 组件
- **zardui**: 从 GitHub (https://github.com/zard-ui/zardui) 克隆的 React 组件

## 分析维度

| 维度 | 评估内容 |
|------|----------|
| 功能完整性 | API 数量、props 配置、变体(variant)、尺寸(size)支持 |
| 性能 | 渲染优化、change detection、依赖大小 |
| 易用性 | API 清晰度、文档完善度、学习曲线 |
| API 设计 | 参数命名一致性、类型安全、可扩展性 |
| 可访问性 | keyboard nav、aria 支持、focus management |

## 工作流程

### Step 1: 获取组件列表

**本地组件:**
```bash
ls src/app/shared/ui/
```

**zardui 组件:**
```bash
# 克隆仓库（如未克隆）
git clone --depth 1 https://github.com/zard-ui/zardui.git /tmp/zardui
ls /tmp/zardui/apps/web/public/components/
```

**shadcn 组件:**
```bash
# 使用 MCP 工具
mcp__shadcn__list_items_in_registries
```

### Step 2: 识别已审核组件

从 `src/app/preview/preview-layout.component.ts` 中读取 `manuallyReviewed: true` 的组件列表，这些组件应排除在分析之外。

### Step 3: 获取源码进行详细分析

对每个待分析组件：
1. 读取本地源码: `src/app/shared/ui/{component}/*.ts`
2. 读取 zardui 源码: `/tmp/zardui/apps/web/public/components/{component}/`
3. 通过 shadcn MCP 获取详情: `mcp__shadcn__view_items_in_registries`

### Step 4: 生成分析报告

输出 Markdown 格式报告，包含：
- 总览表格
- 各组件详细分析
- 优先级建议

## 输出格式

```markdown
# UI 组件能力分析报告

## 总览

| 组件 | 本地 | shadcn | zardui | 建议 |
|------|------|--------|--------|------|
| alert | ★★★ | ★★★★ | ★★★ | - |

## 详细分析

### alert

#### 功能完整性
- 本地: 支持 variant, title, description
- shadcn: 额外支持 dismissible
- zardui: 支持 variant, title, icon

...

#### 建议
[开发优先级建议]
```

## 关键注意事项

- 本地组件目录为 `src/app/shared/ui/`（不是 `src/shared/ui/`）
- zardui 组件路径: `/tmp/zardui/apps/web/public/components/`
- shadcn 使用 MCP 工具获取，无需克隆仓库
- 已人工审核的组件不纳入分析范围
