import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';

// Aligned with shadcn kbd (registry/new-york-v4/ui/kbd.tsx)
const argusxKbdBaseClasses =
  "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none [&_svg:not([class*='size-'])]:size-3 [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10";

const argusxKbdGroupBaseClasses = 'inline-flex items-center gap-1';

// ArgusX extension: optional size scale while keeping shadcn default shape.
export const argusxKbdSizes = {
  sm: 'h-4 min-w-4 text-[0.625rem]',
  default: '',
  lg: 'h-6 min-w-6 text-sm',
} as const;

export type ArgusxKbdSize = keyof typeof argusxKbdSizes;

/**
 * Directive that applies keyboard key styling to kbd elements.
 * Use on <kbd> elements for displaying keyboard shortcuts.
 *
 * @example
 * ```html
 * <kbd argusx-kbd>⌘</kbd>
 * <kbd argusx-kbd>Ctrl</kbd> + <kbd argusx-kbd>K</kbd>
 * <kbd argusx-kbd size="lg">⌘K</kbd>
 * ```
 */
@Directive({
  selector: 'kbd[argusx-kbd]',
  exportAs: 'argusxKbd',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"kbd"',
    '[attr.data-size]': 'size()',
  },
})
export class ArgusxKbdDirective {
  readonly size = input<ArgusxKbdSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxKbdBaseClasses, argusxKbdSizes[this.size()], this.class())
  );
}

/**
 * Directive that applies keyboard key group styling.
 * Use on a wrapper element for grouping multiple kbd elements.
 *
 * @example
 * ```html
 * <kbd argusx-kbd-group>
 *   <kbd argusx-kbd>Ctrl</kbd>
 *   <span>+</span>
 *   <kbd argusx-kbd>K</kbd>
 * </kbd>
 * ```
 */
@Directive({
  selector: 'kbd[argusx-kbd-group]',
  exportAs: 'argusxKbdGroup',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"kbd-group"',
  },
})
export class ArgusxKbdGroupDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxKbdGroupBaseClasses, this.class())
  );
}
