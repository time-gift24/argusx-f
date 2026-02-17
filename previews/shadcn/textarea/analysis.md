# Textarea 组件能力分析报告

## 1. 本地实现 (ArgusX-F)

### 文件位置
- 入口: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/textarea/index.ts`
- 组件: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/textarea/textarea.component.ts`

### 技术实现
- **架构**: Standalone Component
- **变更检测**: OnPush
- **状态管理**: Angular Signals + model()

### 支持的 Props (Inputs)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `placeholder` | `string` | `''` | 占位符文本 |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `readonly` | `boolean` | `false` | 只读状态 |
| `required` | `boolean` | `false` | 必填标识 |
| `value` | `model<string>` | `''` | 双向绑定值 |
| `rows` | `number \| undefined` | `undefined` | 行数 |
| `cols` | `number \| undefined` | `undefined` | 列数 |
| `ariaInvalid` | `boolean \| string \| undefined` | `undefined` | 无效状态 ARIA |
| `ariaDescribedby` | `string \| undefined` | `undefined` | 描述元素 ID |
| `status` | `'default' \| 'error' \| 'warning' \| 'success'` | `'default'` | 状态样式 |
| `class` | `string` | `''` | 自定义类名 |

### 样式特性
- 使用 Tailwind CSS 工具类
- 支持 `field-sizing-content` 自动高度
- 状态样式:
  - `default`: 默认边框
  - `error`: 红色边框 (`border-destructive`)
  - `warning`: 黄色边框
  - `success`: 绿色边框
- 支持禁用状态的 `cursor-not-allowed` 和透明度

### 可访问性
- `data-slot="textarea"` 标识
- `aria-invalid` 属性绑定
- `aria-describedby` 属性支持

---

## 2. Zardui 实现

### 文件位置
- Input 指令: `/tmp/zardui/libs/zard/src/lib/shared/components/input/input.directive.ts`
- Demo: `/tmp/zardui/apps/web/public/components/input/demo/text-area.md`

### 技术实现
- **架构**: Directive (`z-input`)
- textarea 通过在原生 `<textarea>` 元素上添加 `z-input` 属性来应用样式

### 支持的 Props (Directive Inputs)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zSize` | `'default' \| 'sm' \| 'lg'` | `'default'` | 尺寸 |
| `zStatus` | `'error' \| 'warning' \| 'success' \| null` | `null` | 状态 |
| `zBorderless` | `boolean` | `false` | 无边框 |

### 特点
- 不是独立组件，而是指令式实现
- 直接透传原生 textarea 的所有属性 (rows, cols, placeholder 等)
- 样式通过指令附加

---

## 3. Shadcn 实现

### 类型
- Registry: `registry:ui`
- 实际只是一个带有样式的原生 textarea 包装器

### 特点
- 极简实现，主要提供一致的样式
- 使用 Tailwind 类名
- 作为一个 UI 组件在 shadcn/ui registry 中管理

---

## 4. 能力对比

| 特性 | ArgusX-F | Zardui | Shadcn |
|------|----------|--------|--------|
| 独立组件 | Yes | No (Directive) | Yes |
| 双向绑定 (model) | Yes | No | No |
| 状态管理 | Yes (error/warning/success) | Yes | No |
| 自动高度 | Yes (field-sizing) | No | No |
| 尺寸变体 | No | Yes (sm/lg) | No |
| 无边框样式 | No | Yes | No |
| 可访问性 ARIA | Yes | No | No |

---

## 5. 建议与改进

### 本地实现的优势
1. **完整的功能组件**: 独立组件，易于使用
2. **双向绑定**: 使用 Angular model() 实现双向绑定
3. **状态管理**: 内置状态样式支持
4. **自动高度**: `field-sizing-content` 支持
5. **可访问性**: 完整的 ARIA 支持

### 可考虑的增强
1. **尺寸变体**: 添加 `size` 输入 (对应 Zardui 的 sm/lg)
2. **无边框样式**: 添加 `borderless` 输入
3. **字符计数**: 添加 `maxlength` 和字符计数显示
4. **自动resize**: 暴露 resize 属性控制
5. **字数统计**: 添加可选的字数显示

---

## 6. 使用示例

### ArgusX-F
```typescript
// 基础使用
<app-textarea
  placeholder="请输入内容..."
  [(value)]="content"
  [rows]="4"
></app-textarea>

// 带状态
<app-textarea
  placeholder="错误示例"
  status="error"
  ariaInvalid="true"
></app-textarea>

// 自动高度
<app-textarea
  placeholder="自动增长的文本框"
  class="field-sizing-content"
></app-textarea>
```

### Zardui
```html
<textarea z-input rows="8" cols="12" placeholder="Default"></textarea>
<textarea zBorderless z-input rows="8" cols="12" placeholder="Borderless"></textarea>
```

---

## 总结

本地 ArgusX-F 的 textarea 组件是一个功能完整、现代化的实现:

- 使用 Angular 20 最佳实践 (Signals, model(), OnPush)
- 支持多种状态样式
- 良好的可访问性支持
- 与 Zardui 相比，本地实现更加完整 (独立组件 + 双向绑定 + ARIA)
- 与 Shadcn 相比，功能更加丰富

Zardui 采用指令式设计，更轻量但功能较少。Shadcn 则是极简的样式包装。
