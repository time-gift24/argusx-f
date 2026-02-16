---
name: shadcn-ui-component-extractor
description: Use when extracting component information from shadcn/ui website including static styles, interactive behaviors, and component capabilities
---

# shadcn/ui Component Extractor

## Overview

This skill guides you to systematically extract component information from shadcn/ui website (https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false) using Playwright. It covers static information (styles, HTML structure) and dynamic information (interactions, states).

## When to Use

- User wants to analyze shadcn/ui components for implementation reference
- Need to extract component styles, interactions, and capabilities
- Building documentation or component library based on shadcn/ui
- Understanding component implementation patterns

## 提取流程

使用以下流程提取组件：

1. 访问 Create 页面（选择你需要的样式配置）
2. 在左侧导航点击要提取的组件
3. 打开 DevTools -> Network 标签
4. 找到 iframe 的请求地址，复制该 URL
5. 使用复制的 iframe URL 进行提取

### Create Page Component List

**Blocks Category:**
- Home, Elevenlabs, GitHub, Vercel, ChatGPT

**Components Category (60+):**
- Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar
- Badge, Button, Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Combobox, Command, Context Menu
- Dialog, Dropdown Menu
- Form
- Input, Input OTP
- Label, Listbox
- Menu, Menubar
- Navigation Menu
- Popover, Progress
- Radio Group
- Scroll Area, Select, Separator, Sheet, Sidebar, Slider, Switch
- Table, Tabs, Textarea, Toast, Toggle, Tooltip
- Tree

## Extraction Strategy

### 1. Static Information

**Styles to extract:**
- Colors (background, foreground, border) - extract as CSS variables or computed values
- Typography (font-size, font-weight)
- Spacing (padding, margin)
- Border radius
- Shadows
- Transitions

**HTML Structure:**
- Element hierarchy
- Class names (Tailwind)
- ARIA attributes
- Data attributes

### 2. Dynamic Information

**Interaction states:**
- hover
- focus
- active
- disabled
- checked
- loading

**Interactive behaviors:**
- Click handlers
- State changes
- Animations
- Keyboard navigation

### 3. Iframe Preview Extraction

**Preview configuration panel:**
- Current selected component
- Style variant (Nova/Mira/etc.)
- Base color selection
- Theme colors
- Font family
- Border radius value

**Component variants in preview:**
- Different states shown (default, hover, active, disabled)
- Size variations
- Color variants
- Icon integrations

## Playwright Implementation

### Script Template for Create Page

```javascript
// /tmp/shadcn-create-extractor.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const COMPONENT_NAME = 'sidebar'; // Change this to your component
const OUTPUT_DIR = `docs/shadcn-ui/${COMPONENT_NAME}`;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// IMPORTANT: Replace this with the iframe URL from Network tab (see Target URL section)
const TARGET_URL = '从 Network 中获取的 iframe 地址';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    // Add proxy if needed:
    // proxy: { server: 'http://proxy:8080' }
  });
  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // ============================================
  // ============================================
  // Screenshot the preview area (iframe URL goes directly to preview)
  // ============================================
  // Since we use iframe URL from Network, we can directly screenshot the body
  await page.screenshot({ path: `${OUTPUT_DIR}/preview.png` });
  console.log(`Preview screenshot saved to ${OUTPUT_DIR}/preview.png`);

  // Extract sidebar component list
  const componentList = await page.evaluate(() => {
    const sections = document.querySelectorAll('section, div[class*="category"]');
    const result = { blocks: [], components: [] };

    sections.forEach(section => {
      const heading = section.querySelector('h3, h4, [class*="heading"]');
      const items = Array.from(section.querySelectorAll('a, button, [role="button"]'))
        .map(el => el.textContent.trim())
        .filter(Boolean);

      if (heading?.textContent.includes('Block')) {
        result.blocks = items;
      } else if (heading?.textContent.includes('Component')) {
        result.components = items;
      }
    });

    return result;
  });

  // Get current preview configuration
  const config = await page.evaluate(() => {
    const getSelectValue = (label) => {
      const container = Array.from(document.querySelectorAll('div'))
        .find(d => d.textContent?.includes(label));
      return container?.querySelector('select')?.value || 'N/A';
    };

    return {
      style: getSelectValue('Style'),
      baseColor: getSelectValue('Base Color'),
      theme: getSelectValue('Theme'),
      radius: getSelectValue('Radius'),
      font: getSelectValue('Font'),
    };
  });

  // Extract preview components with all variants
  const previewComponents = await page.evaluate(() => {
    const previewArea = document.querySelector('[class*="preview"], main');
    if (!previewArea) return [];

    const components = [];
    const elements = previewArea.querySelectorAll('*');

    elements.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const className = el.className || '';
      const style = el.style.cssText || '';
      const text = el.textContent?.trim().slice(0, 50) || '';

      if (['button', 'input', 'select', 'textarea', 'a'].includes(tag) ||
          className.includes('btn') || className.includes('card') ||
          className.includes('input') || className.includes('badge')) {
        components.push({
          tag,
          className,
          text,
          role: el.getAttribute('role'),
          aria: Array.from(el.attributes)
            .filter(a => a.name.startsWith('aria-'))
            .reduce((acc, a) => ({ ...acc, [a.name]: a.value }), {}),
        });
      }
    });

    return components;
  });

  console.log('Component List:', JSON.stringify(componentList, null, 2));
  console.log('Config:', JSON.stringify(config, null, 2));
  console.log('Preview Components:', JSON.stringify(previewComponents.slice(0, 20), null, 2));

  await browser.close();
})();
```

