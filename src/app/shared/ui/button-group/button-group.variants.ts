import { cva, type VariantProps } from 'class-variance-authority';

export const argusxButtonGroupVariants = cva(
  "has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md flex w-fit items-stretch *:focus-visible:z-10 *:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot=dropdown-menu]:not(:first-child)_[data-slot=dropdown-menu-trigger]]:rounded-l-none [&>[data-slot=dropdown-menu]:not(:first-child)_[data-slot=dropdown-menu-trigger]]:border-l-0 [&>[data-slot=dropdown-menu]:not(:last-child)_[data-slot=dropdown-menu-trigger]]:rounded-r-none [&>[data-slot=select]:not(:first-child)_[data-slot=select-trigger]]:rounded-l-none [&>[data-slot=select]:not(:first-child)_[data-slot=select-trigger]]:border-l-0 [&>[data-slot=select]:not(:last-child)_[data-slot=select-trigger]]:rounded-r-none [&>[data-slot=select]:not(:last-child)_[data-slot=select-trigger]]:border-r-0 [&>[data-as-child]:has(+*)_[data-slot=label]]:rounded-r-none",
        vertical:
          "[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

export type ArgusxButtonGroupOrientation = NonNullable<
  VariantProps<typeof argusxButtonGroupVariants>['orientation']
>;

export const argusxButtonGroupTextVariants = cva(
  "bg-muted gap-2 rounded-md border px-2.5 text-xs/relaxed font-medium [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none"
);

export const argusxButtonGroupTextAsChildVariants = cva(
  "contents [&>*:first-child]:bg-muted [&>*:first-child]:gap-2 [&>*:first-child]:rounded-md [&>*:first-child]:border [&>*:first-child]:px-2.5 [&>*:first-child]:text-xs/relaxed [&>*:first-child]:font-medium [&>*:first-child]:flex [&>*:first-child]:items-center [&>*:first-child]:[&_svg:not([class*='size-'])]:size-4 [&>*:first-child]:[&_svg]:pointer-events-none"
);

export const argusxButtonGroupSeparatorVariants = cva(
  'bg-input relative self-stretch shrink-0 pointer-events-none select-none',
  {
    variants: {
      orientation: {
        horizontal: 'mx-px w-auto',
        vertical: 'my-px h-auto',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);
