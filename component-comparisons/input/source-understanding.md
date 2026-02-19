# input Source Understanding

## Mapping
- local: `input`
- zardui: `input`
- shadcn: `input`
- rationale: 三方命名一致，不需要映射转换；但 API 主导权按本次约束固定为 `shadcn > local/zardui`。

## shadcn Evidence (Target API Primary)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `npx shadcn@latest view @shadcn/input` -> `registry/new-york-v4/ui/input.tsx` | 5-17 | `Input` 直接透传原生 `React.ComponentProps<"input">`，无 `size/status/borderless` 自定义 props。 |
| S2 | `npx shadcn@latest view @shadcn/input` -> `registry/new-york-v4/ui/input.tsx` | 9-14 | 强约束 `data-slot="input"` + `aria-invalid` 相关视觉类。 |
| S3 | `npx shadcn@latest view @shadcn/input-demo @shadcn/input-disabled @shadcn/input-with-label @shadcn/input-file` | `input-demo 1-6`, `input-disabled 1-5`, `input-with-label 1-12`, `input-file 1-12` | 官方示例覆盖 default/disabled/with-label/file，均基于原生 `<Input ... />` 用法。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.directive.ts` | 29-45 | `z-input` 是 directive，支持 `input + textarea`，并挂载 CVA provider。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.directive.ts` | 105-121 | `registerOnChange/registerOnTouched/setDisabledState/writeValue` 完整 CVA 行为。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.variants.ts` | 5-35 | zardui 内部样式以 `zType/zSize/zStatus/zBorderless` 变体组织。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/apps/web/public/components/input/doc/api.md` | 9-13 | 文档公开 `zSize/zStatus/zBorderless` 三个 API。 |
| U2 | `/tmp/zardui/apps/web/public/components/input/demo/default.md` | 11-29 | demo 展示 Reactive Forms + disabled + patchValue。 |
| U3 | `/tmp/zardui/apps/web/public/components/input/demo/size.md` | 10-13 | demo 展示 size 变体。 |
| U4 | `/tmp/zardui/apps/web/public/components/input/demo/text-area.md` | 11-13 | demo 展示 `textarea z-input` 双元素支持。 |

## Local Baseline Evidence (Before Rewrite)
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `git show HEAD:src/app/shared/ui/input/input.directive.ts` | 51-68 | 旧本地 API 为 `input[appInput]`，暴露 `status/size/borderless`。 |
| L2 | `git show HEAD:src/app/shared/ui/input/input.directive.ts` | 55-59 | 旧本地输出 `data-status` 并手动 host 绑定 `type/value`。 |
| L3 | `git show HEAD:src/app/shared/ui/input/input.component.ts` | 15-53 | 存在 `<app-input>` 包装组件，重复暴露 input API。 |
| L4 | `git show HEAD:src/app/preview/input-preview.component.ts` | 89-106,150-164 | 旧 preview 依赖 size 区块与 `<app-input>` 组件模式。 |
