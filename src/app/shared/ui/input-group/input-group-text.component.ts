import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * InputGroupText - Text element for displaying inside InputGroup.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * @example
 * ```html
 * <argusx-input-group-text>
 *   <lucide-icon [img]="searchIcon"></lucide-icon>
 *   Search
 * </argusx-input-group-text>
 * ```
 */
@Component({
  selector: 'argusx-input-group-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="computedClass()">
      <ng-content />
    </span>
  `,
})
export class InputGroupTextComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "text-muted-foreground gap-2 text-xs/relaxed [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none",
      this.class()
    )
  );
}
