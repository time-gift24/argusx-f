# field Source Understanding

## Mapping
- local: `field`
- zardui: `form` (z-form-field, z-form-control, z-form-label, z-form-message)
- shadcn: `field`
- rationale: zardui 没有专门的 field 组件，只有 form 相关组件。argusx 的 field 组件已经与 shadcn 对齐。

## ZardUI Evidence
| id | file | lines | note |
| --- | --- | --- | --- |
| Z1 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/form/form.component.ts | 21-35 | z-form-field 组件实现 |
| Z2 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/form/form.component.ts | 37-67 | z-form-control 组件实现 |
| Z3 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/form/form.component.ts | 69-86 | z-form-label 组件实现 |
| Z4 | /Users/wanyaozhong/projects/zardui/src/app/shared/components/form/form.component.ts | 88-103 | z-form-message 组件实现 |

## Usage Evidence (Doc + Demo)
| id | file | scenario |
| --- | --- | --- |
| U1 | shadcn field-demo | 完整的 field 使用示例，包含 Field, FieldGroup, FieldLabel, FieldDescription, FieldLegend, FieldSeparator, FieldSet |
| U2 | 本地 preview | 基本使用场景 |

## Local Baseline Evidence
| id | file | lines | current behavior |
| --- | --- | --- | --- |
| L1 | src/app/shared/ui/field/field.component.ts | 44-70 | FieldComponent，使用 app-field selector |
| L2 | src/app/shared/ui/field/field-label.component.ts | 19-41 | FieldLabelComponent，使用 app-field-label selector |
| L3 | src/app/shared/ui/field/field-description.component.ts | 22-45 | FieldDescriptionComponent，使用 app-field-description selector |
| L4 | src/app/shared/ui/field/field-error.component.ts | 29-99 | FieldErrorComponent，使用 app-field-error selector |
| L5 | src/app/shared/ui/field/field-set.component.ts | 21-42 | FieldSetComponent，使用 app-field-set selector |
| L6 | src/app/shared/ui/field/field-legend.component.ts | 19-49 | FieldLegendComponent，使用 app-field-legend selector |
| L7 | src/app/shared/ui/field/field-group.component.ts | 21-42 | FieldGroupComponent，使用 app-field-group selector |
| L8 | src/app/shared/ui/field/field-title.component.ts | 18-39 | FieldTitleComponent，使用 app-field-title selector |
| L9 | src/app/shared/ui/field/field-separator.component.ts | 20-58 | FieldSeparatorComponent，使用 app-field-separator selector |
| L10 | src/app/shared/ui/field/field-content.component.ts | 23-44 | FieldContentComponent，使用 app-field-content selector |
