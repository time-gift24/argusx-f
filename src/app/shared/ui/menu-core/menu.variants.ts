import { cva, type VariantProps } from 'class-variance-authority';

export const argusxMenuContentVariants = cva([
  'z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground',
  'shadow-lg animate-in data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95',
  'data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
]);

export const argusxMenuItemVariants = cva(
  [
    'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5',
    'text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
    'focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none',
    'data-disabled:opacity-50 text-left [&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
      variant: {
        default: '',
        destructive: 'text-destructive',
      },
    },
    defaultVariants: {
      inset: false,
      variant: 'default',
    },
  }
);

export const argusxMenuLabelVariants = cva(
  'relative flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground',
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      inset: false,
    },
  }
);

export const argusxMenuShortcutVariants = cva(
  'ml-auto text-xs tracking-widest text-muted-foreground'
);

export type ArgusxMenuItemVariant = NonNullable<
  VariantProps<typeof argusxMenuItemVariants>['variant']
>;
