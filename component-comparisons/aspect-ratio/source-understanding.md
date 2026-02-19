# aspect-ratio Source Understanding

## Mapping
- local: `aspect-ratio`
- zardui: `N/A`
- shadcn: `aspect-ratio`
- rationale: shadcn has a canonical `aspect-ratio` primitive with `ratio` passthrough and `data-slot`. zardui does not provide an equivalent component in source/docs/demo paths, so this rewrite adopts shadcn as API baseline and adds only ArgusX plain-style extensions.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `.argus/skills/zardui-argusx-component-rewrite/references/component-name-mapping.md` | 39-41 | Mapping rule: keep `N/A` when no true equivalent exists. |
| Z2 | `rg -n "aspect-ratio|aspect ratio|AspectRatio" /tmp/zardui/libs/zard/src/lib/shared/components /tmp/zardui/apps/web/public/components` | command output | No `aspect-ratio` component/doc/demo match; only unrelated `preserveAspectRatio` usage in tooltip SVG. |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `npx shadcn@latest view @shadcn/aspect-ratio` | 10-12 | Canonical source path + implementation uses Radix Root with `data-slot="aspect-ratio"` and full props passthrough. |
| U2 | `npx shadcn@latest view @shadcn/aspect-ratio-demo` | 10-12 | Official demo uses `<AspectRatio ratio={16 / 9} className="...">` with media content. |
| U3 | `https://ui.shadcn.com/preview/radix/aspect-ratio-example` | preview reference | Visual parity target for baseline usage examples. |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `git show HEAD:src/app/shared/ui/index.ts` | 1-25 | Pre-rewrite shared UI barrel had no `aspect-ratio` export. |
| L2 | `git show HEAD:src/app/app.routes.ts` | 57-69 | Pre-rewrite preview routes had no `path: 'aspect-ratio'`. |
| L3 | `src/app/preview/preview-layout.component.ts` | 25 | Preview nav already listed `aspect-ratio`, indicating missing target page implementation before rewrite. |
