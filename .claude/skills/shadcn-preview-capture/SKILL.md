---
name: shadcn-preview-capture
description: "Capture shadcn/ui component previews using Chrome DevTools MCP. Use when: (1) Getting shadcn/ui component preview pages from ui.shadcn.com, (2) Taking screenshots of UI components with static/dynamic states, (3) Automating hover, expand, focus interactions to capture component behaviors. Triggered by requests involving shadcn/ui preview screenshots, component visual testing, or capturing UI states."
---

# Shadcn Preview Capture

## Overview

This skill enables capturing shadcn/ui component previews using Chrome DevTools MCP. It provides URL construction for accessing preview pages and automation for capturing screenshots with various interaction states.

## URL Construction

### Primary URL Pattern

```
https://ui.shadcn.com/preview/radix/{component}-example?{queryParams}
```

**Query Parameters:**
- `item`: component identifier (e.g., `select-example`)
- `style`: visual style (e.g., `mira`)
- `theme`: color theme (e.g., `cyan`)
- `font`: font family (e.g., `nunito-sans`)
- `menuAccent`: menu accent style (e.g., `bold`)
- `radius`: border radius (e.g., `medium`)
- `template`: framework template (e.g., `vite`)

**Example:**
```
https://ui.shadcn.com/preview/radix/select-example?item=select-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite
```

### Fallback: Find Links from Create Page

If the primary URL returns 404:
1. Navigate to: `https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false`
2. Use Chrome DevTools to extract links from the left navbar
3. Find the component link and construct the preview URL

See [URL_REFERENCE.md](references/URL_REFERENCE.md) for complete component list and URL patterns.

## Workflow

### Step 1: Open Preview Page

Use Chrome DevTools MCP to navigate to the preview page:

```json
{
  "url": "https://ui.shadcn.com/preview/radix/select-example?item=select-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite",
  "waitUntil": "networkidle"
}
```

### Step 2: Capture Static Screenshots

Take screenshots of the default component state:

```json
{
  "fullPage": false
}
```

### Step 3: Capture Dynamic States

Use interaction commands to capture different states:

**Hover State:**
```json
{
  "selector": "[data-state='closed']",
  "action": "hover"
}
```

**Click/Expand State:**
```json
{
  "selector": "button[aria-haspopup='listbox']",
  "action": "click"
}
```

**Focus State:**
```json
{
  "selector": "input",
  "action": "focus"
}
```

### Step 4: Multiple Component Variations

For components with multiple variants, capture each state:
- Default/initial state
- Hover state
- Active/focused state
- Expanded/opened state
- Disabled state
- Loading state

See [INTERACTIONS.md](references/INTERACTIONS.md) for complete interaction patterns.

## Chrome DevTools MCP Integration

Load the chrome-devtools skill for detailed MCP tool usage:
- `chrome-devtools:new_page` - Open new browser page
- `chrome-devtools:navigate_page` - Navigate to URL
- `chrome-devtools:take_screenshot` - Capture screenshot
- `chrome-devtools:click` - Click elements
- `chrome-devtools:hover` - Hover over elements
- `chrome-devtools:fill` - Fill form fields
- `chrome-devtools:evaluate_script` - Execute JavaScript for complex interactions

## Common Components

Supported components include:
- select, dropdown-menu, context-menu, dialog
- accordion, collapsible, tabs
- carousel, slider
- popover, tooltip, avatar
- card, form, input, textarea
- checkbox, radio, switch, toggle
- button, badge, label
- table, pagination
- navigation-menu, sheet

See [URL_REFERENCE.md](references/URL_REFERENCE.md) for full list with URL patterns.

## Output

Save screenshots with descriptive names in the specified directory:

### Default Output Directory
```
{project-root}/previews/shadcn/{component}/
```

Example:
```
previews/shadcn/select/
├── select-default.png
├── select-hover.png
├── select-open.png
├── select-focused.png
└── select-disabled.png
```

### Custom Output Path
Specify custom output directory:
- Absolute path: `/Users/wanyaozhong/Projects/argusx-f/previews/{component}`
- Relative path: `previews/{component}`

### Image Analysis

After capturing screenshots, analyze the image to extract:
- Component structure and layout
- Visual styling (colors, shadows, borders)
- Interaction states observed
- Accessibility elements (ARIA labels, roles)

Use `mcp__zai-mcp-server__analyze_image` or `mcp__MiniMax__understand_image` MCP tool:

```json
{
  "image_path": "previews/shadcn/select/select-default.png",
  "purpose": "Extract component details for parity validation"
}
```

Analysis output includes:
- Component type identification
- Element hierarchy
- Style properties (colors from CSS variables)
- State indicators (hover, focus, disabled)
- Potential accessibility features
