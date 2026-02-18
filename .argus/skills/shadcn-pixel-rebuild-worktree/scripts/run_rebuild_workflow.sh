#!/usr/bin/env bash
set -euo pipefail

COMPONENT=""
REPO_ROOT="$(pwd)"
BRANCH=""
THRESHOLD="0.003"
ARTIFACTS_DIR=""
HOST="127.0.0.1"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --component)
      COMPONENT="$2"
      shift 2
      ;;
    --repo-root)
      REPO_ROOT="$2"
      shift 2
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --threshold)
      THRESHOLD="$2"
      shift 2
      ;;
    --artifacts-dir)
      ARTIFACTS_DIR="$2"
      shift 2
      ;;
    --host)
      HOST="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$COMPONENT" ]]; then
  echo "Missing required --component" >&2
  exit 1
fi

if [[ -z "$BRANCH" ]]; then
  BRANCH="$(git -C "$REPO_ROOT" branch --show-current)"
fi

if [[ -z "$ARTIFACTS_DIR" ]]; then
  ARTIFACTS_DIR="$REPO_ROOT/component-comparisons/$COMPONENT"
fi

BASELINE_DIR="$REPO_ROOT/previews/shadcn/$COMPONENT"
ACTUAL_DIR="$ARTIFACTS_DIR/local-captures"
URLS_FILE="$ARTIFACTS_DIR/local-urls.json"
BEST_PLAN_FILE="$ARTIFACTS_DIR/best-of-plan.json"
INTERACTION_FILE="$ARTIFACTS_DIR/interaction-results.json"
VISUAL_FILE="$ARTIFACTS_DIR/visual-diff.json"
RUN_STATE_FILE="$ARTIFACTS_DIR/run-state.json"
PORT_FILE="$ARTIFACTS_DIR/port-allocation.json"
BASELINE_BOOTSTRAP_FILE="$ARTIFACTS_DIR/baseline-bootstrap.json"

mkdir -p "$ARTIFACTS_DIR" "$ACTUAL_DIR"

ALLOC_OUTPUT="$(node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/allocate_branch_port.mjs" \
  --repo-root "$REPO_ROOT" \
  --branch "$BRANCH" \
  --out "$PORT_FILE")"
PREVIEW_PORT="$(printf '%s' "$ALLOC_OUTPUT" | node -e 'let input="";process.stdin.on("data",d=>input+=d);process.stdin.on("end",()=>{const j=JSON.parse(input);process.stdout.write(String(j.port));});')"

LOCAL_PREVIEW_URL="http://localhost:${PREVIEW_PORT}/preview?component=${COMPONENT}"
RUNTIME_FILE="$REPO_ROOT/.tmp/preview-runtime-${PREVIEW_PORT}.json"

cleanup() {
  node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/start_preview_server.mjs" \
    --stop \
    --runtime-file "$RUNTIME_FILE" \
    --repo-root "$REPO_ROOT" >/dev/null 2>&1 || true
}
trap cleanup EXIT

node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/start_preview_server.mjs" \
  --repo-root "$REPO_ROOT" \
  --branch "$BRANCH" \
  --port "$PREVIEW_PORT" \
  --host "$HOST" \
  --runtime-file "$RUNTIME_FILE" >/dev/null

node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/ensure_baseline_images.mjs" \
  --repo-root "$REPO_ROOT" \
  --component "$COMPONENT" \
  --out "$BASELINE_BOOTSTRAP_FILE" >/dev/null

node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/derive_best_of_plan.mjs" \
  --repo-root "$REPO_ROOT" \
  --component "$COMPONENT" \
  --out "$BEST_PLAN_FILE" >/dev/null

node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/resolve_local_urls.mjs" \
  --preview-url "$LOCAL_PREVIEW_URL" \
  --out "$URLS_FILE" >/dev/null

LOCAL_FRAME_URL="$(node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('$URLS_FILE','utf8'));process.stdout.write(j.localFrameUrl);")"
SCENARIO_PATH="$BASELINE_DIR/capture.scenario.json"

if [[ ! -f "$SCENARIO_PATH" ]]; then
  echo "Missing scenario: $SCENARIO_PATH" >&2
  exit 1
fi

node "$REPO_ROOT/.argus/skills/shadcn-preview-capture/scripts/capture_interactions.mjs" \
  --url "$LOCAL_FRAME_URL" \
  --scenario "$SCENARIO_PATH" \
  --out-dir "$ACTUAL_DIR" \
  --viewport 1440x1200 \
  --full-page >/dev/null

node -e "const fs=require('fs');const p='$ACTUAL_DIR';const files=fs.readdirSync(p).filter(f=>f.endsWith('.png')).sort();const out={component:'$COMPONENT',pass:true,scenarioPath:'$SCENARIO_PATH',capturedFiles:files,generatedAt:new Date().toISOString()};fs.writeFileSync('$INTERACTION_FILE',JSON.stringify(out,null,2)+'\n');"

set +e
node "$REPO_ROOT/.argus/skills/shadcn-pixel-rebuild-worktree/scripts/compare_pixel_sets.mjs" \
  --baseline-dir "$BASELINE_DIR" \
  --actual-dir "$ACTUAL_DIR" \
  --scenario "$SCENARIO_PATH" \
  --threshold "$THRESHOLD" \
  --out-dir "$ARTIFACTS_DIR" \
  --report "$VISUAL_FILE" >/dev/null
VISUAL_EXIT=$?
set -e

node -e "const fs=require('fs');const state={component:'$COMPONENT',branch:'$BRANCH',previewPort:Number('$PREVIEW_PORT'),localPreviewUrl:'$LOCAL_PREVIEW_URL',localFrameUrl:'$LOCAL_FRAME_URL',baselineDir:'$BASELINE_DIR',artifactsDir:'$ARTIFACTS_DIR',visualPass:${VISUAL_EXIT}===0,interactionPass:true,files:{bestOfPlan:'$BEST_PLAN_FILE',interactionResults:'$INTERACTION_FILE',visualDiff:'$VISUAL_FILE',localUrls:'$URLS_FILE',portAllocation:'$PORT_FILE'},generatedAt:new Date().toISOString()};fs.writeFileSync('$RUN_STATE_FILE',JSON.stringify(state,null,2)+'\n');"

if [[ $VISUAL_EXIT -ne 0 ]]; then
  echo "Visual diff failed. See $VISUAL_FILE" >&2
  exit $VISUAL_EXIT
fi

echo "Workflow completed:"
echo "- component: $COMPONENT"
echo "- branch: $BRANCH"
echo "- previewPort: $PREVIEW_PORT"
echo "- localPreviewUrl: $LOCAL_PREVIEW_URL"
echo "- best-of-plan: $BEST_PLAN_FILE"
echo "- interaction-results: $INTERACTION_FILE"
echo "- visual-diff: $VISUAL_FILE"
