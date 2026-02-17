# Pagination Component Capability Analysis

## Overview

This document analyzes the pagination component from three sources:
- **Local (argusx-f)**: `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/pagination/`
- **Zardui**: `/tmp/zardui/apps/web/public/components/pagination/`
- **shadcn/ui**: Based on Radix UI primitives

---

## 1. Local Implementation (argusx-f)

### Architecture
Modular component-based approach with separate sub-components:

| Component | Selector | Purpose |
|-----------|----------|---------|
| `PaginationComponent` | `app-pagination` | Main container with `mx-auto flex w-full justify-center` |
| `PaginationContentComponent` | `app-pagination-content` | `<ul>` wrapper with `flex items-center gap-0.5` |
| `PaginationItemComponent` | `app-pagination-item` | `<li>` wrapper |
| `PaginationLinkComponent` | `app-pagination-link` | Individual page number button |
| `PaginationPreviousComponent` | `app-pagination-previous` | Previous page button with chevron-left |
| `PaginationNextComponent` | `app-pagination-next` | Next page button with chevron-right |
| `PaginationEllipsisComponent` | `app-pagination-ellipsis` | Ellipsis indicator |

### API

**PaginationLinkComponent**
```typescript
// Inputs
readonly page = input.required<number>();
readonly isActive = input<boolean>(false);
readonly size = input<'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-xs' | 'icon-lg'>('icon');
readonly class = input<string>('');

// Outputs
readonly pageChange = output<number>();
```

**PaginationPreviousComponent / PaginationNextComponent**
```typescript
readonly text = input<string>('Previous' | 'Next');
readonly class = input<string>('');
readonly pageChange = output<number>();  // Emits 0 for previous, 1 for next
```

**PaginationEllipsisComponent**
```typescript
readonly class = input<string>('');
```

### Characteristics
- **No built-in page calculation**: Consumer must calculate pages manually
- **Flexible styling**: Uses ButtonDirective with variant/size options
- **Accessibility**: Includes `aria-label`, `role="navigation"`, `aria-current="page"` for active
- **Icons**: Lucide icons (ChevronLeft, ChevronRight, MoreHorizontal)
- **Responsive**: Previous/Next text hidden on small screens (`hidden sm:block`)

---

## 2. Zardui Implementation

### Architecture
Two-layer approach:
1. **Main wrapper component** (`z-pagination`) - handles state and rendering
2. **Sub-components** - for custom content

### API

**z-pagination (Main Component)**
```typescript
// Inputs
[zAriaLabel]: string = 'Pagination'
[zContent]: TemplateRef<void> | undefined
[zDisabled]: boolean = false
[zPageIndex]: number = 1  // Two-way binding
[zSize]: 'default' | 'sm' | 'lg' = 'default'
[zTotal]: number = 1

// Outputs
(zPageIndexChange): number
```

**z-pagination-content**
```typescript
[class]: string = ''
```

**z-pagination-button**
```typescript
[class]: string = ''
[zActive]: boolean = false
[zDisabled]: boolean = false
[zSize]: 'default' | 'sm' | 'lg' = 'default'
```

**z-pagination-previous / z-pagination-next**
```typescript
[class]: string = ''
[zDisabled]: boolean = false
[zSize]: 'default' | 'sm' | 'lg' = 'default'
```

**z-pagination-ellipsis**
```typescript
[class]: string = ''
```

### Characteristics
- **Built-in page generation**: Handles `zTotal` and `zPageIndex` automatically
- **Two-way binding**: `[(zPageIndex)]` for seamless state management
- **Custom content**: Supports `[zContent]` TemplateRef for full customization
- **Disabled states**: Built-in `[zDisabled]` for disabling buttons
- **Simplified API**: Can use standalone or with custom template

---

## 3. shadcn/ui Implementation

### Architecture
Pure CSS/layout component (no JavaScript logic), based on Radix UI primitives.

### Structure
```html
<nav role="navigation" aria-label="pagination">
  <ul data-slot="pagination-content">
    <li data-slot="pagination-item">
      <a data-slot="pagination-link">Previous</a>
    </li>
    <li><a>1</a></li>
    <li><span data-slot="pagination-ellipsis">...</span></li>
    <li><a>Next</a></li>
  </ul>
</nav>
```

