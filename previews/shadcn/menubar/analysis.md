# Menubar Component Analysis

## Overview

| Property | Value |
|----------|-------|
| **Component Name** | menubar |
| **Type** | registry:ui |
| **Dependency** | radix-ui |
| **Local Path** | `src/app/shared/ui/menubar/` |
| **Zardui Path** | Not available |

## Local Implementation

### Components (17 total)

| Component | Selector | Description |
|-----------|----------|-------------|
| `MenubarComponent` | `app-menubar` | Root component - horizontal menu bar container |
| `MenubarMenuComponent` | `app-menubar-menu` | Individual menu with trigger and dropdown content |
| `MenubarTriggerContentComponent` | `[appMenubarTrigger]` | Content projection directive for menu trigger |
| `MenubarGroupComponent` | `app-menubar-group` | Groups related items together |
| `MenubarLabelComponent` | `app-menubar-label` | Labels a group of items |
| `MenubarItemComponent` | `app-menubar-item` | Individual menu item |
| `MenubarCheckboxItemComponent` | `app-menubar-checkbox-item` | Checkbox menu item with toggle state |
| `MenubarRadioGroupComponent` | `app-menubar-radio-group` | Groups radio items for single selection |
| `MenubarRadioItemComponent` | `app-menubar-radio-item` | Radio menu item |
| `MenubarSeparatorComponent` | `app-menubar-separator` | Visual divider between items |
| `MenubarShortcutComponent` | `app-menubar-shortcut` | Displays keyboard shortcuts |
| `MenubarSubComponent` | `app-menubar-sub` | Container for submenu |
| `MenubarSubTriggerComponent` | `app-menubar-sub-trigger` | Opens a submenu |
| `MenubarSubContentComponent` | `app-menubar-sub-content` | Submenu panel with fixed positioning |
| `MenubarPortalComponent` | `app-menubar-portal` | API compatibility (handled by CDK Overlay) |
| `MenubarContentComponent` | `app-menubar-content` | Wrapper for content projection |

### Features

- **Keyboard Navigation**: Full arrow key support (ArrowUp, ArrowDown, ArrowLeft, ArrowRight), Enter/Space to select, Escape to close
- **Accessibility**: Proper ARIA roles (`menubar`, `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`), `aria-expanded`, `aria-haspopup`, `aria-label`
- **Submenu Support**: Nested submenus with hover and keyboard activation
- **Selection Modes**:
  - Simple item click
  - Checkbox items (toggle without closing menu)
  - Radio items (single selection)
- **Variants**: Default and destructive item variants
- **Positioning**: CDK Overlay with configurable alignment (`start`, `center`, `end`)
- **Animations**: Built-in enter/exit animations
- **Styling**: Tailwind CSS with CSS variables, class-variance-authority for variants

### Input/Output API

| Component | Inputs | Outputs |
|-----------|--------|---------|
| `MenubarComponent` | `class`, `ariaLabel` | - |
| `MenubarMenuComponent` | `open` (model), `value`, `align`, `sideOffset`, `alignOffset`, `minWidth`, `class` | - |
| `MenubarItemComponent` | `inset`, `variant`, `disabled`, `class` | `select` |
| `MenubarCheckboxItemComponent` | `checked`, `inset`, `disabled`, `class` | `checkedChange` |
| `MenubarRadioGroupComponent` | `value` (model), `class` | - |
| `MenubarRadioItemComponent` | `value` (required), `inset`, `disabled`, `class` | - |
| `MenubarLabelComponent` | `inset`, `class` | - |
| `MenubarSeparatorComponent` | `class` | - |
| `MenubarShortcutComponent` | `class` | - |
| `MenubarSubComponent` | `open` (model) | - |
| `MenubarSubTriggerComponent` | `inset`, `class` | - |
| `MenubarSubContentComponent` | `class` | - |

### Types

```typescript
export type MenubarAlign = 'start' | 'center' | 'end';
export type MenubarItemVariant = 'default' | 'destructive';
```

## Shadcn/Radix Reference

The shadcn menubar is based on Radix UI Primitives:
- `@radix-ui/react-menubar`

It provides the same functionality as the local implementation, including:
- Horizontal menubar layout
- Menu items with keyboard navigation
- Submenu support
- Checkbox and radio item variants
- Separator and shortcut components

## Comparison Summary

| Aspect | Local Implementation | Shadcn/Radix |
|--------|---------------------|--------------|
| Architecture | Standalone Angular + CDK Overlay | React + Radix UI |
| State Management | Angular Signals (`signal`, `model`, `computed`) | React useState/useReducer |
| Styling | Tailwind CSS + class-variance-authority | Tailwind CSS |
| Accessibility | Full ARIA support | Full ARIA support (Radix) |
| Components | 17 components | Equivalent set |

## Conclusion

The local implementation at `src/app/shared/ui/menubar/` is a complete, production-ready Angular implementation that mirrors the shadcn/Radix UI menubar functionality. It follows Angular best practices:

- Standalone components
- Signals for state management
- OnPush change detection
- CDK Overlay for positioning
- Full keyboard navigation
- Accessibility support
