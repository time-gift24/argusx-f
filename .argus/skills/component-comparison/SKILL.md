---
name: component-comparison
description: Use when comparing component implementations across zardui, shadcn radix, and local source to determine optimal implementation
---

# Component Comparison

## Overview

Compare component implementations across three sources (zardui Angular, shadcn radix React, local Angular) from four dimensions (functionality, styles, behavior, performance), determine optimal implementation via weighted scoring, and generate preview components that reproduce shadcn visual effects.

## When to Use

- Need to implement or improve a UI component
- Want to understand differences between zardui, shadcn, and local implementations
- Need to generate preview component for visual testing
- Building new component and want to learn from best practices

**Trigger:** User asks to compare, analyze, or learn from zardui/shadcn/local component implementations

## Core Pattern

```
User inputs component name
  ↓
Fetch sources from 3 places:
  - zardui: GitHub raw content
  - shadcn radix: GitHub raw content
  - local: src/app/shared/ui/{component}/
  ↓
Fetch shadcn preview URL
  ↓
Four-dimension analysis:
  - Functionality (API completeness)
  - Styles (Tailwind coverage, theme usage)
  - Behavior (interactions, keyboard, a11y)
  - Performance (change detection, lazy loading)
  ↓
Weighted scoring based on component type
  ↓
Generate comparison report → component-comparisons/{component}/comparison.md
  ↓
Generate preview → src/app/preview/{component}-preview.component.ts
  ↓
Update preview-layout.component.ts navigation
```

## Quick Reference

| Step | Command/Action |
|------|----------------|
| 1. Start | User provides component name |
| 2. Fetch zardui | gh API 获取 GitHub 源码并合并到 README.md |
| 3. Fetch shadcn | MCP 获取源码或 WebFetch |
| 4. Fetch local | 读取本地 src/app/shared/ui/{component}/ |
| 5. Screenshot | 截图分析官网预览 |
| 6. Analyze | Four-dimension scoring |
| 7. Report | Write comparison.md |
| 8. Preview | Generate preview component |
| 9. Register | Add to preview-layout navigation |

## Implementation

### 1. Fetch zardui Sources (Complete Component)

**目标：** 获取 GitHub 仓库指定路径下的所有源码文件，合并到一个本地 .md 文件中

**GitHub 仓库结构：**
```
https://github.com/zard-ui/zardui/tree/master/libs/zard/src/lib/shared/components/{component}
```

**获取流程：**

```bash
# 1. 获取目录结构
gh api repos/zard-ui/zardui/contents/libs/zard/src/lib/shared/components/{component} \
  --jq '.[].name'
```

```bash
# 2. 获取单个文件源码 (Angular component)
gh api repos/zard-ui/zardui/contents/libs/zard/src/lib/shared/components/{component}/{component}.component.ts \
  --jq -r '.content' | base64 -d
```

```bash
# 3. 获取 directive/service 等辅助文件
gh api repos/zard-ui/zardui/contents/libs/zard/src/lib/shared/components/{component}/{component}.directive.ts ...
gh api repos/zard-ui/zardui/contents/libs/zard/src/lib/shared/components/{component}/{component}.service.ts ...
```

**合并到本地 MD：**
```
component-comparisons/{component}/sources/zardui/README.md
```

```markdown
# {Component} - zardui 源码

## 目录结构
- {component}.component.ts - 主组件
- {component}.directive.ts - 指令
- {component}.service.ts - 服务
- {component}.ts - 类型定义

## 源码

### {component}.component.ts
\`\`\`typescript
// 源码内容
\`\`\`

### {component}.directive.ts
\`\`\`typescript
// 源码内容
\`\`\`
```

### 2. Fetch shadcn Sources via MCP

**使用 shadcn MCP 获取组件源码：**

```bash
# 搜索组件
mcp__shadcn__search_items_in_registries --query "{component}" --registries ["@shadcn"]

# 获取组件详情
mcp__shadcn__view_items_in_registries --items ["@shadcn/{component}"]

# 获取使用示例
mcp__shadcn__get_item_examples_from_registries --query "{component}-demo" --registries ["@shadcn"]
```