### Detailed Extraction Patterns

**Extract computed styles:**
```javascript
const getStyles = async (page, selector) => {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;

    const computed = window.getComputedStyle(el);
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      borderRadius: computed.borderRadius,
      padding: computed.padding,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      transition: computed.transition,
    };
  }, selector);
};
```

**Extract class names:**
```javascript
const getClasses = (page, selector) => {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.className : null;
  }, selector);
};
```

**Extract ARIA attributes:**
```javascript
const getAria = (page, selector) => {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return {};

    const attrs = {};
    for (const attr of el.attributes) {
      if (attr.name.startsWith('aria-')) {
        attrs[attr.name] = attr.value;
      }
    }
    return attrs;
  }, selector);
};
```

**Test interactions:**
```javascript
const testHover = async (page, selector) => {
  await page.hover(selector);
  // Capture state change
  const afterHover = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return window.getComputedStyle(el).backgroundColor;
  }, selector);
  return afterHover;
};
```

### Handling Iframe Preview

The Create page uses an iframe to display the component preview. Use these patterns to interact with it:

**Switch to iframe context:**
```javascript
// Find the iframe element
const iframeElement = await page.$('iframe[src*="preview"]');
if (iframeElement) {
  const frame = await iframeElement.contentFrame();
  // Now you can query elements inside the iframe
  const iframePage = await page.frame('iframe[src*="preview"]');

  // Extract content from iframe
  const iframeContent = await iframePage.evaluate(() => {
    return {
      html: document.body.innerHTML,
      title: document.title,
      elements: Array.from(document.querySelectorAll('*')).map(el => ({
        tag: el.tagName.toLowerCase(),
        class: el.className,
        text: el.textContent?.trim().slice(0, 50),
      })),
    };
  });
}
```

**Wait for iframe to load:**
```javascript
await page.waitForFunction(() => {
  const iframe = document.querySelector('iframe[src*="preview"]');
  return iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete';
}, { timeout: 10000 });
```

**Interact with elements inside iframe:**
```javascript
// Get the frame
const frame = page.frameLocator('iframe[src*="preview"]');

// Click elements inside iframe
await frame.locator('button').first().click();

// Hover inside iframe
await frame.locator('[class*="menu-item"]').hover();

// Get computed styles inside iframe
const styles = await frame.evaluate(() => {
  const el = document.querySelector('button');
  const computed = window.getComputedStyle(el);
  return {
    backgroundColor: computed.backgroundColor,
    color: computed.color,
    padding: computed.padding,
    borderRadius: computed.borderRadius,
  };
});
```

**Take screenshot of iframe content:**
```javascript
const frame = page.frameLocator('iframe[src*="preview"]');
await frame.locator('body').screenshot({ path: `${OUTPUT_DIR}/preview.png` });
```

