# Alert - shadcn/ui 源码

## 概述

shadcn/ui 的 Alert 组件是一个轻量级的 React 组件，用于向用户显示重要信息。

## 使用示例

```tsx
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <PopcornIcon />
        <AlertTitle>
          This Alert has a title and an icon. No description.
        </AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Unable to process your payment.</AlertTitle>
        <AlertDescription>
          <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

## API 参考

| 组件 | 属性 | 类型 | 默认值 |
|------|------|------|--------|
| Alert | variant | "default" \| "destructive" | "default" |
| AlertTitle | className | string | - |
| AlertDescription | className | string | - |
| AlertAction | className | string | - |

## 变体

- **default**: 标准信息提示样式
- **destructive**: 错误/警告状态
