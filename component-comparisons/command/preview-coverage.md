# command Preview Coverage

## Required Scenarios

### 1. Conflict APIs with shadcn-aligned behavior
- [x] argusx-command 根组件
- [x] argusx-command-input 输入框
- [x] argusx-command-list 列表容器
- [x] argusx-command-empty 空状态
- [x] argusx-command-group 分组
- [x] argusx-command-item 选项
- [x] argusx-command-separator 分割线
- [x] argusx-command-shortcut 快捷键

### 2. Non-conflict Extension APIs in plain style
- [x] filterFn 自定义过滤函数支持
- [x] value model 双向绑定
- [x] disabled input 禁用状态
- [x] CommandRootToken 组件间通信

### 3. Key State Combinations
- [x] 正常状态 - 显示选项列表
- [x] 搜索状态 - 过滤显示
- [x] 空状态 - 无匹配结果
- [x] 禁用状态 - disabled item
- [x] 选中状态 - 选中项目高亮

### 4. shadcn Preview Parity Examples
- [x] 基本使用 - Command + Input + List + Item
- [x] 分组 - CommandGroup + heading
- [x] 分割线 - CommandSeparator
- [x] 快捷键 - CommandShortcut

### 5. Complex Combined Scenario
- [x] 完整示例：包含多个分组、分割线、快捷键、禁用项

## Local Preview Routes
- main: `/preview?component=command`
- reference: `https://ui.shadcn.com/preview/radix/command-example`

## Current Preview Coverage

预览组件 `src/app/preview/command-preview.component.ts` 已覆盖：
1. argusx-command 根组件使用
2. argusx-command-input 搜索输入
3. argusx-command-list 列表容器
4. argusx-command-empty 空状态显示
5. argusx-command-group 分组 (2个)
6. argusx-command-item 选项 (6个)
7. argusx-command-separator 分割线
8. argusx-command-shortcut 快捷键 (4个)
9. 禁用项 - `[disabled]="true"`
10. 双向绑定 - `[(value)]="selectedCommand"`

## Verification Notes

### Build Status
- [ ] Build passed
- [ ] Build failed (待验证)

### Test Status
- [ ] No spec file found - no tests to run

### Manual Check
- [ ] 打开 `/preview?component=command`
- [ ] 确认所有 API 场景可见
