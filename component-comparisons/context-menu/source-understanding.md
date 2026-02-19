# context-menu Source Understanding

## Mapping
- local: `src/app/shared/ui/context-menu/context-menu.component.ts`
- zardui: `/tmp/zardui/libs/zard/src/lib/shared/components/menu/*`
- shadcn: `/tmp/shadcn-context-menu.tsx`
- rationale: preserve shadcn `context-menu` API shape while using zard-style trigger/menu primitives and shared menu-core interaction helpers.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/context-menu.directive.ts` | 47-57 | keyboard open via `ContextMenu` / `Shift+F10`. |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/context-menu.directive.ts` | 67-91 | open-state lifecycle cleanup on `scroll`/`resize` and close subscription. |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu-item.directive.ts` | 79-95 | pointermove focus + disabled event block. |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu-manager.service.ts` | 11-28 | centralized active-hover-menu management. |
| Z5 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/menu.directive.ts` | 73-75, 155-184 | placement map and delayed close behavior reused in ArgusX menu-core. |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/doc/api.md` | 36-43 | documented `z-context-menu` trigger contract. |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/demo/context-menu.ts` | 12-24 | right-click entrypoint and slot usage pattern. |
| U3 | `/tmp/zardui/libs/zard/src/lib/shared/components/menu/demo/context-menu.ts` | 34-44, 52-61 | submenu and destructive branch in context flow. |
| U4 | `/tmp/shadcn-context-menu.tsx` | 9-20, 96-112 | root/trigger/content slots and portal wrapping. |
| U5 | `/tmp/shadcn-context-menu.tsx` | 114-135, 187-205 | item variant default + inset/label structure. |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 63-92 | directive trigger handles right-click + keyboard open (`Shift+F10`). |
| L2 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 100-139 | explicit trigger component exists in addition to directive form. |
| L3 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 753-792 | root selector and defaults (`side='right'`, `sideOffset=4`). |
| L4 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 834-847, 860-863 | coordinate open and trigger-relative keyboard open positioning. |
| L5 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 772, 803, 888-890 | content applies `data-state` and runtime `data-side`. |
| L6 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 228-243 | item data attrs and `variant='default'` behavior. |
| L7 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 323-327, 417-424 | checkbox does not close, radio selection closes. |
| L8 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 1196-1218 | content wrapper forwards `side`, `sideOffset`, `class` config into root. |
| L9 | `src/app/shared/ui/context-menu/context-menu.component.ts` | 1246-1263 | full Argusx export family with `ArgusxContextMenuComponents`. |
