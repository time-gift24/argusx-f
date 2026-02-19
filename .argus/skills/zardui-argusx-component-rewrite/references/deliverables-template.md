# Deliverables Template

Use these templates for each component under `component-comparisons/{component}/`.

## source-understanding.md

```md
# {component} Source Understanding

## Mapping
- local: `{component}`
- zardui: `{zarduiComponent}`
- shadcn: `{shadcnItem}`
- rationale:

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 |  |  |  |
| Z2 |  |  |  |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 |  |  |  |
| U2 |  |  |  |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 |  |  |  |
| L2 |  |  |  |
```

## api-diff.md

```md
# {component} API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | evidence |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | Z1/L1/S1 |

## Missing APIs
- [ ] API name: impact + source evidence

## Behavior Mismatches
- [ ] API name: mismatch + expected behavior + source evidence

## Final Target API
- selectors:
- inputs:
- outputs:
- data attributes:
- accessibility contract:
```

## rewrite-plan.md

```md
# {component} Rewrite Plan

## Naming Migration (z -> argusx)
- [ ] selector migration
- [ ] input/output/type symbol migration
- [ ] index export migration
- [ ] compatibility alias (if needed)

## shadcn API Alignment
- [ ] API surface alignment
- [ ] behavior alignment
- [ ] accessibility alignment

## File-level Plan
1. `src/app/shared/ui/{component}/...`
2. `src/app/shared/ui/{component}/index.ts`
3. `src/app/preview/{component}-preview.component.ts`
```

## preview-coverage.md

```md
# {component} Preview Coverage

## Required Scenarios
- [ ] all primary input enums
- [ ] all key state combinations
- [ ] shadcn preview parity examples
- [ ] one complex combined scenario

## Local Preview Routes
- main: `/preview?component={component}`
- reference: `https://ui.shadcn.com/preview/radix/{shadcnItem}-example`

## Verification Notes
- build:
- tests:
- manual check:
```
