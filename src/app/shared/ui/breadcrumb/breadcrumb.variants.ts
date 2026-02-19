import { cva, type VariantProps } from 'class-variance-authority';

export const argusxBreadcrumbVariants = cva('w-full', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ArgusxBreadcrumbSize = NonNullable<
  VariantProps<typeof argusxBreadcrumbVariants>['size']
>;

export const argusxBreadcrumbListVariants = cva(
  'text-muted-foreground flex items-center gap-1.5 break-words sm:gap-2.5',
  {
    variants: {
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
      wrap: {
        wrap: 'flex-wrap',
        nowrap: 'flex-nowrap',
      },
    },
    defaultVariants: {
      align: 'start',
      wrap: 'wrap',
    },
  }
);

export type ArgusxBreadcrumbAlign = NonNullable<
  VariantProps<typeof argusxBreadcrumbListVariants>['align']
>;

export type ArgusxBreadcrumbWrap = NonNullable<
  VariantProps<typeof argusxBreadcrumbListVariants>['wrap']
>;

export const argusxBreadcrumbItemVariants = cva('inline-flex items-center gap-1.5');

export const argusxBreadcrumbEllipsisVariants = cva('flex size-9 items-center justify-center', {
  variants: {
    color: {
      muted: 'text-muted-foreground',
      strong: 'text-foreground',
    },
  },
  defaultVariants: {
    color: 'muted',
  },
});

export type ArgusxBreadcrumbEllipsisColor = NonNullable<
  VariantProps<typeof argusxBreadcrumbEllipsisVariants>['color']
>;
