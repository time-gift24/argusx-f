# checkbox Source Understanding

## Mapping
- local: `checkbox`
- zardui: `checkbox`
- shadcn: `checkbox`
- rationale: 三方都对应同一语义“二/三态勾选控件”。zardui 与本地实现在 API 命名和默认样式上分叉，shadcn 作为冲突裁决基线，zardui 作为底层实现复用基线。

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/checkbox/checkbox.component.ts` | 32-33 | 组件对外入口是 `z-checkbox, [z-checkbox]`，存在 element + attribute 双 selector。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/checkbox/checkbox.component.ts` | 75-82 | zardui 公共输入为 `zType/zSize/zShape/zDisabled`，命名与 shadcn 不一致。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/checkbox/checkbox.component.ts` | 90-93,99-101 | 有 `disabledByForm` + `zDisabled` 合并禁用态，CVA `setDisabledState` 生效。 |
| Z4 | `/tmp/zardui/libs/zard/src/lib/shared/components/checkbox/checkbox.variants.ts` | 3-25 | 视觉变体来自 `zType/zSize/zShape`，默认 `zType=default`。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/checkbox/doc/api.md` | 9-14 | 文档 API 表确认 `zType/zSize/zShape/zDisabled` 与默认值。 |
| U2 | `/tmp/zardui/apps/web/public/components/checkbox/demo/default.md` | 11-13 | 默认使用支持 `[(ngModel)]` 受控绑定。 |
| U3 | `/tmp/zardui/apps/web/public/components/checkbox/demo/disabled.md` | 13-20,32-34 | 同时演示 `[zDisabled]` 与 `form.disable()` 的禁用路径。 |
| U4 | `/tmp/zardui/apps/web/public/components/checkbox/demo/shape.md` | 11-13 | 形状能力通过 `zShape` 暴露。 |
| U5 | `/tmp/zardui/apps/web/public/components/checkbox/demo/destructive.md` | 11-13 | 语义色能力通过 `zType=\"destructive\"` 暴露。 |
| U6 | `/tmp/zardui/apps/web/public/components/checkbox/demo/size.md` | 12-14 | 尺寸能力通过 `zSize` 暴露。 |

## Local Baseline Evidence
> 注：基线证据由改写前文件快照生成（`git show HEAD:...`），暂存于 `/tmp/local-checkbox-before-rewrite.*`。

| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `/tmp/local-checkbox-before-rewrite.component.ts` | 62,120-126,130 | 旧 selector 是 `app-checkbox`；输入输出为 `checked/disabled/name/value/required/class` + `checkedChange`。 |
| L2 | `/tmp/local-checkbox-before-rewrite.component.ts` | 147-160,180-190 | 旧实现已有 `checked/unchecked/indeterminate` 与 `aria-checked`，但默认样式不是 plain。 |
| L3 | `/tmp/local-checkbox-before-rewrite.component.ts` | 236-253 | 旧实现 CVA 的 `setDisabledState` 未生效（空实现），表单禁用态存在行为缺口。 |
| L4 | `/tmp/local-checkbox-before-rewrite.preview.ts` | 15-66 | 旧 preview 仅覆盖默认/描述/禁用，未覆盖受控与复杂组合场景。 |

## shadcn Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-checkbox.tsx` | 9-12,20 | shadcn 组件以 `React.ComponentProps<typeof CheckboxPrimitive.Root>` 透传根节点 API。 |
| S2 | `/tmp/shadcn-checkbox.tsx` | 14-27 | 固定 `data-slot=\"checkbox\"` 与 `data-slot=\"checkbox-indicator\"`，状态依赖 `data-[state=*]`。 |
| S3 | `/tmp/shadcn-checkbox-demo.tsx` | 10,14,23,27-31 | 示例覆盖 `id/defaultChecked/disabled/className` 基础能力。 |
| S4 | `/tmp/shadcn-form-rhf-checkbox.tsx` | 102-107,142-147 | 表单示例显示受控路径以 `checked + onCheckedChange + name` 为主，并包含 `aria-invalid`。 |
