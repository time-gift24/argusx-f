import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils/cn';

/** Error object structure for FieldError */
export interface FieldErrorItem {
  message?: string;
}

/**
 * FieldError component for displaying form validation errors.
 * Supports single error or array of errors with automatic deduplication.
 * Automatically uses role="alert" for accessibility.
 *
 * @example
 * ```html
 * <!-- Single error -->
 * <app-field-error>This field is required.</app-field-error>
 *
 * <!-- With error array -->
 * <app-field-error [errors]="formControl.errors"></app-field-error>
 * ```
 */
@Component({
  selector: 'argusx-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (content()) {
      <div [class]="'text-destructive text-xs/relaxed font-normal ' + class()">
        @if (isSingleError()) {
          {{ singleErrorMessage() }}
        } @else {
          <ul class="ml-4 flex list-disc flex-col gap-1">
            @for (error of uniqueErrors(); track error.message) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </div>
    }
  `,
  host: {
    role: 'alert',
    '[attr.data-slot]': '"field-error"',
  },
})
export class FieldErrorComponent {
  /**
   * Array of error objects to display.
   * Errors are deduplicated by message.
   */
  readonly errors = input<Array<FieldErrorItem | undefined>>([]);

  /**
   * Direct content for simple error messages.
   */
  readonly errorContent = input<string>('');

  /**
   * Additional CSS classes to apply.
   */
  readonly class = input<string>('');

  protected readonly uniqueErrors = computed(() => {
    const errors = this.errors();
    if (!errors?.length) return [];

    // Deduplicate by message
    const uniqueMap = new Map<string, FieldErrorItem>();
    for (const error of errors) {
      if (error?.message) {
        uniqueMap.set(error.message, error);
      }
    }
    return Array.from(uniqueMap.values());
  });

  protected readonly singleErrorMessage = computed(() => {
    const errors = this.uniqueErrors();
    return errors.length === 1 ? errors[0]?.message : '';
  });

  protected readonly isSingleError = computed(
    () => this.uniqueErrors().length === 1
  );

  protected readonly content = computed(() => {
    const directContent = this.errorContent();
    if (directContent) return true;

    const errors = this.errors();
    return errors?.length > 0;
  });
}