**Capture multiple interaction screenshots:**
```javascript
// Since iframe URL directly shows preview, use page directly
const page2 = page;

// 1. Click interaction - try all clickable elements
const clickableSelectors = [
  'button',
  '[role="button"]',
  'a',
  '[class*="trigger"]',
  '[class*="toggle"]',
];

let screenshotIndex = 1;
for (const selector of clickableSelectors) {
  const elements = await page2.locator(selector).all();
  for (const el of elements) {
    try {
      await el.click({ timeout: 1000 });
      await page2.waitForTimeout(500);
      await page2.screenshot({ path: `${OUTPUT_DIR}/click-${screenshotIndex}.png` });
      console.log(`Click ${screenshotIndex}: ${selector}`);
      screenshotIndex++;
      // Go back to initial state if needed
      await page2.reload({ waitUntil: 'networkidle' });
      await page2.waitForTimeout(1000);
    } catch (e) {
      // Element might not be clickable, skip
    }
  }
}

// 2. Fill input interactions
const inputSelectors = ['input', 'textarea', '[contenteditable="true"]'];
for (const selector of inputSelectors) {
  const inputs = await page2.locator(selector).all();
  for (let i = 0; i < inputs.length; i++) {
    try {
      await inputs[i].fill(`Test value ${i + 1}`);
      await page2.waitForTimeout(300);
      await page2.screenshot({ path: `${OUTPUT_DIR}/input-${i + 1}.png` });
      console.log(`Input ${i + 1}: ${selector}`);
    } catch (e) {
      // Skip if not fillable
    }
  }
}

// 3. Hover interactions
const hoverSelectors = ['button', 'a', '[role="menuitem"]', '[class*="item"]'];
for (const selector of hoverSelectors) {
  const elements = await page2.locator(selector).all();
  for (let i = 0; i < Math.min(elements.length, 3); i++) { // Limit to 3
    try {
      await elements[i].hover();
      await page2.waitForTimeout(300);
      await page2.screenshot({ path: `${OUTPUT_DIR}/hover-${i + 1}.png` });
      console.log(`Hover ${i + 1}: ${selector}`);
    } catch (e) {
      // Skip
    }
  }
}

// 4. Keyboard interactions (Tab, Arrow keys)
await page2.keyboard.press('Tab');
await page2.waitForTimeout(200);
await page2.screenshot({ path: `${OUTPUT_DIR}/keyboard-tab.png` });

await page2.keyboard.press('ArrowDown');
await page2.waitForTimeout(200);
await page2.screenshot({ path: `${OUTPUT_DIR}/keyboard-arrow.png` });
```

**Analyze interaction screenshot with MCP:**
```javascript
// After capturing interaction screenshot, use the image analysis MCP
// to get detailed analysis of the UI state

// Using mcp__zai-mcp-server__analyze_image
{
  image_source: `${OUTPUT_DIR}/interaction.png`,
  prompt: "Analyze this UI component screenshot. Describe: 1) What component is shown 2) What state it's in (open/closed/hover/filled) 3) Key UI elements visible 4) Any visual changes from default state"
}
```

## Output Format

### Save to File

**IMPORTANT:** Save all outputs to `docs/shadcn-ui/{component}/` directory:

```
docs/shadcn-ui/{component}/
├── index.md              # Component documentation
├── preview.png           # Static screenshot (initial state)
├── click-1.png          # Click interaction 1
├── click-2.png          # Click interaction 2
├── input-1.png          # Input interaction 1
├── input-2.png          # Input interaction 2
├── hover-1.png          # Hover interaction 1
├── keyboard-tab.png     # Keyboard Tab interaction
└── (other interaction screenshots)
```

**After extraction:**
1. Create directory: `docs/shadcn-ui/{component}/`
2. Save static screenshot as `preview.png`
3. Perform ALL interactions (click multiple elements, fill inputs, hover, keyboard)
4. Save each interaction screenshot with descriptive names
5. Use `mcp__zai-mcp-server__analyze_image` to analyze key interaction screenshots
6. Add analysis results to documentation
7. Save markdown documentation as `index.md`
4. Use `mcp__zai-mcp-server__analyze_image` to analyze interaction screenshot
5. Add analysis results to documentation
6. Save markdown documentation as `index.md`

### Document Structure

Save as `docs/shadcn-ui/{component}/index.md`:

