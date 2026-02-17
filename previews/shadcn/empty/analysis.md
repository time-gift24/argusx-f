# Empty Component Capability Analysis

## 1. Component Overview

The `empty` component is a UI pattern used to display placeholder content when no data is available, commonly used in tables, lists, search results, or any content area that requires a "no data" state.

## 2. Local Implementation (ArgusX-F)

**Location:** `src/app/shared/ui/empty/`

### Files
- `index.ts` - Public API exports
- `empty.directive.ts` - Implementation

### Architecture
The local implementation uses **multiple directives** approach instead of a single component:

| Directive | Selector | Purpose |
|-----------|----------|---------|
| `EmptyDirective` | `[appEmpty]` | Root container |
| `EmptyHeaderDirective` | `[appEmptyHeader]` | Header section (title + description) |
| `EmptyMediaDirective` | `[appEmptyMedia]` | Icon/illustration area |
| `EmptyTitleDirective` | `[appEmptyTitle]` | Title text |
| `EmptyDescriptionDirective` | `[appEmptyDescription]` | Description text |
| `EmptyContentDirective` | `[appEmptyContent]` | Action buttons area |

### Features
- **CVA (Class Variance Authority)** for `EmptyMediaDirective` with variants:
  - `default`: Transparent background
  - `icon`: Muted background with rounded square container
- **ARIA support**: `aria-live="polite"` on root for screen reader announcements
- **Data slots**: All elements have `data-slot` attributes for styling hooks
- **Tailwind-based**: Uses Tailwind utility classes with theme variables

### Usage Example
```html
<div appEmpty>
  <div appEmptyMedia>
    <lucide-icon name="inbox"></lucide-icon>
  </div>
  <div appEmptyHeader>
    <div appEmptyTitle>No results found</div>
    <div appEmptyDescription>Try adjusting your search filters</div>
  </div>
  <div appEmptyContent>
    <button argusButton>Clear filters</button>
  </div>
</div>
```

### Styling Classes
- Root: `gap-4 rounded-xl border-dashed p-6 flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance`
- Header: `gap-1 flex max-w-sm flex-col items-center`
- Media: `mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0`
- Title: `text-sm font-medium tracking-tight`
- Description: `text-xs/relaxed text-muted-foreground [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4`
- Content: `gap-2 text-xs/relaxed flex w-full max-w-sm min-w-0 flex-col items-center text-balance`

## 3. ZardUI Implementation

**Location:** `/tmp/zardui/apps/web/public/components/empty/`

### Architecture
ZardUI uses a **single component** approach (`ZardEmptyComponent`):

```typescript
<z-empty
  zIcon="folder-code"
  zTitle="No Projects Yet"
  zDescription="You haven't created any projects yet..."
  [zActions]="[actionPrimary, actionSecondary]"
>
  <!-- Action templates -->
</z-empty>
```

### API Properties

| Property | Type | Description |
|----------|------|-------------|
| `zIcon` | `ZardIcon` | Icon to display |
| `zImage` | `string \| TemplateRef<void>` | Image URL or custom template |
| `zDescription` | `string \| TemplateRef<void>` | Description text or custom template |
| `zTitle` | `string \| TemplateRef<void>` | Title text or custom template |
| `zActions` | `TemplateRef<void>[]` | Array of action templates |
| `class` | `ClassValue` | Custom CSS classes |

### Variants (Size)
- `default`: image `w-40`, svg `w-16 h-10`, description `text-sm`
- `small`: image `w-28`, svg `w-12 h-8`, description `text-xs`

### Demo Types
1. **Default**: Icon + Title + Description + Actions
2. **Custom Image**: Custom image instead of icon
3. **Advanced**: Complex customization
4. **Actions**: Multiple action buttons

## 4. shadcn/ui Reference

**Registry:** `@shadcn/empty` (registry:ui)

shadcn/ui provides a basic Empty component that serves as a visual placeholder. The ArgusX-F implementation aligns with shadcn/ui's pattern using dashed borders and centered content layout.

## 5. Comparison Summary

| Aspect | Local (ArgusX-F) | ZardUI |
|--------|------------------|--------|
| **Pattern** | Multiple Directives | Single Component |
| **Input Type** | Directive selectors | Component props (`zIcon`, `zTitle`, etc.) |
| **Template Support** | Via directives | Via `TemplateRef<void>` |
| **Variants** | Media variant (default/icon) | Size variant (default/small) |
| **Custom Image** | Not built-in | Supported (`zImage`) |
| **Actions** | Via `EmptyContentDirective` | Via `zActions` array |
| **ARIA** | `aria-live="polite"` | Not specified |

## 6. Recommendations for Enhancement

Based on the analysis, the local implementation could benefit from:

1. **Single Component Wrapper**: Consider creating a wrapper component that combines all directives for simpler usage
2. **Image Support**: Add `zImage` prop support similar to ZardUI
3. **Size Variants**: Add size variants (small/default/large)
4. **TemplateRef Support**: Allow content projection for custom layouts
5. **Actions API**: Consider a simpler API for action buttons

## 7. Files Reference

### Local
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/empty/index.ts`
- `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/empty/empty.directive.ts`

### ZardUI
- `/tmp/zardui/apps/web/public/components/empty/demo/default.md`
- `/tmp/zardui/apps/web/public/components/empty/demo/custom-image.md`
- `/tmp/zardui/apps/web/public/components/empty/doc/api.md`
- `/tmp/zardui/apps/web/public/components/empty/doc/overview.md`
- `/tmp/zardui/apps/web/public/components/empty/doc/empty.variants.ts`

### shadcn
- Registry: `@shadcn/empty` (type: registry:ui)
