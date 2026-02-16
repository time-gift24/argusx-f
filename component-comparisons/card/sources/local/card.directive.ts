import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// Aligned with shadcn/ui card component
// Reference: https://ui.shadcn.com/docs/components/card
const cardVariants = cva(
  'bg-card text-card-foreground group/card flex flex-col rounded-lg border border-border',
  {
    variants: {
      size: {
        default: 'p-6 gap-4',
        sm: 'p-4 gap-3',
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
 */
@Directive({
  selector: '[appCard]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card"',
    '[attr.data-size]': 'size()',
  },
})
export class CardDirective {
  readonly size = input<CardSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(cardVariants({ size: this.size() }), this.class())
  );
}

@Directive({
  selector: '[appCardHeader]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-header"',
  },
})
export class CardHeaderDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col gap-1.5 group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
      this.class()
    )
  );
}

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
    cn('text-sm font-medium', this.class())
  );
}

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
    cn('text-muted-foreground text-xs/relaxed', this.class())
  );
}

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
    cn('flex-1', this.class())
  );
}

@Directive({
  selector: '[appCardFooter]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"card-footer"',
  },
})
export class CardFooterDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex items-center', this.class())
  );
}

export { cardVariants };
