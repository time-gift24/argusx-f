# sidebar Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Preview Components (需要创建)
1. `argusx-sidebar-provider` - Provider 组件示例
2. `argusx-sidebar` - 主 sidebar 组件示例
3. `argusx-sidebar-trigger` - 触发器示例
4. `argusx-sidebar-inset` - Inset 区域示例
5. `argusx-sidebar-header/footer` - 头部/底部示例
6. `argusx-sidebar-group/label/menu` - 菜单组示例
7. `argusx-sidebar-menu-button` - 菜单按钮含 isActive 示例
8. `argusx-sidebar-separator` - 分割线示例
9. `argusx-sidebar-input` - 输入框示例
10. collapsible="offcanvas" 折叠示例
11. collapsible="icon" 图标模式示例
12. side="left/right" 侧边位置示例

## Local Preview Routes
- main: `/preview?component=sidebar`
- reference: `https://ui.shadcn.com/preview/radix/sidebar-example`

## Verification Notes
- build: 需要验证 ng build 通过
- tests: 需要验证组件测试通过
- manual check: 需要手动验证预览页
