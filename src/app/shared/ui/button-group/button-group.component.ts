import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * ButtonGroup component - Groups related buttons together
 * Aligned with official shadcn preset (.vendor/aim/components/ui/button-group.tsx)
 *
 * @example
 * ```html
 * <!-- Horizontal button group (default) -->
 * <app-button-group>
 *   <button argusx-button>Button 1</button>
 *   <button argusx-button>Button 2</button>
 *   <button argusx-button>Button 3</button>
 * </app-button-group>
 *
 * <!-- Vertical button group -->
 * <app-button-group orientation="vertical">
 *   <button argusx-button>Button 1</button>
 *   <button argusx-button>Button 2</button>
 *   <button argusx-button>Button 3</button>
 * </app-button-group>
 * ```
 */
@Component({
  selector: 'app-button-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[attr.role]': '"group"',
    '[attr.data-slot]': '"button-group"',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class ButtonGroupComponent {
  /**
   * Orientation of the button group.
   * @default 'horizontal'
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  /**
   * Computed classes based on orientation and custom classes.
   */
  protected readonly computedClass = computed(() => {
    const isHorizontal = this.orientation() === 'horizontal';

    return cn(
      // Base styles
      'flex w-fit items-stretch *:focus-visible:z-10 *:focus-visible:relative',
      // Gap between items
      'gap-2 [&>input]:flex-1',
      // Orientation-specific styles
      isHorizontal
        ? [
            // First item: rounded right, no left border removal
            '[&>*:not(:first-child)]:rounded-l-none',
            '[&>*:not(:first-child)]:border-l-0',
            // Last item: rounded right
            '[&>*:not(:last-child)]:rounded-r-none',
            // Single item: rounded right
            '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md!',
          ]
        : [
            // Vertical: use flex-col
            'flex-col',
            // First item: rounded bottom, no top border removal
            '[&>*:not(:first-child)]:rounded-t-none',
            '[&>*:not(:first-child)]:border-t-0',
            // Last item: rounded bottom
            '[&>*:not(:last-child)]:rounded-b-none',
            // Single item: rounded bottom
            '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md!',
          ],
      this.class()
    );
  });
}

/**
 * ButtonGroupText component - Display text within a button group
 * Aligned with official shadcn preset
 *
 * @example
 * ```html
 * <app-button-group>
 *   <button argusx-button>Save</button>
 *   <app-button-group-text>or</app-button-group-text>
 *   <button argusx-button>Cancel</button>
 * </app-button-group>
 * ```
 */
@Component({
  selector: 'app-button-group-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    '[attr.data-slot]': '"button-group-text"',
    '[class]': 'computedClass()',
  },
})
export class ButtonGroupTextComponent {
  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  /**
   * Computed classes for the text element.
   */
  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted gap-2 rounded-md border px-2.5 text-xs/relaxed font-medium',
      '[&_svg:not([class*="size-"])]:size-4 flex items-center [&_svg]:pointer-events-none',
      this.class()
    )
  );
}

/**
 * ButtonGroupSeparator component - Separator within button groups
 * Aligned with official shadcn preset
 *
 * @example
 * ```html
 * <app-button-group>
 *   <button argusx-button>Save</button>
 *   <app-button-group-separator />
 *   <button argusx-button>Cancel</button>
 * </app-button-group>
 * ```
 */
@Component({
  selector: 'app-button-group-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    '[attr.data-slot]': '"button-group-separator"',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class ButtonGroupSeparatorComponent {
  /**
   * Orientation of the separator.
   * @default 'vertical'
   */
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  /**
   * Computed classes for the separator.
   */
  protected readonly computedClass = computed(() => {
    const isHorizontal = this.orientation() === 'horizontal';

    return cn(
      'bg-input relative self-stretch',
      // Orientation-specific styles
      isHorizontal ? 'mx-px w-auto' : 'my-px h-auto',
      this.class()
    );
  });
}
