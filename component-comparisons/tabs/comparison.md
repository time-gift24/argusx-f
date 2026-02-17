# Tabs 三方对比报告

## 来源
- zardui: `component-comparisons/tabs/sources/zardui/README.md`
- shadcn: `component-comparisons/tabs/sources/shadcn/README.md`
- local: `component-comparisons/tabs/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn | local(修复前) | local(修复后) | 最优参考 |
|------|--------|--------|---------------|---------------|----------|
| `data-orientation` 驱动样式 | ✓ | ✓ | 部分（类名不完全对齐） | ✓ | shadcn |
| trigger 语义状态 `data-state` | ✓ | ✓ | ✗ (`data-active`) | ✓ | shadcn |
| 空值时自动选首个可用 tab | ✓ | 依赖 `defaultValue` | ✗ | ✓ | zardui |
| 键盘导航（左右/上下/Home/End） | ✓ | ✓ | ✓ | ✓ | local |

## 样式差异
- zardui: 功能更重，额外滚动箭头和布局能力。
- shadcn: 轻量，`data-[orientation=...]` 与 `data-[state=active]` 规则最统一。
- local 修复前使用了非标准 group-data 片段，导致视觉规则可读性较差。

## 行为对比
- local 修复前 `data-active` 与主流 Radix/shadcn 语义不一致。
- local 修复后统一为 `data-state="active|inactive"`，并增加首个可用 tab 自动激活。

## 性能评估
- 三者都为常量级交互开销。
- local 修复后减少“初始无激活 tab”带来的无效重绘与空内容状态。

## 加权评分（Interaction-heavy，Behavior ×1.5）
- zardui: 8.7
- shadcn: 9.1
- local 修复前: 7.4
- local 修复后: 8.9

## 已落地修复
- `src/app/shared/ui/tabs/tabs.component.ts`
  - 样式类名对齐 shadcn 的 `data-[orientation=...]` 模式。
  - trigger 状态从 `data-active` 切换为 `data-state`。
  - 增加初始无值时自动选择首个可用 tab。

## 推荐实现
- 以 shadcn 语义状态体系为主，保留 local 现有键盘导航能力。
