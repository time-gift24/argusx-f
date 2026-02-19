import { cva, type VariantProps } from 'class-variance-authority';

export const argusxCheckboxVariants = cva(
  [
    'peer inline-flex shrink-0 items-center justify-center border align-middle outline-none transition-colors',
    'border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    'focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        plain: 'shadow-none',
        destructive:
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground',
      },
      size: {
        default: 'size-4',
        lg: 'size-5',
      },
      shape: {
        default: 'rounded-[4px]',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'plain',
      size: 'default',
      shape: 'default',
    },
  }
);

export type ArgusxCheckboxVariant = NonNullable<VariantProps<typeof argusxCheckboxVariants>['variant']>;
export type ArgusxCheckboxSize = NonNullable<VariantProps<typeof argusxCheckboxVariants>['size']>;
export type ArgusxCheckboxShape = NonNullable<VariantProps<typeof argusxCheckboxVariants>['shape']>;
