import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/label.tsx)
const labelVariants = cva(
  "text-xs/relaxed leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
  {
    variants: {},
    defaultVariants: {},
  }
);

type LabelVariants = VariantProps<typeof labelVariants>;

/**
 * Directive that applies label styles to a label element.
 * Use on <label> elements to provide consistent styling for form labels.
 *
 * @example
 * ```html
 * <label appLabel for="email">Email</label>
 * <input id="email" type="email" class="peer" />
 * ```
 *
 * The label supports peer-disabled styling - when the associated input
 * (marked with .peer class) is disabled, the label will automatically
 * reduce opacity and show not-allowed cursor.
 */
@Directive({
  selector: 'label[appLabel]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"label"',
  },
})
export class LabelDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(labelVariants(), this.class())
  );
}

// Export labelVariants for external use
export { labelVariants };
