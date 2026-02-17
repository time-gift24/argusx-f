---
name: shadcn-preview-capture
description: "Capture shadcn/ui component previews using Playwright. Use when: (1) Getting shadcn/ui component preview pages from ui.shadcn.com, (2) Taking screenshots of UI components with static/dynamic states, (3) Automating hover, expand, focus interactions to capture component behaviors. Triggered by requests involving shadcn/ui preview screenshots, component visual testing, or capturing UI states."
---

# Shadcn Preview Capture

## Overview

This skill captures shadcn/ui component previews using **Playwright** (via `npx playwright screenshot`). This is more reliable than Chrome DevTools MCP for capturing screenshots.

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
2. Use Playwright to extract links from the left navbar
3. Find the component link and construct the preview URL

See [URL_REFERENCE.md](references/URL_REFERENCE.md) for complete component list and URL patterns.

## Workflow

### Step 1: Create Output Directory

Create the output directory for screenshots:
```bash
mkdir -p previews/shadcn/{component}
```

### Step 2: Capture Screenshot with Playwright

Use `npx playwright screenshot` to capture the preview:

```bash
npx playwright screenshot "<URL>" <output-path> --full-page --wait-for-timeout 2000
```

**Example:**
```bash
npx playwright screenshot \
  "https://ui.shadcn.com/preview/radix/select-example?item=select-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite" \
  previews/shadcn/select/select-default.png \
  --full-page --wait-for-timeout 2000
```

### Step 3: Capture Dynamic States

For interactive components, create a Playwright script to capture different states:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('<URL>')
    page.wait_for_load_state('networkidle')

    # Default state
    page.screenshot(path='previews/shadcn/{component}/{component}-default.png')

    # Hover state
    page.hover('<selector>')
    page.screenshot(path='previews/shadcn/{component}/{component}-hover.png')

    # Click/expand state
    page.click('<selector>')
    page.screenshot(path='previews/shadcn/{component}/{component}-open.png')

    browser.close()
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

## Image Analysis

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
