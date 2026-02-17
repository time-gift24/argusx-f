# Select 三方对比报告

## 来源
- zardui: `component-comparisons/select/sources/zardui/README.md`
- shadcn: `component-comparisons/select/sources/shadcn/README.md`
- local: `component-comparisons/select/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| Item 通过上下文更新 Root 值 | ✓ | ✓ | ✗ (需手工传 `selectOnChange`) | ✓ | shadcn/zardui |
| 选中态语义属性 (`data-state`) | ✓ | ✓ | 部分 | ✓ | shadcn |
| 触发器 + 内容分层结构 | ✓ | ✓ | ✓ | ✓ | shadcn |
| 可滚动列表上下按钮 | ✓ | ✓ | ✓ | ✓ | local |
| CVA / forms 友好性 | ✓ | - | 部分 | 部分 | zardui |

## 样式差异
- zardui: 变体更完整，和 forms 深度集成。
- shadcn: 语义类名标准化（`data-slot`、`data-state`）最清晰。
- local: 样式接近 shadcn，但交互耦合在 preview 层，导致 API 使用不自然。

## 行为对比
- zardui/shadcn 都是“item 自己能选中并更新 root”。
- local 修复前必须在每个 item 手工传 `[selectValue]` + `(selectOnChange)`，这是行为层缺陷。
- local 修复后引入 `SelectRootToken`，item 自动接入 root，回退兼容旧 API。

## 性能评估
- 三者均为轻量组件。
- local 修复后减少模板层重复绑定，组件使用成本和出错概率下降。

## 加权评分（Interaction-heavy，Behavior ×1.5）
- zardui: 8.9
- shadcn: 9.2
- local 修复前: 6.9
- local 修复后: 8.8

## 已落地修复
- `src/app/shared/ui/select/select.component.ts`
  - 新增 `SelectRootToken` 上下文。
  - `SelectItemComponent` 自动读写 root 值。
  - 新增 `data-state="checked|unchecked"` 语义态。
  - 保留 `selectValue/selectOnChange` 兼容旧用法。
- `src/app/preview/select-preview.component.ts`
  - 移除手工 `selectOnChange/selectValue` 绑定，改为标准用法。

## 推荐实现
- 采用 shadcn 的语义结构 + zardui 的上下文联动思想。
- 本地组件已按该方案修复。
