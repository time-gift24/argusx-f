# Interaction Scenarios

Use this file to author scenario JSON for `scripts/capture_interactions.mjs`.

## Scenario Schema

```json
{
  "waitAfterLoadMs": 1200,
  "shots": [
    {
      "name": "select-default",
      "reset": false,
      "actions": [],
      "assertions": [],
      "beforeScreenshotWaitMs": 120,
      "mustDifferFrom": "select-default",
      "mustDifferFromPrevious": false,
      "screenshot": {
        "file": "select-default.png",
        "fullPage": true,
        "target": { "selector": "main" }
      }
    }
  ]
}
```

Notes:
- `mustDifferFrom` should not be set on baseline shot.
- Use `reset: true` when a shot should start from clean initial state.
- Use page screenshot (`fullPage`) for portal overlays (dialog/popover/tooltip/dropdown).

## Target Syntax

Use one of:

```json
{ "selector": "[role='combobox']" }
```

```json
{ "role": "button", "name": "Open", "exact": false }
```

```json
{ "text": "Open", "exact": true }
```

```json
{ "label": "Email" }
```

```json
{ "testId": "component-trigger" }
```

## Supported Actions

- `wait` -> `{ "type": "wait", "ms": 300 }`
- `waitFor` -> `{ "type": "waitFor", "target": {...}, "state": "visible" }`
- `click`
- `dblclick`
- `rightClick`
- `hover`
- `focus`
- `blur`
- `press`
- `fill`
- `type`
- `check`
- `uncheck`
- `drag`
- `scrollIntoView`

## Supported Assertions

- `visible`
- `hidden`
- `exists`
- `notExists`
- `count`
- `attr`
- `textIncludes`
- `urlIncludes`

## Example: Select (click + open listbox)

```json
{
  "waitAfterLoadMs": 1400,
  "shots": [
    {
      "name": "select-default",
      "screenshot": { "file": "select-default.png", "fullPage": true }
    },
    {
      "name": "select-open",
      "reset": true,
      "actions": [
        { "type": "click", "target": { "selector": "button[role='combobox']" } },
        { "type": "waitFor", "target": { "selector": "[role='listbox']" }, "state": "visible" }
      ],
      "assertions": [
        { "type": "visible", "target": { "selector": "[role='listbox']" } },
        {
          "type": "exists",
          "target": { "selector": "button[role='combobox'][aria-expanded='true']" }
        }
      ],
      "beforeScreenshotWaitMs": 120,
      "mustDifferFrom": "select-default",
      "screenshot": { "file": "select-open.png", "fullPage": true }
    }
  ]
}
```

## Example: Accordion (hover + expand)

```json
{
  "waitAfterLoadMs": 1200,
  "shots": [
    {
      "name": "accordion-default",
      "screenshot": { "file": "accordion-default.png", "fullPage": true }
    },
    {
      "name": "accordion-hover",
      "reset": true,
      "actions": [
        {
          "type": "hover",
          "target": { "selector": "button[aria-controls]" },
          "waitAfterMs": 120
        }
      ],
      "mustDifferFrom": "accordion-default",
      "screenshot": { "file": "accordion-hover.png", "fullPage": true }
    },
    {
      "name": "accordion-open",
      "reset": true,
      "actions": [
        { "type": "click", "target": { "selector": "button[aria-controls]" } },
        {
          "type": "waitFor",
          "target": { "selector": "[data-state='open']" },
          "state": "visible"
        }
      ],
      "assertions": [{ "type": "exists", "target": { "selector": "[data-state='open']" } }],
      "mustDifferFrom": "accordion-default",
      "screenshot": { "file": "accordion-open.png", "fullPage": true }
    }
  ]
}
```

## Example: Tooltip / Hover Card

```json
{
  "waitAfterLoadMs": 1200,
  "shots": [
    {
      "name": "tooltip-default",
      "screenshot": { "file": "tooltip-default.png", "fullPage": true }
    },
    {
      "name": "tooltip-hover",
      "reset": true,
      "actions": [
        {
          "type": "hover",
          "target": { "selector": "[data-slot='tooltip-trigger']" },
          "waitAfterMs": 240
        },
        {
          "type": "waitFor",
          "target": { "selector": "[role='tooltip']" },
          "state": "visible"
        }
      ],
      "assertions": [
        { "type": "visible", "target": { "selector": "[role='tooltip']" } },
        {
          "type": "exists",
          "target": { "selector": "[data-slot='tooltip-trigger'][data-state*='open']" }
        }
      ],
      "mustDifferFrom": "tooltip-default",
      "screenshot": { "file": "tooltip-hover.png", "fullPage": true }
    }
  ]
}
```

## Example: Tabs (switch content)

```json
{
  "waitAfterLoadMs": 1200,
  "shots": [
    {
      "name": "tabs-default",
      "screenshot": { "file": "tabs-default.png", "fullPage": true }
    },
    {
      "name": "tabs-account",
      "reset": true,
      "actions": [
        { "type": "click", "target": { "role": "tab", "name": "Account" } },
        { "type": "wait", "ms": 120 }
      ],
      "assertions": [
        {
          "type": "attr",
          "target": { "role": "tab", "name": "Account" },
          "name": "data-state",
          "value": "active"
        }
      ],
      "mustDifferFrom": "tabs-default",
      "screenshot": { "file": "tabs-account.png", "fullPage": true }
    }
  ]
}
```
