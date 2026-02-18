#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = dirname(scriptPath);
const defaultRepoRoot = resolve(scriptDir, '..');

const INPUT_SCHEMA_VERSION = 'v1';
const OUTPUT_SCHEMA_VERSION = 'v1';

const TASK_STATUS = {
  pending: 'pending',
  running: 'running',
  awaitingCherryPick: 'awaiting_cherry_pick',
  success: 'success',
  failed: 'failed',
};

export function createInitialTaskRecords(queue, { repoRoot, worktreeRoot }) {
  const now = new Date().toISOString();
  return queue.map((component) => ({
    component,
    status: TASK_STATUS.pending,
    isRunning: false,
    agentCompleted: false,
    agentResult: null,
    cherryPick: 'pending',
    branch: `codex/review-${component}`,
    worktreePath: resolve(worktreeRoot, `review-${component}`),
    baselineDir: resolve(repoRoot, 'previews', 'shadcn', component),
    artifactDir: resolve(repoRoot, 'component-comparisons', component),
    commitSha: null,
    checks: {},
    artifacts: {},
    error: null,
    startedAt: null,
    finishedAt: null,
    updatedAt: now,
  }));
}

export function summarizeTaskRecords(records) {
  const summary = {
    pendingCount: 0,
    runningCount: 0,
    awaitingCherryPickCount: 0,
    successCount: 0,
    failureCount: 0,
    agentCompletedCount: 0,
  };

  for (const record of records) {
    if (record.status === TASK_STATUS.pending) summary.pendingCount += 1;
    if (record.status === TASK_STATUS.running) summary.runningCount += 1;
    if (record.status === TASK_STATUS.awaitingCherryPick) summary.awaitingCherryPickCount += 1;
    if (record.status === TASK_STATUS.success) summary.successCount += 1;
    if (record.status === TASK_STATUS.failed) summary.failureCount += 1;
    if (record.agentCompleted) summary.agentCompletedCount += 1;
  }

  return summary;
}

export function renderTaskListMarkdown(snapshot) {
  const lines = [];
  const counts = snapshot.counts;
  lines.push(`# Preview Review Tasks (${snapshot.runId})`);
  lines.push('');
  lines.push(`- generatedAt: ${snapshot.generatedAt}`);
  lines.push(`- updatedAt: ${snapshot.updatedAt}`);
  lines.push(`- queueSize: ${snapshot.queueSize}`);
  lines.push(`- pending: ${counts.pendingCount}`);
  lines.push(`- running: ${counts.runningCount}`);
  lines.push(`- awaitingCherryPick: ${counts.awaitingCherryPickCount}`);
  lines.push(`- success: ${counts.successCount}`);
  lines.push(`- failed: ${counts.failureCount}`);
  lines.push(`- agentCompleted: ${counts.agentCompletedCount}`);
  lines.push('');
  lines.push('| component | status | isRunning | agentCompleted | cherryPick | commitSha |');
  lines.push('|---|---|---|---|---|---|');

  for (const task of snapshot.tasks) {
    lines.push(
      `| ${task.component} | ${task.status} | ${task.isRunning} | ${task.agentCompleted} | ${task.cherryPick} | ${
        task.commitSha ?? ''
      } |`
    );
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

export function renderTaskListConsole(snapshot) {
  const lines = [];
  const counts = snapshot.counts;
  lines.push(`Preview Review Watch (${snapshot.runId})`);
  lines.push(`updatedAt: ${snapshot.updatedAt}`);
  lines.push(
    `queue=${snapshot.queueSize} pending=${counts.pendingCount} running=${counts.runningCount} awaitingCherryPick=${counts.awaitingCherryPickCount} success=${counts.successCount} failed=${counts.failureCount} agentCompleted=${counts.agentCompletedCount}`
  );
  lines.push('');
  lines.push('component | status | isRunning | agentCompleted | cherryPick | commitSha');
  lines.push('---|---|---|---|---|---');

  for (const task of snapshot.tasks) {
    lines.push(
      `${task.component} | ${task.status} | ${task.isRunning} | ${task.agentCompleted} | ${task.cherryPick} | ${
        task.commitSha ?? ''
      }`
    );
  }

  return `${lines.join('\n')}\n`;
}

export function buildMainProcessInterrogation(component, issues) {
  const lines = [
    `主进程质问（${component}）:`,
    ...issues.map((issue, index) => `${index + 1}. ${issue}`),
    '请先完成 preview 1:1 像素级复刻并提供证据，再报告 success。',
  ];
  return lines.join('\n');
}

export function parsePreviewItems(source) {
  const blockMatch = source.match(
    /const\s+PREVIEW_ITEMS\s*=\s*\[([\s\S]*?)\]\s*as\s+const\s*;/
  );
  if (!blockMatch) {
    throw new Error('Unable to locate PREVIEW_ITEMS array in preview layout source.');
  }

  const block = blockMatch[1];
  const objects = block.match(/\{[\s\S]*?\}/g) ?? [];

  const items = objects
    .map((entry) => {
      const idMatch = entry.match(/id\s*:\s*'([^']+)'/);
      const labelMatch = entry.match(/label\s*:\s*'([^']+)'/);
      if (!idMatch || !labelMatch) {
        return null;
      }

      return {
        id: idMatch[1],
        label: labelMatch[1],
        manuallyReviewed: /manuallyReviewed\s*:\s*true/.test(entry),
      };
    })
    .filter(Boolean);

  return items;
}

