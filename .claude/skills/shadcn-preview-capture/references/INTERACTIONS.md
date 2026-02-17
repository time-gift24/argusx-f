# Interaction Patterns

## Basic Interactions

### Hover
```json
{
  "selector": "button",
  "action": "hover"
}
```

### Click
```json
{
  "selector": "button[aria-haspopup='listbox']",
  "action": "click"
}
```

### Double Click
```json
{
  "selector": "button",
  "action": "double_click"
}
```

### Right Click (Context Menu)
```json
{
  "selector": ".context-area",
  "action": "click",
  "button": "right"
}
```

## Form Interactions

### Focus Input
```json
{
  "selector": "input[type='text']",
  "action": "focus"
}
```

### Fill Input
```json
{
  "selector": "input[type='text']",
  "action": "fill",
  "value": "Hello World"
}
```

### Type in Input
```json
{
  "selector": "input[type='text']",
  "action": "type",
  "value": "Hello"
}
```

### Clear Input
```json
{
  "selector": "input",
  "action": "clear"
}
```

### Checkbox Toggle
```json
{
  "selector": "input[type='checkbox']",
  "action": "check"
}
```

### Radio Selection
```json
{
  "selector": "input[type='radio'][value='option1']",
  "action": "check"
}
```

### Slider Move
```json
{
  "selector": "input[type='range']",
  "action": "fill",
  "value": "50"
}
```

## Dropdown/Select Interactions

### Open Select Dropdown
```json
{
  "selector": "button[role='combobox']",
  "action": "click"
}
```

### Select Option
```json
{
  "selector": "[role='option']:has-text('Option 1')",
  "action": "click"
}
```

### Keyboard Navigation in Select
```json
{
  "selector": "button[role='combobox']",
  "action": "press",
  "key": "ArrowDown"
}
```

## Dialog/Popover Interactions

### Open Dialog
```json
{
  "selector": "button:text('Open Dialog')",
  "action": "click"
}
```

### Close Dialog
```json
{
  "selector": "[role='dialog'] button[aria-label='Close']",
  "action": "click"
}
```

### Open Popover
```json
{
  "selector": "button[data-state='closed']",
  "action": "click"
}
```

## Accordion/Tabs Interactions

### Toggle Accordion Item
```json
{
  "selector": "button[aria-expanded='false']",
  "action": "click"
}
```

### Switch Tabs
```json
{
  "selector": "button[role='tab']:has-text('Account')",
  "action": "click"
}
```

## Carousel/Slider Interactions

### Navigate Carousel Next
```json
{
  "selector": "button[aria-label='Next']",
  "action": "click"
}
```

### Navigate Carousel Previous
```json
{
  "selector": "button[aria-label='Previous']",
  "action": "click"
}
```

### Drag Slider
```json
{
  "selector": "[data-orientation='horizontal'] > [role='slider']",
  "action": "click",
  "position": {"x": 200, "y": 0}
}
```

## Navigation Interactions

### Hover Navigation Menu
```json
{
  "selector": "a:text('Products')",
  "action": "hover"
}
```

### Click Navigation Link
```json
{
  "selector": "a:text('Products')",
  "action": "click"
}
```

## Screenshot Capture Patterns

### Wait Before Screenshot
Use `wait_for` to wait for animations or state changes:
```json
{
  "selector": "[data-state='open']",
  "state": "visible",
  "timeout": 5000
}
```

### Capture After Interaction
1. Perform interaction (click, hover)
2. Wait for state change
3. Take screenshot

### Full Page Screenshot
```json
{
  "fullPage": true
}
```

### Element Screenshot
```json
{
  "selector": ".component-container",
  "fullPage": false
}
```

## Complex Interactions

### Multi-step: Form Submission
1. Fill input fields
2. Select options
3. Click submit
4. Wait for success state
5. Screenshot

### Multi-step: Selection Flow
1. Open dropdown (click)
2. Wait for options to appear
3. Hover option (preview)
4. Click option (select)
5. Screenshot result
