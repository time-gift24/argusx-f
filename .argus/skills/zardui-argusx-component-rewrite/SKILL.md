---
name: zardui-argusx-component-rewrite
description: "用 zardui 作为实现底座重写 ArgusX Angular 组件。API 改写规则：与 shadcn 冲突时必须采用 shadcn；无冲突时扩展为 ArgusX 自有 API，并统一为 plain 风格；不保留兼容层，采用一次性破坏式改写。Use when you need to: (1) 解析 zardui 源码与 demo/doc 以复用实现逻辑, (2) 通过 shadcn MCP 定义冲突与非冲突 API 决策, (3) 把 zardui 命名迁移为 argusx- 前缀, (4) 在 src/app/preview 中完整展示 shadcn + argusx plain 风格 API 的使用方式。"
---

# ZardUI to ArgusX Component Rewrite

对单个组件执行“源码理解 -> API 差异 -> 改造实现 -> Preview 覆盖”的完整流程。  
按组件逐个执行，不要批量并行改多个组件。

## Required Input
- `component`: 本地组件目录名（`src/app/shared/ui/{component}`）
- `zarduiComponent` (optional): zardui 组件目录名；默认与 `component` 同名
- `shadcnItem` (optional): shadcn registry item 名；默认与 `component` 同名

在开始前先运行脚本生成任务骨架：

```bash
python3 .argus/skills/zardui-argusx-component-rewrite/scripts/scaffold_component_rewrite.py \
  --component "$COMPONENT" \
  --zardui-component "$ZARDUI_COMPONENT" \
  --shadcn-item "$SHADCN_ITEM"
```

## Decision Rules

按四条轨道决策，避免“API、实现和风格来源混淆”：

1. API 冲突决策轨道（命名、参数、默认值、交互语义）  
- 规则: `conflict -> shadcn`
- 冲突定义: 同一语义 API 在 shadcn 与 zardui/local 存在命名、默认值或行为不一致。
- 处理: 无例外采用 shadcn 形态；禁止保留兼容 alias 或双轨主入口。

2. API 非冲突扩展轨道（增量能力）  
- 规则: `no conflict -> argusx extension`
- 范围: shadcn 未定义且不破坏 shadcn 语义主路径的能力。
- 处理: 以 ArgusX 自有 API 扩展；扩展 API 必须保持 plain 风格并记录理由。

3. 实现轨道（内部状态机、样式变体组织、DOM 结构技巧）  
- 优先级: `zardui > 本地现有实现`
- 含义: 优先复用 zardui 已验证的底层实现思路，不为了“长得像 shadcn”而牺牲实现稳定性。

4. 风格轨道（视觉与样式）  
- 基线: `plain`
- 含义: 所有默认态、默认变体和扩展 API 的视觉表现都应采用 plain 风格（中性、克制、低装饰）。

## Plain Style Contract

- 默认 `variant` 必须是 `plain`；若组件无 variant 概念，默认样式需等价 plain。
- 默认态避免强阴影、渐变、玻璃化和高噪声动画。
- 优先复用现有 design tokens，避免组件内部硬编码品牌色。
- preview 至少提供一个 plain baseline 示例和一个 plain + 扩展 API 叠加示例。

## Source Priority

按以下顺序取证并记录到 `component-comparisons/{component}/source-understanding.md`：

1. shadcn 对标实现（目标 API 主依据）  
- `mcp__shadcn__get_project_registries`
- `mcp__shadcn__search_items_in_registries`
- `mcp__shadcn__view_items_in_registries`
- `mcp__shadcn__get_item_examples_from_registries`
- 参考 URL: `https://ui.shadcn.com/preview/radix/{component}-example`

2. zardui 实现源码（底层实现主依据）  
- `/tmp/zardui/libs/zard/src/lib/shared/components/{zarduiComponent}/`

3. zardui 使用方式与文档（补充行为依据）  
- `/tmp/zardui/apps/web/public/components/{zarduiComponent}/doc/`
- `/tmp/zardui/apps/web/public/components/{zarduiComponent}/demo/`

4. 本地组件实现（改造目标与当前差异）  
- `src/app/shared/ui/{component}/`
- `src/app/preview/{component}-preview.component.ts`

命名不一致时读取 `references/component-name-mapping.md`。

## Workflow

### 1) Define shadcn baseline and plain extension contract
执行以下动作：
1. 用 shadcn MCP 拉取组件源码与示例，提取 public API（props、state、events、slot/data attributes、a11y）。
2. 对每个候选 API 打标：`conflict-adopt-shadcn`、`no-conflict-extend-argusx`。
3. 输出首版 target API 清单（含 plain 风格要求），作为后续改造契约。

