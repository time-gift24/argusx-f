# field Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=field`
- reference: `https://ui.shadcn.com/preview/radix/field-example`

## Preview Coverage Details

### Basic Field (已有)
- argusx-field
- argusx-field-label
- argusx-field-description

### Field Set + Error (已有)
- argusx-field-set
- argusx-field-legend
- argusx-field
- argusx-field-label
- argusx-field-description
- argusx-field-error

### Horizontal Orientation (已有)
- argusx-field orientation="horizontal"
- argusx-field-label with for attribute

### Field Legend (已有)
- argusx-field-set
- argusx-field-legend with variant="legend" (default)
- argusx-field-legend with variant="label"

### Field Group (新增)
- argusx-field-group
- checkbox 分组示例
- 多字段分组布局

### Field Separator (新增)
- argusx-field-separator
- 简单分隔线
- 带内容的分隔线 (hasContent="true")

### Responsive Orientation (新增)
- argusx-field orientation="responsive"
- argusx-field-content
- 响应式布局在不同屏幕宽度下的行为

### Complex Form Payment (新增)
- FieldGroup > FieldSet > FieldGroup > Field 多层嵌套
- 完整支付表单结构
- 包含 Month/Year/CVV 网格布局

## Verification Notes
- build: passed
- tests: no spec files for field component
- manual check: http://localhost:4200/preview/field
