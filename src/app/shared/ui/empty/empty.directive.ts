import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/empty.tsx)
const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: 'bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*=size-])]:size-6',
      },
      size: {
        default: 'mb-2',
        sm: 'mb-1.5',
        lg: 'mb-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>;

export type EmptyMediaVariant = NonNullable<EmptyMediaVariants['variant']>;
export type EmptyMediaSize = NonNullable<EmptyMediaVariants['size']>;

// Empty root variants
const emptyVariants = cva('', {
  variants: {
    variant: {
      default: 'border-border',
      muted: 'border-muted',
    },
    size: {
      default: 'p-6 gap-4',
      sm: 'p-4 gap-3',
      lg: 'p-8 gap-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type EmptyVariants = VariantProps<typeof emptyVariants>;
export type EmptyVariant = NonNullable<EmptyVariants['variant']>;
export type EmptySize = NonNullable<EmptyVariants['size']>;

/**
 * Empty component root directive that provides a container for empty state content.
 * Displays a centered, dashed border container for no-data scenarios.
 *
 * @example
 * ```html
 * <div appEmpty>
 *   <div appEmptyMedia variant="icon">
 *     <svg>...</svg>
 *   </div>
 *   <div appEmptyHeader>
 *     <h3 appEmptyTitle>No results found</h3>
 *     <p appEmptyDescription>Try adjusting your search filters</p>
 *   </div>
 *   <div appEmptyContent>
 *     <button argusx-button>Clear filters</button>
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[appEmpty]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.aria-live]': '"polite"',
    '[attr.role]': '"status"',
  },
})
export class EmptyDirective {
  readonly variant = input<EmptyVariant>('default');
  readonly size = input<EmptySize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'rounded-xl border border-dashed flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
      emptyVariants({ variant: this.variant(), size: this.size() }),
      this.class()
    )
  );
}

/**
 * EmptyHeader directive for the header section containing title and description.
 */
@Directive({
  selector: '[appEmptyHeader]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty-header"',
  },
})
export class EmptyHeaderDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('gap-1 flex max-w-sm flex-col items-center', this.class())
  );
}

/**
 * EmptyMedia directive for the icon or illustration area.
 * Supports variant and size props for different styling options.
 * Icons are hidden from assistive tech by default since they're decorative.
 */
@Directive({
  selector: '[appEmptyMedia]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty-icon"',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.aria-hidden]': 'variant() === "icon" ? "true" : null',
  },
})
export class EmptyMediaDirective {
  readonly variant = input<EmptyMediaVariant>('default');
  readonly size = input<EmptyMediaSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(emptyMediaVariants({ variant: this.variant(), size: this.size(), className: this.class() }))
  );
}

/**
 * EmptyTitle directive for the title text.
 */
@Directive({
  selector: '[appEmptyTitle]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty-title"',
  },
})
export class EmptyTitleDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('text-sm font-medium tracking-tight', this.class()));
}

/**
 * EmptyDescription directive for the description text.
 */
@Directive({
  selector: '[appEmptyDescription]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty-description"',
  },
})
export class EmptyDescriptionDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-xs/relaxed text-muted-foreground [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
      this.class()
    )
  );
}

/**
 * EmptyContent directive for additional content like action buttons.
 */
@Directive({
  selector: '[appEmptyContent]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty-content"',
  },
})
export class EmptyContentDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('gap-2 text-xs/relaxed flex w-full max-w-sm min-w-0 flex-col items-center text-balance', this.class())
  );
}

// Export emptyMediaVariants for external use
export { emptyMediaVariants };
