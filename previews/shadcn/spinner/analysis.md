# Spinner Component Capability Analysis

## Overview

The Spinner component is used to display a loading state, providing visual feedback that an operation is in progress.

## Source Analysis

### Local (argusx-f)

**Location:** `/Users/wanyaozhong/Projects/argusx-f/src/app/shared/ui/spinner/`

**Implementation:** Component-based using Lucide icon

```typescript
@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon
      [img]="loaderIcon"
      role="status"
      aria-label="Loading"
      [class]="computedClass()"
    />
  `,
})
export class SpinnerComponent {
  readonly class = input<string>('');
  readonly size = input<string | number>('size-4');

  protected readonly loaderIcon = Loader2;

  protected readonly computedClass = computed(() =>
    cn('animate-spin', this.size(), this.class())
  );
}
```

**API:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `class` | `input<string>` | `''` | Custom CSS classes |
| `size` | `input<string \| number>` | `'size-4'` | Size of the spinner (e.g., 'size-4', 'size-6', 'size-8') |

**Characteristics:**
- Uses Lucide icon `Loader2` as the spinner graphic
- Applies `animate-spin` Tailwind class for rotation animation
- Supports custom size via Tailwind size classes
- Accessibility: includes `role="status"` and `aria-label="Loading"`
- Component-based pattern
- Simple, lightweight implementation

### Zardui

**Location:** `/tmp/zardui/libs/zard/src/lib/shared/components/loader/`

**Implementation:** Component-based with custom CSS animation

```typescript
@Component({
  selector: 'z-loader',
  standalone: true,
  template: `
    <div class="relative top-1/2 left-1/2 h-[inherit] w-[inherit]">
      @for (_ of bars; track $index) {
        <div
          class="animate-spinner absolute -top-[3.9%] -left-[10%] h-[8%] w-[24%] rounded-md bg-black dark:bg-white"
          [style]="{
            animationDelay: animationDelay($index),
            transform: transform($index),
          }"
        ></div>
      }
    </div>
  `,
  styles: `
    @keyframes spinner {
      0% { opacity: 1; }
      100% { opacity: 0.15; }
    }
    .animate-spinner {
      animation: spinner 1.2s linear infinite;
    }
  `,
})
export class ZardLoaderComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardLoaderVariants['zSize']>('default');

  protected readonly bars = Array.from({ length: 12 });
}
```

**Variants (loader.variants.ts):**
```typescript
export const loaderVariants = cva('', {
  variants: {
    zSize: {
      default: 'size-6',
      sm: 'size-4',
      lg: 'size-8',
    },
  },
});
```

**API:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `[zSize]` | `'default' \| 'sm' \| 'lg'` | `'default'` | Loader size |
| `[class]` | `ClassValue` | `''` | Custom CSS classes |

**Characteristics:**
- Custom CSS keyframe animation (`spinner` with 12 bars)
- Uses 12 animated bars arranged in a circle
- Different animation pattern from simple rotation
- Dark mode support (`bg-black dark:bg-white`)
- CVA (class-variance-authority) for variant management

### Shadcn

**Registry:** `@shadcn/spinner`

**Type:** `registry:ui`

**Dependencies:** class-variance-authority

**Note:** Shadcn spinner is a simple UI component. Based on the registry information, it uses CVA for variant management, similar to other shadcn components. The implementation is React-based and typically wraps a simple SVG or icon with animation.

## Comparison Matrix

| Feature | Local (argusx-f) | Zardui | Shadcn |
|---------|------------------|--------|--------|
| **Type** | Component | Component | Component |
| **Animation** | `animate-spin` (rotation) | Custom 12-bar spinner | (TBD - likely rotation) |
| **Size Options** | Custom via class | 3 variants (sm, default, lg) | Via CVA |
| **Custom Class** | Yes | Yes | Yes |
| **Dark Mode** | Via Tailwind | Built-in | Via Tailwind |
| **Accessibility** | role + aria-label | (TBD) | (TBD) |
| **Implementation** | Lucide icon | Custom CSS + 12 bars | SVG/Icon |
| **Complexity** | Low | Medium | Low |
| **Dependencies** | lucide-angular | class-variance-authority | class-variance-authority |

## Performance

### Local
- Uses `ChangeDetectionStrategy.OnPush` for optimized change detection
- Uses `computed()` for derived class computation
- Uses `input()` modern Angular API
- Lightweight - only wraps a Lucide icon

### Zardui
- Uses `ChangeDetectionStrategy.OnPush`
- Custom CSS animation (not Tailwind utility)
- 12-bar animation requires more DOM elements
- Uses CVA for variant management

### Shadcn
- React component with fine-grained updates
- CVA-driven variant system

## Accessibility

### Local
- Includes `role="status"` for screen readers
- Includes `aria-label="Loading"` for context
- Proper ARIA pattern for status indicators

### Zardui
- No explicit accessibility attributes in code
- Would need `role="status"` and `aria-label` added

### Shadcn
- Standard React ARIA patterns

## Recommendations

### Current State
The local `SpinnerComponent` is well-designed and follows Angular 20+ best practices:
- Uses standalone component pattern
- Leverages Angular Signals (`input`, `computed`)
- Proper accessibility attributes
- Simple and lightweight

### Comparison to Zardui
- Zardui uses a more complex 12-bar spinner animation
- Zardui has pre-defined size variants (sm, default, lg)
- Local implementation is simpler and more flexible (custom size via class)

### Potential Enhancements

1. **Size Variants:** Consider adding pre-defined size variants (sm, md, lg, xl) for convenience
2. **Animation Options:** Support different animation types (spinning vs. pulsing)
3. **Color Variants:** Support different color variants for different contexts
4. **Accessibility:** Ensure consistent ARIA support across all variants

### Usage Example

```html
<!-- Basic spinner -->
<app-spinner />

<!-- Small spinner -->
<app-spinner class="size-4" />

<!-- Large spinner -->
<app-spinner class="size-8" />

<!-- In a button -->
<button>
  <app-spinner class="size-4 mr-2" />
  Loading...
</button>
```

## Conclusion

The local `SpinnerComponent` provides a clean, lightweight solution for loading states. Its implementation is aligned with the project's Angular 20+ standards (Signals, standalone components, OnPush change detection). The use of Lucide icons provides consistent iconography with other UI elements in the project.

Compared to Zardui's 12-bar spinner, the local implementation uses a simpler rotation animation which is more lightweight. However, Zardui offers pre-defined size variants that could be added to the local implementation for convenience.

**Recommendation:** The current implementation is sufficient for most use cases. Consider adding pre-defined size variant support if desired for API consistency with Zardui.
