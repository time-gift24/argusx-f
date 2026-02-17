const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const pixelmatchModule = require('pixelmatch');
const { PNG } = require('pngjs');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

const ROOT = path.resolve(__dirname, '..', '..');
const COMPONENT = 'card';
const BASE_DIR = path.join(ROOT, 'component-comparisons', COMPONENT);
const SOURCES_DIR = path.join(BASE_DIR, 'sources');
const LOCAL_DIR = path.join(SOURCES_DIR, 'local');
const SHADCN_DIR = path.join(SOURCES_DIR, 'shadcn');
const ZARDUI_DIR = path.join(SOURCES_DIR, 'zardui');
const DIFF_DIR = path.join(SOURCES_DIR, 'diffs');
const RUN_STATE_PATH = path.join(BASE_DIR, 'run-state.json');
const INTERACTION_RESULTS_PATH = path.join(BASE_DIR, 'interaction-results.json');
const VISUAL_DIFF_PATH = path.join(BASE_DIR, 'visual-diff.json');

const BASELINE_URL = process.env.SHADCN_BASELINE_URL ||
  'https://ui.shadcn.com/preview/radix/card-example?item=card-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite';
const LOCAL_URL = process.env.LOCAL_PREVIEW_URL || 'http://127.0.0.1:4205/preview/card';
const VISUAL_THRESHOLD = Number(process.env.VISUAL_THRESHOLD || '0.05');

const VISUAL_STATES = [
  { id: 'default-view', locator: '[data-slot="example-wrapper"]' },
  { id: 'default-size', locator: '[data-slot="example"]', nth: 0 },
  { id: 'small-size', locator: '[data-slot="example"]', nth: 1 },
  { id: 'with-image', locator: '[data-slot="example"]', nth: 6 },
  { id: 'login', locator: '[data-slot="example"]', nth: 8 },
  { id: 'meeting-notes', locator: '[data-slot="example"]', nth: 9 },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function copyFileIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

function prepareCanvas(image, width, height) {
  const canvas = new PNG({ width, height, fill: true });
  PNG.bitblt(image, canvas, 0, 0, image.width, image.height, 0, 0);
  return canvas;
}

function compareImages(localPath, shadcnPath, diffPath) {
  const localPng = PNG.sync.read(fs.readFileSync(localPath));
  const shadcnPng = PNG.sync.read(fs.readFileSync(shadcnPath));

  const width = Math.max(localPng.width, shadcnPng.width);
  const height = Math.max(localPng.height, shadcnPng.height);

  const localCanvas = prepareCanvas(localPng, width, height);
  const shadcnCanvas = prepareCanvas(shadcnPng, width, height);
  const diffCanvas = new PNG({ width, height });

  const diffPixels = pixelmatch(
    localCanvas.data,
    shadcnCanvas.data,
    diffCanvas.data,
    width,
    height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diffCanvas));

  return {
    width,
    height,
    diff_pixels: diffPixels,
    diff_ratio: diffPixels / (width * height),
  };
}

async function captureStates(page, targetDir) {
  const captured = {};

  for (const state of VISUAL_STATES) {
    const locator =
      typeof state.nth === 'number'
        ? page.locator(state.locator).nth(state.nth)
        : page.locator(state.locator).first();

    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const outPath = path.join(targetDir, `${state.id}.png`);
    await locator.screenshot({ path: outPath });
    captured[state.id] = outPath;
  }

  const fullPagePath = path.join(targetDir, 'full-page.png');
  await page.screenshot({ path: fullPagePath, fullPage: true });

  return captured;
}

async function collectShadcnSource(page) {
  const wrapperHtml = await page.locator('[data-slot="example-wrapper"]').first().evaluate((el) => el.outerHTML);
  fs.writeFileSync(path.join(SHADCN_DIR, 'card-example-wrapper.html'), wrapperHtml, 'utf8');

  const pageHtml = await page.content();
  fs.writeFileSync(path.join(SHADCN_DIR, 'card-example-page.html'), pageHtml, 'utf8');
}

