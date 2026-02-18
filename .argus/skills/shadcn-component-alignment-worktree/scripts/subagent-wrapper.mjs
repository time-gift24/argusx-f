#!/usr/bin/env node

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const scriptDir = new URL('./', import.meta.url).pathname;
const subagentPromptPath = resolve(scriptDir, 'preview-review-subagent-prompt.md');

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

async function ensureWorktree({ repoRoot, worktreeRoot, branch, worktreePath }) {
  // Check if worktreeRoot exists, create if not
  if (!existsSync(worktreeRoot)) {
    console.log(`Creating worktree root: ${worktreeRoot}`);
    await mkdir(worktreeRoot, { recursive: true });

    // Verify it's ignored
    const ignoreCheck = await executeShellCommand(
      `git check-ignore -q ${worktreeRoot} && echo "IGNORED" || echo "NOT_IGNORED"`,
      repoRoot
    );
    if (ignoreCheck.stdout.includes('NOT_IGNORED')) {
      console.log('WARNING: worktreeRoot is not gitignored. Consider adding to .gitignore');
    }
  }

  // Check if worktree already exists (handles race condition in parallel execution)
  if (existsSync(worktreePath)) {
    console.log(`Worktree already exists: ${worktreePath}`);
    return;
  }

  // Also check git worktree list to handle case where directory exists but not tracked
  const listCheck = await executeShellCommand(
    `git worktree list --porcelain`,
    repoRoot
  );
  if (listCheck.stdout.includes(worktreePath)) {
    console.log(`Worktree already registered: ${worktreePath}`);
    return;
  }

  // Check if branch already exists
  const branchCheck = await executeShellCommand(
    `git rev-parse --verify "${branch}" >/dev/null 2>&1 && echo "EXISTS" || echo "NOT_EXISTS"`,
    repoRoot
  );

  if (branchCheck.stdout.includes('EXISTS')) {
    // Branch exists but worktree doesn't - create worktree without -b flag
    console.log(`Branch ${branch} exists, creating worktree: ${worktreePath}`);
    const result = await executeShellCommand(
      `git worktree add "${worktreePath}" "${branch}"`,
      repoRoot
    );
    if (result.exitCode !== 0) {
      // Handle race condition - another process might have created it
      if (result.stderr.includes('already exists')) {
        console.log(`Worktree already created by another process: ${worktreePath}`);
        return;
      }
      throw new Error(`Failed to create worktree: ${result.stderr}`);
    }
  } else {
    // Branch doesn't exist, create new branch and worktree
    console.log(`Creating worktree: ${worktreePath} with branch ${branch}`);
    const result = await executeShellCommand(
      `git worktree add "${worktreePath}" -b "${branch}"`,
      repoRoot
    );
    if (result.exitCode !== 0) {
      // Handle race condition - another process might have created it
      if (result.stderr.includes('already exists')) {
        console.log(`Worktree already created by another process: ${worktreePath}`);
        return;
      }
      throw new Error(`Failed to create worktree: ${result.stderr}`);
    }
  }
  console.log('Worktree ready');
}

async function main() {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];

  if (!inputFile || !outputFile) {
    console.error('Usage: node subagent-wrapper.mjs <inputFile> <outputFile>');
    process.exit(1);
  }

  // Read input contract
  const inputJson = JSON.parse(await readFile(inputFile, 'utf8'));
  const { component, repoRoot, worktreeRoot, branch, worktreePath, baselineDir, onlinePreviewUrl, localPreviewUrl, artifactDir, verification } = inputJson;

  console.log(`Processing component: ${component}`);

  // Ensure worktree exists before writing task file
  await ensureWorktree({ repoRoot, worktreeRoot, branch, worktreePath });

  // Read subagent prompt template
  const promptTemplate = await readFile(subagentPromptPath, 'utf8');

  // Build the prompt with all context (including worktree variables)
  const prompt = promptTemplate
    .replace(/\{\{inputFile\}\}/g, inputFile)
    .replace(/\{\{outputFile\}\}/g, outputFile)
    .replace(/\{\{repoRoot\}\}/g, repoRoot)
    .replace(/\{\{worktreeRoot\}\}/g, worktreeRoot)
    .replace(/\{\{worktreePath\}\}/g, worktreePath)
    .replace(/\{\{branch\}\}/g, branch);

  // Create task JSON file for Claude Code
  const taskJson = {
    component,
    repoRoot,
    worktreeRoot,
    branch,
    worktreePath,
    baselineDir,
    onlinePreviewUrl,
    localPreviewUrl,
    artifactDir,
    verification,
  };

  const taskFile = resolve(worktreePath, 'task.json');
  await writeFile(taskFile, JSON.stringify(taskJson, null, 2), 'utf8');

  // Build Claude Code command
  // Using -p for prompt mode, --print for JSON output
  const claudeCmd = [
    'claude', '-p', '--print',
    '--dangerously-skip-permissions',
    `Task: Review and align shadcn component "${component}"

Context:
- repoRoot: ${repoRoot}
- worktreeRoot: ${worktreeRoot}
- branch: ${branch}
- worktreePath: ${worktreePath}
- baselineDir: ${baselineDir}
- onlinePreviewUrl: ${onlinePreviewUrl}
- localPreviewUrl: ${localPreviewUrl}
- artifactDir: ${artifactDir}
- verification: ${JSON.stringify(verification)}

${prompt}

IMPORTANT: Write your result JSON to {{outputFile}} (absolute path: ${outputFile})`
  ];

  return new Promise((resolve, reject) => {
    const child = spawn('claude', claudeCmd.slice(2), {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', async (code) => {
      console.log('Claude Code stdout:', stdout.slice(0, 500));
      if (stderr) console.error('Claude Code stderr:', stderr.slice(0, 500));

      // Try to parse the output and write to outputFile
      try {
        // The output should be JSON - try to extract it
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          await writeFile(outputFile, JSON.stringify(result, null, 2), 'utf8');
          console.log(`Wrote result to ${outputFile}`);
          resolve();
        } else {
          // Write a failure response
          const failureResult = {
            component,
            status: 'failed',
            branch,
            worktreePath,
            error: `Claude Code did not return valid JSON output. stdout: ${stdout.slice(0, 500)}`,
          };
          await writeFile(outputFile, JSON.stringify(failureResult, null, 2), 'utf8');
          resolve();
        }
      } catch (err) {
        const failureResult = {
          component,
          status: 'failed',
          branch,
          worktreePath,
          error: `Failed to parse Claude Code output: ${err.message}. stdout: ${stdout.slice(0, 500)}`,
        };
        await writeFile(outputFile, JSON.stringify(failureResult, null, 2), 'utf8');
        resolve();
      }
    });

    child.on('error', async (err) => {
      const failureResult = {
        component,
        status: 'failed',
        branch,
        worktreePath,
        error: `Failed to spawn Claude Code: ${err.message}`,
      };
      await writeFile(outputFile, JSON.stringify(failureResult, null, 2), 'utf8');
      resolve();
    });
  });
}

main().catch(console.error);
