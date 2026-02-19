# Argusx Card 使用说明

`argusx-card` 是项目内统一卡片组件，基于 zard card 结构实现，并扩展了 `size` 与 `card-action` 插槽能力。

## 1. 引入

在 standalone 组件中导入：

```ts
import { ArgusxCardActionDirective, ArgusxCardComponent } from '../shared/ui/card';
```

根据当前文件位置调整相对路径即可。

## 2. 基础用法

```html
<argusx-card
  class="w-full"
  title="Default Card"
  description="This card uses the default size variant."
>
  <p>Card body content...</p>

  <div card-footer class="w-full">
    <button argusButton variant="outline" class="w-full">Action</button>
  </div>
</argusx-card>
```

## 3. API

### 3.1 导出项（`shared/ui/card/index.ts`）

- `ArgusxCardComponent`
- `ArgusxCardActionDirective`（selector: `[card-action]`）
- `type ArgusxCardSize = 'default' | 'sm' | 'lg'`
- `cardVariants`
- `cardHeaderVariants`
- `cardBodyVariants`
- `cardFooterVariants`

### 3.2 ArgusxCardComponent Inputs

| Input | Type | Default | 说明 |
| --- | --- | --- | --- |
| `class` | `ClassValue` | `''` | 合并到 card 根节点 class。 |
| `size` | `ArgusxCardSize` | `'default'` | 控制整体间距、圆角与内边距。 |
| `title` | `string \| TemplateRef<void> \| undefined` | `undefined` | 标题；支持文本或模板。 |
| `description` | `string \| TemplateRef<void> \| undefined` | `undefined` | 描述；支持文本或模板。 |
| `action` | `string` | `''` | header 右上角默认 action 按钮文本。 |
| `headerBorder` | `boolean` | `false` | 是否给 header 添加 `border-b`（`booleanAttribute`）。 |
| `footerBorder` | `boolean` | `false` | 是否给 footer 添加 `border-t`（`booleanAttribute`）。 |

### 3.3 ArgusxCardComponent Outputs

| Output | Type | 触发时机 |
| --- | --- | --- |
| `actionClick` | `EventEmitter<void>` | 点击内置 `action` 文本按钮时触发。 |

说明：如果投影了 `[card-action]` 插槽，则会隐藏内置 `action` 文本按钮，此时组件不会自动触发 `actionClick`。

默认 `action` 会渲染 header 右上角按钮并触发 `actionClick`：

```html
<argusx-card title="Profile" action="Edit" (actionClick)="onEdit()">
  <p>...</p>
</argusx-card>
```

## 4. 插槽

- 默认插槽：主体内容（`card-content`）
- `[card-footer]`：底部区域
- `[card-action]`：header 右上角自定义操作区（由 `ArgusxCardActionDirective` 标记）

`[card-action]` 优先级高于 `action` 文本按钮（两者同时存在时，只显示插槽内容）。

```html
<argusx-card title="Meeting Notes" description="Transcript from the meeting.">
  <button card-action argusButton variant="outline" size="sm">Transcribe</button>
  <p>...</p>
</argusx-card>
```

## 5. 渲染规则

- 仅当 `title` 存在时渲染 header。
- `description` 依附 header，且仅在 `title` 存在时生效。
- footer 无投影内容时自动隐藏。
- 自动绑定 `aria-labelledby` / `aria-describedby`，并保持稳定 ID。
- 根节点固定 `data-slot="card"`，并同步 `data-size` 为当前 `size`。

## 6. 样式与布局建议

- 图片卡片若希望保留标题上间距，不要给根节点加 `pt-0`。
- 叠加层（overlay）请放在图片的 `relative` 容器内，使用 `absolute inset-0`，避免覆盖范围错位。
