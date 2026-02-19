# textarea Source Understanding

## Mapping
- local: `textarea`
- zardui: `input` (`textarea[z-input]` branch)
- shadcn: `textarea`
- rationale: zardui 没有独立 `textarea` 目录；`textarea` 能力由 `input` directive 的 `textarea[z-input]` 分支承载。

## shadcn Evidence (Target API Primary)
| id | file | lines | note |
| --- | --- | --- | --- |
| S1 | `/tmp/shadcn-textarea-items.json` (`npx shadcn@latest view @shadcn/textarea ...`) | 4-10 | `Textarea` 直接透传原生 `textarea` props，并固定 `data-slot="textarea"`。 |
| S2 | `/tmp/shadcn-textarea-items.json` | 16-43 | `textarea-demo`、`textarea-disabled` 覆盖 Basic + Disabled。 |
| S3 | `/tmp/shadcn-textarea-items.json` | 45-75 | `textarea-with-text`、`textarea-with-label` 对齐 Label + Description 组合。 |
| S4 | `https://ui.shadcn.com/create?...&item=textarea-example`（iframe snapshot） | sections: `Basic/Invalid/With Label/With Description/Disabled` | create 页面中 `textarea-example` 的实际预览分组。 |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.directive.ts` | 29-45 | `z-input` 是 directive，且 selector 同时支持 `input` 与 `textarea`。 |
| Z2 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.directive.ts` | 50-68, 105-121 | `zBorderless/zSize/zStatus` + CVA（`registerOnChange/writeValue`）实现。 |
| Z3 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.variants.ts` | 7-25 | `textarea` 样式、`zStatus` 与 `zBorderless` 变体定义。 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/doc/api.md` | 9-13 | 文档公开 `zSize/zStatus/zBorderless` API。 |
| U2 | `/tmp/zardui/libs/zard/src/lib/shared/components/input/demo/text-area.ts` | 9-12 | demo 展示 `textarea z-input` 与 `zBorderless` 组合。 |

## Local Baseline Evidence (Before Rewrite)
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `git show HEAD:src/app/shared/ui/textarea/textarea.component.ts` | 6-42 | 旧实现是 `<app-textarea>` 包装组件，暴露 `value/status` 等自定义 API。 |
| L2 | `git show HEAD:src/app/shared/ui/textarea/textarea.component.ts` | 44-63 | 样式基线与 shadcn 有偏差，且默认维护本地 `status` 状态机。 |
| L3 | `git show HEAD:src/app/preview/textarea-preview.component.ts` | 15-40 | 旧 preview 仅覆盖 `Default/Statuses`，缺失 shadcn `textarea-example` 关键场景。 |
