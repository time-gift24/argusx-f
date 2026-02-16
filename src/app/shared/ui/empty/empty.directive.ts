import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with official shadcn preset (.vendor/aim/components/ui/empty.tsx)
const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon:
          'bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md [&_svg:not([class*=size-])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>;

export type EmptyMediaVariant = NonNullable<EmptyMediaVariants['variant']>;

/**
 * Empty component root directive that provides a container for empty state content.
 * Displays a centered, dashed border container for no-data scenarios.
 *
 * @example
 * ```html
 * <div appEmpty>
 *   <div appEmptyMedia>
 *     <lucide-icon name="inbox"></lucide-icon>
 *   </div>
 *   <div appEmptyHeader>
 *     <div appEmptyTitle>No results found</div>
 *     <div appEmptyDescription>Try adjusting your search filters</div>
 *   </div>
 *   <div appEmptyContent>
 *     <button argusButton>Clear filters</button>
 *   </div>
 * </div>
 * ```
 */
@Directive({
  selector: '[appEmpty]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty"',
    '[attr.aria-live]': '"polite"',
  },
})
export class EmptyDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'gap-4 rounded-xl border-dashed p-6 flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
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
 * Supports variant prop for different styling options.
 */
@Directive({
  selector: '[appEmptyMedia]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"empty-icon"',
    '[attr.data-variant]': 'variant()',
  },
})
export class EmptyMediaDirective {
  readonly variant = input<EmptyMediaVariant>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(emptyMediaVariants({ variant: this.variant(), className: this.class() }))
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
