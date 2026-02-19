# native-select Source Understanding

## Mapping
- local: `native-select`
- zardui: N/A (zardui 没有 native-select 组件)
- shadcn: `native-select`
- rationale: 本地实现使用 directives 方式包装原生 select 元素，与 shadcn 组件方式略有不同但 API 语义一致

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | N/A | N/A | zardui 没有 native-select 组件，只有自定义 select 组件（非原生） |

## Usage Evidence (Doc + Demo)
| id | file | scenario |
| --- | --- | --- |
| U1 | shadcn registry: native-select-demo | 基本使用，包含 NativeSelect 和 NativeSelectOption |
| U2 | shadcn registry: native-select-groups | 分组选项，使用 NativeSelectOptGroup |
| U3 | shadcn registry: native-select-invalid | 验证状态，aria-invalid="true" |
| U4 | shadcn registry: native-select-disabled | 禁用状态，disabled 属性 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/native-select/native-select.directive.ts | 60-67 | NativeSelectWrapperDirective - 包装器指令 |
| L2 | src/app/shared/ui/native-select/native-select.directive.ts | 84-99 | NativeSelectDirective - select 样式指令 |
| L3 | src/app/shared/ui/native-select/native-select.directive.ts | 113-122 | NativeSelectOptionDirective - option 样式指令 |
| L4 | src/app/shared/ui/native-select/native-select.directive.ts | 137-148 | NativeSelectOptGroupDirective - optgroup 样式指令 |
| L5 | src/app/shared/ui/native-select/native-select.directive.ts | 164-182 | NativeSelectIconDirective - 图标样式指令 |

## shadcn API Reference
From shadcn registry:
- `NativeSelect` - 根组件，支持 `disabled`, `aria-invalid` 属性
- `NativeSelectOption` - 选项元素
- `NativeSelectOptGroup` - 选项组，支持 `label` 属性
