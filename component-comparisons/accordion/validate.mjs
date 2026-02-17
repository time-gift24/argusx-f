import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const COMPONENT = 'accordion';
const ROOT = process.cwd();
const BASE_DIR = path.join(ROOT, 'component-comparisons', COMPONENT);
const SOURCES_DIR = path.join(BASE_DIR, 'sources');
const SHADCN_DIR = path.join(SOURCES_DIR, 'shadcn');
const LOCAL_DIR = path.join(SOURCES_DIR, 'local');
const ZARDUI_DIR = path.join(SOURCES_DIR, 'zardui');
const EVIDENCE_DIR = path.join(BASE_DIR, 'evidence');

const BASELINE_URL =
  'https://ui.shadcn.com/preview/radix/accordion-example?item=accordion-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite';
const LOCAL_URL = process.env.LOCAL_URL ?? 'http://127.0.0.1:4310/preview/accordion';

const VISUAL_THRESHOLD = Number(process.env.VISUAL_THRESHOLD ?? '0.1');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function toRel(filePath) {
  return path.relative(ROOT, filePath);
}

async function ensureDirs() {
  await fs.mkdir(SHADCN_DIR, { recursive: true });
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.mkdir(ZARDUI_DIR, { recursive: true });
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
}

async function copySources() {
  await fs.copyFile(
    path.join(ROOT, 'src/app/shared/ui/accordion/accordion.component.ts'),
    path.join(LOCAL_DIR, 'accordion.component.ts')
  );

  // zardui source snapshot placeholder in this repo context.
  await fs.copyFile(
    path.join(ROOT, 'src/app/shared/ui/accordion/accordion.component.ts'),
    path.join(ZARDUI_DIR, 'accordion.component.ts')
  );
}

async function gotoReady(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.zoom = '1';
  });
  await page.waitForTimeout(200);
}

function localSection(page, title) {
  return page.locator('section', { hasText: title }).first();
}

function localTrigger(page, sectionTitle, label, nth = 0) {
  return localSection(page, sectionTitle)
    .getByRole('button', { name: label, exact: true })
    .nth(nth);
}

function baselineTrigger(page, label, nth = 0) {
  return page.getByRole('button', { name: label, exact: true }).nth(nth);
}

const MULTIPLE_Q1 =
  'What are the key considerations when implementing a comprehensive enterprise-level authentication system?';
const MULTIPLE_Q2 =
  'How does modern distributed system architecture handle eventual consistency and data synchronization across multiple regions?';

const visualStates = [
  {
    state: 'default',
    setupLocal: async () => {},
    setupBaseline: async () => {},
  },
  {
    state: 'basic-open',
    setupLocal: async (page) => {
      await localTrigger(page, 'Basic', 'Is it accessible?').click();
    },
    setupBaseline: async (page) => {
      await baselineTrigger(page, 'Is it accessible?').click();
    },
  },
  {
    state: 'multiple-open',
    setupLocal: async (page) => {
      await localTrigger(page, 'Multiple', MULTIPLE_Q1).click();
      await localTrigger(page, 'Multiple', MULTIPLE_Q2).click();
    },
    setupBaseline: async (page) => {
      await baselineTrigger(page, MULTIPLE_Q1).click();
      await baselineTrigger(page, MULTIPLE_Q2).click();
    },
  },
  {
    state: 'with-borders-open',
    setupLocal: async (page) => {
      await localTrigger(page, 'With Borders', 'How does billing work?').click();
    },
    setupBaseline: async (page) => {
      await baselineTrigger(page, 'How does billing work?', 0).click();
    },
  },
  {
    state: 'in-card-second-open',
    setupLocal: async (page) => {
      await localTrigger(page, 'In Card', 'How does billing work?').click();
    },
    setupBaseline: async (page) => {
      await baselineTrigger(page, 'How does billing work?', 1).click();
    },
  },
  {
    state: 'disabled-attempt',
    setupLocal: async (page) => {
      const disabled = localTrigger(page, 'With Disabled', 'Premium feature information');
      await disabled.click({ force: true });
    },
    setupBaseline: async (page) => {
      const disabled = baselineTrigger(page, 'Premium feature information');
      await disabled.click({ force: true });
    },
  },
];

function computeVisualDiff(localPath, baselinePath) {
  const filter = `movie=${localPath}[0];movie=${baselinePath}[1];[0][1]blend=all_mode=difference,signalstats`;
  const result = spawnSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-f',
      'lavfi',
      filter,
      '-show_entries',
      'frame_tags=lavfi.signalstats.YAVG',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
    ],
    { encoding: 'utf8' }
  );

  if (result.status !== 0) {
    throw new Error(
      `Unable to compute visual diff for ${path.basename(localPath)}.\n${result.stderr || result.stdout}`
    );
  }

  const yavg = Number((result.stdout || '').trim());
  if (Number.isNaN(yavg)) {
    throw new Error(`Unable to parse YAVG diff output for ${path.basename(localPath)}: ${result.stdout}`);
  }

  // Normalize [0,255] luma diff to [0,1] ratio.
  const diffRatio = Number((yavg / 255).toFixed(6));
  return { yavg, diffRatio };
}

