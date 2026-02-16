import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/input.tsx)
const inputVariants = cva(
  'bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors file:h-6 file:text-xs/relaxed file:font-medium focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {},
    defaultVariants: {},
  }
);

type InputVariants = VariantProps<typeof inputVariants>;

/**
 * Directive that applies input styles to an input element.
 * Use on <input> elements to provide consistent styling for form inputs.
 *
 * @example
 * ```html
 * <input appInput type="text" placeholder="Enter your email" />
 * <input appInput type="password" aria-invalid="true" />
 * <input appInput type="file" />
 * ```
 */
@Directive({
  selector: 'input[appInput]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"input"',
    '[type]': 'type()',
  },
})
export class InputDirective {
  readonly type = input<string>('text');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(inputVariants(), this.class())
  );
}

// Export inputVariants for external use
export { inputVariants };
