import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with ArgusX plain style
const toggleVariants = cva(
  "hover:text-foreground aria-pressed:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=on]:bg-muted gap-1 rounded-md text-xs font-medium transition-all [&_svg:not([class*='size-'])]:size-3.5 group/toggle hover:bg-muted inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        plain: 'bg-transparent',
        outline: 'border-input hover:bg-muted border bg-transparent',
      },
      size: {
        sm: "h-6 min-w-6 rounded-[min(var(--radius-md),8px)] px-1.5 text-[0.625rem] [&_svg:not([class*='size-'])]:size-3",
        md: "h-7 min-w-7 px-2",
        lg: "h-8 min-w-8 px-2",
      },
    },
    defaultVariants: {
      variant: 'plain',
      size: 'md',
    },
  }
);

type ToggleVariants = VariantProps<typeof toggleVariants>;

export type ToggleVariant = NonNullable<ToggleVariants['variant']>;
export type ToggleSize = NonNullable<ToggleVariants['size']>;

/**
 * Directive that applies toggle button styles to any element.
 * Use on <button> elements with aria-pressed attribute for accessibility.
 *
 * @example
 * ```html
 * <button
 *   appToggle
 *   variant="outline"
 *   size="sm"
 *   [attr.aria-pressed]="isPressed() ? 'true' : 'false'"
 *   (click)="toggle()">
 *   Toggle Me
 * </button>
 * ```
 */
@Directive({
  selector: 'button[appToggle]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"toggle"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class ToggleDirective {
  readonly variant = input<ToggleVariant>('plain');
  readonly size = input<ToggleSize>('md');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(toggleVariants({ variant: this.variant(), size: this.size() }), this.class())
  );
}

// Export toggleVariants for external use
export { toggleVariants };
