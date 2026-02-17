const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const url = "https://ui.shadcn.com/preview/radix/sheet-example?item=sheet-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite";

  await page.goto(url);
  await page.waitForLoadState('networkidle');

  // Click to open the sheet
  const triggerSelectors = [
    "button:has-text('Open')",
    "button:has-text('Sheet')",
    "[data-trigger]",
    ".group button",
    "button"
  ];

  for (const selector of triggerSelectors) {
    try {
      await page.click(selector, { timeout: 2000 });
      console.log(`Clicked: ${selector}`);
      break;
    } catch (e) {
      console.log(`Failed to click ${selector}`);
    }
  }

  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({
    path: '/Users/wanyaozhong/Projects/argusx-f/previews/shadcn/sheet/sheet-open.png',
    fullPage: true
  });

  await browser.close();
  console.log('Screenshot saved to sheet-open.png');
})();
