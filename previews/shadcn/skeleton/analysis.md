# Skeleton Component Capability Analysis

## Overview

The Skeleton component is used to display a placeholder while content is loading, providing a better user experience by indicating that data is being fetched.

## Source Analysis

### Local (argusx-f)

**Location:** `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/skeleton/`

**Implementation:** Directive-based approach

```typescript
// skeleton.directive.ts
@Directive({
  selector: '[appSkeleton]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"skeleton"',
  },
})
export class SkeletonDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-muted rounded-md animate-pulse', this.class())
  );
}
```

**API:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `class` | `input<string>` | `''` | Custom CSS classes |
| `appSkeleton` | Directive selector | - | Apply to any element |

**Characteristics:**
- Directive pattern (attribute selector) - can be applied to any element
- Uses Tailwind classes: `bg-muted`, `rounded-md`, `animate-pulse`
- Supports custom class input for styling flexibility
- Sets `data-slot="skeleton"` for styling hooks
- Simple, lightweight implementation

### Zardui

**Location:** `/tmp/zardui/apps/web/public/components/skeleton/`

**Implementation:** Component-based approach (`z-skeleton`)

```typescript
@Component({
  selector: 'z-skeleton',
  // Component implementation details
})
export class ZardSkeletonComponent {
  @Input() class: string = '';
}
```

**API:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `[class]` | `string` | `''` | Custom CSS classes |

**Demo Examples:**

1. **Default Demo:** Circular avatar skeleton with text lines
   ```html
   <div class="flex items-center space-x-4">
     <z-skeleton class="h-12 w-12 rounded-full" />
     <div class="space-y-2">
       <z-skeleton class="h-4 w-[250px]" />
       <z-skeleton class="h-4 w-[200px]" />
     </div>
   </div>
   ```

2. **Card Demo:** Card placeholder with image area
   ```html
   <div class="flex flex-col space-y-3">
     <z-skeleton class="rounded-xll h-[125px] w-[250px]" />
     <div class="space-y-2">
       <z-skeleton class="h-4 w-[250px]" />
       <z-skeleton class="h-4 w-[200px]" />
     </div>
   </div>
   ```

### Shadcn

**Registry:** `@shadcn/skeleton`

**Add Command:**
```bash
npx shadcn@latest add @shadcn/skeleton
```

**Type:** `registry:ui`

**Note:** Shadcn skeleton is a simple UI component. More details can be retrieved by running the add command to see the implementation.

## Comparison Matrix

| Feature | Local (argusx-f) | Zardui | Shadcn |
|---------|------------------|--------|--------|
| **Type** | Directive | Component | Component |
| **Custom Class Input** | Yes | Yes | Yes |
| **Animation** | `animate-pulse` | `animate-pulse` | (TBD) |
| **Base Styling** | `bg-muted rounded-md` | (TBD) | (TBD) |
| **Data Slot Attr** | Yes | (TBD) | (TBD) |
| **Complexity** | Low | Low | Low |

## Recommendations

### Current State
The local implementation (`SkeletonDirective`) is well-designed and follows Angular best practices:
- Uses standalone directive pattern
- Leverages Angular Signals (`input`, `computed`)
- Applies Tailwind utility classes (`bg-muted`, `animate-pulse`)
- Minimal and focused on single responsibility

### Potential Enhancements

1. **Variant Support:** Consider adding variants (e.g., `text`, `circular`, `rectangular`)
2. **Animation Options:** Support different animation types beyond `animate-pulse`
3. **Shadcn Compatibility:** If shadcn skeleton provides additional features, consider aligning API

### Usage Example

```html
<!-- Basic skeleton -->
<div appSkeleton class="h-4 w-20"></div>

<!-- Circular avatar skeleton -->
<div appSkeleton class="h-12 w-12 rounded-full"></div>

<!-- Card skeleton -->
<div appSkeleton class="h-[125px] w-[250px] rounded-xl"></div>
```

## Conclusion

The local `SkeletonDirective` provides a flexible, lightweight solution for skeleton loading states. Its directive-based approach allows it to be applied to any element, making it more versatile than component-based alternatives. The implementation is aligned with the project's Angular 20+ standards (Signals, standalone directives).
