# typography API Diff

## API Matrix
| api | zardui | local (current) | shadcn | target (argusx) | conflict? | decision | plain note | evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CSS classes | N/A (CSS-only) | shadcn-aligned | shadcn-aligned | shadcn-aligned | no | N/A | default is plain (shadcn default) | L1, U1 |
| directive selector | N/A | `h1[appTypographyH1]` | N/A (CSS) | `h1[argusxTypographyH1]` | no | extend-argusx | N/A | L1 |
| directive class name | N/A | `TypographyH1Directive` | N/A | `ArgusxTypographyH1Directive` | no | extend-argusx | N/A | L1 |
| input: class | N/A | `input<string>('')` | N/A | `input<string>('')` | no | adopt-shadcn | N/A | L1 |
| export name | N/A | `TypographyH1Directive` | N/A | `ArgusxTypographyH1Directive` | no | extend-argusx | N/A | L2 |

## Conflict Decisions (Must Adopt shadcn)
- No conflicts identified. Typography CSS classes are already aligned with shadcn.

## Non-conflict Extensions (ArgusX Plain)
- **Selector naming**: Migrate from `appTypography*` to `argusxTypography*` prefix
  - rationale: Follow ArgusX naming convention (argusx-* prefix)
  - argusx API shape: `h1[argusxTypographyH1]`, `p[argusxTypographyP]`, etc.
  - plain style: CSS classes remain shadcn default (plain style)

- **Class naming**: Migrate from `Typography*Directive` to `ArgusxTypography*Directive`
  - rationale: Follow ArgusX class naming convention
  - argusx API shape: `ArgusxTypographyH1Directive`, etc.
  - plain style: N/A (class name)

- **Export naming**: Update exports in index.ts
  - rationale: Consistent naming across exports
  - argusx API shape: `ArgusxTypographyH1Directive`, etc.

## Missing APIs
- No missing APIs identified. All shadcn typography styles are covered:
  - H1, H2, H3, H4
  - P (paragraph)
  - Blockquote
  - Code (inline)
  - Lead
  - Large
  - Small
  - Muted
  - List

## Behavior Mismatches
- No behavior mismatches. The CSS classes exactly match shadcn's typography preset.

## Final Target API
- selectors:
  - `h1[argusxTypographyH1]`
  - `h2[argusxTypographyH2]`
  - `h3[argusxTypographyH3]`
  - `h4[argusxTypographyH4]`
  - `p[argusxTypographyP]`
  - `blockquote[argusxTypographyBlockquote]`
  - `code[argusxTypographyCode]`
  - `p[argusxTypographyLead]`
  - `[argusxTypographyLarge]`
  - `small[argusxTypographySmall]`
  - `[argusxTypographyMuted]`
  - `ul[argusxTypographyList]`, `ol[argusxTypographyList]`
- inputs:
  - `class: input<string>('')` - additional CSS classes to merge
- outputs: None
- data attributes: None (CSS-only utility)
- accessibility contract: Relies on semantic HTML elements (h1-h4, p, blockquote, code, ul/ol, small)
- plain style defaults: Using exact shadcn typography CSS utility classes (already plain style)
