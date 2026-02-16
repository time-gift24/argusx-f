import { computed, Directive, input, model } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

export type InputStatus = 'default' | 'error' | 'warning' | 'success';

export type InputSize = 'sm' | 'default' | 'lg';

// Aligned with official shadcn preset (.vendor/aim/components/ui/input.tsx)
const inputVariants = cva(
  'bg-input/20 dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-7 rounded-md border px-2 py-0.5 text-sm transition-colors file:h-6 file:text-xs/relaxed file:font-medium focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      status: {
        default: '',
        error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
        warning: 'border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/30',
        success: 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/30',
      },
      size: {
        sm: 'h-6 text-xs px-1.5 py-0.5',
        default: 'h-7 text-sm px-2 py-0.5',
        lg: 'h-10 text-base px-3 py-1.5',
      },
      borderless: {
        false: '',
        true: 'flex-1 bg-transparent border-0 focus-visible:border-0 focus-visible:ring-0',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'default',
      borderless: false,
    },
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
 * <input appInput type="password" status="error" />
 * <input appInput type="text" [(value)]="formControl" />
 * ```
 */
@Directive({
  selector: 'input[appInput]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"input"',
    '[attr.data-status]': 'status()',
    '[type]': 'type()',
    '[value]': 'value()',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
  },
})
export class InputDirective {
  readonly type = input<string>('text');
  readonly class = input<string>('');
  readonly status = input<InputStatus>('default');
  readonly size = input<InputSize>('default');
  readonly borderless = input<boolean>(false);

  // Bidirectional binding with model()
  readonly value = model<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      inputVariants({
        status: this.status(),
        size: this.size(),
        borderless: this.borderless(),
      }),
      this.class()
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  protected onBlur(): void {
    // Can be used for validation trigger
  }
}

// Export inputVariants for external use
export { inputVariants };
