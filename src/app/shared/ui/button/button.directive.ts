import { booleanAttribute, computed, Directive, ElementRef, inject, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

export const argusxButtonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium focus-visible:ring-2 aria-invalid:ring-2 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-colors transition-opacity disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline: 'border-border dark:bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive: 'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        'icon-xs': "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        'icon-sm': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-lg': "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
      shape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
      full: {
        false: '',
        true: 'w-full',
      },
      loading: {
        false: '',
        true: 'pointer-events-none opacity-50',
      },
      disabled: {
        false: '',
        true: 'pointer-events-none opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'default',
      full: false,
      loading: false,
      disabled: false,
    },
  },
);

type ArgusxButtonVariants = VariantProps<typeof argusxButtonVariants>;

export type ArgusxButtonVariant = NonNullable<ArgusxButtonVariants['variant']>;
export type ArgusxButtonSize = NonNullable<ArgusxButtonVariants['size']>;
export type ArgusxButtonShape = NonNullable<ArgusxButtonVariants['shape']>;

@Directive({
  selector: 'button[argusx-button], a[argusx-button]',
  exportAs: 'argusxButton',
  host: {
    '[class]': 'asChild() ? null : computedClass()',
    '[attr.data-slot]': '"button"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-full]': 'full() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-invalid]': 'invalid()',
    '[attr.aria-busy]': 'loading()',
    '[attr.tabindex]': 'isAnchorElement() && isDisabled() ? "-1" : null',
    '[attr.disabled]': 'isNativeButtonElement() && isDisabled() ? "" : null',
  },
})
export class ArgusxButtonDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly variant = input<ArgusxButtonVariant>('default');
  readonly size = input<ArgusxButtonSize>('default');
  readonly shape = input<ArgusxButtonShape>('default');
  readonly full = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly class = input<string>('');
  readonly asChild = input(false, { transform: booleanAttribute });

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({
        variant: this.variant(),
        size: this.size(),
        shape: this.shape(),
        full: this.full(),
        loading: this.loading(),
        disabled: this.isDisabled(),
      }),
      this.class(),
    ),
  );

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly isNativeButtonElement = computed(
    () => this.elementRef.nativeElement.tagName.toLowerCase() === 'button',
  );

  protected readonly isAnchorElement = computed(
    () => this.elementRef.nativeElement.tagName.toLowerCase() === 'a',
  );

  getClasses(): string {
    return this.computedClass();
  }
}
