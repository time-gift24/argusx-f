#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { chromium } from 'playwright';

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);
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

function parseViewport(input) {
  if (!input) {
    return { width: 1440, height: 1200 };
  }

  const parts = input.split('x');
  if (parts.length !== 2) {
    throw new Error(`Invalid --viewport value "${input}". Use WIDTHxHEIGHT, for example 1440x1200.`);
  }

  const width = Number(parts[0]);
  const height = Number(parts[1]);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error(`Invalid --viewport value "${input}". Use positive integers like 1440x1200.`);
  }

  return { width, height };
}

function parseBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  const normalized = String(value).toLowerCase().trim();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

function ensureValue(value, message) {
  if (value === undefined || value === null || value === '') {
    throw new Error(message);
  }
}

function hashBuffer(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

function targetLabel(target) {
  if (!target) {
    return '<none>';
  }
  if (typeof target === 'string') {
    return target;
  }
  if (target.selector) {
    return target.selector;
  }
  if (target.role) {
    return `role=${target.role}${target.name ? ` name=${target.name}` : ''}`;
  }
  if (target.text) {
    return `text=${target.text}`;
  }
  if (target.label) {
    return `label=${target.label}`;
  }
  if (target.testId) {
    return `testId=${target.testId}`;
  }
  return JSON.stringify(target);
}

function buildNameMatcher(target) {
  if (!target || target.name === undefined) {
    return undefined;
  }
  if (target.namePattern) {
    return new RegExp(target.name, target.nameFlags || '');
  }
  return target.name;
}

function resolveLocator(page, target) {
  if (!target) {
    throw new Error('Missing action/assertion target.');
  }

  if (typeof target === 'string') {
    return page.locator(target);
  }

  if (target.selector) {
    return page.locator(target.selector);
  }

  if (target.role) {
    return page.getByRole(target.role, {
      name: buildNameMatcher(target),
      exact: Boolean(target.exact),
    });
  }

  if (target.text) {
    return page.getByText(target.text, { exact: Boolean(target.exact) });
  }

  if (target.label) {
    return page.getByLabel(target.label, { exact: Boolean(target.exact) });
  }

  if (target.testId) {
    return page.getByTestId(target.testId);
  }

  throw new Error(`Unsupported target shape: ${JSON.stringify(target)}`);
}

async function runAction(page, action) {
  ensureValue(action?.type, `Invalid action: ${JSON.stringify(action)}`);
  const timeout = action.timeoutMs ?? 5000;
  const type = action.type;

  const withTarget = () => resolveLocator(page, action.target);
  const waitAfter = async () => {
    if (action.waitAfterMs) {
      await page.waitForTimeout(action.waitAfterMs);
    }
  };

  switch (type) {
    case 'wait': {
      await page.waitForTimeout(action.ms ?? 300);
      return;
    }
    case 'waitFor': {
      const locator = withTarget();
      await locator.first().waitFor({
        state: action.state ?? 'visible',
        timeout,
      });
      return;
    }
    case 'waitForUrl': {
      ensureValue(action.url, `waitForUrl action requires "url": ${JSON.stringify(action)}`);
      await page.waitForURL(action.url, { timeout });
      return;
    }
    case 'scrollIntoView': {
      const locator = withTarget();
      await locator.first().scrollIntoViewIfNeeded();
      await waitAfter();
      return;
    }
    case 'hover': {
      const locator = withTarget();
      await locator.first().hover({ timeout, force: Boolean(action.force) });
      await waitAfter();
      return;
    }
    case 'click': {
      const locator = withTarget();
      await locator.first().click({
        timeout,
        force: Boolean(action.force),
        button: action.button ?? 'left',
        clickCount: action.clickCount ?? 1,
      });
      await waitAfter();
      return;
    }
    case 'dblclick': {
      const locator = withTarget();
      await locator.first().dblclick({ timeout, force: Boolean(action.force) });
      await waitAfter();
      return;
    }
    case 'rightClick': {
      const locator = withTarget();
      await locator.first().click({ timeout, button: 'right', force: Boolean(action.force) });
      await waitAfter();
      return;
    }
    case 'focus': {
      const locator = withTarget();
      await locator.first().focus();
      await waitAfter();
      return;
    }
    case 'blur': {
      const locator = withTarget();
      await locator.first().evaluate((node) => {
        if (node instanceof HTMLElement) {
          node.blur();
        }
      });
      await waitAfter();
      return;
    }
    case 'press': {
      const key = action.key;
      ensureValue(key, `press action requires "key": ${JSON.stringify(action)}`);
      if (action.target) {
        const locator = withTarget();
        await locator.first().press(key, { timeout });
      } else {
        await page.keyboard.press(key);
      }
      await waitAfter();
      return;
    }
    case 'fill': {
      const locator = withTarget();
      await locator.first().fill(action.value ?? '', { timeout });
      await waitAfter();
      return;
    }
    case 'type': {
      const locator = withTarget();
      await locator.first().type(action.value ?? '', {
        delay: action.delayMs ?? 20,
        timeout,
      });
      await waitAfter();
      return;
    }
    case 'check': {
      const locator = withTarget();
      await locator.first().check({ timeout, force: Boolean(action.force) });
      await waitAfter();
      return;
    }
    case 'uncheck': {
      const locator = withTarget();
      await locator.first().uncheck({ timeout, force: Boolean(action.force) });
      await waitAfter();
      return;
    }
    case 'drag': {
      const from = resolveLocator(page, action.from);
      const to = resolveLocator(page, action.to);
      await from.first().dragTo(to.first(), { timeout, force: Boolean(action.force) });
      await waitAfter();
      return;
    }
    default:
      throw new Error(`Unsupported action type "${type}"`);
  }
}

async function runAssertion(page, assertion) {
  ensureValue(assertion?.type, `Invalid assertion: ${JSON.stringify(assertion)}`);
  const timeout = assertion.timeoutMs ?? 5000;
  const type = assertion.type;

  if (type === 'urlIncludes') {
    ensureValue(
      assertion.value,
      `urlIncludes assertion requires "value": ${JSON.stringify(assertion)}`
    );
    const url = page.url();
    if (!url.includes(assertion.value)) {
      throw new Error(`Assertion failed: URL "${url}" does not include "${assertion.value}"`);
    }
    return;
  }

  const locator = resolveLocator(page, assertion.target).first();
  switch (type) {
    case 'visible': {
      await locator.waitFor({ state: 'visible', timeout });
      return;
    }
    case 'hidden': {
      await locator.waitFor({ state: 'hidden', timeout });
      return;
    }
    case 'exists': {
      await locator.waitFor({ state: 'attached', timeout });
      return;
    }
    case 'notExists': {
      const deadline = Date.now() + timeout;
      while (Date.now() < deadline) {
        // eslint-disable-next-line no-await-in-loop
        const count = await locator.count();
        if (count === 0) {
          return;
        }
        // eslint-disable-next-line no-await-in-loop
        await page.waitForTimeout(100);
      }
      throw new Error(`Assertion failed: expected target to not exist: ${targetLabel(assertion.target)}`);
    }
    case 'count': {
      const actual = await locator.count();
      if (assertion.equals !== undefined && actual !== assertion.equals) {
        throw new Error(`Assertion failed: count ${actual} !== ${assertion.equals}`);
      }
      if (assertion.gte !== undefined && actual < assertion.gte) {
        throw new Error(`Assertion failed: count ${actual} < ${assertion.gte}`);
      }
      if (assertion.lte !== undefined && actual > assertion.lte) {
        throw new Error(`Assertion failed: count ${actual} > ${assertion.lte}`);
      }
      return;
    }
    case 'attr': {
      ensureValue(assertion.name, `attr assertion requires "name": ${JSON.stringify(assertion)}`);
      const actual = await locator.getAttribute(assertion.name, { timeout });
      if (String(actual) !== String(assertion.value)) {
        throw new Error(
          `Assertion failed: attr ${assertion.name} on ${targetLabel(assertion.target)} expected "${assertion.value}", got "${actual}"`
        );
      }
      return;
    }
    case 'textIncludes': {
      ensureValue(assertion.value, `textIncludes assertion requires "value": ${JSON.stringify(assertion)}`);
      const actual = (await locator.innerText()).trim();
      if (!actual.includes(assertion.value)) {
        throw new Error(
          `Assertion failed: text does not include "${assertion.value}" on ${targetLabel(assertion.target)}.\nActual text: "${actual}"`
        );
      }
      return;
    }
    default:
      throw new Error(`Unsupported assertion type "${type}"`);
  }
}

async function takeShot(page, outDir, shot, defaultFullPage) {
  const shotName = shot.name;
  ensureValue(shotName, `Every shot must include "name": ${JSON.stringify(shot)}`);
  const screenshot = shot.screenshot ?? {};
  const fileName = screenshot.file ?? `${shotName}.png`;
  const filePath = path.join(outDir, fileName);

  if (screenshot.target) {
    const locator = resolveLocator(page, screenshot.target);
    await locator.first().screenshot({ path: filePath });
  } else {
    await page.screenshot({
      path: filePath,
      fullPage: parseBoolean(screenshot.fullPage, defaultFullPage),
    });
  }

  const data = await fs.readFile(filePath);
  return {
    filePath,
    hash: hashBuffer(data),
  };
}

async function run() {
  const args = parseArgs(process.argv);
  const url = args.url;
  const scenarioPath = args.scenario;
  const outDir = args['out-dir'];
  const fullPage = parseBoolean(args['full-page'], true);

  ensureValue(
    url,
    'Missing --url. Example: --url "https://ui.shadcn.com/preview/radix/select-example?item=select-example..."'
  );
  ensureValue(
    scenarioPath,
    'Missing --scenario. Example: --scenario ".argus/skills/shadcn-preview-capture/references/examples/select.json"'
  );
  ensureValue(outDir, 'Missing --out-dir. Example: --out-dir "previews/shadcn/select"');

  const scenarioRaw = await fs.readFile(scenarioPath, 'utf8');
  const scenario = JSON.parse(scenarioRaw);
  const shots = scenario.shots ?? [];
  if (!Array.isArray(shots) || shots.length === 0) {
    throw new Error(`Scenario must include a non-empty "shots" array: ${scenarioPath}`);
  }

  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: !parseBoolean(args.headful, false),
  });

  const context = await browser.newContext({
    viewport: parseViewport(args.viewport),
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  const goto = async () => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const networkIdleTimeoutMs = scenario.networkIdleTimeoutMs ?? 4000;
    if (networkIdleTimeoutMs > 0) {
      try {
        await page.waitForLoadState('networkidle', { timeout: networkIdleTimeoutMs });
      } catch {
        console.warn(
          `Warning: networkidle was not reached within ${networkIdleTimeoutMs}ms. Continuing with DOM-ready state.`
        );
      }
    }
    const waitAfterLoadMs = scenario.waitAfterLoadMs ?? 1200;
    if (waitAfterLoadMs > 0) {
      await page.waitForTimeout(waitAfterLoadMs);
    }
  };

  await goto();

  const shotHashes = new Map();
  let previousHash = null;
  const summary = [];

  for (const [index, shot] of shots.entries()) {
    if (shot.reset === true && index > 0) {
      await goto();
    }

    const actions = shot.actions ?? [];
    for (const action of actions) {
      // eslint-disable-next-line no-await-in-loop
      await runAction(page, action);
    }

    const assertions = shot.assertions ?? [];
    for (const assertion of assertions) {
      // eslint-disable-next-line no-await-in-loop
      await runAssertion(page, assertion);
    }

    if (shot.beforeScreenshotWaitMs) {
      await page.waitForTimeout(shot.beforeScreenshotWaitMs);
    }

    // eslint-disable-next-line no-await-in-loop
    const result = await takeShot(page, outDir, shot, fullPage);
    const shotName = shot.name;
    shotHashes.set(shotName, result.hash);

    if (shot.mustDifferFrom) {
      const baselineHash = shotHashes.get(shot.mustDifferFrom);
      if (!baselineHash) {
        throw new Error(
          `Shot "${shotName}" references unknown mustDifferFrom shot "${shot.mustDifferFrom}"`
        );
      }
      if (baselineHash === result.hash) {
        throw new Error(
          `Shot "${shotName}" is identical to "${shot.mustDifferFrom}" (${result.hash}). This usually means interaction failed.`
        );
      }
    }

    if (shot.mustDifferFromPrevious && previousHash && previousHash === result.hash) {
      throw new Error(
        `Shot "${shotName}" is identical to previous shot (${result.hash}). This usually means interaction failed.`
      );
    }

    previousHash = result.hash;
    summary.push({
      shot: shotName,
      file: path.relative(process.cwd(), result.filePath),
      hash: result.hash,
    });
  }

  await browser.close();

  console.log('\nCapture completed:');
  for (const item of summary) {
    console.log(`- ${item.shot}: ${item.file} [${item.hash}]`);
  }
}

run().catch((error) => {
  console.error(`\nCapture failed: ${error.message}`);
  process.exitCode = 1;
});