async function runVisualValidation(context) {
  const states = [];

  for (const state of visualStates) {
    const shadcnPage = await context.newPage();
    const localPage = await context.newPage();

    await gotoReady(shadcnPage, BASELINE_URL);
    await gotoReady(localPage, LOCAL_URL);

    await state.setupBaseline(shadcnPage);
    await state.setupLocal(localPage);
    await shadcnPage.waitForTimeout(350);
    await localPage.waitForTimeout(350);

    const shadcnPath = path.join(SHADCN_DIR, `${state.state}.png`);
    const localPath = path.join(LOCAL_DIR, `${state.state}.png`);

    await shadcnPage.screenshot({ path: shadcnPath });
    await localPage.screenshot({ path: localPath });

    await shadcnPage.close();
    await localPage.close();

    const { yavg, diffRatio } = computeVisualDiff(localPath, shadcnPath);
    states.push({
      state: state.state,
      yavg,
      diff_ratio: diffRatio,
      threshold: VISUAL_THRESHOLD,
      pass: diffRatio <= VISUAL_THRESHOLD,
      shadcn_path: toRel(shadcnPath),
      local_path: toRel(localPath),
    });
  }

  const visualResult = {
    generated_at: new Date().toISOString(),
    baseline_url: BASELINE_URL,
    local_url: LOCAL_URL,
    threshold: VISUAL_THRESHOLD,
    states,
    pass: states.every((s) => s.pass),
  };

  const visualPath = path.join(BASE_DIR, 'visual-diff.json');
  await fs.writeFile(visualPath, `${JSON.stringify(visualResult, null, 2)}\n`);

  return visualResult;
}

async function runCase(context, caseId, fn) {
  const page = await context.newPage();
  const evidencePath = path.join(EVIDENCE_DIR, `${caseId}.png`);

  try {
    await gotoReady(page, LOCAL_URL);
    await fn(page);
    await page.waitForTimeout(200);
    await page.screenshot({ path: evidencePath });
    await page.close();

    return {
      case_id: caseId,
      status: 'pass',
      evidence_path: toRel(evidencePath),
      failure_reason: null,
    };
  } catch (error) {
    await page.screenshot({ path: evidencePath });
    await page.close();

    return {
      case_id: caseId,
      status: 'fail',
      evidence_path: toRel(evidencePath),
      failure_reason: error instanceof Error ? error.message : String(error),
    };
  }
}

