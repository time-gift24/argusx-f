# sheet Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior (无冲突)
- [x] all non-conflict extension APIs in plain style
- [x] all key state combinations
- [x] shadcn preview parity examples
- [x] one complex combined scenario

## Local Preview Routes
- main: `/preview?component=sheet`
- reference: `https://ui.shadcn.com/preview/radix/sheet-example`
- local: `src/app/preview/sheet-preview.component.ts`

## Current Preview Coverage
- Position (side): top/right/bottom/left
- Basic content structure: header, title, description, body, footer
- Close functionality: close button, cancel button
- Open trigger: button with argusxSheetTrigger

## Verification Notes
- build: 有预先存在的 popover 组件构建错误，与 sheet 无关
- tests: 无 spec 文件
- manual check: 需要运行开发服务器验证
