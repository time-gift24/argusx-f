import { ChangeDetectionStrategy, Component, computed, input, ElementRef, inject, afterNextRender } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
const inputGroupAddonVariants = cva(
  "text-muted-foreground **:data-[slot=kbd]:bg-muted-foreground/10 h-auto gap-1 py-2 text-xs/relaxed font-medium group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)] **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:text-[0.625rem] [&>svg:not([class*='size-'])]:size-3.5 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        "inline-start": "pl-2 has-[>button]:ml-[-0.275rem] has-[>kbd]:ml-[-0.275rem] order-first",
        "inline-end": "pr-2 has-[>button]:mr-[-0.275rem] has-[>kbd]:mr-[-0.275rem] order-last",
        "block-start":
          "px-2 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start",
        "block-end":
          "px-2 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

type InputGroupAddonAlign = NonNullable<VariantProps<typeof inputGroupAddonVariants>['align']>;

/**
 * InputGroupAddon - Addon element for InputGroup (icons, text, buttons).
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * @example
 * ```html
 * <argusx-input-group-addon align="inline-start">
 *   <lucide-icon [img]="mailIcon"></lucide-icon>
 * </argusx-input-group-addon>
 * ```
 */
@Component({
  selector: 'argusx-input-group-addon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="computedClass()"
      [attr.data-slot]="'input-group-addon'"
      [attr.data-align]="align()"
      [attr.role]="'group'"
      (click)="onAddonClick($event)"
    >
      <ng-content />
    </div>
  `,
  host: {
    '[class.block]': 'true',
  },
})
export class InputGroupAddonComponent {
  readonly align = input<InputGroupAddonAlign>('inline-start');
  readonly class = input<string>('');

  private readonly elementRef = inject(ElementRef);

  protected readonly computedClass = computed(() =>
    cn(inputGroupAddonVariants({ align: this.align() }), this.class())
  );

  protected onAddonClick(event: MouseEvent): void {
    // If clicking on a button, don't focus the input
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    // Focus the first input in the parent input-group
    const parentGroup = this.elementRef.nativeElement.closest('[data-slot="input-group"]');
    if (parentGroup) {
      const input = parentGroup.querySelector('input') as HTMLInputElement | null;
      input?.focus();
    }
  }
}