async function runInteractionChecks(page) {
  const cases = [];

  const pushCase = async (caseId, testFn, evidenceName) => {
    const evidencePath = evidenceName
      ? path.join(LOCAL_DIR, evidenceName)
      : null;

    try {
      await testFn(evidencePath);
      cases.push({
        case_id: caseId,
        status: 'pass',
        evidence_path: evidencePath,
        failure_reason: null,
      });
    } catch (error) {
      if (evidencePath) {
        await page.screenshot({ path: evidencePath, fullPage: true });
      }
      cases.push({
        case_id: caseId,
        status: 'fail',
        evidence_path: evidencePath,
        failure_reason: error instanceof Error ? error.message : String(error),
      });
    }
  };

  await pushCase(
    'render-10-examples',
    async (evidencePath) => {
      const count = await page.locator('[data-slot="example"]').count();
      if (count !== 10) {
        throw new Error(`expected 10 examples, got ${count}`);
      }
      if (evidencePath) {
        await page.locator('[data-slot="example-wrapper"]').first().screenshot({ path: evidencePath });
      }
    },
    'interaction-render-10-examples.png'
  );

  await pushCase(
    'size-variant-coverage',
    async (evidencePath) => {
      const sizes = await page
        .locator('[data-slot="card"]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-size')));
      const defaultCount = sizes.filter((value) => value === 'default').length;
      const smCount = sizes.filter((value) => value === 'sm').length;
      if (defaultCount < 1 || smCount < 1) {
        throw new Error(`missing required sizes: default=${defaultCount}, sm=${smCount}`);
      }
      if (evidencePath) {
        await page.locator('[data-slot="example"]').nth(1).screenshot({ path: evidencePath });
      }
    },
    'interaction-size-variant-coverage.png'
  );

  await pushCase(
    'hover-highlight-state',
    async (evidencePath) => {
      const button = page
        .locator('[data-slot="example"]')
        .nth(0)
        .locator('button')
        .first();
      await button.hover();
      if (evidencePath) {
        await page.locator('[data-slot="example"]').nth(0).screenshot({ path: evidencePath });
      }
    },
    'interaction-hover-highlight-state.png'
  );

  await pushCase(
    'login-form-entry',
    async (evidencePath) => {
      const loginExample = page.locator('[data-slot="example"]').nth(8);
      const email = loginExample.locator('#email');
      const password = loginExample.locator('#password');
      await email.fill('m@example.com');
      await password.fill('super-secret');
      const emailValue = await email.inputValue();
      const passwordValue = await password.inputValue();
      if (emailValue !== 'm@example.com' || passwordValue !== 'super-secret') {
        throw new Error('form input values did not persist after fill');
      }
      if (evidencePath) {
        await loginExample.screenshot({ path: evidencePath });
      }
    },
    'interaction-login-form-entry.png'
  );

  await pushCase(
    'meeting-notes-action-layout',
    async (evidencePath) => {
      const meeting = page.locator('[data-slot="example"]').nth(9);
      const actionButton = meeting
        .locator('[data-slot="card-action"] button', { hasText: 'Transcribe' })
        .first();
      if ((await actionButton.count()) === 0) {
        throw new Error('missing Transcribe action button inside card action slot');
      }
      const avatarCount = await meeting.locator('[data-slot="avatar"]').count();
      const avatarGroupCount = await meeting.locator('[data-slot="avatar-group-count"]').first().textContent();
      if (avatarCount < 3 || !avatarGroupCount?.includes('+8')) {
        throw new Error(`unexpected avatar footer: avatars=${avatarCount}, groupCount=${avatarGroupCount}`);
      }
      if (evidencePath) {
        await meeting.screenshot({ path: evidencePath });
      }
    },
    'interaction-meeting-notes-action-layout.png'
  );

  return cases;
}

function loadRunState() {
  if (!fs.existsSync(RUN_STATE_PATH)) {
    return {
      component: COMPONENT,
      baseline_url: BASELINE_URL,
      visual_threshold: VISUAL_THRESHOLD,
      max_iterations: 10,
      iteration: 0,
      worktree_path: '.worktrees/card-comparison',
      branch: 'codex/card-quality-compare',
      status: 'in_progress',
    };
  }

  return JSON.parse(fs.readFileSync(RUN_STATE_PATH, 'utf8'));
}

