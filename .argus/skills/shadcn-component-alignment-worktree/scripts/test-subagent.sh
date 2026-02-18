#!/bin/bash
# Simple subagent wrapper for testing

INPUT_FILE="$1"
OUTPUT_FILE="$2"

echo "Subagent called with input: $INPUT_FILE, output: $OUTPUT_FILE"

# Read the input JSON to get component name
COMPONENT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$INPUT_FILE', 'utf8')).component)")

echo "Processing component: $COMPONENT"

# Write a simple success response for testing
cat > "$OUTPUT_FILE" << EOF
{
  "component": "$COMPONENT",
  "status": "success",
  "branch": "codex/review-$COMPONENT",
  "worktreePath": "/Users/wanyaozhong/Projects/argusx-f/.worktrees/review-$COMPONENT",
  "commitSha": "test123",
  "checks": {
    "visualPass": true,
    "interactionPass": true
  },
  "artifacts": {
    "visualDiffJson": "component-comparisons/$COMPONENT/visual-diff.json",
    "interactionResultsJson": "component-comparisons/$COMPONENT/interaction-results.json"
  }
}
EOF

echo "Output written to $OUTPUT_FILE"
