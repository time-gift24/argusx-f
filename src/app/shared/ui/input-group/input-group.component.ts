import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * InputGroup - Container for grouped input elements with addons.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * Official comparison URL:
 * https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false&item=input-group-example
 *
 * @example
 * ```html
 * <app-input-group>
 *   <app-input-group-addon align="inline-start">
 *     <lucide-icon [img]="mailIcon"></lucide-icon>
 *   </app-input-group-addon>
 *   <app-input-group-input placeholder="Email" />
 * </app-input-group>
 * ```
 */
@Component({
  selector: 'app-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass()"
      [attr.data-slot]="'input-group'"
      [attr.role]="'group'"
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

  protected readonly computedClass = computed(() =>
    cn(
      // Base styles aligned with shadcn preset
      'border-input bg-input/20 dark:bg-input/30',
      'has-[[data-slot=input-group-control]:focus-visible]:border-ring',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30',
      'has-[[data-slot][aria-invalid=true]]:ring-destructive/20',
      'has-[[data-slot][aria-invalid=true]]:border-destructive',
      'dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
      'h-7 rounded-md border transition-colors',
      'in-data-[slot=combobox-content]:focus-within:border-inherit',
      'in-data-[slot=combobox-content]:focus-within:ring-0',
      'has-data-[align=block-end]:rounded-md',
      'has-data-[align=block-start]:rounded-md',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-2',
      'has-[[data-slot][aria-invalid=true]]:ring-2',
      'has-[textarea]:rounded-md',
      'has-[[data-align=block-end]]:h-auto',
      'has-[[data-align=block-end]]:flex-col',
      'has-[[data-align=block-start]]:h-auto',
      'has-[[data-align=block-start]]:flex-col',
      'has-[[data-align=block-end]]:[&_input[data-slot=input-group-control]]:pt-3',
      'has-[[data-align=block-start]]:[&_input[data-slot=input-group-control]]:pb-3',
      'has-[[data-align=inline-end]]:[&_input[data-slot=input-group-control]]:pr-1.5',
      'has-[[data-align=inline-start]]:[&_input[data-slot=input-group-control]]:pl-1.5',
      'group/input-group relative flex w-full min-w-0 items-center outline-none',
      'has-[>textarea]:h-auto',
      this.class()
    )
  );
}
