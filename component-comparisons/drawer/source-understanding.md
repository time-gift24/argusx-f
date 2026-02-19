# drawer Source Understanding

## Mapping
- local: `drawer`
- zardui: `sheet`
- shadcn: `drawer`
- rationale: local `drawer` 与 shadcn `drawer` 的 slot 结构一致（root/trigger/content/header/footer/title/description）；zardui 没有 drawer 目录，但 `sheet` 提供同类的 side + size 能力，可作为实现与扩展 API 的底座参考。

## shadcn Evidence (Target API Primary)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/argusx-drawer-evidence/shadcn-drawer.tsx` | 8-30 | Root/Trigger/Portal/Close 都是最小包装并统一 `data-slot`。 |
| S2 | `/tmp/argusx-drawer-evidence/shadcn-drawer.tsx` | 48-73 | Content 内置 Overlay，方向通过 `data-vaul-drawer-direction` 驱动样式。 |
| S3 | `/tmp/argusx-drawer-evidence/shadcn-drawer.tsx` | 75-122 | Header/Footer/Title/Description 的默认 typography 与 spacing 基线。 |
| S4 | `/tmp/argusx-drawer-evidence/shadcn-drawer-demo.tsx` | 69-134 | 默认使用路径：`Drawer -> DrawerTrigger -> DrawerContent -> DrawerClose`。 |
| S5 | `/tmp/argusx-drawer-evidence/shadcn-drawer-dialog.tsx` | 54-73 | 受控模式 `open/onOpenChange` 用法。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet.component.ts` | 35-57 | `ZardSheetOptions` 暴露 `zSide/zSize/zMaskClosable/zClosable`。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet.component.ts` | 59-148 | 组件结构中 `data-slot="sheet"` 与 header/footer/title/description slot 语义。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/sheet/sheet.variants.ts` | 3-58 | `zSide + zSize` 组合变体（左右宽度、上下高度）。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/sheet/doc/api.md` | 17-33 | 文档公开 side/dimensions/closable 类配置。 |
| U2 | `/tmp/zardui/apps/web/public/components/sheet/demo/side.md` | 88-102 | demo 展示 side 作为动态控制 API。 |
| U3 | `/tmp/zardui/apps/web/public/components/sheet/demo/dimensions.md` | 23-87 | demo 展示 width/height 维度扩展场景。 |
| U4 | `/tmp/zardui/apps/web/public/components/sheet/demo/basic.md` | 77-91 | demo 展示基础 header/footer + actions 流程。 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `git show HEAD:src/app/shared/ui/drawer/drawer.component.ts` | 52-63,309-339 | 旧 API 使用 `app-` 前缀与 `appDrawer*` 指令。 |
| L2 | `git show HEAD:src/app/shared/ui/drawer/drawer.component.ts` | 158-164,366-373 | 旧 overlay 视觉偏重（`bg-black/80` + blur）。 |
| L3 | `git show HEAD:src/app/shared/ui/drawer/drawer.component.ts` | 29-31,465,473-501 | 旧实现包含 `xl` 尺寸且 `showCloseButton` 默认开启。 |
| L4 | `git show HEAD:src/app/preview/drawer-preview.component.ts` | 21-70 | preview 仅覆盖 right/bottom 两个场景，未覆盖完整 API 组合。 |
