# Resizable Component Capability Analysis

## Overview

The `resizable` component is a layout component that enables users to resize panels by dragging dividers between them. It follows the shadcn/ui pattern and provides a flexible way to create adjustable split-pane layouts.

## Source Analysis

### Local Implementation (`src/app/shared/ui/resizable/`)

The local implementation consists of three main components:

#### 1. ResizablePanelGroupComponent (`app-resizable-panel-group`)
- **Purpose**: Container for managing multiple resizable panels
- **Key Inputs**:
  - `orientation`: `'horizontal' | 'vertical'` - Layout direction
  - `class`: Additional CSS classes
  - `autoSaveId`: ID for persisting panel sizes to localStorage
- **Key Outputs**:
  - `sizesChange`: Emits array of panel sizes when they change
- **Features**:
  - ResizeObserver for tracking container size changes
  - localStorage persistence for panel sizes
  - DOM-based panel registration and ordering
  - CSS variable for group size (`--panel-group-size.px`)

#### 2. ResizablePanelComponent (`app-resizable-panel`)
- **Purpose**: Individual resizable panel within a group
- **Key Inputs**:
  - `defaultSize`: Initial size as percentage (0-100), default: 50
  - `minSize`: Minimum size as percentage, default: 0
  - `maxSize`: Maximum size as percentage, default: 100
  - `class`: Additional CSS classes
  - `id`: Panel identifier
- **Features**:
  - Size clamping based on min/max constraints
  - Synchronization with group state
  - Support for saved sizes from localStorage

#### 3. ResizableHandleComponent (`app-resizable-handle`)
- **Purpose**: Draggable divider between panels
- **Key Inputs**:
  - `withHandle`: Shows visual grip indicator
  - `class`: Additional CSS classes
- **Features**:
  - Mouse drag interaction
  - Touch interaction support
  - Keyboard navigation (Arrow keys for resize, Home for reset)
  - Proper ARIA attributes (`role="separator"`, `aria-orientation`)
  - Focus-visible ring styling

### ZardUI Implementation

The zardui implementation provides similar functionality with slightly different naming conventions:

#### Components:
- `z-resizable` - Main container
- `z-resizable-panel` - Individual panel
- `z-resizable-handle` - Drag handle

#### Key Differences from Local Implementation:

| Feature | Local (argusx-f) | ZardUI |
|---------|------------------|--------|
| Container Selector | `app-resizable-panel-group` | `z-resizable` |
| Panel Selector | `app-resizable-panel` | `z-resizable-panel` |
| Handle Selector | `app-resizable-handle` | `z-resizable-handle` |
| Orientation Input | `orientation` | `zLayout` |
| Default Size Input | `defaultSize` | `zDefaultSize` |
| Min Size Input | `minSize` | `zMin` |
| Max Size Input | `maxSize` | `zMax` |
| With Handle Input | `withHandle` | `zWithHandle` |
| Auto-save | `autoSaveId` | N/A |
| Lazy Update | N/A | `zLazy` |
| Collapsible | N/A | `zCollapsible` |
| Resizable Toggle | N/A | `zResizable` |
| Handle Disabled | N/A | `zDisabled` |
| Resize Events | `sizesChange` | `zResizeStart`, `zResize`, `zResizeEnd` |

### shadcn/ui Reference

shadcn/ui's resizable component is a wrapper around `react-resizable-panels` library. It provides:
- Panel groups with percentage-based sizing
- Handle components for dragging
- Support for min/max constraints
- Keyboard accessibility
- SSR compatible

## Capability Comparison

### Implemented Features

| Feature | Local | ZardUI | shadcn |
|---------|-------|--------|--------|
| Horizontal layout | Yes | Yes | Yes |
| Vertical layout | Yes | Yes | Yes |
| Panel sizing (percentage) | Yes | Yes | Yes |
| Min size constraint | Yes | Yes | Yes |
| Max size constraint | Yes | Yes | Yes |
| Drag to resize | Yes | Yes | Yes |
| Keyboard navigation | Yes | Yes | Yes |
| Touch support | Yes | Yes | Yes |
| Visual handle indicator | Yes | Yes | Yes |
| localStorage persistence | Yes | No | No |
| Lazy resize updates | No | Yes | No |
| Collapsible panels | No | Yes | No |
| Resize events | Partial | Full | Yes |

### Missing Features in Local Implementation

1. **Lazy resize updates**: Option to only update panel sizes after resize ends
2. **Collapsible panels**: Ability to collapse panels (toggle to 0 size)
3. **Resizable toggle**: Enable/disable resizing per panel
4. **Handle disabled state**: Disable resize on specific handle
5. **Detailed resize events**: Start/End/Current resize event emissions

## Recommendations

### For Local Implementation (argusx-f)

The local implementation is well-structured and follows Angular best practices:
- Uses Signals for state management
- OnPush change detection
- Proper TypeScript types
- Accessibility support (ARIA attributes)

However, to align with zardui capabilities, consider adding:

1. **Resize Events**: Add `resizeStart`, `resize`, `resizeEnd` outputs to provide more control over resize operations
2. **Lazy Mode**: Add `lazy` input to defer size updates until drag ends
3. **Collapsible Panels**: Add `collapsible` input to enable collapse functionality
4. **Resizable Toggle**: Add `resizable` input to enable/disable resize per panel

### Code Quality Notes

The local implementation:
- Uses `cn()` utility for class composition
- Uses `afterNextRender` for DOM initialization
- Uses `effect()` for side effects (saving to localStorage)
- Properly cleans up ResizeObserver on destroy
- Uses native control flow (`@if`)
- Uses `input()` / `output()` decorators

## Usage Examples

### Basic Horizontal Layout
```html
<app-resizable-panel-group orientation="horizontal">
  <app-resizable-panel defaultSize="50">
    <div>Panel 1</div>
  </app-resizable-panel>
  <app-resizable-handle />
  <app-resizable-panel defaultSize="50">
    <div>Panel 2</div>
  </app-resizable-panel>
</app-resizable-panel-group>
```

### With Min/Max Constraints
```html
<app-resizable-panel-group orientation="horizontal">
  <app-resizable-panel defaultSize="25" minSize="10" maxSize="40">
    <div>Left Panel (10-40%)</div>
  </app-resizable-panel>
  <app-resizable-handle withHandle />
  <app-resizable-panel defaultSize="75" minSize="20">
    <div>Right Panel (min 20%)</div>
  </app-resizable-panel>
</app-resizable-panel-group>
```

### With Auto-save (persistence)
```html
<app-resizable-panel-group orientation="horizontal" autoSaveId="my-layout">
  <app-resizable-panel defaultSize="50">
    <div>Panel 1</div>
  </app-resizable-panel>
  <app-resizable-handle />
  <app-resizable-panel defaultSize="50">
    <div>Panel 2</div>
  </app-resizable-panel>
</app-resizable-panel-group>
```

## File Locations

- **Local Source**: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/resizable/`
- **ZardUI Source**: `/tmp/zardui/apps/web/public/components/resizable/`
- **shadcn Registry**: `@shadcn/resizable` (depends on `react-resizable-panels@^4`)
