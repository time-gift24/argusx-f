# Aspect Ratio 三方对比报告

## 概述

Aspect Ratio 组件是一个保持元素宽高比的实用组件，常用于图片、视频、iframe 等需要按比例缩放的场景。

## 功能矩阵

| 特性 | zardui | shadcn | local | 最优 |
|------|--------|--------|-------|------|
| 基础宽高比支持 | ✗ | ✓ | ✗ | shadcn |
| 自定义比例 (ratio) | ✗ | ✓ | ✗ | shadcn |
| 常用比例预设 (16:9, 4:3, 1:1) | ✗ | ✓ | ✗ | shadcn |
| 响应式支持 | ✗ | ✓ | ✗ | shadcn |
| className 扩展 | ✗ | ✓ | ✗ | shadcn |

## 样式差异

- **shadcn**: 使用 CSS `padding-bottom` 技巧实现宽高比，通过 `aspect-ratio` CSS 属性作为现代方案。配合 `fill` class 让子元素完全填充容器。
- **zardui**: 不存在该组件
- **local**: 不存在该组件

## 行为对比

- **shadcn**:
  - 基于 Radix UI / Base UI 实现
  - 使用 `aspect-ratio` CSS 属性（现代浏览器）或 padding-bottom 回退方案
  - 子元素通常配合 `fill` class 实现 `object-fit: cover` 效果
- **zardui**: 无相关组件
- **local**: 无相关组件

## 性能评估

- **shadcn**: 纯 CSS 实现，无运行时开销，性能最优
- **zardui**: N/A
- **local**: N/A

## 推荐实现

基于智能加权（基础组件，功能为主），**推荐采用 shadcn 的实现方案**。

### shadcn 实现参考

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full overflow-hidden", className)}
      style={{
        aspectRatio: ratio,
        // 或使用 padding-bottom 回退
        // paddingBottom: `${(1 / ratio) * 100}%`,
      }}
      {...props}
    >
      {children}
    </div>
  )
)
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
```

### 常用比例

| 比例 | 值 | 用途 |
|------|-----|------|
| 16:9 | 16/9 | 视频、演示文稿 |
| 4:3 | 4/3 | 传统照片 |
| 1:1 | 1 | 正方形图片、头像 |
| 9:16 | 9/16 | 竖屏视频、故事 |

## 结论

建议在本地实现 Aspect Ratio 组件，参考 shadcn 的简洁实现。这是一个纯展示性的实用组件，技术复杂度低，直接实现即可。
