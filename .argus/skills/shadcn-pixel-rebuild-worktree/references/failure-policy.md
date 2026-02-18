# Failure Policy

## Immediate Fail Conditions

1. `component` missing or unsupported.
2. Branch port allocation failed after 1000 probes in range 1420-2419.
3. Preview server cannot become ready before timeout.
4. Baseline image auto-capture failed when baseline png count is zero.
5. Local interaction capture failed.
6. Any pixel diff entry exceeds threshold `0.003`.
7. Missing mandatory artifacts:
   - `visual-diff.json`
   - `interaction-results.json`
   - `best-of-plan.json`

## Baseline Policy

- If baseline png files already exist, do not overwrite them.
- If baseline png files do not exist, create them through `shadcn-preview-capture`.
- If no scenario exists during auto-capture, generate a minimal default-only scenario.

## Pass Criteria

A run is successful only when all conditions hold:

1. `interaction-results.json.pass` is `true`.
2. `visual-diff.json.overallPass` is `true`.
3. Every compared screenshot has `mismatchRatio <= 0.003`.
4. `best-of-plan.json` is generated from available analysis files.

## Reporting

Every failure must report:

1. Which stage failed.
2. Which command failed.
3. Which file was expected but missing.
4. Next action to unblock.
