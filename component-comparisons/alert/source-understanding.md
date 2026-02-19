# alert Source Understanding

## Mapping
- local: `alert`
- zardui: `alert`
- shadcn: `alert`
- rationale: 三者都存在 `alert` 语义组件。skill 约定路径 `/tmp/zardui/...` 在本机不存在，本次改用本地可访问仓库 `/Users/wanyaozhong/projects/zardui/...` 取证。

## Shadcn Evidence (Target API Baseline)
| id | file | lines | API/Behavior |
| --- | --- | --- | --- |
| S1 | `registry/new-york-v4/ui/alert.tsx` | 6-19 | 根组件 `alertVariants` 只定义 `default` / `destructive`，默认 `default` |
| S2 | `registry/new-york-v4/ui/alert.tsx` | 28-33 | `Alert` 根节点包含 `data-slot="alert"` 与 `role="alert"` |
| S3 | `registry/new-york-v4/ui/alert.tsx` | 37-47 | `AlertTitle` 的 `data-slot="alert-title"` 与标题 class（`line-clamp-1 min-h-4`） |
| S4 | `registry/new-york-v4/ui/alert.tsx` | 50-64 | `AlertDescription` 的 `data-slot="alert-description"` 与说明区 class（`text-muted-foreground ... [&_p]:leading-relaxed`） |
| S5 | `registry/new-york-v4/examples/alert-demo.tsx` | 11-37 | 标准组合：默认态（icon+title+description）、标题-only、`variant="destructive"` 列表内容 |
| S6 | `registry/new-york-v4/examples/alert-destructive.tsx` | 11-17 | destructive 最小示例（icon + title + description） |

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.component.ts` | 19-21 | selector 为 `z-alert, [z-alert]`（element + attribute 双入口） |
| Z2 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.component.ts` | 55-59 | 输入 API：`zTitle`、`zDescription`、`zIcon`、`zType`（default/destructive） |
| Z3 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.variants.ts` | 3-13 | 根变体 `zType`：`default`/`destructive`，默认 `default` |
| Z4 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.component.ts` | 69-79 | 当 `zType === 'destructive'` 时会自动推导默认 icon（`circle-alert`） |
| Z5 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.component.ts` | 47-51 | host 语义：`role="alert"` + `data-slot="alert"` |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.component.ts` | 23-43 | 模板通过 `zTitle/zDescription/zIcon` 组合渲染，不依赖额外子组件 |
| U2 | `/Users/wanyaozhong/projects/zardui/src/app/shared/components/alert/alert.component.ts` | 31-43 | title/description 采用条件渲染，说明组件支持 title-only 或 description-only |
| U3 | `/Users/wanyaozhong/projects/zardui` | N/A | 未找到 `alert/doc` 与 `alert/demo` 目录（本次使用组件源码模板作为 usage 依据） |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | `src/app/shared/ui/alert/alert.component.ts` | 12-31 | 根变体：`plain/destructive/warning/info/success`，默认 `plain` |
| L2 | `src/app/shared/ui/alert/alert.component.ts` | 37-55 | host 对齐：`data-slot`、`data-variant`、`role`、`aria-live` |
| L3 | `src/app/shared/ui/alert/alert-title.component.ts` | 4-18 | 标题子组件 `data-slot="alert-title"`，class 对齐 shadcn 标题排版 |
| L4 | `src/app/shared/ui/alert/alert-description.component.ts` | 4-21 | 描述子组件 `data-slot="alert-description"`，class 对齐 shadcn 描述排版 |
| L5 | `src/app/shared/ui/alert/alert-action.component.ts` | 9-23 | ArgusX 扩展子组件：`argusx-alert-action`（操作区插槽） |
| L6 | `src/app/preview/alert-preview.component.ts` | 37-146 | preview 已覆盖 shadcn 主路径、ArgusX plain 扩展、复杂组合场景 |
| L7 | `src/app/shared/ui/alert/alert.component.spec.ts` | 22-53 | 新增 spec：验证默认 plain、destructive class contract、slot class contract |