export function getUnreviewedComponents(items) {
  return items.filter((item) => !item.manuallyReviewed).map((item) => item.id);
}

export function createRunId(now = new Date()) {
  const pad2 = (value) => String(value).padStart(2, '0');
  return [
    now.getFullYear(),
    pad2(now.getMonth() + 1),
    pad2(now.getDate()),
    '-',
    pad2(now.getHours()),
    pad2(now.getMinutes()),
    pad2(now.getSeconds()),
  ].join('');
}

export function makeTaskContract({
  component,
  repoRoot,
  worktreeRoot,
  visualThreshold,
}) {
  return {
    component,
    repoRoot,
    worktreeRoot,
    branch: `codex/review-${component}`,
    worktreePath: resolve(worktreeRoot, `review-${component}`),
    baselineDir: resolve(repoRoot, 'previews', 'shadcn', component),
    artifactDir: resolve(repoRoot, 'component-comparisons', component),
    verification: {
      visualThreshold,
      requireInteractionChecks: true,
    },
  };
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

export function renderSubagentCommand(template, replacements) {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_match, key) => {
    if (!(key in replacements)) {
      throw new Error(`Missing command template replacement: ${key}`);
    }
    return shellEscape(replacements[key]);
  });
}

export function validateSubagentOutput(rawOutput, expectedComponent) {
  if (!rawOutput || typeof rawOutput !== 'object' || Array.isArray(rawOutput)) {
    return { ok: false, error: 'Subagent output must be a JSON object.' };
  }

  const output = rawOutput;
  const status = output.status;
  if (status !== 'success' && status !== 'failed') {
    return { ok: false, error: 'Subagent output field "status" must be success or failed.' };
  }

  if (output.component !== expectedComponent) {
    return {
      ok: false,
      error: `Subagent output component mismatch: expected ${expectedComponent}, received ${output.component}.`,
    };
  }

  if (typeof output.branch !== 'string' || output.branch.length === 0) {
    return { ok: false, error: 'Subagent output field "branch" is required.' };
  }

  if (typeof output.worktreePath !== 'string' || output.worktreePath.length === 0) {
    return { ok: false, error: 'Subagent output field "worktreePath" is required.' };
  }

  if (status === 'success') {
    if (typeof output.commitSha !== 'string' || output.commitSha.length === 0) {
      return { ok: false, error: 'Successful subagent output requires non-empty "commitSha".' };
    }

    if (
      !output.checks ||
      typeof output.checks.visualPass !== 'boolean' ||
      typeof output.checks.interactionPass !== 'boolean'
    ) {
      return {
        ok: false,
        error:
          'Successful subagent output requires "checks.visualPass" and "checks.interactionPass" booleans.',
      };
    }
    if (output.checks.visualPass !== true || output.checks.interactionPass !== true) {
      return {
        ok: false,
        error: buildMainProcessInterrogation(expectedComponent, [
          '你报告了 success，但 checks.visualPass / checks.interactionPass 不是 true。',
          '像素级复刻与交互验证必须全部通过。',
        ]),
      };
    }
  } else if (typeof output.error !== 'string' || output.error.length === 0) {
    return { ok: false, error: 'Failed subagent output requires non-empty "error".' };
  }

  if (output.artifacts !== undefined) {
    if (typeof output.artifacts !== 'object' || Array.isArray(output.artifacts)) {
      return { ok: false, error: 'Subagent output "artifacts" must be a JSON object when provided.' };
    }

    const artifactKeys = ['visualDiffJson', 'interactionResultsJson', 'runStateJson'];
    for (const key of artifactKeys) {
      const value = output.artifacts[key];
      if (value !== undefined && typeof value !== 'string') {
        return { ok: false, error: `Subagent output artifacts.${key} must be a string when provided.` };
      }
    }
  }

  if (status === 'success') {
    const artifacts = output.artifacts ?? {};
    if (
      typeof artifacts.visualDiffJson !== 'string' ||
      artifacts.visualDiffJson.length === 0 ||
      typeof artifacts.interactionResultsJson !== 'string' ||
      artifacts.interactionResultsJson.length === 0
    ) {
      return {
        ok: false,
        error: buildMainProcessInterrogation(expectedComponent, [
          '你报告了 success，但缺少 visualDiffJson 或 interactionResultsJson 证据路径。',
          '请给出像素级对齐与交互验证的产物文件。',
        ]),
      };
    }
  }

  return { ok: true, normalized: output };
}

