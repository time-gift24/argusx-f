import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with shadcn/ui card component
// Reference: https://ui.shadcn.com/docs/components/card
const cardVariants = cva(
  'cn-card bg-card text-card-foreground group/card flex flex-col mx-auto w-full max-w-sm rounded-lg text-xs/relaxed shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)]',
  {
    variants: {
      size: {
        default: 'py-4 gap-4',
        sm: 'py-3 gap-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type CardVariants = VariantProps<typeof cardVariants>;

export type CardSize = NonNullable<CardVariants['size']>;

/**
 * Card component that provides a container for card content.
 * Supports size variants for different card densities.
 *
 * @example
 * ```html
 * <div appCard>
 *   <div appCardHeader>
 *     <div appCardTitle>Card Title</div>
 *     <div appCardDescription>Card description text</div>
 *   </div>
 *   <div appCardContent>Content goes here</div>
 *   <div appCardFooter>Footer content</div>
 * </div>
 * ```
 */
@Directive({
  selector: '[appCard]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card"',
    '[attr.data-size]': 'size()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export class CardDirective {
  readonly size = input<CardSize>('default');
  readonly class = input<string>('');
  readonly ariaLabelledBy = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);

  protected readonly computedClass = computed(() =>
    cn(cardVariants({ size: this.size() }), this.class())
  );
}

/**
 * CardHeader directive for the header section of a card.
 */
@Directive({
  selector: '[appCardHeader]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-header"',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export class CardHeaderDirective {
  readonly class = input<string>('');
  readonly appCardHeaderBorder = input<boolean>(false);
  readonly ariaLabelledBy = input<string>('');
  readonly ariaDescribedBy = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'cn-card-header group/card-header @container/card-header grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] px-4 group-data-[size=sm]/card:px-3',
      this.appCardHeaderBorder() ? 'border-b' : '',
      this.class()
    )
  );
}

/**
 * CardTitle directive for the title text in a card header.
 */
@Directive({
  selector: '[appCardTitle]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-title"',
  },
})
export class CardTitleDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('cn-card-title text-sm font-medium leading-5', this.class())
  );
}

/**
 * CardDescription directive for the description text in a card header.
 */
@Directive({
  selector: '[appCardDescription]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-description"',
  },
})
export class CardDescriptionDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('cn-card-description text-muted-foreground leading-relaxed', this.class())
  );
}

/**
 * CardAction directive for action buttons/links in a card header.
 */
@Directive({
  selector: '[appCardAction]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-action"',
  },
})
export class CardActionDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      this.class()
    )
  );
}

/**
 * CardContent directive for the main content area of a card.
 */
@Directive({
  selector: '[appCardContent]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-content"',
  },
})
export class CardContentDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('cn-card-content px-4 group-data-[size=sm]/card:px-3', this.class())
  );
}

/**
 * CardFooter directive for the footer section of a card.
 */
@Directive({
  selector: '[appCardFooter]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-footer"',
  },
})
export class CardFooterDirective {
  readonly class = input<string>('');
  readonly appCardFooterBorder = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'cn-card-footer flex items-center px-4 group-data-[size=sm]/card:px-3',
      this.appCardFooterBorder() ? 'border-t' : '',
      this.class()
    )
  );
}

// Export cardVariants for external use
export { cardVariants };
