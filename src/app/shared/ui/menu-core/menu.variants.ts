import { cva, type VariantProps } from 'class-variance-authority';

const menuSurfaceAnimationClasses = [
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
];

const menuInteractiveRowBaseClasses = [
  'group/argusx-menu-item relative flex w-full cursor-default items-center justify-start',
  'gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none data-[inset]:pl-8',
];

const menuInteractiveRowStateClasses = [
  'focus:bg-accent focus:text-accent-foreground',
  'hover:bg-accent hover:text-accent-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
];

const menuInteractiveRowIconClasses = [
  "[&_svg:not([class*='text-'])]:text-muted-foreground",
  "[&_svg:not([class*='size-'])]:size-4",
  '[&_svg]:pointer-events-none [&_svg]:shrink-0',
];

export const argusxMenuContentBaseVariants = cva([
  'bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1',
  'origin-[var(--radix-context-menu-content-transform-origin)]',
  ...menuSurfaceAnimationClasses,
]);

export const argusxMenuContentVariants = cva([
  argusxMenuContentBaseVariants(),
  'max-h-[var(--radix-context-menu-content-available-height)] overflow-x-hidden overflow-y-auto shadow-md',
]);

export const argusxMenuSubContentVariants = cva([
  argusxMenuContentBaseVariants(),
  'overflow-hidden shadow-lg',
]);

export const argusxMenuItemVariants = cva(
  [
    ...menuInteractiveRowBaseClasses,
    ...menuInteractiveRowStateClasses,
    ...menuInteractiveRowIconClasses,
    'data-[variant=destructive]:text-destructive',
    'data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20',
    'data-[variant=destructive]:focus:text-destructive',
    'data-[variant=destructive]:hover:bg-destructive/10 dark:data-[variant=destructive]:hover:bg-destructive/20',
    'data-[variant=destructive]:hover:text-destructive',
    "data-[variant=destructive]:*:[svg]:!text-destructive",
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
  'relative flex w-full items-center justify-start px-2 py-1.5 text-left text-sm font-medium text-foreground data-[inset]:pl-8',
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

export const argusxMenuCheckboxItemVariants = cva([
  ...menuInteractiveRowBaseClasses,
  ...menuInteractiveRowStateClasses,
  ...menuInteractiveRowIconClasses,
  'py-1.5 pr-2 pl-8 data-[inset]:pl-8',
]);

export const argusxMenuRadioItemVariants = cva([
  ...menuInteractiveRowBaseClasses,
  ...menuInteractiveRowStateClasses,
  ...menuInteractiveRowIconClasses,
  'py-1.5 pr-2 pl-8 data-[inset]:pl-8',
]);

export const argusxMenuSubTriggerVariants = cva(
  [
    ...menuInteractiveRowBaseClasses,
    ...menuInteractiveRowStateClasses,
    ...menuInteractiveRowIconClasses,
    'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[inset]:pl-8',
  ],
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
  'text-muted-foreground ml-auto text-xs tracking-widest group-focus/argusx-menu-item:text-accent-foreground group-hover/argusx-menu-item:text-accent-foreground'
);

export const argusxMenuSeparatorVariants = cva(
  'bg-border -mx-1 my-1 block h-px w-full shrink-0'
);

export type ArgusxMenuItemVariant = NonNullable<
  VariantProps<typeof argusxMenuItemVariants>['variant']
>;