async function main() {
  ensureDir(BASE_DIR);
  ensureDir(SOURCES_DIR);
  ensureDir(LOCAL_DIR);
  ensureDir(SHADCN_DIR);
  ensureDir(ZARDUI_DIR);
  ensureDir(DIFF_DIR);

  copyFileIfExists(
    path.join(ROOT, 'src/app/shared/ui/card/card.directive.ts'),
    path.join(LOCAL_DIR, 'card.directive.ts')
  );
  copyFileIfExists(
    path.join(ROOT, 'src/app/preview/card-preview.component.ts'),
    path.join(LOCAL_DIR, 'card-preview.component.ts')
  );

  const runState = loadRunState();
  runState.component = COMPONENT;
  runState.baseline_url = BASELINE_URL;
  runState.visual_threshold = VISUAL_THRESHOLD;
  runState.worktree_path = '.worktrees/card-comparison';
  runState.branch = 'codex/card-quality-compare';
  runState.iteration = Number(runState.iteration || 0) + 1;
  runState.status = 'in_progress';
  writeJson(RUN_STATE_PATH, runState);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2200 },
    deviceScaleFactor: 1,
  });

  const shadcnPage = await context.newPage();
  await shadcnPage.goto(BASELINE_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await shadcnPage.waitForTimeout(2500);
  const shadcnShots = await captureStates(shadcnPage, SHADCN_DIR);
  await collectShadcnSource(shadcnPage);

  const localPage = await context.newPage();
  await localPage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await localPage.waitForTimeout(1500);
  const localShots = await captureStates(localPage, LOCAL_DIR);

  const interactionCases = await runInteractionChecks(localPage);
  writeJson(INTERACTION_RESULTS_PATH, {
    component: COMPONENT,
    baseline_url: BASELINE_URL,
    local_url: LOCAL_URL,
    cases: interactionCases,
    summary: {
      total: interactionCases.length,
      passed: interactionCases.filter((item) => item.status === 'pass').length,
      failed: interactionCases.filter((item) => item.status === 'fail').length,
    },
  });

  const stateResults = [];
  for (const state of VISUAL_STATES) {
    const localPath = localShots[state.id];
    const shadcnPath = shadcnShots[state.id];
    const diffPath = path.join(DIFF_DIR, `${state.id}-diff.png`);
    const metrics = compareImages(localPath, shadcnPath, diffPath);

    stateResults.push({
      state: state.id,
      local_path: path.relative(BASE_DIR, localPath),
      shadcn_path: path.relative(BASE_DIR, shadcnPath),
      diff_path: path.relative(BASE_DIR, diffPath),
      width: metrics.width,
      height: metrics.height,
      diff_pixels: metrics.diff_pixels,
      diff_ratio: Number(metrics.diff_ratio.toFixed(6)),
      threshold: VISUAL_THRESHOLD,
      pass: metrics.diff_ratio <= VISUAL_THRESHOLD,
    });
  }

  const visualPass = stateResults.every((item) => item.pass);
  const interactionPass = interactionCases.every((item) => item.status === 'pass');

  writeJson(VISUAL_DIFF_PATH, {
    component: COMPONENT,
    baseline_url: BASELINE_URL,
    visual_threshold: VISUAL_THRESHOLD,
    states: stateResults,
    summary: {
      pass: visualPass,
      avg_diff_ratio:
        Number(
          (
            stateResults.reduce((sum, item) => sum + item.diff_ratio, 0) /
            Math.max(stateResults.length, 1)
          ).toFixed(6)
        ),
      max_diff_ratio: Number(
        Math.max(...stateResults.map((item) => item.diff_ratio)).toFixed(6)
      ),
    },
  });

  runState.status = visualPass && interactionPass ? 'success' : 'blocked';
  runState.notes = visualPass && interactionPass
    ? 'Visual and interaction checks passed.'
    : 'One or more visual/interaction checks failed. See visual-diff.json and interaction-results.json';
  writeJson(RUN_STATE_PATH, runState);

  await browser.close();

  if (!visualPass || !interactionPass) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
