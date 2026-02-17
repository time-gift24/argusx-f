# Input OTP 组件能力分析

## 1. 组件概述

**组件名称**: InputOTP (One-Time Password)

**用途**: 用于接收一次性验证码输入，支持分组、自动完成、粘贴复制、键盘导航等特性。

**源码位置**: `src/app/shared/ui/input-otp/input-otp.component.ts`

**依赖**: 基于 [input-otp](https://github.com/guilhermerodz/input-otp) 库构建

---

## 2. 本地实现分析

### 2.1 组件结构

本地实现包含 4 个组件:

| 组件 | 选择器 | 用途 |
|------|--------|------|
| `InputOtpComponent` | `app-input-otp` | 主容器，处理输入逻辑 |
| `InputOtpGroupComponent` | `app-input-otp-group` | 分组容器，用于布局 |
| `InputOtpSlotComponent` | `app-input-otp-slot` | 单个字符槽位 |
| `InputOtpSeparatorComponent` | `app-input-otp-separator` | 分组分隔符 |

### 2.2 主组件 API

#### Inputs

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `model<string>` | `''` | 双向绑定值 |
| `length` | `input<number>` | `6` | OTP 长度 |
| `pattern` | `input<string \| RegExp \| null>` | `null` | 验证正则 |
| `placeholder` | `input<string>` | `''` | 占位符 |
| `inputMode` | `input<'numeric' \| 'text' \| 'tel'>` | `'numeric'` | 输入模式 |
| `textAlign` | `input<'left' \| 'center' \| 'right'>` | `'left'` | 文本对齐 |
| `autoComplete` | `input<string>` | `'one-time-code'` | 自动完成 |
| `disabled` | `input<boolean>` | `false` | 禁用状态 |
| `containerClass` | `input<string>` | `''` | 容器类名 |
| `ariaDescribedby` | `input<string>` | `''` | ARIA 描述 |
| `ariaInvalidInput` | `input<boolean \| 'false' \| 'true'>` | `'false'` | 无效状态 |

#### Outputs

| 事件 | 类型 | 说明 |
|------|------|------|
| `complete` | `output<string>` | OTP 填写完成时触发 |

#### 方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `focus()` | - | 聚焦输入框 |
| `blur()` | - | 取消聚焦 |
| `getSlotStates()` | - | 获取槽位状态数组 |

### 2.3 内置常量

```typescript
export const REGEXP_ONLY_DIGITS = '^\\d+$';
export const REGEXP_ONLY_CHARS = '^[a-zA-Z]+$';
export const REGEXP_ONLY_DIGITS_AND_CHARS = '^[a-zA-Z0-9]+$';
```

### 2.4 核心特性

- **双向绑定**: 使用 Angular Signals `model()` 实现
- **输入验证**: 支持正则表达式模式验证
- **粘贴支持**: 完整支持粘贴整段验证码
- **自动完成**: 使用 `one-time-code` 自动填充
- **假光标**: 实现自定义闪烁光标效果
- **无障碍**: 完整的 ARIA 支持

---

## 3. Shadcn/ui 对比

### 3.1 Shadcn API

```tsx
// Shadcn 用法
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    ...
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    ...
  </InputOTPGroup>
</InputOTP>
```

### 3.2 差异对比

| 特性 | 本地实现 | Shadcn/ui |
|------|----------|------------|
| 双向绑定 | `[(ngModel)]` / `value` model | `value` + `onChange` |
| 分组 | `app-input-otp-group` | `InputOTPGroup` |
| 槽位 | `app-input-otp-slot` + index | `InputOTPSlot` + index |
| 分隔符 | `app-input-otp-separator` | `InputOTPSeparator` |
| 正则验证 | `pattern` input | `pattern` prop |
| 禁用 | `disabled` input | `disabled` prop |
| RTL | 支持 | 支持 |

---

## 4. 功能矩阵

| 功能 | 状态 | 说明 |
|------|------|------|
| 基础输入 | ✅ | 逐字符输入 |
| 粘贴填充 | ✅ | 支持粘贴整段 |
| 长度配置 | ✅ | `length` input |
| 数字模式 | ✅ | `REGEXP_ONLY_DIGITS` |
| 字母模式 | ✅ | `REGEXP_ONLY_CHARS` |
| 混合模式 | ✅ | `REGEXP_ONLY_DIGITS_AND_CHARS` |
| 自定义正则 | ✅ | 支持 string/RegExp |
| 分组显示 | ✅ | 3-3, 2-2-2 等布局 |
| 分隔符 | ✅ | `-` 分隔符 |
| 禁用状态 | ✅ | `disabled` input |
| 自动完成 | ✅ | `one-time-code` |
| 键盘导航 | ✅ | 自动跳转下一个空位 |
| RTL 支持 | ✅ | 需设置 `dir="rtl"` |
| 表单集成 | ⚠️ | 需自行集成 ReactiveForms |

---

## 5. 使用示例

### 5.1 基础用法

```html
<app-input-otp
  [(ngModel)]="otp"
  [length]="6"
  (complete)="onOtpComplete($event)"
/>
```

### 5.2 分组用法

```html
<app-input-otp [(ngModel)]="otp" [length]="6">
  <app-input-otp-group>
    @for (i of [0,1,2]; track i) {
      <app-input-otp-slot [index]="i" />
    }
  </app-input-otp-group>
  <app-input-otp-separator />
  <app-input-otp-group>
    @for (i of [3,4,5]; track i) {
      <app-input-otp-slot [index]="i" />
    }
  </app-input-otp-group>
</app-input-otp>
```

### 5.3 仅数字模式

```html
<app-input-otp
  [(ngModel)]="otp"
  [length]="4"
  [pattern]="REGEXP_ONLY_DIGITS"
/>
```

---

## 6. 评估结论

### 6.1 能力完整性: 高

本地实现完整覆盖了 input-otp 库的核心功能，包括:
- 基础输入与粘贴
- 正则验证
- 分组显示
- 假光标动画
- 无障碍支持

### 6.2 Angular 适配度: 高

- 使用 Standalone 组件
- 使用 Signals (`model`, `computed`, `effect`)
- 使用 `input()` / `output()` API
- 使用 OnPush 变更检测
- 使用原生控制流 `@if` / `@for`

### 6.3 待改进项

1. **表单集成**: 当前无 ReactiveForms 集成，需手动绑定
2. **事件完整度**: 缺少 `change` 事件暴露
3. **Shadcn 命名对齐**: 组件名为 `app-*` 前缀，可考虑兼容原名

### 6.4 建议

- 当前实现可满足大部分 OTP 输入场景
- 如需完整表单验证，建议封装 `ControlValueAccessor`
- 可考虑导出 `InputOtp` 别名以兼容 shadcn 用法
