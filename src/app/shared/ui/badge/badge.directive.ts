import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with shadcn badge (new-york-v4/ui/badge.tsx)
export const argusxBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost:
          '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type ArgusxBadgeVariants = VariantProps<typeof argusxBadgeVariants>;

export type ArgusxBadgeVariant = NonNullable<ArgusxBadgeVariants['variant']>;

/**
 * Directive that applies badge styles to any element.
 * Use on <span>, <a>, or <div> elements.
 *
 * @example
 * ```html
 * <span argusx-badge>Default</span>
 * <span argusx-badge variant="secondary">Secondary</span>
 * <span argusx-badge variant="outline">Outline</span>
 * <a argusx-badge variant="link" href="/path">Link Badge</a>
 * ```
 */
@Directive({
  selector: 'span[argusx-badge], a[argusx-badge], div[argusx-badge]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"badge"',
    '[attr.data-variant]': 'variant()',
  },
})
export class ArgusxBadgeDirective {
  readonly variant = input<ArgusxBadgeVariant>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxBadgeVariants({ variant: this.variant() }), this.class()),
  );
}
