import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        plain: 'bg-transparent hover:bg-muted hover:text-muted-foreground',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-2',
        md: 'h-9 px-3',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants: {
      variant: 'plain',
      size: 'md',
    },
  },
);

export type ArgusxToggleVariants = VariantProps<typeof toggleVariants>;
