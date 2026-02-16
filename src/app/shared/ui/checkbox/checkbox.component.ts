import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { cn } from '../../utils/cn';
import { CheckIcon, MinusIcon } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type CheckboxCheckedState = boolean | 'indeterminate';

// ============================================================================
// Checkbox Root Token for DI (using injection token)
// ============================================================================

import { InjectionToken } from '@angular/core';

export const CHECKBOX_ROOT_TOKEN = new InjectionToken<CheckboxComponent>('CHECKBOX_ROOT_TOKEN');

// ============================================================================
// Checkbox Component
// ============================================================================

let checkboxIdCounter = 0;

/**
 * Checkbox Component
 *
 * A checkbox component that supports three states: checked, unchecked, and indeterminate.
 * Integrates with Angular Reactive Forms via ControlValueAccessor.
 *
 * @example
 * ```html
 * <app-checkbox [(checked)]="rememberMe">Remember me</app-checkbox>
 *
 * <app-checkbox [(ngModel)]="termsAccepted" required>
 *   I accept the terms and conditions
 * </app-checkbox>
 *
 * <app-checkbox [formControl]="myControl">Label</app-checkbox>
 * ```
 *
 * Reference: .vendor/aim/components/ui/checkbox.tsx
 */
@Component({
  selector: 'app-checkbox',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <button
      type="button"
      [id]="id()"
      [class]="computedClass()"
      [attr.data-state]="state()"
      [attr.data-disabled]="disabled() ? '' : null"
      [attr.aria-checked]="ariaChecked()"
      [attr.aria-required]="required() || null"
      [attr.name]="name() || null"
      [attr.value]="value() || null"
      [disabled]="disabled()"
      (click)="toggle()"
      (keydown)="onKeydown($event)"
      data-slot="checkbox"
    >
      <div
        class="grid place-content-center text-current transition-none"
        data-slot="checkbox-indicator"
      >
        @if (isIndeterminate()) {
          <lucide-icon [img]="minusIcon" class="size-3.5" />
        } @else if (isChecked()) {
          <lucide-icon [img]="checkIcon" class="size-3.5" />
        }
      </div>
    </button>
    <ng-content />
  `,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-slot]': '"checkbox-wrapper"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
    {
      provide: CHECKBOX_ROOT_TOKEN,
      useExisting: forwardRef(() => CheckboxComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  // ============================================================================
  // Icons
  // ============================================================================
  protected readonly checkIcon = CheckIcon;
  protected readonly minusIcon = MinusIcon;

  // ============================================================================
  // Inputs
  // ============================================================================
  readonly checked = model<CheckboxCheckedState>(false);
  readonly disabled = input<boolean>(false);
  readonly name = input<string>();
  readonly value = input<string>();
  readonly required = input<boolean>(false);
  readonly class = input<string>('');

  // ============================================================================
  // Outputs
  // ============================================================================
  readonly checkedChange = output<CheckboxCheckedState>();

  // ============================================================================
  // Internal State
  // ============================================================================
  readonly id = signal(`checkbox-${checkboxIdCounter++}`);

  protected onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  // ============================================================================
  // Computed Properties
  // ============================================================================

  /**
   * Visual state for styling (checked, unchecked, or indeterminate)
   */
  protected readonly state = computed<'checked' | 'unchecked' | 'indeterminate'>(() => {
    const checkedValue = this.checked();
    if (checkedValue === 'indeterminate') return 'indeterminate';
    return checkedValue ? 'checked' : 'unchecked';
  });

  /**
   * ARIA checked attribute value
   */
  protected readonly ariaChecked = computed<'true' | 'false' | 'mixed'>(() => {
    const checkedValue = this.checked();
    if (checkedValue === 'indeterminate') return 'mixed';
    return checkedValue ? 'true' : 'false';
  });

  /**
   * Whether the checkbox is checked
   */
  protected readonly isChecked = computed(() => {
    return this.checked() === true;
  });

  /**
   * Whether the checkbox is in indeterminate state
   */
  protected readonly isIndeterminate = computed(() => {
    return this.checked() === 'indeterminate';
  });

  /**
   * Computed CSS classes for the checkbox button
   * Aligned with official shadcn preset (.vendor/aim/components/ui/checkbox.tsx)
   */
  protected readonly computedClass = computed(() =>
    cn(
      'border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'aria-invalid:not-data-[state=checked]:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
      'focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      'flex size-4 items-center justify-center rounded-[4px] border transition-shadow group-has-disabled/field:opacity-50',
      'focus-visible:ring-2 aria-invalid:ring-2 peer relative shrink-0 outline-none',
      'after:absolute after:-inset-x-3 after:-inset-y-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  /**
   * Host wrapper class
   */
  protected readonly hostClass = computed(() =>
    cn('inline-flex items-center gap-2', this.disabled() && 'opacity-50')
  );

  // ============================================================================
  // Public Methods
  // ============================================================================

  /**
   * Toggle checkbox state
   */
  toggle(): void {
    if (this.disabled()) return;

    const currentChecked = this.checked();
    const newChecked = currentChecked === true ? false : true;

    this.checked.set(newChecked);
    this.onChange(newChecked);
    this.onTouched();
    this.checkedChange.emit(newChecked);
  }

  /**
   * Handle keyboard navigation
   */
  protected onKeydown(event: KeyboardEvent): void {
    // Allow keyboard activation with Space or Enter
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!this.disabled()) {
        this.toggle();
      }
    }
  }

  // ============================================================================
  // ControlValueAccessor Implementation
  // ============================================================================

  writeValue(value: CheckboxCheckedState | null | undefined): void {
    // Convert null/undefined to false for consistency
    this.checked.set(value === true || value === 'indeterminate' ? value : false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Note: We can't directly set an input() signal value
    // The parent component should handle this through the disabled input
    // This is a known limitation with signal-based inputs and CVA
  }
}

// ============================================================================
// Exports
// ============================================================================

export const CheckboxComponents = [CheckboxComponent];
