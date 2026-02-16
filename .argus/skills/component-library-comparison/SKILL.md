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
1. Read local implementation source
2. Fetch zardui implementation from GitHub
3. Document API differences

### Step 3: Analyze Each Dimension

Work through functionality, performance, usability, and code quality for each component.

### Step 4: Synthesize Findings

Create comparison summary with:
- Component-by-component analysis
- Overall recommendations
- Action items for adoption/migration

## Data Sources

### Zardui (GitHub)
```
Base URL: https://github.com/zard-ui/zardui
Components: libs/zard/src/lib/shared/components/
Raw: https://raw.githubusercontent.com/zard-ui/zardui/master/libs/zard/src/lib/shared/components/{component}/
```

### Local Components
```
Base: src/app/shared/ui/{component}/
```

## Quick Reference

### Zardui Naming Conventions
- Component selector: `z-{component}`
- Input properties: `z{PropertyName}`
- Example: `<z-button zType="default" zSize="lg">`

### Local (ArgusX) Naming Conventions
- Directive selector: `[app{Component}]`
- Input properties: `{property}()`
- Example: `<button argus-button [variant]="'default'" [size]="'lg'">`

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
