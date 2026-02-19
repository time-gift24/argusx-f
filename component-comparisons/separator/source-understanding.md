# separator Source Understanding

## Mapping
- local: `separator`
- zardui: `divider`
- shadcn: `separator`
- rationale: zardui uses "divider" naming while shadcn uses "separator". Local aligns with shadcn.

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/divider/divider.component.ts` | 1-36 | Main component with zOrientation, zSpacing inputs |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/divider/divider.variants.ts` | 1-54 | CVA variants for orientation and spacing |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | shadcn MCP separator-demo | 1-20 | Horizontal and vertical separator usage |
| U2 | zardui demo/default.ts | - | Default horizontal divider |
| U3 | zardui demo/vertical.ts | - | Vertical divider with height control |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/separator/separator.component.ts` | 20-66 | Main component with orientation, decorative, class inputs |
| L2 | `src/app/preview/separator-preview.component.ts` | 1-44 | Preview showing horizontal and vertical usage |