### Variants
1. **Basic**: Previous/Next + page numbers + ellipsis
2. **Simple**: Just page numbers (1-5)
3. **With Select**: Includes dropdown for "rows per page"

### Data Attributes
| Attribute | Values |
|-----------|--------|
| `data-slot` | `pagination-content`, `pagination-item`, `pagination-link`, `pagination-ellipsis` |
| `data-variant` | `ghost`, `outline` |
| `data-size` | `default`, `icon` |
| `data-active` | `true` / `false` |

### Characteristics
- **No JavaScript logic**: Pure UI component
- **Headless**: No built-in state management
- **Flexible**: Consumer implements all pagination logic
- **Accessible**: Proper ARIA labels (`Go to previous page`, `Go to next page`, `More pages`)

---

## Comparison Matrix

| Feature | argusx-f | Zardui | shadcn |
|---------|----------|--------|--------|
| **Page state management** | Manual | Built-in | None |
| **Two-way binding** | No | Yes (`zPageIndex`) | No |
| **Auto page calculation** | No | Yes | No |
| **Custom content template** | Via ng-content | Yes (`zContent`) | Manual |
| **Disabled states** | Via ButtonDirective | Built-in | Manual |
| **Ellipsis logic** | Manual | Built-in | Manual |
| **Size variants** | 7 sizes | 3 sizes | 2 sizes |
| **Component count** | 7 | 6 | 1 (structure) |
| **Architecture** | Composite | Composite + Wrapper | Pure Layout |

---

## Recommendations

### For argusx-f Enhancement

1. **Add page calculation logic**
   - Consider adding a wrapper component similar to `z-pagination` that handles:
     - Total pages calculation
     - Current page state
     - Ellipsis logic (show 1, 2, ..., 10)

2. **Improve two-way binding**
   - Add support for `[(page)]` two-way binding similar to Zardui

3. **Add disabled state handling**
   - Add `[disabled]` input to `PaginationPreviousComponent` and `PaginationNextComponent`
   - Auto-disable "Previous" on first page, "Next" on last page

4. **Size alignment**
   - Reduce size variants from 7 to 3 to match Zardui/shadcn
   - Keep: `'default'`, `'sm'`, `'icon'`

### Code Example: Suggested Enhancement

```typescript
// New: PaginationWrapperComponent
@Component({
  selector: 'app-pagination-wrapper',
  template: `
    <app-pagination>
      <app-pagination-content>
        <app-pagination-item>
          <app-pagination-previous
            [disabled]="currentPage() === 1"
            (pageChange)="goToPrevious()"
          />
        </app-pagination-item>

        @for (page of visiblePages(); track page) {
          <app-pagination-item>
            <app-pagination-link
              [page]="page"
              [isActive]="page === currentPage()"
              (pageChange)="goToPage(page)"
            >
              {{ page }}
            </app-pagination-link>
          </app-pagination-item>
        }

        @if (showEllipsis()) {
          <app-pagination-item>
            <app-pagination-ellipsis />
          </app-pagination-item>
        }

        <app-pagination-item>
          <app-pagination-next
            [disabled]="currentPage() === total()"
            (pageChange)="goToNext()"
          />
        </app-pagination-item>
      </app-pagination-content>
    </app-pagination>
  `
})
export class PaginationWrapperComponent {
  readonly total = input.required<number>();
  readonly page = input(1);
  readonly pageChange = output<number>();

  // Computed visible pages with ellipsis logic...
}
```

---

## Conclusion

The current argusx-f pagination implementation provides a solid foundation of reusable UI components but lacks the smart pagination logic found in Zardui. The implementation aligns well with shadcn's headless approach, requiring consumers to handle state management.

**Recommended enhancement**: Create a wrapper component that combines the existing modular pieces with built-in page state management, similar to Zardui's approach. This would provide the best of both worlds - flexible sub-components for custom use cases, and a convenient wrapper for common pagination scenarios.