function resolveArtifactPath(repoRoot, artifactPath) {
  if (!artifactPath) {
    return null;
  }
  if (artifactPath.startsWith('/')) {
    return artifactPath;
  }
  return resolve(repoRoot, artifactPath);
}

function validateArtifactFilesExist(repoRoot, component, output) {
  if (output.status !== 'success') {
    return { ok: true };
  }

  const visualDiffPath = resolveArtifactPath(repoRoot, output.artifacts?.visualDiffJson);
  const interactionPath = resolveArtifactPath(repoRoot, output.artifacts?.interactionResultsJson);
  const issues = [];

  if (!visualDiffPath || !existsSync(visualDiffPath)) {
    issues.push(
      `缺少可读取的 visualDiffJson 证据文件：${output.artifacts?.visualDiffJson ?? '<missing>'}`
    );
  }
  if (!interactionPath || !existsSync(interactionPath)) {
    issues.push(
      `缺少可读取的 interactionResultsJson 证据文件：${
        output.artifacts?.interactionResultsJson ?? '<missing>'
      }`
    );
  }

  if (issues.length > 0) {
    return {
      ok: false,
      error: buildMainProcessInterrogation(component, issues),
    };
  }

  return { ok: true };
}

function parseArgs(argv) {
  const options = {
    repoRoot: defaultRepoRoot,
    previewFile: resolve(defaultRepoRoot, 'src/app/preview/preview-layout.component.ts'),
    worktreeRoot: resolve(defaultRepoRoot, '.worktrees'),
    outputRoot: resolve(defaultRepoRoot, 'component-comparisons/review-runs'),
    concurrency: 5,
    visualThreshold: 0.1,
    runId: createRunId(),
    cherryPick: true,
    watch: false,
    components: null,
    subagentCmd: process.env.SUBAGENT_CMD ?? '',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--repo-root':
        options.repoRoot = resolve(argv[++i]);
        break;
      case '--preview-file':
        options.previewFile = resolve(argv[++i]);
        break;
      case '--worktree-root':
        options.worktreeRoot = resolve(argv[++i]);
        break;
      case '--output-root':
        options.outputRoot = resolve(argv[++i]);
        break;
      case '--concurrency':
        options.concurrency = Number(argv[++i]);
        break;
      case '--visual-threshold':
        options.visualThreshold = Number(argv[++i]);
        break;
      case '--run-id':
        options.runId = String(argv[++i]);
        break;
      case '--components':
        options.components = String(argv[++i])
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);
        break;
      case '--subagent-cmd':
        options.subagentCmd = String(argv[++i]);
        break;
      case '--no-cherry-pick':
        options.cherryPick = false;
        break;
      case '--watch':
        options.watch = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`preview-review-orchestrator

Usage:
  node scripts/preview-review-orchestrator.mjs --subagent-cmd "<command-template>" [options]

Required:
  --subagent-cmd    Command template to execute one component subagent task.
                    Available placeholders:
                    {{component}}, {{inputFile}}, {{outputFile}}, {{repoRoot}},
                    {{worktreeRoot}}, {{worktreePath}}, {{branch}},
                    {{baselineDir}}, {{artifactDir}}

Options:
  --repo-root <path>         Repository root (default: project root)
  --preview-file <path>      preview-layout.component.ts path
  --worktree-root <path>     Worktree root (default: <repoRoot>/.worktrees)
  --output-root <path>       Run output root (default: component-comparisons/review-runs)
  --concurrency <n>          Max parallel subagents (default: 5)
  --visual-threshold <n>     Visual threshold in subagent input contract (default: 0.1)
  --run-id <id>              Custom run id (default: timestamp)
  --components <a,b,c>       Override queue to only these components
  --no-cherry-pick           Skip cherry-pick stage
  --watch                    Re-render live task progress in terminal
  -h, --help                 Show this help
`);
}

