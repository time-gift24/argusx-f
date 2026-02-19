# toast Source Understanding

## Mapping
- local: `toast`
- zardui: `toast`
- shadcn: `sonner`
- rationale: shadcn/sonner 是事实标准，zardui 也使用 sonner 底层

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /tmp/zardui/libs/zard/src/lib/shared/components/toast/toast.component.ts | 1-51 | 主组件使用 ngx-sonner |
| Z2 | /tmp/zardui/libs/zard/src/lib/shared/components/toast/toast.variants.ts | 1-19 | variant 定义 |
| Z3 | /tmp/zardui/libs/zard/src/lib/shared/components/toast/doc/api.md | 1-19 | API 文档 |

## Usage Evidence (Doc + Demo)
| id | file | lines | scenario |
| --- | --- | --- | --- |
| U1 | /tmp/zardui/libs/zard/src/lib/shared/components/toast/demo/default.ts | 1-20 | 默认使用 |
| U2 | /tmp/zardui/libs/zard/src/lib/shared/components/toast/demo/position.ts | 1-20 | 位置配置 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/toast/toast.component.ts | 1-198 | 包含 ToastItemComponent, ToastContainerComponent, ToasterComponent |
| L2 | src/app/shared/ui/toast/toast.service.ts | 1-139 | 服务提供 success/error/warning/info/loading 方法 |
