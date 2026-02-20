import { cva } from 'class-variance-authority';

import { cn } from '../../utils/cn';

export type ArgusxCardSize = 'default' | 'sm' | 'lg';

export const cardVariants = cva('bg-card text-card-foreground flex flex-col border shadow-sm', {
  variants: {
    size: {
      default: 'gap-4 rounded-lg py-4',
      sm: 'gap-3 rounded-lg py-3',
      lg: 'gap-6 rounded-xl py-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const cardHeaderVariants = cva(
  cn(
    '@container/card-header grid auto-rows-min items-start',
    'has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]'
  ),
  {
    variants: {
      size: {
        default: 'gap-1 px-4',
        sm: 'gap-1 px-3',
        lg: 'gap-2 px-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const cardBodyVariants = cva('', {
  variants: {
    size: {
      default: 'px-4',
      sm: 'px-3',
      lg: 'px-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const cardFooterVariants = cva('flex flex-col items-center', {
  variants: {
    size: {
      default: 'gap-2 px-4',
      sm: 'gap-2 px-3',
      lg: 'gap-2 px-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
