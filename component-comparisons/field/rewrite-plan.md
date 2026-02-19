# field Rewrite Plan

## Conflict Resolution (Must Adopt shadcn)
- [x] 无冲突项需要处理

## Non-conflict Extensions (ArgusX Plain)
- [x] FieldErrorComponent: 本地扩展
- [x] FieldTitleComponent: 本地扩展
- [x] FieldContentComponent: 本地扩展
- [x] 所有扩展均保持 plain 风格

## Breaking Rewrite Policy (No Compatibility Layer)
- [x] 直接从 app-field-* 迁移到 argusx-field-*，无兼容层

## Naming Migration (app -> argusx)
- [x] selector: app-field -> argusx-field
- [x] selector: app-field-label -> argusx-field-label
- [x] selector: app-field-description -> argusx-field-description
- [x] selector: app-field-error -> argusx-field-error
- [x] selector: app-field-set -> argusx-field-set
- [x] selector: app-field-legend -> argusx-field-legend
- [x] selector: app-field-group -> argusx-field-group
- [x] selector: app-field-title -> argusx-field-title
- [x] selector: app-field-separator -> argusx-field-separator
- [x] selector: app-field-content -> argusx-field-content

## shadcn API Alignment
- [x] orientation 输入对齐 shadcn
- [x] data-slot 属性对齐 shadcn
- [x] accessibility 对齐 (role="group", role="alert")

## Plain Style Alignment
- [x] 默认使用 Tailwind 工具类和 CSS 变量
- [x] 无硬编码品牌色

## File-level Plan
1. `src/app/shared/ui/field/field.component.ts` - selector 迁移
2. `src/app/shared/ui/field/field-label.component.ts` - selector 迁移
3. `src/app/shared/ui/field/field-description.component.ts` - selector 迁移
4. `src/app/shared/ui/field/field-error.component.ts` - selector 迁移
5. `src/app/shared/ui/field/field-set.component.ts` - selector 迁移
6. `src/app/shared/ui/field/field-legend.component.ts` - selector 迁移
7. `src/app/shared/ui/field/field-group.component.ts` - selector 迁移
8. `src/app/shared/ui/field/field-title.component.ts` - selector 迁移
9. `src/app/shared/ui/field/field-separator.component.ts` - selector 迁移
10. `src/app/shared/ui/field/field-content.component.ts` - selector 迁移
11. `src/app/shared/ui/field/index.ts` - 更新示例注释
12. `src/app/preview/field-preview.component.ts` - 更新使用
