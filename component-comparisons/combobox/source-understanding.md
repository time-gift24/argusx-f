# combobox Source Understanding

## Mapping
- local: `combobox`
- zardui: `combobox`
- shadcn: `combobox`
- rationale: three sides all represent the same “searchable select/command style popover” component family, no name remapping needed.

## shadcn Baseline Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-combobox.tsx` | 16-20 | root/value are split primitives (`Combobox`, `ComboboxValue`) with `data-slot`. |
| S2 | `/tmp/shadcn-combobox.tsx` | 55-90 | `ComboboxInput` defines `showTrigger/showClear` and wraps trigger/clear inside input-group. |
| S3 | `/tmp/shadcn-combobox.tsx` | 92-123 | content API owns `side/align/sideOffset/alignOffset/anchor`; content sets `data-chips`. |
| S4 | `/tmp/shadcn-combobox.tsx` | 129-139 | list is independent slot component with `data-empty`-aware styling. |
| S5 | `/tmp/shadcn-combobox.tsx` | 142-167 | item has selected indicator slot and highlighted/disabled states. |
| S6 | `/tmp/shadcn-combobox.tsx` | 201-212 | empty state is visibility-controlled by list/content empty state. |
| S7 | `/tmp/shadcn-combobox.tsx` | 227-287 | chips/chip/chips-input are first-class API surface. |
| S8 | `/tmp/shadcn-combobox.tsx` | 289-310 | export surface includes `useComboboxAnchor` helper and full slot API. |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/combobox/combobox.component.ts` | 52-99 | implementation is popover + command composition; trigger button owns combobox ARIA attributes. |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/combobox/combobox.component.ts` | 189-205 | public inputs are `buttonVariant/zWidth/searchable/options/groups` and z-prefixed outputs. |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/combobox/combobox.component.ts` | 261-280 | opening behavior focuses command input and refreshes command options. |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/combobox/combobox.component.ts` | 282-317 | selection behavior toggles current option and closes popover after selection. |
| Z5 | `/tmp/zardui/libs/zard/src/lib/shared/components/combobox/combobox.component.ts` | 330-383 | keyboard model: open/close handling, arrow navigation forwarding, searchable type-to-open logic. |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/combobox/doc/api.md` | 3-17 | documented inputs include width/search/aria/options/groups. |
| U2 | `/tmp/zardui/apps/web/public/components/combobox/doc/api.md` | 21-24 | outputs are `zValueChange` and `zComboSelected`. |
| U3 | `/tmp/zardui/apps/web/public/components/combobox/demo/default.md` | 11-17 | default single-select with options + placeholder/search/empty text. |
| U4 | `/tmp/zardui/apps/web/public/components/combobox/demo/grouped.md` | 11-17, 21-49 | grouped options usage with section labels. |
| U5 | `/tmp/zardui/apps/web/public/components/combobox/demo/disabled.md` | 11-19, 30-35 | disabled root and disabled option scenarios. |
| U6 | `/tmp/zardui/apps/web/public/components/combobox/demo/form.md` | 13-20, 33-49 | reactive form binding and external value set/clear behavior. |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/combobox/combobox.component.ts` (pre-rewrite in `HEAD`) | 80-99, 810-840 | selectors were `app-*`; root used single overlay wrapper with projected slots. |
| L2 | `src/app/shared/ui/combobox/combobox.component.ts` (pre-rewrite in `HEAD`) | 864-872 | root inputs included non-shadcn `placeholder/filterMode/side/align` on root. |
| L3 | `src/app/shared/ui/combobox/combobox.component.ts` (pre-rewrite in `HEAD`) | 537-562 | input already had shadcn-like `showTrigger/showClear` behavior. |
| L4 | `src/app/shared/ui/combobox/combobox.component.ts` (pre-rewrite in `HEAD`) | 645-797 | local already had chips/chip/chips-input composition for multi-select. |
| L5 | `src/app/preview/combobox-preview.component.ts` (pre-rewrite in `HEAD`) | 20-33, 45-58 | preview covered only basic single and multiple scenarios; no full conflict/extension matrix coverage. |