function executeShellCommand(command, cwd) {
  return new Promise((resolvePromise) => {
    const child = spawn('zsh', ['-lc', command], { cwd, env: process.env });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      resolvePromise({
        exitCode: code ?? 0,
        stdout,
        stderr,
      });
    });
  });
}

export async function runWithConcurrency(items, limit, worker) {
  if (limit < 1 || !Number.isInteger(limit)) {
    throw new Error(`Concurrency limit must be a positive integer. Received: ${limit}`);
  }

  const results = new Array(items.length);
  let nextIndex = 0;
  let running = 0;
  let maxRunning = 0;

  return new Promise((resolvePromise) => {
    const launch = () => {
      while (running < limit && nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        running += 1;
        maxRunning = Math.max(maxRunning, running);

        Promise.resolve(worker(items[index], index))
          .then((result) => {
            results[index] = result;
          })
          .catch((error) => {
            results[index] = {
              status: 'failed',
              error: error instanceof Error ? error.message : String(error),
            };
          })
          .finally(() => {
            running -= 1;
            if (nextIndex === items.length && running === 0) {
              resolvePromise({ results, maxRunning });
              return;
            }
            launch();
          });
      }

      if (items.length === 0) {
        resolvePromise({ results: [], maxRunning: 0 });
      }
    };

    launch();
  });
}

async function readJson(path) {
  const content = await readFile(path, 'utf8');
  return JSON.parse(content);
}

