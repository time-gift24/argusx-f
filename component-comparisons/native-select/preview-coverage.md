# native-select Preview Coverage

## Required Scenarios
- [x] 基本选择场景 (default)
- [x] 分组选项场景 (with groups)
- [x] disabled 状态场景
- [x] invalid 状态场景
- [x] size 变体场景

## Local Preview Routes
- main: `/preview?component=native-select`
- reference: https://ui.shadcn.com/preview/radix/native-select-example

## Preview 覆盖场景
1. **Default** - 基本选择，默认尺寸
2. **With Groups** - 分组选项，sm 尺寸
3. **Disabled** - 禁用状态
4. **Invalid** - 验证失败状态

## Verification Notes
- build: 需要修复 drawer 组件错误后验证
- tests: 无 spec 文件
- manual check: 需在浏览器中验证预览页面
