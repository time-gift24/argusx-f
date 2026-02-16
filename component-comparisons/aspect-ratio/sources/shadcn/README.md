# Aspect Ratio - shadcn/ui 源码

## 组件信息

- **类型**: registry:ui
- **依赖**: Radix UI / Base UI
- **官网**: https://ui.shadcn.com/docs/components/aspect-ratio

## 安装命令

```bash
pnpm dlx shadcn@latest add aspect-ratio
```

## 使用方法

```tsx
import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9}>
  <Image src="..." alt="..." className="rounded-md object-cover" />
</AspectRatio>
```

## API Reference

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `ratio` | `number` | 16/9 | Yes |
| `className` | `string` | - | No |

## 源码实现

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full overflow-hidden", className)}
        style={{
          aspectRatio: typeof ratio === "number" ? ratio : `${ratio.width}/${ratio.height}`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
```

## 示例代码

### 16:9 视频比例

```tsx
<AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
  <Image
    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
    alt="Photo by Drew Beamer"
    fill
    className="h-full w-full rounded-lg object-cover"
  />
</AspectRatio>
```

### 1:1 正方形

```tsx
<AspectRatio ratio={1 / 1}>
  <Image src="..." alt="Photo" className="rounded-md object-cover" />
</AspectRatio>
```

### 9:16 竖屏

```tsx
<AspectRatio ratio={9 / 16}>
  <Image src="..." alt="Photo" className="rounded-md object-cover" />
</AspectRatio>
```

## 实现原理

1. **现代方案**: 使用 CSS `aspect-ratio` 属性
2. **回退方案**: 使用 `padding-bottom` 百分比技巧（已较少使用）
3. **子元素填充**: 使用 `fill` class 配合 `object-fit: cover` 让图片/视频完全填充容器