**备用方案（WebFetch）：**

```bash
# 从官网获取组件源码
WebFetch https://ui.shadcn.com/docs/components/{component}
```

### 3. Fetch Local Sources

```bash
# 从本地获取
ls -la src/app/shared/ui/{component}/
cat src/app/shared/ui/{component}/*.ts
```

### 4. Preview Screenshot Analysis

**目标：** 对 shadcn 官网预览进行截图，作为本地预览实现的视觉参考

**shadcn 预览 URL 模式：**
```
https://ui.shadcn.com/preview/{component}-example
```

**获取截图并分析：**

```bash
# 使用 MCP 获取截图
mcp__zai-mcp-server__ui_to_artifact \
  --image_source "https://ui.shadcn.com/preview/{component}-example" \
  --output_type "description" \
  --prompt "Describe the UI layout, colors, spacing, and visual effects"
```

```bash
# 截图用于设计参考
mcp__zai-mcp-server__ui_to_artifact \
  --image_source "https://ui.shadcn.com/preview/{component}-example" \
  --output_type "spec" \
  --prompt "Extract detailed visual specs: colors, typography, spacing, shadows"
```

**本地预览实现指导：**

根据截图分析结果，在 preview 组件中复现：

```typescript
@Component({
  // ... 基于截图分析的配置
  template: `
    <!-- 复现视觉效果的模板 -->
  `,
  styles: [`
    /* 基于截图的样式分析 */
  `]
})
export class {Component}PreviewComponent {}
```

**截图保存：**
```
component-comparisons/{component}/sources/shadcn/preview.png
```

### 5. Output Structure

```
component-comparisons/
└── {component}/
    ├── comparison.md              # Main report
    ├── sources/
    │   ├── zardui/
    │   │   ├── README.md         # 合并后的 zardui 源码
    │   │   └── files/           # 原始文件备份
    │   ├── shadcn/
    │   │   ├── README.md         # shadcn 源码
    │   │   ├── preview.png      # 官网预览截图
    │   │   └── analysis.md      # 截图分析结果
    │   └── local/
    │       └── README.md        # 本地源码
    └── preview/
        └── {component}-preview.component.ts
```

### 6. Four-Dimension Analysis

| Dimension | Weight Default | Interaction Heavy ×1.5 | Data Heavy ×1.5 |
|-----------|----------------|------------------------|-----------------|
| Functionality | 1.0 | 1.0 | 1.0 |
| Styles | 1.0 | 1.0 | 1.0 |
| Behavior | 1.0 | 1.5 | 1.0 |
| Performance | 1.0 | 1.0 | 1.5 |

**Component Classification:**
- Interaction Heavy: dialog, dropdown-menu, context-menu, tooltip, popover, accordion, collapsible, menubar, tabs
- Data Heavy: table, list, chart, calendar, pagination

### 7. GitHub API 快速获取技巧

**批量获取整个目录：**

```bash
# 获取目录下所有文件
for file in $(gh api repos/zard-ui/zardui/contents/libs/zard/src/lib/shared/components/{component} \
  --jq '.[].name'); do
  gh api repos/zard-ui/zardui/contents/libs/zard/src/lib/shared/components/{component}/$file \
    --jq -r '.content' | base64 -d > sources/zardui/files/$file
done
```

**常见 zardui 组件路径：**
- Button: `libs/zard/src/lib/shared/components/button`
- Input: `libs/zard/src/lib/shared/components/input`
- Card: `libs/zard/src/lib/shared/components/card`
- Dialog: `libs/zard/src/lib/shared/components/dialog`
- DropdownMenu: `libs/zard/src/lib/shared/components/dropdown-menu`
- Select: `libs/zard/src/lib/shared/components/select`
- Tabs: `libs/zard/src/lib/shared/components/tabs`

### 8. shadcn MCP 使用详解

**MCP 工具列表：**

