const { chromium } = require('playwright');

const url = 'https://ui.shadcn.com/preview/radix/select-example?item=select-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite';
const outputDir = '/Users/wanyaozhong/Projects/argusx-f/previews/shadcn/select';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Capture default state
  await page.screenshot({ path: `${outputDir}/select-default.png`, fullPage: true });
  console.log('Captured select-default.png');

  // Click on the select trigger to open the dropdown
  // Try different selectors for the select trigger
  const selectors = [
    '.radix-select-trigger',
    '[class*="select-trigger"]',
    '[class*="SelectTrigger"]',
    'button[class*="select"]',
    '.flex.flex-col.gap-1\.5 > button'
  ];

  let clicked = false;
  for (const selector of selectors) {
    try {
      await page.click(selector, { timeout: 1000 });
      console.log(`Clicked selector: ${selector}`);
      clicked = true;
      break;
    } catch (e) {
      console.log(`Selector ${selector} not found, trying next...`);
    }
  }

  if (!clicked) {
    // Try clicking anywhere that looks like a select
    await page.click('body');
  }

  await page.waitForTimeout(500);

  // Capture open state
  await page.screenshot({ path: `${outputDir}/select-open.png`, fullPage: true });
  console.log('Captured select-open.png');

  await browser.close();
  console.log('Done!');
})();
