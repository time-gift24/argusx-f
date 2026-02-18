#!/usr/bin/env node

import net from 'node:net';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const PORT_MIN = 1420;
const PORT_MAX = 2419;
const PORT_RANGE = PORT_MAX - PORT_MIN + 1;

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

function fnv1a32(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function sanitizeBranch(branch) {
  return branch.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function currentBranch(repoRoot) {
  return execSync('git branch --show-current', { cwd: repoRoot, encoding: 'utf8' }).trim();
}

async function isPortFree(port, host = '127.0.0.1') {
  return new Promise((resolvePromise) => {
    const server = net.createServer();
    server.unref();

    server.on('error', () => {
      resolvePromise(false);
    });

    server.listen({ port, host }, () => {
      server.close(() => resolvePromise(true));
    });
  });
}

async function loadBranchLocks(lockDir, branch) {
  const entries = await readdir(lockDir, { withFileTypes: true });
  const reserved = new Set();
  let selfLock = null;

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const filePath = join(lockDir, entry.name);
    try {
      const raw = await readFile(filePath, 'utf8');
      const data = JSON.parse(raw);
      if (!Number.isInteger(data.port) || data.port < PORT_MIN || data.port > PORT_MAX) {
        continue;
      }
      if (data.branch === branch) {
        selfLock = data;
      } else {
        reserved.add(data.port);
      }
    } catch {
      // Ignore malformed lock entries.
    }
  }

  return { reserved, selfLock };
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = resolve(args['repo-root'] ?? process.cwd());
  const branch = args.branch ?? currentBranch(repoRoot);

  if (!branch) {
    throw new Error('Unable to resolve branch name.');
  }

  const lockDir = resolve(repoRoot, '.tmp/preview-port-locks');
  await mkdir(lockDir, { recursive: true });

  const selfLockFile = resolve(lockDir, `${sanitizeBranch(branch)}.json`);
  if (existsSync(selfLockFile)) {
    try {
      const selfLock = JSON.parse(await readFile(selfLockFile, 'utf8'));
      if (
        Number.isInteger(selfLock.port) &&
        selfLock.port >= PORT_MIN &&
        selfLock.port <= PORT_MAX
      ) {
        const result = {
          branch,
          port: selfLock.port,
          candidatePort: selfLock.port,
          strategy: 'reuse-branch-lock',
          lockFile: selfLockFile,
          localPreviewUrl: `http://localhost:${selfLock.port}/preview?component={component}`,
        };
        if (args.out) {
          await writeFile(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
        }
        process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
        return;
      }
    } catch {
      // Re-allocate if existing lock is malformed.
    }
  }

  const { reserved, selfLock } = await loadBranchLocks(lockDir, branch);

  const preferred = PORT_MIN + (fnv1a32(branch) % PORT_RANGE);
  const start = selfLock?.port ?? preferred;
  let selected = null;

  for (let i = 0; i < PORT_RANGE; i += 1) {
    const candidate = PORT_MIN + (((start - PORT_MIN) + i) % PORT_RANGE);
    if (reserved.has(candidate)) {
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(candidate);
    if (!free) continue;
    selected = candidate;
    break;
  }

  if (selected === null) {
    throw new Error(`No available port in range ${PORT_MIN}-${PORT_MAX}`);
  }

  const lockFile = selfLockFile;
  const lockData = {
    branch,
    port: selected,
    reservedAt: new Date().toISOString(),
    source: 'allocate_branch_port',
  };
  await writeFile(lockFile, `${JSON.stringify(lockData, null, 2)}\n`, 'utf8');

  const result = {
    branch,
    port: selected,
    candidatePort: preferred,
    strategy: selected === preferred ? 'hash-candidate' : 'linear-probe',
    lockFile,
    localPreviewUrl: `http://localhost:${selected}/preview?component={component}`,
  };

  if (args.out) {
    await writeFile(resolve(args.out), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  console.error(`allocate_branch_port failed: ${error.message}`);
  process.exit(1);
});
