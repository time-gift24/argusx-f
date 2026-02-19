import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  argusxButtonVariants,
  type ArgusxButtonVariant,
} from '../button/button.directive';

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
 * <app-input-group-button variant="ghost" size="icon-xs" aria-label="Search">
 *   <lucide-icon [img]="searchIcon"></lucide-icon>
 * </app-input-group-button>
 * ```
 */
@Component({
  selector: 'button[appInputGroupButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.type]': 'type()',
    '[attr.data-size]': 'size()',
    '[attr.data-slot]': '"button"',
    '[attr.data-variant]': 'variant()',
  },
})
export class InputGroupButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<ArgusxButtonVariant>('ghost');
  readonly size = input<InputGroupButtonSize>('xs');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: this.variant(), size: 'default' }),
      inputGroupButtonVariants({ size: this.size() }),
      this.class()
    )
  );
}
