#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const previewUrl = args['preview-url'];
  const timeoutMs = Number(args['timeout-ms'] ?? 20000);

  if (!previewUrl) {
    throw new Error('Missing --preview-url');
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  try {
    await page.goto(previewUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    await page.waitForSelector('iframe', { state: 'attached', timeout: timeoutMs });
    const iframeSrc = await page.getAttribute('iframe', 'src');
    if (!iframeSrc) {
      throw new Error('Preview layout iframe has no src attribute.');
    }

    const preview = new URL(previewUrl);
    const localFrameUrl = new URL(iframeSrc, previewUrl).toString();
    const component = preview.searchParams.get('component');
    const previewPort =
      preview.port.length > 0 ? Number(preview.port) : preview.protocol === 'https:' ? 443 : 80;

    const result = {
      localPreviewUrl: previewUrl,
      localFrameUrl,
      component,
      previewPort,
      resolvedAt: new Date().toISOString(),
    };

    if (args.out) {
      await writeFile(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    }
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`resolve_local_urls failed: ${error.message}`);
  process.exit(1);
});
