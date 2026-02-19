# input Preview Coverage

## Required Scenarios
- [x] all conflict APIs with shadcn-aligned behavior  
  - strict selector + no wrapper/no variant APIs reflected in preview usage.
- [x] all non-conflict extension APIs in plain style  
  - CVA extension covered by directive unit test, preview 保持 plain input path。
- [x] all key state combinations  
  - default, disabled, readonly, `aria-invalid`。
- [x] shadcn preview parity examples  
  - default input, with-label, disabled, file input。
- [x] one complex combined scenario  
  - `Complex Form Combination`：label + helper + invalid + readonly + disabled 同时出现。

## Local Preview Routes
- main: `/preview?component=input`
- reference: `https://ui.shadcn.com/preview/radix/input-example`

## Verification Notes
- build:
  - command: `npm run build`
  - result: pass (exit 0)
- tests:
  - command: `npx vitest run src/app/shared/ui/input/input.directive.spec.ts`
  - result: pass (`4 passed`)
  - command: `npx vitest run src/app/shared/ui/input/*.spec.ts`
  - result: pass (`1 file, 4 tests`)
  - note: `ng test --include=...` 在当前仓库不可用（`Unknown argument: include`）；`ng test` 也无 test target（`Cannot determine project or target for command.`）。
- manual check:
  - served route: `http://localhost:4300/preview?component=input`
  - verified via browser snapshot:
    - `Input` 标题渲染
    - `Default / States / With Label / File Input / Complex Form Combination` 五个区块可见
    - disabled / readonly / invalid 输入状态可见