async function processTask({
  component,
  options,
  runDir,
  componentDir,
}) {
  const contract = makeTaskContract({
    component,
    repoRoot: options.repoRoot,
    worktreeRoot: options.worktreeRoot,
    visualThreshold: options.visualThreshold,
  });

  const inputFile = resolve(componentDir, `${component}-input.json`);
  const outputFile = resolve(componentDir, `${component}-output.json`);
  const stdoutFile = resolve(componentDir, `${component}-stdout.log`);
  const stderrFile = resolve(componentDir, `${component}-stderr.log`);
  const taskResultFile = resolve(componentDir, `${component}.json`);

  await writeFile(inputFile, `${JSON.stringify(contract, null, 2)}\n`, 'utf8');

  const command = renderSubagentCommand(options.subagentCmd, {
    component,
    inputFile,
    outputFile,
    repoRoot: options.repoRoot,
    worktreeRoot: options.worktreeRoot,
    worktreePath: contract.worktreePath,
    branch: contract.branch,
    baselineDir: contract.baselineDir,
    artifactDir: contract.artifactDir,
  });

  const startedAt = Date.now();
  const commandResult = await executeShellCommand(command, options.repoRoot);
  const durationMs = Date.now() - startedAt;

  await writeFile(stdoutFile, commandResult.stdout, 'utf8');
  await writeFile(stderrFile, commandResult.stderr, 'utf8');

  let result;

  if (!existsSync(outputFile)) {
    result = {
      component,
      status: 'failed',
      branch: contract.branch,
      worktreePath: contract.worktreePath,
      error: `Subagent did not write output file: ${outputFile}`,
    };
  } else {
    try {
      const outputJson = await readJson(outputFile);
      const validation = validateSubagentOutput(outputJson, component);
      if (!validation.ok) {
        result = {
          component,
          status: 'failed',
          branch: contract.branch,
          worktreePath: contract.worktreePath,
          error: validation.error,
        };
      } else if (commandResult.exitCode !== 0 && validation.normalized.status === 'success') {
        result = {
          component,
          status: 'failed',
          branch: contract.branch,
          worktreePath: contract.worktreePath,
          error: `Subagent exited with code ${commandResult.exitCode}, but reported success.`,
        };
      } else {
        const artifactValidation = validateArtifactFilesExist(
          options.repoRoot,
          component,
          validation.normalized
        );
        if (!artifactValidation.ok) {
          result = {
            component,
            status: 'failed',
            branch: validation.normalized.branch,
            worktreePath: validation.normalized.worktreePath,
            error: artifactValidation.error,
            artifacts: validation.normalized.artifacts ?? {},
            checks: validation.normalized.checks ?? {},
          };
        } else {
          result = validation.normalized;
        }
      }
    } catch (error) {
      result = {
        component,
        status: 'failed',
        branch: contract.branch,
        worktreePath: contract.worktreePath,
        error: `Failed to parse subagent output JSON: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  const fullResult = {
    ...result,
    meta: {
      inputSchemaVersion: INPUT_SCHEMA_VERSION,
      outputSchemaVersion: OUTPUT_SCHEMA_VERSION,
      runDir,
      command,
      commandExitCode: commandResult.exitCode,
      durationMs,
      stdoutFile,
      stderrFile,
      inputFile,
      outputFile,
      taskResultFile,
    },
  };

  await writeFile(taskResultFile, `${JSON.stringify(fullResult, null, 2)}\n`, 'utf8');
  return fullResult;
}

function cherryPickCommit(repoRoot, commitSha) {
  const cherryPick = spawnSync('git', ['-C', repoRoot, 'cherry-pick', commitSha], {
    encoding: 'utf8',
  });

  if (cherryPick.status === 0) {
    return { ok: true };
  }

  spawnSync('git', ['-C', repoRoot, 'cherry-pick', '--abort'], { encoding: 'utf8' });
  return {
    ok: false,
    error: `git cherry-pick ${commitSha} failed.\n${(cherryPick.stderr || cherryPick.stdout).trim()}`,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const runStartedAt = new Date().toISOString();

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.subagentCmd) {
    throw new Error('Missing required option: --subagent-cmd (or SUBAGENT_CMD env var).');
  }

  if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
    throw new Error(`Invalid --concurrency value: ${options.concurrency}`);
  }

  if (options.worktreeRoot === '/.worktrees') {
    throw new Error(
      'worktreeRoot cannot be "/.worktrees". Use repository-local ".worktrees", e.g. /path/to/repo/.worktrees.'
    );
  }

  const previewSource = await readFile(options.previewFile, 'utf8');
  const previewItems = parsePreviewItems(previewSource);
  const unreviewed = getUnreviewedComponents(previewItems);
  const queue = options.components ?? unreviewed;

  const runDir = resolve(options.outputRoot, options.runId);
  const componentDir = resolve(runDir, 'components');
  const tasksJson = resolve(runDir, 'tasks.json');
  const tasksMd = resolve(runDir, 'tasks.md');

  await mkdir(componentDir, { recursive: true });

  const queueFile = resolve(runDir, 'queue.json');
  await writeFile(
    queueFile,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        previewFile: options.previewFile,
        totalPreviewItems: previewItems.length,
        totalUnreviewedItems: unreviewed.length,
        queue,
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  const taskRecords = createInitialTaskRecords(queue, {
    repoRoot: options.repoRoot,
    worktreeRoot: options.worktreeRoot,
  });
  const taskByComponent = new Map(taskRecords.map((task) => [task.component, task]));
  let taskWriteQueue = Promise.resolve();

  const patchTask = (component, patch) => {
    const task = taskByComponent.get(component);
    if (!task) {
      return;
    }
    Object.assign(task, patch, { updatedAt: new Date().toISOString() });
  };

  const enqueueTaskSnapshotWrite = (extra = {}) => {
    const snapshot = {
      runId: options.runId,
      generatedAt: runStartedAt,
      updatedAt: new Date().toISOString(),
      queueSize: queue.length,
      repoRoot: options.repoRoot,
      worktreeRoot: options.worktreeRoot,
      concurrencyLimit: options.concurrency,
      cherryPickEnabled: options.cherryPick,
      counts: summarizeTaskRecords(taskRecords),
      tasks: taskRecords,
      ...extra,
    };

    const markdown = renderTaskListMarkdown(snapshot);
    const consoleOutput = renderTaskListConsole(snapshot);
    taskWriteQueue = taskWriteQueue.then(async () => {
      await writeFile(tasksJson, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
      await writeFile(tasksMd, markdown, 'utf8');
      if (options.watch) {
        process.stdout.write('\x1Bc');
        process.stdout.write(consoleOutput);
      }
    });
    return taskWriteQueue;
  };

  await enqueueTaskSnapshotWrite();

  if (!options.watch) {
    console.log(`Run ID: ${options.runId}`);
    console.log(`Queue size: ${queue.length}`);
    console.log(`Concurrency: ${options.concurrency}`);
    console.log(`Worktree root: ${options.worktreeRoot}`);
  }

  const { results, maxRunning } = await runWithConcurrency(
    queue,
    options.concurrency,
    async (component) => {
      const startedAt = new Date().toISOString();
      patchTask(component, {
        status: TASK_STATUS.running,
        isRunning: true,
        startedAt,
        error: null,
      });
      await enqueueTaskSnapshotWrite();

      if (!options.watch) {
        console.log(`[start] ${component}`);
      }
      try {
        const result = await processTask({ component, options, runDir, componentDir });
        if (!options.watch) {
          console.log(`[done] ${component} -> ${result.status}`);
        }

        const completedPatch = {
          isRunning: false,
          agentCompleted: true,
          agentResult: result.status,
          checks: result.checks ?? {},
          artifacts: result.artifacts ?? {},
          commitSha: result.commitSha ?? null,
        };

        if (result.status === 'failed') {
          patchTask(component, {
            ...completedPatch,
            status: TASK_STATUS.failed,
            cherryPick: 'skipped',
            error: result.error ?? 'Subagent failed without an explicit error message.',
            finishedAt: new Date().toISOString(),
          });
        } else if (options.cherryPick) {
          patchTask(component, {
            ...completedPatch,
            status: TASK_STATUS.awaitingCherryPick,
            cherryPick: 'pending',
            error: null,
          });
        } else {
          patchTask(component, {
            ...completedPatch,
            status: TASK_STATUS.success,
            cherryPick: 'skipped',
            error: null,
            finishedAt: new Date().toISOString(),
          });
        }

        await enqueueTaskSnapshotWrite();
        return result;
      } catch (error) {
        patchTask(component, {
          status: TASK_STATUS.failed,
          isRunning: false,
          agentCompleted: true,
          agentResult: 'failed',
          cherryPick: 'skipped',
          checks: {},
          artifacts: {},
          commitSha: null,
          error: error instanceof Error ? error.message : String(error),
          finishedAt: new Date().toISOString(),
        });
        await enqueueTaskSnapshotWrite();
        return {
          component,
          status: 'failed',
          branch: `codex/review-${component}`,
          worktreePath: resolve(options.worktreeRoot, `review-${component}`),
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  );

  const runtimeFailures = [];
  const runtimeSuccesses = [];

  for (const result of results) {
    if (result.status === 'success') {
      runtimeSuccesses.push(result);
    } else {
      runtimeFailures.push(result);
    }
  }

  const cherryPickFailures = [];
  const cherryPickSuccesses = [];

  if (options.cherryPick) {
    for (const success of runtimeSuccesses) {
      const pick = cherryPickCommit(options.repoRoot, success.commitSha);
      if (pick.ok) {
        cherryPickSuccesses.push(success);
        patchTask(success.component, {
          status: TASK_STATUS.success,
          cherryPick: 'success',
          error: null,
          finishedAt: new Date().toISOString(),
        });
        await enqueueTaskSnapshotWrite();
        continue;
      }

      cherryPickFailures.push({
        component: success.component,
        status: 'failed',
        branch: success.branch,
        worktreePath: success.worktreePath,
        error: pick.error,
        artifacts: success.artifacts,
        checks: success.checks,
        meta: success.meta,
      });
      patchTask(success.component, {
        status: TASK_STATUS.failed,
        cherryPick: 'failed',
        error: pick.error,
        finishedAt: new Date().toISOString(),
      });
      await enqueueTaskSnapshotWrite();
    }
  }

  const finalSuccesses = options.cherryPick ? cherryPickSuccesses : runtimeSuccesses;
  const finalFailures = [
    ...runtimeFailures,
    ...(options.cherryPick ? cherryPickFailures : []),
  ];

  const summary = {
    generatedAt: new Date().toISOString(),
    runId: options.runId,
    inputSchemaVersion: INPUT_SCHEMA_VERSION,
    outputSchemaVersion: OUTPUT_SCHEMA_VERSION,
    repoRoot: options.repoRoot,
    worktreeRoot: options.worktreeRoot,
    queueSize: queue.length,
    concurrencyLimit: options.concurrency,
    maxRunningObserved: maxRunning,
    cherryPickEnabled: options.cherryPick,
    successCount: finalSuccesses.length,
    failureCount: finalFailures.length,
    successes: finalSuccesses.map((entry) => ({
      component: entry.component,
      commitSha: entry.commitSha,
      branch: entry.branch,
      worktreePath: entry.worktreePath,
      artifacts: entry.artifacts ?? {},
      checks: entry.checks ?? {},
    })),
    failures: finalFailures.map((entry) => ({
      component: entry.component,
      branch: entry.branch,
      worktreePath: entry.worktreePath,
      error: entry.error,
      artifacts: entry.artifacts ?? {},
    })),
    files: {
      queueJson: queueFile,
      tasksJson,
      tasksMarkdown: tasksMd,
      summaryJson: resolve(runDir, 'summary.json'),
      failuresJson: resolve(runDir, 'failures.json'),
      componentsDir: componentDir,
    },
  };

  await writeFile(resolve(runDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  await writeFile(
    resolve(runDir, 'failures.json'),
    `${JSON.stringify(
      {
        generatedAt: summary.generatedAt,
        runId: summary.runId,
        failures: finalFailures,
      },
      null,
      2
    )}\n`,
    'utf8'
  );
  await enqueueTaskSnapshotWrite({ maxRunningObserved: maxRunning });
  await taskWriteQueue;

  if (options.watch) {
    process.stdout.write('\n');
  }
  console.log(`Success: ${summary.successCount}`);
  console.log(`Failed: ${summary.failureCount}`);
  console.log(`Summary: ${summary.files.summaryJson}`);

  if (summary.failureCount > 0) {
    process.exitCode = 2;
  }
}

const isCliEntry = process.argv[1] && resolve(process.argv[1]) === scriptPath;

if (isCliEntry) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