```markdown
# {Component Name} 组件

基于 shadcn/ui 组件库提取的 {Component Name} 组件信息。

> 来源: {URL}

## 组件预览

### 静态截图 (初始状态)

![Preview](./preview.png)

### 交互截图集合

**点击交互：**
![Click 1](./click-1.png)
![Click 2](./click-2.png)

**输入交互：**
![Input 1](./input-1.png)
![Input 2](./input-2.png)

**悬停交互：**
![Hover 1](./hover-1.png)

**键盘交互：**
![Keyboard Tab](./keyboard-tab.png)

### 图片分析结果

> 基于 mcp__zai-mcp-server__analyze_image 分析结果：

[在此添加图片分析的详细描述，包括：
1) 组件类型
2) 各交互状态下的UI变化
3) 关键UI元素
4) 动画效果
5) 与默认状态的视觉差异]

## 组件列表

| 组件 | 说明 |
|------|------|
| SubComponent | 说明 |

## 静态信息

### 子组件名称

```css
/* 样式代码 */
```

### HTML 结构

```html
<!-- HTML 结构 -->
```

## 交互能力

### 状态处理

| 状态 | 实现方式 |
|------|----------|
| 默认 | data-slot 属性 |
| 打开 | Radix UI 状态管理 |

## ARIA 属性

| 属性 | 值 | 说明 |
|------|-----|------|
| role | dialog | Radix 自动添加 |

## 可访问性 (A11y)

- 基于 Radix UI 保证 WCAG 合规
- 自动焦点管理
- ESC 键关闭支持

## 安装与使用

```bash
pnpm dlx shadcn@latest add {component}
```

## 变体与配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| propName | type | default | description |
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Dynamic content not loaded | Wait for `networkidle` or specific selectors |
| Styles not computed | Use `window.getComputedStyle()` |
| Missing interactions | Test actual hover/click events |
| Incomplete component list | Scroll page to load all components |
| Server errors (500) | Use `proxy_on` command to enable proxy access |
| Page not loading | Check network, try alternative URLs (/create vs /themes) |
| **Cannot access preview content** | Use `page.frameLocator()` to switch to iframe context |
| **Iframe content is empty** | Wait for iframe to fully load with `waitForFunction` |
| **Screenshot is blank** | Wait for page to load, try screenshotting body |

## Target URL (Default)

### 正确的提取流程

**步骤 1: 访问 Create 页面（选择你的样式）**

你选择的样式配置的 create 页面 URL：
```
https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false
```

**步骤 2: 点击组件按钮**

在 Create 页面的左侧导航中，点击要提取的组件（如 sidebar）。

**步骤 3: 从 Network 中获取 iframe 地址**

打开浏览器的 DevTools -> Network 标签，刷新页面，查找 iframe 的请求地址。iframe 地址格式如下：

```
https://ui.shadcn.com/preview/radix/{component}-example?item={component}-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite
```

**步骤 4: 使用 iframe 地址进行提取**

直接访问 iframe 地址进行提取（无需处理 dialog）：

```
https://ui.shadcn.com/preview/radix/sidebar-example?item=sidebar-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite
```

**URL Parameters (从 create 页面选择):**
| Parameter | 值 (你的配置) | 说明 |
|----------|--------------|------|
| base | radix | UI library |
| style | mira | Style variant (从 create 页面选择) |
| baseColor | neutral | Base color |
| theme | cyan | Color theme |
| iconLibrary | lucide | Icon library |
| font | nunito-sans | Font family |
| radius | medium | Border radius |
| item | {component}-example | Component to preview |

**重要说明:**
- 不要自己构造 iframe URL！一定要从 create 页面的 Network 中获取真实的 iframe 地址
- 因为样式参数可能随着你在 create 页面的选择而变化
- iframe 地址是 create 页面加载组件时实际请求的地址

### 示例

1. 访问: `https://ui.shadcn.com/create?base=radix&style=mira&...`
2. 点击左侧导航的 "Sidebar" 组件
3. 在 Network 中找到 iframe 请求，复制其 URL
4. 使用复制的 URL 进行提取

### 为什么不能直接构造 URL？

因为：
- 样式参数可能在 create 页面被修改
- iframe 地址包含了你选择的所有配置
- 直接构造可能遗漏某些参数

---

## Related Skills

- **REQUIRED SUB-SKILL:** Use superpowers:playwright-skill for browser automation
