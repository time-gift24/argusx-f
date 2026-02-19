# Argusx Breadcrumb 使用说明

`argusx-breadcrumb` 是基于 shadcn 结构对齐的面包屑组件族，支持 `argusx-*` 组件选择器与语义 attribute 选择器双写法。

## 1. 引入

在 standalone 组件中导入：

```ts
import { ArgusxBreadcrumbComponents } from '@app/shared/ui/breadcrumb';
```

若需单独导入类型或变体函数，也可按需从同一路径引入。

## 2. 基础用法

```html
<argusx-breadcrumb size="md">
  <argusx-breadcrumb-list align="start" wrap="wrap">
    <argusx-breadcrumb-item>
      <a argusxBreadcrumbLink href="#">Home</a>
    </argusx-breadcrumb-item>
    <argusx-breadcrumb-separator />
    <argusx-breadcrumb-item>
      <argusx-breadcrumb-page>Breadcrumb</argusx-breadcrumb-page>
    </argusx-breadcrumb-item>
  </argusx-breadcrumb-list>
</argusx-breadcrumb>
```

## 3. API

### 3.1 选择器

- `argusx-breadcrumb, nav[argusxBreadcrumb]`
- `argusx-breadcrumb-list, ol[argusxBreadcrumbList]`
- `argusx-breadcrumb-item, li[argusxBreadcrumbItem]`
- `argusx-breadcrumb-link, a[argusxBreadcrumbLink]`
- `argusx-breadcrumb-page, span[argusxBreadcrumbPage]`
- `argusx-breadcrumb-separator, li[argusxBreadcrumbSeparator]`
- `argusx-breadcrumb-ellipsis, span[argusxBreadcrumbEllipsis]`

### 3.2 Inputs

| 组件 | Input | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `ArgusxBreadcrumbComponent` | `class` | `string` | `''` | 根节点 class 合并。 |
| `ArgusxBreadcrumbComponent` | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 控制字号。 |
| `ArgusxBreadcrumbListComponent` | `class` | `string` | `''` | 列表 class 合并。 |
| `ArgusxBreadcrumbListComponent` | `align` | `'start' \| 'center' \| 'end'` | `'start'` | 主轴对齐。 |
| `ArgusxBreadcrumbListComponent` | `wrap` | `'wrap' \| 'nowrap'` | `'wrap'` | 控制换行。 |
| `ArgusxBreadcrumbItemComponent` | `class` | `string` | `''` | 条目 class 合并。 |
| `ArgusxBreadcrumbLinkComponent` | `class` | `string` | `''` | 链接 class 合并。 |
| `ArgusxBreadcrumbPageComponent` | `class` | `string` | `''` | 当前页 class 合并。 |
| `ArgusxBreadcrumbSeparatorComponent` | `class` | `string` | `''` | 分隔符 class 合并。 |
| `ArgusxBreadcrumbEllipsisComponent` | `class` | `string` | `''` | 省略符 class 合并。 |
| `ArgusxBreadcrumbEllipsisComponent` | `ellipsisColor` | `'muted' \| 'strong'` | `'muted'` | 省略符颜色强度。 |

### 3.3 分隔符规则

- 不提供根级 `separator` 输入。
- 使用显式 `<argusx-breadcrumb-separator>` 放置分隔符。
- separator 内有投影内容时，使用投影内容；无内容时回退默认 ChevronRight 图标。

## 4. 可访问性与 data-slot

- Root: `aria-label="breadcrumb"`，`data-slot="breadcrumb"`。
- List/Item/Link/Page/Separator/Ellipsis 对应 `data-slot`：
  - `breadcrumb-list`
  - `breadcrumb-item`
  - `breadcrumb-link`
  - `breadcrumb-page`
  - `breadcrumb-separator`
  - `breadcrumb-ellipsis`
- `BreadcrumbPage`: `role="link" aria-disabled="true" aria-current="page"`。
- `BreadcrumbSeparator` / `BreadcrumbEllipsis`: `role="presentation" aria-hidden="true"`。

## 5. 语义写法示例

```html
<nav argusxBreadcrumb>
  <ol argusxBreadcrumbList>
    <li argusxBreadcrumbItem><a argusxBreadcrumbLink href="#">Home</a></li>
    <li argusxBreadcrumbSeparator>/</li>
    <li argusxBreadcrumbItem><span argusxBreadcrumbPage>Products</span></li>
  </ol>
</nav>
```
