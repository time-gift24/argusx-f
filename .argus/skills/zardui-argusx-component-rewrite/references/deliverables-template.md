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
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | yes/no | adopt-shadcn / extend-argusx | default style note | Z1/L1/S1 |

## Conflict Decisions (Must Adopt shadcn)
- [ ] API name: conflict reason + adopted shadcn shape + source evidence

## Non-conflict Extensions (ArgusX Plain)
- [ ] API name: extension rationale + argusx API shape + plain style behavior + source evidence

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
- plain style defaults:
```

## rewrite-plan.md

```md
# {component} Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [ ] lock shadcn naming/default/behavior for conflict APIs
- [ ] remove conflicting local/zardui primary entries

## Non-conflict Extensions (ArgusX Plain)
- [ ] define extension API and naming
- [ ] ensure extension does not break shadcn main path
- [ ] set plain default style behavior

## Breaking Rewrite Policy (No Compatibility Layer)
- [ ] remove legacy API entrances and deprecated aliases
- [ ] keep single canonical API path only

## Naming Migration (z -> argusx)
- [ ] selector migration
- [ ] input/output/type symbol migration
- [ ] index export migration

## shadcn API Alignment
- [ ] API surface alignment
- [ ] behavior alignment
- [ ] accessibility alignment

## Plain Style Alignment
- [ ] default variant/style is plain
- [ ] avoid heavy decoration in default state
- [ ] verify token usage and no hardcoded brand colors in component internals

## File-level Plan
1. `src/app/shared/ui/{component}/...`
2. `src/app/shared/ui/{component}/index.ts`
3. `src/app/preview/{component}-preview.component.ts`
```

## preview-coverage.md

```md
# {component} Preview Coverage

## Required Scenarios
- [ ] all conflict APIs with shadcn-aligned behavior
- [ ] all non-conflict extension APIs in plain style
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
