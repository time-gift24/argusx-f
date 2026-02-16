import { computed, Directive, input } from '@angular/core';
import { cn } from '../../utils/cn';

// Aligned with official shadcn preset (.vendor/aim/components/ui/kbd.tsx)
const kbdBaseClasses = "bg-muted text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 h-5 w-fit min-w-5 gap-1 rounded-xs px-1 font-sans text-[0.625rem] font-medium [&_svg:not([class*='size-'])]:size-3 pointer-events-none inline-flex items-center justify-center select-none";

const kbdGroupBaseClasses = "gap-1 inline-flex items-center";

/**
 * Directive that applies keyboard key styling to kbd elements.
 * Use on <kbd> elements for displaying keyboard shortcuts.
 *
 * @example
 * ```html
 * <kbd appKbd>⌘</kbd>
 * <kbd appKbd>Ctrl</kbd> + <kbd appKbd>K</kbd>
 * ```
 */
@Directive({
  selector: 'kbd[appKbd]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"kbd"',
  },
})
export class KbdDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(kbdBaseClasses, this.class())
  );
}

/**
 * Directive that applies keyboard key group styling.
 * Use on a wrapper element for grouping multiple kbd elements.
 *
 * @example
 * ```html
 * <kbd appKbdGroup>
 *   <kbd appKbd>Ctrl</kbd>
 *   <span>+</span>
 *   <kbd appKbd>K</kbd>
 * </kbd>
 * ```
 */
@Directive({
  selector: 'kbd[appKbdGroup]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"kbd-group"',
  },
})
export class KbdGroupDirective {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(kbdGroupBaseClasses, this.class())
  );
}
