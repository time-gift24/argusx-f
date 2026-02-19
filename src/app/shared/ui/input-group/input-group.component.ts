import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  computed,
  forwardRef,
  input,
  type Signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

export type InputGroupSize = 'sm' | 'default' | 'lg';

export interface InputGroupContext {
  disabled: Signal<boolean>;
  loading: Signal<boolean>;
  size: Signal<InputGroupSize>;
}

export const ARGUSX_INPUT_GROUP_CONTEXT = new InjectionToken<InputGroupContext>(
  'ARGUSX_INPUT_GROUP_CONTEXT'
);

/**
 * InputGroup - Container for grouped input elements with addons.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * Official comparison URL:
 * https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false&item=input-group-example
 *
 * @example
 * ```html
 * <argusx-input-group>
 *   <argusx-input-group-addon align="inline-start">
 *     <lucide-icon [img]="mailIcon"></lucide-icon>
 *   </argusx-input-group-addon>
 *   <argusx-input-group-input placeholder="Email" />
 * </argusx-input-group>
 * ```
 */
@Component({
  selector: 'argusx-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ARGUSX_INPUT_GROUP_CONTEXT,
      useExisting: forwardRef(() => InputGroupComponent),
    },
  ],
  template: `
    <div
      [class]="computedClass()"
      [attr.data-slot]="'input-group'"
      [attr.data-size]="size()"
      [attr.data-disabled]="isDisabled() ? 'true' : null"
      [attr.role]="'group'"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      [attr.aria-busy]="loading() ? 'true' : null"
    >
      <ng-content />
    </div>
  `,
  host: {
    '[class.block]': 'true',
  },
})
export class InputGroupComponent {
  readonly class = input<string>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly size = input<InputGroupSize>('default');

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  private readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'h-6';
      case 'lg':
        return 'h-8';
      default:
        return 'h-7';
    }
  });

  protected readonly computedClass = computed(() =>
    cn(
      'border-input bg-input/20 dark:bg-input/30',
      'has-[[data-slot=input-group-control]:focus-visible]:border-ring',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30',
      'has-[[data-slot][aria-invalid=true]]:ring-destructive/20',
      'has-[[data-slot][aria-invalid=true]]:border-destructive',
      'dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
      'rounded-md border transition-colors',
      'in-data-[slot=combobox-content]:focus-within:border-inherit',
      'in-data-[slot=combobox-content]:focus-within:ring-0',
      'has-data-[align=block-end]:rounded-md has-data-[align=block-start]:rounded-md',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-2',
      'has-[[data-slot][aria-invalid=true]]:ring-2',
      'has-[textarea]:rounded-md',
      'has-[>[data-align=block-end]]:h-auto',
      'has-[>[data-align=block-end]]:flex-col',
      'has-[>[data-align=block-start]]:h-auto',
      'has-[>[data-align=block-start]]:flex-col',
      'has-[>[data-align=block-end]]:[&_input[data-slot=input-group-control]]:pt-3',
      'has-[>[data-align=block-start]]:[&_input[data-slot=input-group-control]]:pb-3',
      'has-[>[data-align=inline-end]]:[&_input[data-slot=input-group-control]]:pr-1.5',
      'has-[>[data-align=inline-start]]:[&_input[data-slot=input-group-control]]:pl-1.5',
      'group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
      this.sizeClass(),
      this.isDisabled() ? 'cursor-not-allowed opacity-50 data-[disabled=true]:bg-input/50 dark:data-[disabled=true]:bg-input/80' : null,
      this.class()
    )
  );
}
