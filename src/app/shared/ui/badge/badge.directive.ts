import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/badge.tsx)
const badgeVariants = cva(
  "h-5 gap-1 rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-2.5! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive: 'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
        outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground bg-input/20 dark:bg-input/30',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

export type BadgeVariant = NonNullable<BadgeVariants['variant']>;

/**
 * Directive that applies badge styles to any element.
 * Use on <span>, <a>, or <div> elements.
 *
 * @example
 * ```html
 * <span appBadge>Default</span>
 * <span appBadge variant="secondary">Secondary</span>
 * <span appBadge variant="outline">Outline</span>
 * <a appBadge variant="link" href="/path">Link Badge</a>
 * ```
 */
@Directive({
  selector: 'span[appBadge], a[appBadge], div[appBadge]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"badge"',
    '[attr.data-variant]': 'variant()',
  },
})
export class BadgeDirective {
  readonly variant = input<BadgeVariant>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(badgeVariants({ variant: this.variant() }), this.class())
  );
}

// Export badgeVariants for external use
export { badgeVariants };
