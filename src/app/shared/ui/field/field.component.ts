import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/field.tsx)
const fieldVariants = cva(
  'data-[invalid=true]:text-destructive gap-2 group/field flex w-full',
  {
    variants: {
      orientation: {
        vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
        horizontal:
          'flex-row items-center *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);

type FieldVariants = VariantProps<typeof fieldVariants>;

/**
 * Field component for grouping form controls with labels, descriptions, and errors.
 * Supports vertical, horizontal, and responsive orientations.
 *
 * @example
 * ```html
 * <app-field>
 *   <app-field-label>Email</app-field-label>
 *   <input appInput type="email" />
 *   <app-field-description>Enter your email address.</app-field-description>
 * </app-field>
 * ```
 */
@Component({
  selector: 'app-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  host: {
    role: 'group',
    '[attr.data-slot]': '"field"',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class FieldComponent {
  /**
   * Orientation of the field layout.
   * @default 'vertical'
   */
  readonly orientation = input<FieldVariants['orientation']>('vertical');

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(fieldVariants({ orientation: this.orientation() }), this.class())
  );
}

export { fieldVariants };
