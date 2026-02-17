# Toast 三方对比报告

## 来源
- zardui: `component-comparisons/toast/sources/zardui/README.md`
- shadcn(sonner): `component-comparisons/toast/sources/shadcn/README.md`
- local: `component-comparisons/toast/sources/local/README.md`

## 功能矩阵
| 特性 | zardui | shadcn(sonner) | local(修复前) | local(修复后) | 最优参考 |
|------|--------|----------------|---------------|---------------|----------|
| 进入/退出状态动画 | ✓ | ✓ | 部分（仅 show） | ✓ | shadcn |
| 顶部/底部堆叠方向 | ✓ | ✓ | ✗（固定反向） | ✓ | shadcn |
| 图标语义与类型映射 | ✓ | ✓ | ✓ | ✓ | local |
| API 级 dismissAll 行为 | ✓ | ✓ | 直接清空 | 动画后清空 | shadcn/zardui |

## 样式差异
- zardui/shadcn 都强调 Toaster 统一容器行为。
- local 修复前 `data-state` 固定为 `show`，退出动画失效。

## 行为对比
- local 修复后：
  - 增加 `Toast.state = show/hide`。
  - `dismiss` 先标记 `hide` 再延迟移除，确保退出动画可见。
  - 容器顶部位置改为 `flex-col`，底部保留 `flex-col-reverse`。

## 性能评估
- 修复后通过微小延迟定时器换来完整动画体验；开销可接受。

## 加权评分（Interaction-heavy，Behavior ×1.5）
- zardui: 8.6
- shadcn(sonner): 9.3
- local 修复前: 6.7
- local 修复后: 8.5

## 已落地修复
- `src/app/shared/ui/toast/toast.service.ts`
  - 新增 `ToastState` 和退出动画计时逻辑。
  - `dismissAll` 改为逐条动画退出。
- `src/app/shared/ui/toast/toast.component.ts`
  - `data-state` 绑定真实状态。
  - 按顶部/底部位置切换入场/退场方向与堆叠方向。

## 推荐实现
- 继续沿用 local service API，同时对齐 shadcn/sonner 的状态驱动动画模型。
