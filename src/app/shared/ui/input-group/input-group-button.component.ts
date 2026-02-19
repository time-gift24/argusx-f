import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  argusxButtonVariants,
  type ArgusxButtonVariant,
} from '../button/button.directive';
import { ARGUSX_INPUT_GROUP_CONTEXT } from './input-group.component';

// Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
const inputGroupButtonVariants = cva(
  "gap-2 rounded-md text-xs/relaxed shadow-none flex items-center",
  {
    variants: {
      size: {
        xs: "h-5 gap-1 rounded-[calc(var(--radius-sm)-2px)] px-1 [&>svg:not([class*='size-'])]:size-3",
        sm: "",
        "icon-xs": "size-6 p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

type InputGroupButtonSize = NonNullable<VariantProps<typeof inputGroupButtonVariants>['size']>;

/**
 * InputGroupButton - Button styled for use inside InputGroup.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * @example
 * ```html
 * <button argusxInputGroupButton variant="ghost" size="icon-xs" aria-label="Search">
 *   <lucide-icon [img]="searchIcon"></lucide-icon>
 * </button>
 * ```
 */
@Component({
  selector: 'button[argusxInputGroupButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[disabled]': 'isDisabled()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-disabled]': 'isDisabled() ? "true" : null',
    '[attr.type]': 'type()',
    '[attr.data-size]': 'size()',
    '[attr.data-slot]': '"input-group-button"',
    '[attr.data-variant]': 'variant()',
  },
})
export class InputGroupButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<ArgusxButtonVariant>('ghost');
  readonly size = input<InputGroupButtonSize>('xs');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  private readonly group = inject(ARGUSX_INPUT_GROUP_CONTEXT, { optional: true });

  protected readonly isDisabled = computed(
    () =>
      this.disabled() ||
      this.group?.disabled() === true ||
      this.group?.loading() === true
  );

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: this.variant(), size: 'default' }),
      inputGroupButtonVariants({ size: this.size() }),
      this.class()
    )
  );
}
