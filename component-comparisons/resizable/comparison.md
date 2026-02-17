# Resizable 三方对比报告

## 来源
- zardui: `component-comparisons/resizable/sources/zardui/README.md`
- shadcn: `component-comparisons/resizable/sources/shadcn/README.md`
- local: `component-comparisons/resizable/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| Group/Panel/Handle 上下文通信 | ✓ | ✓ | ✗ (DOM 强转调用) | ✓ | zardui/shadcn |
| 拖拽后尺寸状态一致性 | ✓ | ✓ | 部分 (直接写 DOM style) | ✓ | shadcn |
| 面板约束(min/max)遵循 | ✓ | ✓ | 部分 | ✓ | zardui |
| 键盘方向语义（横/竖布局） | ✓ | ✓ | 部分 | ✓ | shadcn |
| `aria-orientation` 语义 | ✓ | ✓ | 部分 | ✓ | shadcn |

## 样式差异
- shadcn 的 handle 语义类与方向类最规范。
- zardui 在约束与事件拆分更完整（start/resize/end）。
- local 修复后保留当前视觉，同时把交互逻辑对齐到上下文驱动。

## 行为对比
- 修复前 local 通过 DOM 强转访问 group API，属于脆弱实现。
- 修复前拖拽时直接改 DOM `flex-basis`，与组件信号状态可能漂移。
- 修复后 local 使用 `RESIZABLE_GROUP` 注入上下文，panel 注册到 group，handle 通过面板 API 调整尺寸并同步 group 状态。

## 性能评估
- 变更后避免了重复 DOM 查询和非受控样式写入，交互一致性提升。
- 保持 OnPush，不引入额外重渲染热点。

## 加权评分（Interaction-heavy，Behavior ×1.5）
- zardui: 9.1
- shadcn: 9.3
- local 修复前: 6.8
- local 修复后: 8.9

## 已落地修复
- `src/app/shared/ui/resizable/resizable.component.ts`
  - 新增 `RESIZABLE_GROUP` 上下文，替代 DOM 强转。
  - `Panel` 注册/注销到 group，尺寸初始化读取 group 状态。
  - `Handle` 基于 panel API 调整尺寸并统一同步到 group。
  - 键盘方向行为与 `aria-orientation` 语义修正。

## 推荐实现
- 采用 shadcn 的语义结构 + zardui 的上下文与约束思路。
- local 当前实现已完成关键风险修复，可作为后续细化动画和折叠行为的基线。
