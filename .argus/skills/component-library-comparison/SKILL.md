---
name: component-library-comparison
description: Use when comparing zardui and local shadcn/angular component implementations across functionality, performance, usability, and code quality
---

# Component Library Comparison

## Overview

This skill guides you through systematically comparing zardui (a shadcn/ui alternative for Angular) with local component implementations. It provides a structured approach for analyzing components from multiple perspectives to identify improvements, migration opportunities, or architectural decisions.

## When to Use

- Evaluating zardui as a potential replacement for local components
- Identifying strengths and weaknesses in local implementations
- Creating technical comparison documents for team decisions
- Planning component migration or adoption strategies

## Comparison Framework

### 1. Component Discovery

First, identify the components to compare:

**Zardui Components (from `libs/zard/src/lib/shared/components`):**
- accordion, alert-dialog, alert, avatar, badge
- breadcrumb, button, button-group
- calendar, card, carousel, checkbox, combobox
- command, date-picker, dialog, divider, dropdown
- empty, form, icon, input-group, input
- kbd, layout, loader, menu, pagination
- popover, progress-bar, radio, resizable, segmented
- select, sheet, skeleton, slider, switch
- table, tabs, toast, toggle-group, toggle, tooltip

**Local ArgusX Components (from `src/app/shared/ui`):**
- button, dialog, input, dropdown-menu, combobox
- accordion, alert, alert-dialog, card, carousel
- checkbox, drawer, empty, field, hover-card
- input-group, input-otp, kbd, label, menubar
- native-select, pagination, popover, progress
- separator, skeleton, sidebar, skeleton, spinner
- tabs, textarea, toast, toggle, toggle-group
- tooltip, chart, context-menu

### 2. Analysis Dimensions

#### Functionality Comparison

| Aspect | Local (ArgusX) | Zardui |
|--------|---------------|--------|
| API Design | Input/output signals, CVA variants | Similar patterns with z- prefix |
| Component Structure | Directive + Component patterns | Component-based with NgModule |
| State Management | Angular Signals, model() | Signals + Service-based |
| Accessibility | ARIA attributes, keyboard nav | Similar a11y support |

#### Performance Comparison

- Bundle size impact
- Change detection strategy (OnPush default)
- Lazy loading support
- Tree shaking effectiveness

#### Usability Comparison

- Learning curve
- TypeScript type safety
- Error messages and validation
- Documentation quality

#### Code Quality Comparison

- Architecture patterns
- Code organization
- Test coverage potential
- Maintenance burden

### 3. Comparison Output Template

```markdown
## [Component Name] Comparison

### API Surface

#### Local Implementation
- Key inputs: [...]
- Key outputs: [...]
- Usage example: [...]

#### Zardui Implementation
- Key inputs: [...]
- Key outputs: [...]
- Usage example: [...]

### Findings

| Dimension | Local | Zardui | Winner |
|-----------|-------|--------|--------|
| Functionality | | | |
| Performance | | | |
| Usability | | | |
| Code Quality | | | |

### Recommendations

1. [...]
2. [...]
```

## Execution Steps

### Step 1: Select Components

Choose components to compare based on:
- Core components (button, dialog, input, dropdown)
- Complex components (combobox, calendar, date-picker)
- Data display (table, carousel, accordion)

### Step 2: Gather Implementation Details

For each component:
1. **Read local implementation** - 使用 Serena/Read 工具直接读取 `src/app/shared/ui/{component}/`
2. **Fetch zardui 实现** - 首选: 访问 `https://www.zardui.com/docs/components/{component}` 获取完整源码 (包含 inline 代码块)
3. **Document API differences**

### Step 3: Analyze Each Dimension

Work through functionality, performance, usability, and code quality for each component.

### Step 4: Synthesize Findings

Create comparison summary with:
- Component-by-component analysis
- Overall recommendations
- Action items for adoption/migration

## Data Sources

### Zardui - 首选文档站 ⚡️

**文档站是获取源码最快的方式** - zardui.com/docs/components/{component} 页面直接包含了完整的组件源码 (button.component.ts, button.variants.ts 等)，无需猜测 GitHub 路径结构。

```
URL 格式: https://www.zardui.com/docs/components/{component}
示例: https://www.zardui.com/docs/components/button
```

### Zardui - GitHub (备选)

如果文档站不可用，尝试 GitHub。但注意：repo 目录结构可能与文档中描述的不同，需要探索确认。

```
Base: https://github.com/zard-ui/zardui
搜索: https://github.com/zard-ui/zardui/search?q=button+path%3Alibs
```

### Local Components
```
Base: src/app/shared/ui/{component}/
使用: 直接读取本地文件
```

## Quick Reference

### Zardui Naming Conventions
- 组件选择器: `z-button` 或 `button[z-button]`
- 输入属性: `zType`, `zSize`, `zShape`, `zFull`, `zLoading`, `zDisabled`
- 示例: `<button z-button zType="outline" zSize="sm">`

### Local (ArgusX) Naming Conventions
- 指令选择器: `argus-button`
- 输入属性: `variant()`, `size()`, `disabled()`, `invalid()`
- 示例: `<button argus-button variant="outline" size="sm">`

## Common Findings Patterns

| Pattern | Implication |
|---------|-------------|
| Zardui has more variants | Consider adopting variants |
| Local has better a11y | Document as strength, propose to zardui |
| Different state management | Evaluate complexity vs flexibility |
| API design differences | Standardize on preferred pattern |

## Output Location

Save comparison documents to:
- `docs/comparison/{component-name}.md` for individual components
- `docs/comparison/summary.md` for overall recommendations