### 2) Understand zardui source and usage
执行以下动作：
1. 读取 `component.ts`、`*.variants.ts`、`index.ts`，提取 selector、inputs、outputs、host attributes、slot/structure。
2. 读取 `doc/api.md`，提取 API 表（名称、类型、默认值、说明）。
3. 读取 `demo/*`，提取真实组合方式（变体、尺寸、状态、受控/非受控行为）。
4. 所有结论绑定源码证据（文件路径 + 行号片段）。

### 3) Compare APIs and output diff
执行以下动作：
1. 对照 shadcn target API、zardui 能力和本地现状，汇总差异与冲突项。
2. 输出 `component-comparisons/{component}/api-diff.md`，必须包含：
- API matrix（zardui vs local vs shadcn vs target）
- Conflict Decisions（冲突项，必须采用 shadcn）
- Non-conflict Extensions（非冲突扩展项，归属 ArgusX plain）
- Missing APIs（本地缺失）
- Behavior mismatches（同名 API 行为不一致）
- Final target API（本地改造后 API）

优先规则：
- 冲突项必须先落为 shadcn，不得保留 zardui/local 主形态。
- 非冲突扩展不得破坏 shadcn 主路径，并且必须写清 plain 风格落点。

### 4) Rewrite component from zardui baseline
以 zardui 为基础实现本地组件，但 API 以 shadcn target 为准。执行顺序固定：

1. 先落地冲突项（采用 shadcn）
- 以 `api-diff.md` 的 Final target API 为唯一对外 API 基线
- 所有冲突项按 shadcn 的命名、默认值、交互语义实现

2. 再落地非冲突扩展（ArgusX plain）
- 仅扩展 shadcn 未覆盖能力，禁止重定义 shadcn 既有语义
- 扩展 API 命名避免与 shadcn 冲突，并在默认态保持 plain 风格

3. 再做命名迁移（argusx 前缀）
- selector: `z-foo` -> `argusx-foo`
- attribute selector: `[zFoo]` -> `[argusxFoo]`
- class/type symbol: `ZardFoo*` -> `ArgusxFoo*`
- input names: `zType` 之类迁移到 `argusxType`

4. 用 zardui 逻辑实现 target API
- 优先复用 zardui 内部逻辑、状态与结构
- 增加 `variant` / `size` / state API 与对应行为（`variant` 默认 `plain`）
- 对齐 data attributes（如 `data-slot`、`data-variant`、`data-size`）
- 对齐可访问性语义（ARIA、keyboard interaction）
- 对齐导出结构（`index.ts`）

5. 最后做收口清理
- 删除旧 API 的兼容入口、deprecated alias 与过渡分支
- 不在同一提交中做无关重构

### 5) Expand preview to cover all APIs
更新 `src/app/preview/{component}-preview.component.ts`，至少覆盖：
1. 冲突项 API 的 shadcn 对齐场景
2. 非冲突扩展 API 的 plain 风格场景
3. 关键状态组合（disabled/loading/open/checked 等）
4. 至少一个“复杂组合示例”（多个 API 同时生效）

若组件或路由尚未接入，补充：
- `src/app/app.routes.ts`
- `src/app/preview/preview-layout.component.ts` 的 `PREVIEW_ITEMS`

### 6) Validate before completion
至少执行：

```bash
ng build
```

如果组件有对应 spec，再执行：

```bash
ng test --include="src/app/shared/ui/{component}/**/*.spec.ts"
```

手动验证：
1. 打开 `/preview?component={component}`
2. 确认预览页能看到 API 差异文档中的每个目标 API 场景

## Deliverables

每个组件必须落盘以下文件：
- `component-comparisons/{component}/source-understanding.md`
- `component-comparisons/{component}/api-diff.md`
- `component-comparisons/{component}/rewrite-plan.md`
- `component-comparisons/{component}/preview-coverage.md`

写作模板见 `references/deliverables-template.md`。

## Quality Gates

在宣称完成前逐项确认：
1. API 差异表中每一行都有来源证据（zardui/shadcn/local）。
2. 所有冲突项均采用 shadcn（无例外主入口）。
3. 所有非冲突扩展项均为 ArgusX 自有 API 且满足 plain 风格。
4. 不存在兼容 alias、deprecated API 入口或双轨行为。
5. preview 覆盖 shadcn 主路径 + ArgusX plain 扩展，不只演示 happy path。
6. 构建通过；若有组件测试则测试通过。
