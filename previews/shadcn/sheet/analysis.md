# Sheet 组件能力分析

## 1. 本地实现 (ArgusX-F)

### 1.1 组件架构

**源文件**: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/sheet/`

| 组件/指令 | 类型 | 描述 |
|-----------|------|------|
| `SheetComponent` | Component | Sheet 根组件，基于 Angular CDK Overlay 实现 |
| `SheetTriggerDirective` | Directive | 触发器，点击打开 sheet |
| `SheetCloseDirective` | Directive | 关闭按钮，点击关闭 sheet |
| `SheetPortalComponent` | Directive | .portal 插槽兼容（占位符） |
| `SheetOverlayComponent` | Component | 自定义遮罩层 |
| `SheetContentComponent` | Component | 内容容器，包含关闭按钮 |
| `SheetHeaderComponent` | Component | 头部容器 |
| `SheetFooterComponent` | Component | 底部容器（可选关闭按钮） |
| `SheetTitleComponent` | Component | 标题（用于 A11y） |
| `SheetDescriptionComponent` | Component | 描述（用于 A11y） |

### 1.2 API

**SheetComponent 输入**:
```typescript
open: Model<boolean>          // 双向绑定打开状态
side: SheetSide = 'right'      // 展开方向: 'top' | 'right' | 'bottom' | 'left'
size: SheetSize = 'default'    // 宽度尺寸: 'default' | 'sm' | 'lg' | 'xl' | 'full'
class: string = ''             // 自定义类名
closeOnBackdropClick: boolean = true   // 点击遮罩关闭
closeOnEscape: boolean = true          // ESC 键关闭
```

**SheetComponent 输出**:
```typescript
openChange: Output<boolean>    // 状态变化事件
```

**SheetComponent 方法**:
```typescript
openSheet(): void              // 打开 sheet
closeSheet(): void             // 关闭 sheet
toggleSheet(): void            // 切换状态
```

### 1.3 可访问性 (A11y)

- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` 指向标题
- `aria-describedby` 指向描述
- 焦点陷阱 (cdkTrapFocus)
- ESC 键关闭
- 点击遮罩关闭

### 1.4 样式与动画

- 使用 Tailwind CSS 工具类
- 动画: `data-[state=open]/data-[state=closed]` + `animate-in`/`animate-out`
- 方向动画: `slide-in-from-*` / `slide-out-to-*`
- 遮罩: `bg-black/80`，支持 `backdrop-blur-xs`

### 1.5 技术实现

- 基于 `@angular/cdk/overlay` 实现
- 使用 Angular Signals (`signal`, `computed`, `model`)
- `ChangeDetectionStrategy.OnPush`
- 依赖 `lucide-angular` 图标库

---

## 2. Shadcn UI 参考

### 2.1 组件结构

Shadcn Sheet 基于 **Radix UI Dialog** 实现，提供以下子组件:

| 组件 | 描述 |
|------|------|
| `Sheet` | 根容器 |
| `SheetTrigger` | 触发器 |
| `SheetContent` | 内容（支持 `side` 属性） |
| `SheetHeader` | 头部 |
| `SheetFooter` | 底部 |
| `SheetTitle` | 标题 |
| `SheetDescription` | 描述 |
| `SheetClose` | 关闭按钮 |

### 2.2 Shadcn API

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
    {/* 内容 */}
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Close</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### 2.3 Shadcn 特性

- 支持 `side` 属性: `top`, `right`, `bottom`, `left`
- 支持 `asChild` 模式（Radix Slot）
- `SheetClose asChild` 允许将关闭行为附加到任意按钮

---

## 3. 能力对比

| 特性 | 本地实现 | Shadcn | 差距分析 |
|------|----------|--------|----------|
| 方向支持 | top/right/bottom/left | top/right/bottom/left | 一致 |
| 尺寸支持 | default/sm/lg/xl/full | 仅 default | **需补充** |
| asChild 模式 | 不支持 | 支持 | **需补充** |
| 自定义遮罩 | SheetOverlayComponent | 内置 | 一致 |
| 焦点陷阱 | CDK cdkTrapFocus | Radix 内置 | 一致 |
| ESC 关闭 | 可配置 | 可配置 | 一致 |
| 遮罩点击关闭 | 可配置 | 可配置 | 一致 |
| 双向绑定 | model() | open prop | 一致 |
| Slot 模式 | .portal | 不适用 | N/A |

---

## 4. 改进建议

### 4.1 高优先级

1. **支持 asChild 模式**
   - 参考 Shadcn 实现，使用 `@angular/cdk/portals` 或 Radix Slot 模式
   - 使 SheetTrigger 和 SheetClose 可以包裹任意元素

2. **增强尺寸控制**
   - 当前 size 属性在 SheetComponent，SheetContent 无法独立设置
   - 考虑在 SheetContent 上添加 size 输入

### 4.2 中优先级

3. **动画优化**
   - 添加更多预设动画曲线
   - 支持自定义动画时长

4. **移动端适配**
   - 移动端默认全宽/全高
   - 添加 `forceMount` 属性控制条件渲染

### 4.3 低优先级

5. **嵌套 Sheet**
   - 当前实现可能不支持多层嵌套
   - 参考 Radix 实现焦点管理策略

---

## 5. 使用示例

### 5.1 基础用法

```html
<app-sheet [open]="isOpen" side="right" (openChange)="isOpen = $event">
  <button appSheetTrigger>Open Sheet</button>
  <app-sheet-content>
    <app-sheet-header>
      <app-sheet-title>标题</app-sheet-title>
      <app-sheet-description>描述内容</app-sheet-description>
    </app-sheet-header>
    <div class="p-4">
      <!-- 内容 -->
    </div>
    <app-sheet-footer>
      <button argusButton appSheetClose>取消</button>
      <button argusButton variant="default">确定</button>
    </app-sheet-footer>
  </app-sheet-content>
</app-sheet>
```

### 5.2 四方向

```html
<!-- 顶部 -->
<app-sheet side="top">...</app-sheet>

<!-- 右侧 -->
<app-sheet side="right">...</app-sheet>

<!-- 底部 -->
<app-sheet side="bottom">...</app-sheet>

<!-- 左侧 -->
<app-sheet side="left">...</app-sheet>
```

---

## 6. 结论

本地 Sheet 组件实现已经相当完善:

- **已完成**: 核心功能（展开方向、动画、A11y、遮罩关闭）
- **待补充**: asChild 模式、更多尺寸选项
- **技术栈**: 使用 Angular CDK + Signals + Tailwind，符合项目规范

建议优先实现 asChild 模式以完全对齐 Shadcn API。
