#!/bin/bash
# Launch preview review orchestrator with Claude Code subagent

set -e

REPO_ROOT="/Users/wanyaozhong/Projects/argusx-f"
WORKTREE_ROOT="$REPO_ROOT/.worktrees"
SUBAGENT_CMD="node $REPO_ROOT/.argus/skills/shadcn-component-alignment-worktree/scripts/subagent-wrapper.mjs {{inputFile}} {{outputFile}}"

# Default: process first 2 components for testing
COMPONENTS="${COMPONENTS:-button,avatar}"
CONCURRENCY="${CONCURRENCY:-5}"

echo "Starting preview review orchestrator..."
echo "  Components: $COMPONENTS"
echo "  Concurrency: $CONCURRENCY"
echo "  Worktree root: $WORKTREE_ROOT"
echo ""

cd "$REPO_ROOT"

npm run review:orchestrate -- \
  --watch \
  --concurrency "$CONCURRENCY" \
  --components "$COMPONENTS" \
  --worktree-root "$WORKTREE_ROOT" \
  --subagent-cmd "$SUBAGENT_CMD"
