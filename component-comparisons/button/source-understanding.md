# button Source Understanding

## Mapping
- local: `button`
- zardui: `button`
- shadcn: `button`
- rationale: three implementations all target semantic action controls with shared variant/size model. Naming differs (`z-button` vs `argusx-button` vs `<Button />`) but behavioral surface is comparable.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/button/button.component.ts` | 27-58 | zard selector and core inputs: `zType`, `zSize`, `zShape`, `zFull`, `zLoading`, `zDisabled`. |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/button/button.variants.ts` | 14-51 | zard variant matrix includes `zType` + `zSize` + `zShape`, and state variants `zFull`/`zLoading`/`zDisabled`. |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/button/doc/api.md` | 5-12 | Official API table confirms all public props and defaults. |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/button/demo/loading.ts` | 9-11 | Loading usage is declarative (`zLoading`) and tied directly to selector usage. |
| U3 | `/tmp/zardui/libs/zard/src/lib/shared/components/button/demo/full.ts` | 9-11 | Full-width usage is declarative (`zFull`). |
| U4 | `/tmp/zardui/libs/zard/src/lib/shared/components/button/demo/size.ts` | 12-25 | Size behaviors demonstrated for `sm/default/lg` including icon-only patterns. |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/button/button.directive.ts` | 57-113 | Unified selector is `button[argusx-button], a[argusx-button]` with data/aria contract and state logic. |
| L2 | `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/button/button.directive.ts` | 8-49 | Local class variance matrix supports shadcn core (`variant`,`size`) plus zard-aligned extensions (`shape`,`full`,`loading`,`disabled`). |
| L3 | `/Users/wanyaozhong/Projects/argusx-f/src/app/preview/button-preview.component.ts` | 17-184 | Preview covers variants, sizes, loading patterns, shape/full extensions, and `asChild` rendering via `getClasses()`. |

## shadcn Evidence
| id | source | lines | note |
| --- | --- | --- | --- |
| S1 | `npx shadcn@latest view @shadcn/button` -> `registry/new-york-v4/ui/button.tsx` | 7-37 | canonical variant/size matrix and defaults. |
| S2 | same source | 41-60 | canonical `asChild` + `data-slot`/`data-variant`/`data-size` host contract. |
