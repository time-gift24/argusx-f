# textarea Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior  
  - `Basic / Invalid / With Label / With Description / Disabled` 已对齐 `textarea-example`。
- [x] all non-conflict extension APIs in plain style  
  - `argusxVariant/argusxSize/argusxStatus` 在 `ArgusX Plain Extensions` 区块覆盖。
- [x] all key state combinations  
  - `invalid`、`disabled`、`status`、`size`、`borderless` 已覆盖。
- [x] shadcn preview parity examples  
  - 与 create 页面 `textarea-example` 的五个核心场景一致。
- [x] one complex combined scenario  
  - `Complex Combined Scenario` 覆盖 label + helper text + dynamic status + button action。

## Local Preview Routes
- main: `/preview?component=textarea`
- reference: `https://ui.shadcn.com/preview/radix/textarea-example`

## Verification Notes
- build:
  - command: `npx ng build`
  - result: pass (exit 0)
  - note: 仅存在仓库既有 CommonJS warnings（与本次 textarea 改造无关）。
- tests:
  - command: `npx vitest run src/app/shared/ui/textarea/textarea.directive.spec.ts`
  - result: pass (`5 passed`)
  - command: `npx ng test --include="src/app/shared/ui/textarea/**/*.spec.ts" --watch=false`
  - result: fail（CLI 不支持 `include/watch` 参数）
  - command: `npx ng test`
  - result: fail（仓库未配置默认 test target）
- manual check:
  - served route: `http://127.0.0.1:4310/preview?component=textarea`
  - browser snapshot confirms sections:
    - `Basic`
    - `Invalid`
    - `With Label`
    - `With Description`
    - `Disabled`
    - `ArgusX Plain Extensions`
    - `Complex Combined Scenario`
