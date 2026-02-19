# checkbox Preview Coverage

## Required Scenarios
- [x] shadcn 冲突项对齐场景
  - `checked` 受控
  - `defaultChecked` 非受控
  - `disabled` 与 `required/name/value` 展示
  - `checked='indeterminate'` 显示 mixed
- [x] ArgusX 非冲突扩展（plain）
  - `variant=plain/destructive`
  - `size=default/lg`
  - `shape=default/circle/square`
- [x] 关键状态组合
  - unchecked / checked / indeterminate
  - enabled / disabled
  - form-like 受控组合（`name + checkedChange`）
- [x] shadcn parity 示例
  - 基础 label 组合
  - defaultChecked + 说明文案
  - disabled 行
  - 自定义 class 覆盖
- [x] 复杂组合
  - `checked='indeterminate' + variant='destructive' + size='lg' + shape='circle' + required`

## Local Preview Routes
- main: `/preview?component=checkbox`
- reference: `https://ui.shadcn.com/preview/radix/checkbox-example`

## Verification Notes
- build:
  - `ng build` ✅（存在仓库级 CommonJS 警告，与 checkbox 改写无关）
- tests:
  - `src/app/shared/ui/checkbox` 下暂无 `*.spec.ts`，未执行 include 测试
- manual check:
  - 启动 `ng serve --host 127.0.0.1 --port 4400`
  - 打开 `/preview?component=checkbox`
  - 验证四个区块都渲染，且交互更新正常（例如 Task selections 中 Push 勾选后文本从 `Selected: email` 变为 `Selected: email, push`）
