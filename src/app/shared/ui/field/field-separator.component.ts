import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { ArgusxSeparatorComponent } from '../separator/separator.component';

/**
 * FieldSeparator component for separating field groups.
 * Can display optional content in the center.
 *
 * @example
 * ```html
 * <app-field-separator>OR</app-field-separator>
 * <app-field-separator></app-field-separator>
 * ```
 */
@Component({
  selector: 'argusx-field-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxSeparatorComponent],
  template: `
    <argusx-separator class="absolute inset-0 top-1/2" />
    @if (hasContent()) {
      <span
        class="text-muted-foreground px-2 bg-background relative mx-auto block w-fit"
        data-slot="field-separator-content"
      >
        <ng-content></ng-content>
      </span>
    }
  `,
  host: {
    '[attr.data-slot]': '"field-separator"',
    '[attr.data-content]': 'hasContent()',
    '[class]': 'computedClass()',
  },
})
export class FieldSeparatorComponent {
  /**
   * Whether the separator has content.
   */
  readonly hasContent = input<boolean>(false);

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      '-my-2 h-5 text-xs/relaxed group-data-[variant=outline]/field-group:-mb-2 relative',
      this.class()
    )
  );
}