| 工具 | 用途 |
|------|------|
| `mcp__shadcn__search_items_in_registries` | 搜索组件 |
| `mcp__shadcn__view_items_in_registries` | 获取组件详情和源码 |
| `mcp__shadcn__get_item_examples_from_registries` | 获取使用示例 |
| `mcp__shadcn__get_add_command_for_items` | 获取安装命令 |

**常用查询示例：**

```bash
# 搜索 button 组件
mcp__shadcn__search_items_in_registries \
  --query "button" \
  --registries ["@shadcn"]

# 获取 button 源码
mcp__shadcn__view_items_in_registries \
  --items ["@shadcn/button"]

# 获取 button 示例代码
mcp__shadcn__get_item_examples_from_registries \
  --query "button-demo" \
  --registries ["@shadcn"]
```

**支持的组件列表：**
- button, input, card, checkbox, radio, switch
- dialog, dropdown-menu, context-menu
- accordion, collapsible, tabs
- select, combobox, autocomplete
- form, label, toast, tooltip
- popover, menubar, navigation-menu
- avatar, badge, separator
- sheet, alert-dialog, alert

### 9. Scoring Criteria

```
component-comparisons/
└── {component}/
    ├── comparison.md              # Main report
    ├── sources/
    │   ├── zardui/
    │   │   ├── README.md         # 合并后的 zardui 源码
    │   │   └── files/           # 原始文件备份
    │   ├── shadcn/
    │   │   ├── README.md         # shadcn 源码
    │   │   ├── preview.png      # 官网预览截图
    │   │   └── analysis.md      # 截图分析结果
    │   └── local/
    │       └── README.md        # 本地源码
    └── preview/
        └── {component}-preview.component.ts
```

### 10. Generate Comparison Report

```markdown
# {Component} 三方对比报告

## 功能矩阵
| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| xxx  | ✓/✗    | ✓/✗    | ✓/✗   | src  |

## 样式差异
- zardui: ...
- shadcn: ...
- local: ...

## 行为对比
- zardui: ...
- shadcn: ...
- local: ...

## 性能评估
- zardui: ...
- shadcn: ...
- local: ...

## 推荐实现
基于智能加权，采用 {src} 的实现方案。
```

### 11. Generate Preview Component

Follow pattern from `angular-component-preview` skill:

```typescript
@Component({
  selector: 'app-{component}-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [{Component}],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">{Component}</h1>
      <p class="mb-8 text-muted-foreground">Description</p>
      <section class="mb-8">...</section>
    </div>
  `,
})
export class {Component}PreviewComponent {}
```

### 12. Update Navigation

Add to `preview-layout.component.ts`:

```typescript
readonly currentPreview = signal<'{component}' | ...>('{component}');

// Add navbar button
<button (click)="setPreview('{component}')">...</button>

// Update setPreview method
setPreview(component: '...' | '{component}'): void {
  this.currentPreview.set(component);
}
```

Add route in `app.routes.ts`:

```typescript
{
  path: '{component}',
  loadComponent: () => import('./preview/{component}-preview.component').then(m => m.{Component}PreviewComponent),
},
```

## Common Mistakes

1. **Not caching sources** - Always save sources to `component-comparisons/{component}/sources/` for future reference
2. **Wrong weighting** - Apply ×1.5 for interaction/data heavy components
3. **Missing local source** - Check if component exists locally before comparing
4. **Preview not integrated** - Always update preview-layout and routes
5. **Forgetting git** - Commit comparison results to version control
6. **Not using MCP** - shadcn MCP provides ready-to-use code, faster than WebFetch
7. **Skipping screenshot analysis** - Preview implementation needs visual guidance from shadcn官网
8. **Not merging zardui sources** - Keep all zardui files in one README.md for easy comparison
9. **Wrong zardui path** - Verify component path in zardui repo before fetching

## Git Integration

All comparison results go into `component-comparisons/` directory:

```bash
# After generating comparison
git add component-comparisons/{component}/
git commit -m "feat(comparison): add {component} comparison"
```
