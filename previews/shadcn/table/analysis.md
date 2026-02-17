# Table 组件能力分析报告

## 1. 本地实现 (argusx-f)

### 组件路径
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/table/`

### 实现方式
使用 **Directive（指令）** 模式实现，提供 9 个指令：

| 指令 | Selector | 功能 |
|------|----------|------|
| `TableContainerDirective` | `[appTableContainer]` | 表格容器，处理 overflow |
| `TableDirective` | `table[appTable]` | 表格主容器样式 |
| `TableHeaderDirective` | `thead[appTableHeader]` | 表头样式 |
| `TableBodyDirective` | `tbody[appTableBody]` | 表格body样式 |
| `TableFooterDirective` | `tfoot[appTableFooter]` | 表尾样式，带背景色 |
| `TableRowDirective` | `tr[appTableRow]` | 行样式，支持hover和selected状态 |
| `TableHeadDirective` | `th[appTableHead]` | 表头单元格样式 |
| `TableCellDirective` | `td[appTableCell]` | 数据单元格样式 |
| `TableCaptionDirective` | `caption[appTableCaption]` | 标题样式 |

### 特性
- 所有指令支持 `class` 输入，可自定义样式
- 每个指令都有 `data-slot` 属性用于样式 targeting
- 使用 `computed()` 和 `cn()` 工具函数组合样式类
- 行支持 `hover:bg-muted/50` 和 `data-[state=selected]:bg-muted` 状态
- 单元格自动处理 checkbox 场景的 padding

### 优势
- 指令模式，无需导入多个组件
- 与原生 HTML table 语义完全一致
- 轻量级，无额外运行时开销

### 不足
- 无内置排序、分页、筛选功能
- 无内置列宽控制
- 无数据绑定能力，纯样式指令

---

## 2. Zardui 实现

### 组件路径
- `/tmp/zardui/apps/web/public/components/table/`

### 实现方式
提供 **单一主指令** + **可选子组件** 两种使用模式：

#### 主指令 `[z-table]`
```html
<table z-table [zType]="'default|striped|bordered'" [zSize]="'default|compact|comfortable'">
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zType` | `default \| striped \| bordered` | `default` | 表格变体 |
| `zSize` | `default \| compact \| comfortable` | `default` | 表格尺寸 |

#### 子组件（可选）
- `z-table-header` - thead
- `z-table-body` - tbody
- `z-table-row` - tr
- `z-table-head` - th
- `z-table-cell` - td
- `z-table-caption` - caption

### Demo 示例
1. **Simple Demo** - 基础表格展示，带 caption
2. **Payments Demo** - 完整业务示例，包含：
   - Badge 状态展示
   - Button 操作列
   - Icon 图标
   - Empty 状态处理 (`@empty`)
   - 格式化函数 (currency)
   - 事件处理

### 优势
- 单一指令即可自动样式化所有子元素
- 支持多种变体 (striped, bordered)
- 支持多种尺寸 (compact, comfortable)
- 与 zardui 生态其他组件无缝集成

---

## 3. Shadcn/ui 实现

### 文档
- https://ui.shadcn.com/docs/components/base/table

### 安装
```bash
pnpm dlx shadcn@latest add table
```

### 导入
```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

### 组件列表
| 组件 | 说明 |
|------|------|
| `Table` | 主容器 |
| `TableCaption` | 表格标题 |
| `TableHeader` | 表头容器 |
| `TableBody` | 表格 body |
| `TableRow` | 行 |
| `TableHead` | 表头单元格 |
| `TableCell` | 数据单元格 |
| `TableFooter` | 表尾（可选） |

### 特性
- 响应式设计
- 支持 RTL (right-to-left)
- 可与 `@tanstack/react-table` 集成实现高级功能（排序、筛选、分页）
- 支持每行操作（配合 DropdownMenu）

### 优势
- 完整的组件库体系
- 生态完善，集成 tanstack table 文档
- 社区活跃，文档详尽

### 不足
- React 专属
- 需要导入多个组件

---

## 4. 能力对比矩阵

| 能力 | argusx-f (Directive) | Zardui | Shadcn/ui |
|------|---------------------|--------|-----------|
| 样式化能力 | 基础 | 基础+变体 | 基础 |
| 表格变体 | 无 | striped/bordered | 无 |
| 尺寸控制 | 无 | compact/comfortable/default | 无 |
| 排序 | 无 | 无 | 需集成 tanstack |
| 分页 | 无 | 无 | 需集成 tanstack |
| 筛选 | 无 | 无 | 需集成 tanstack |
| 空状态 | 无 | 支持 (@empty) | 无 |
| 表尾 | 支持 | 支持 | 支持 |
| Hover 状态 | 支持 | 支持 | 支持 |
| Selected 状态 | 支持 | 支持 | 无内置 |
| 自定义 class | 支持 | 支持 | 支持 |

---

## 5. 结论与建议

### 当前 argusx-f 实现评估
- 纯指令样式方案，轻量且符合 Angular 最佳实践
- 与 Zardui 思路类似，但缺少变体和尺寸控制
- 无内置数据处理能力（排序/分页/筛选），需要业务层自行实现

### 建议增强方向
1. **增加变体支持** - 参考 Zardui 添加 `striped`、`bordered` 变体
2. **增加尺寸支持** - 参考 Zardui 添加 `compact`、`comfortable` 尺寸
3. **空状态组件** - 提供 `<ng-template #empty>` 插槽支持
4. **响应式能力** - 参考 shadcn 添加移动端适配
5. **集成方案** - 如需高级功能，可参考 shadcn 集成 `@tanstack/table` 的方式为 Angular 提供数据表格能力

### 最终建议
当前 directive 实现已满足基础表格样式需求，建议保持现状。如需更丰富的表格能力，可：
- 短期：增强 directive 变体和尺寸
- 长期：考虑封装 Angular 数据表格组件，参考 shadcn + tanstack 模式
