import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
  ElementRef,
} from '@angular/core';
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
      (click)="onAddonClick($event)"
    >
      <ng-content />
    </div>
  `,
  host: {
    '[class.block]': 'true',
    '[class.w-full]': 'isBlockAlign()',
    '[attr.data-slot]': '"input-group-addon"',
    '[attr.data-align]': 'align()',
    '[attr.role]': '"group"',
  },
})
export class InputGroupAddonComponent implements AfterViewInit {
  private readonly explicitAlignValue = signal<InputGroupAddonAlign | null>(null);
  private readonly autoAlignValue = signal<InputGroupAddonAlign>('inline-start');
  private readonly classValue = signal('');

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly align = computed(() => this.explicitAlignValue() ?? this.autoAlignValue());
  protected readonly class = this.classValue.asReadonly();

  @Input({ alias: 'align' })
  set alignInput(value: InputGroupAddonAlign | null | undefined) {
    this.explicitAlignValue.set(value ?? null);
    if (value == null) {
      this.autoAlignValue.set(this.resolveAutoAlign());
    }
  }

  @Input('class')
  set hostClass(value: string | null | undefined) {
    this.classValue.set(value ?? '');
  }

  protected readonly isBlockAlign = computed(() =>
    this.align() === 'block-start' || this.align() === 'block-end'
  );

  protected readonly computedClass = computed(() =>
    cn(inputGroupAddonVariants({ align: this.align() }), this.class())
  );

  ngAfterViewInit(): void {
    if (this.explicitAlignValue() == null) {
      this.autoAlignValue.set(this.resolveAutoAlign());
    }
  }

  protected onAddonClick(event: MouseEvent): void {
    // If clicking on a button, don't focus the input
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    // shadcn baseline: focus the first input control in parent group.
    const parentGroup = this.elementRef.nativeElement.closest('[data-slot="input-group"]');
    if (parentGroup) {
      const control = parentGroup.querySelector('input') as HTMLInputElement | null;
      control?.focus();
    }
  }

  private resolveAutoAlign(): InputGroupAddonAlign {
    const host = this.elementRef.nativeElement;
    const parentGroup = host.closest('[data-slot="input-group"]');
    if (!(parentGroup instanceof HTMLElement)) {
      return 'inline-start';
    }

    const children = Array.from(parentGroup.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement
    );
    const textareaIndex = children.findIndex((node) => node.tagName === 'ARGUSX-INPUT-GROUP-TEXTAREA');
    const addonIndex = children.indexOf(host);

    if (textareaIndex === -1 || addonIndex === -1) {
      return 'inline-start';
    }

    return addonIndex < textareaIndex ? 'block-start' : 'block-end';
  }
}
