import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildMainProcessInterrogation,
  createInitialTaskRecords,
  getUnreviewedComponents,
  parsePreviewItems,
  renderTaskListConsole,
  renderTaskListMarkdown,
  runWithConcurrency,
  summarizeTaskRecords,
  validateSubagentOutput,
} from './preview-review-orchestrator.mjs';

test('parsePreviewItems extracts ids and manuallyReviewed flag', () => {
  const source = `
const PREVIEW_ITEMS = [
  { id: 'button', label: 'Button', manuallyReviewed: true },
  { id: 'popover', label: 'Popover' },
  { id: 'tooltip', label: 'Tooltip', manuallyReviewed: true },
] as const;
`;

  const items = parsePreviewItems(source);
  assert.equal(items.length, 3);
  assert.deepEqual(items[0], {
    id: 'button',
    label: 'Button',
    manuallyReviewed: true,
  });
  assert.deepEqual(items[1], {
    id: 'popover',
    label: 'Popover',
    manuallyReviewed: false,
  });
});

test('getUnreviewedComponents returns ids without manuallyReviewed=true', () => {
  const items = [
    { id: 'a', label: 'A', manuallyReviewed: true },
    { id: 'b', label: 'B', manuallyReviewed: false },
    { id: 'c', label: 'C', manuallyReviewed: false },
  ];

  assert.deepEqual(getUnreviewedComponents(items), ['b', 'c']);
});

test('validateSubagentOutput validates success payload', () => {
  const output = {
    component: 'popover',
    status: 'success',
    branch: 'codex/review-popover',
    worktreePath: '/tmp/worktree',
    commitSha: 'abc123',
    checks: {
      visualPass: true,
      interactionPass: true,
    },
    artifacts: {
      visualDiffJson: '/tmp/visual.json',
      interactionResultsJson: '/tmp/interaction.json',
    },
  };

  const validation = validateSubagentOutput(output, 'popover');
  assert.equal(validation.ok, true);
});

test('validateSubagentOutput rejects success payload missing commitSha', () => {
  const output = {
    component: 'popover',
    status: 'success',
    branch: 'codex/review-popover',
    worktreePath: '/tmp/worktree',
    checks: {
      visualPass: true,
      interactionPass: true,
    },
  };

  const validation = validateSubagentOutput(output, 'popover');
  assert.equal(validation.ok, false);
});

test('validateSubagentOutput rejects success payload missing pixel evidence artifacts', () => {
  const output = {
    component: 'popover',
    status: 'success',
    branch: 'codex/review-popover',
    worktreePath: '/tmp/worktree',
    commitSha: 'abc123',
    checks: {
      visualPass: true,
      interactionPass: true,
    },
    artifacts: {
      visualDiffJson: '/tmp/visual.json',
    },
  };

  const validation = validateSubagentOutput(output, 'popover');
  assert.equal(validation.ok, false);
  assert.ok(validation.error.includes('主进程质问'));
});

test('buildMainProcessInterrogation renders challenge list', () => {
  const message = buildMainProcessInterrogation('popover', [
    '缺少 visualDiffJson',
    '缺少 interactionResultsJson',
  ]);
  assert.ok(message.includes('主进程质问（popover）'));
  assert.ok(message.includes('1. 缺少 visualDiffJson'));
});

test('runWithConcurrency never exceeds configured limit', async () => {
  const items = Array.from({ length: 12 }, (_, index) => index + 1);
  const concurrencyLimit = 3;
  let inFlight = 0;
  let observedMax = 0;

  const { maxRunning } = await runWithConcurrency(items, concurrencyLimit, async (value) => {
    inFlight += 1;
    observedMax = Math.max(observedMax, inFlight);
    await new Promise((resolvePromise) => {
      setTimeout(resolvePromise, 10);
    });
    inFlight -= 1;
    return value;
  });

  assert.ok(observedMax <= concurrencyLimit);
  assert.ok(maxRunning <= concurrencyLimit);
});

test('task list helpers include running and agent completion markers', () => {
  const tasks = createInitialTaskRecords(['popover', 'tooltip'], {
    repoRoot: '/repo',
    worktreeRoot: '/repo/.worktrees',
  });

  assert.equal(tasks.length, 2);
  assert.equal(tasks[0].status, 'pending');
  assert.equal(tasks[0].isRunning, false);
  assert.equal(tasks[0].agentCompleted, false);

  tasks[0].status = 'running';
  tasks[0].isRunning = true;
  tasks[1].status = 'success';
  tasks[1].agentCompleted = true;

  const summary = summarizeTaskRecords(tasks);
  assert.equal(summary.runningCount, 1);
  assert.equal(summary.successCount, 1);
  assert.equal(summary.agentCompletedCount, 1);

  const markdown = renderTaskListMarkdown({
    runId: 'run-1',
    generatedAt: '2026-02-18T00:00:00.000Z',
    updatedAt: '2026-02-18T00:01:00.000Z',
    queueSize: 2,
    counts: summary,
    tasks,
  });
  assert.ok(markdown.includes('| popover | running | true | false |'));
  assert.ok(markdown.includes('| tooltip | success | false | true |'));

  const consoleText = renderTaskListConsole({
    runId: 'run-1',
    generatedAt: '2026-02-18T00:00:00.000Z',
    updatedAt: '2026-02-18T00:01:00.000Z',
    queueSize: 2,
    counts: summary,
    tasks,
  });
  assert.ok(consoleText.includes('running=1'));
  assert.ok(consoleText.includes('agentCompleted=1'));
  assert.ok(consoleText.includes('popover | running | true | false |'));
});