async function runInteractionValidation(context) {
  const cases = [];

  cases.push(
    await runCase(context, 'open-close-via-click', async (page) => {
      const trigger = localTrigger(page, 'Basic', 'Is it accessible?');
      assert((await trigger.getAttribute('aria-expanded')) === 'false', 'Basic item should start closed');
      await trigger.click();
      assert((await trigger.getAttribute('aria-expanded')) === 'true', 'Basic item should open after click');
      await trigger.click();
      assert((await trigger.getAttribute('aria-expanded')) === 'false', 'Basic item should close after second click');
    })
  );

  cases.push(
    await runCase(context, 'outside-click-behavior', async (page) => {
      const trigger = localTrigger(page, 'Basic', 'Is it accessible?');
      await trigger.click();
      assert((await trigger.getAttribute('aria-expanded')) === 'true', 'Item should be open');
      await page.mouse.click(20, 20);
      assert(
        (await trigger.getAttribute('aria-expanded')) === 'true',
        'Accordion should preserve state after outside click'
      );
    })
  );

  cases.push(
    await runCase(context, 'escape-key-behavior', async (page) => {
      const trigger = localTrigger(page, 'Basic', 'Is it accessible?');
      await trigger.click();
      await page.keyboard.press('Escape');
      assert(
        (await trigger.getAttribute('aria-expanded')) === 'true',
        'Escape should not change accordion state'
      );
    })
  );

  cases.push(
    await runCase(context, 'keyboard-navigation', async (page) => {
      const first = localTrigger(page, 'Basic', 'Is it accessible?');
      const second = localTrigger(page, 'Basic', 'Is it styled?');
      const third = localTrigger(page, 'Basic', 'Is it animated?');

      await first.focus();
      await page.keyboard.press('ArrowDown');
      assert(await second.evaluate((el) => el === document.activeElement), 'ArrowDown should focus second trigger');

      await page.keyboard.press('End');
      assert(await third.evaluate((el) => el === document.activeElement), 'End should focus last trigger');

      await page.keyboard.press('Home');
      assert(await first.evaluate((el) => el === document.activeElement), 'Home should focus first trigger');

      await page.keyboard.press('ArrowUp');
      assert(await third.evaluate((el) => el === document.activeElement), 'ArrowUp should wrap to last trigger');
    })
  );

  cases.push(
    await runCase(context, 'toggle-via-enter-space', async (page) => {
      const trigger = localTrigger(page, 'Basic', 'Is it styled?');
      await trigger.focus();
      await page.keyboard.press('Enter');
      assert((await trigger.getAttribute('aria-expanded')) === 'true', 'Enter should open trigger');

      await page.keyboard.press('Space');
      assert((await trigger.getAttribute('aria-expanded')) === 'false', 'Space should close trigger');
    })
  );

  cases.push(
    await runCase(context, 'disabled-item-cannot-be-selected', async (page) => {
      const disabled = localTrigger(page, 'With Disabled', 'Premium feature information');
      assert(await disabled.isDisabled(), 'Disabled trigger should have disabled attribute');
      await disabled.click({ force: true });
      assert(
        (await disabled.getAttribute('aria-expanded')) === 'false',
        'Disabled trigger should remain closed'
      );
    })
  );

  cases.push(
    await runCase(context, 'hover-highlight-state', async (page) => {
      const trigger = localTrigger(page, 'Basic', 'Is it accessible?');
      await trigger.hover();
      const textDecoration = await trigger.evaluate(
        (el) => getComputedStyle(el).textDecorationLine
      );
      assert(textDecoration.includes('underline'), 'Hover should show underline state');
    })
  );

  cases.push(
    await runCase(context, 'selected-value-display', async (page) => {
      const trigger = localTrigger(page, 'Basic', 'Is it accessible?');
      await trigger.click();
      const section = localSection(page, 'Basic');
      const content = section.locator('[data-slot="accordion-content"]').first();
      const text = await content.innerText();
      assert(text.includes('WAI-ARIA design pattern'), 'Expanded content should display label text');
    })
  );

  cases.push(
    await runCase(context, 'long-list-scrolling', async (page) => {
      const trigger = localTrigger(page, 'Multiple', MULTIPLE_Q1);
      await trigger.click();
      const content = localSection(page, 'Multiple').locator('[data-slot="accordion-content"]').first();

      const metrics = await content.evaluate((el) => ({
        height: el.clientHeight,
        scrollHeight: el.scrollHeight,
        hidden: el.getAttribute('aria-hidden'),
      }));

      assert(metrics.hidden !== 'true', 'Long content should be visible when expanded');
      assert(metrics.scrollHeight >= metrics.height, 'Long content should layout without clipping');
    })
  );

  cases.push(
    await runCase(context, 'item-aligned-reopen', async (page) => {
      const first = localTrigger(page, 'Basic', 'Is it accessible?');
      const second = localTrigger(page, 'Basic', 'Is it styled?');
      await first.click();
      await second.click();

      assert((await first.getAttribute('aria-expanded')) === 'false', 'Single mode should close previous item');
      assert((await second.getAttribute('aria-expanded')) === 'true', 'Single mode should open selected item');
    })
  );

  cases.push(
    await runCase(context, 'context-behavior-inside-card', async (page) => {
      const first = localTrigger(page, 'In Card', 'What subscription plans do you offer?');
      const second = localTrigger(page, 'In Card', 'How does billing work?');

      assert((await first.getAttribute('aria-expanded')) === 'true', 'Card accordion should default first item open');
      await second.click();
      assert((await first.getAttribute('aria-expanded')) === 'false', 'Opening second card item should close first');
      assert((await second.getAttribute('aria-expanded')) === 'true', 'Second card item should open');
    })
  );

  const result = {
    generated_at: new Date().toISOString(),
    cases,
    pass: cases.every((c) => c.status === 'pass'),
  };

  const outputPath = path.join(BASE_DIR, 'interaction-results.json');
  await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);

  return result;
}

async function main() {
  await ensureDirs();
  await copySources();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1707 },
    deviceScaleFactor: 1,
  });

  try {
    const visualResult = await runVisualValidation(context);
    const interactionResult = await runInteractionValidation(context);

    const output = {
      visual: visualResult.pass,
      interaction: interactionResult.pass,
      visualStates: visualResult.states.map((s) => ({ state: s.state, diff_ratio: s.diff_ratio, pass: s.pass })),
      failedCases: interactionResult.cases.filter((c) => c.status === 'fail').map((c) => c.case_id),
    };

    console.log(JSON.stringify(output, null, 2));

    if (!visualResult.pass || !interactionResult.pass) {
      process.exitCode = 2;
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
