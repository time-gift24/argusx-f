import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  InjectionToken,
  input,
  model,
  signal,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { cn } from '../../utils/cn';
import { CircleIcon } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

// ============================================================================
// Radio Group Root Token for DI
// ============================================================================

export interface RadioGroupContext {
  name: () => string;
  value: () => string | undefined;
  disabled: () => boolean;
  required: () => boolean;
  select: (value: string) => void;
}

export const RADIO_GROUP_TOKEN = new InjectionToken<RadioGroupContext>('RadioGroupContext');

// ============================================================================
// Radio Group Root Component
// ============================================================================

let radioGroupIdCounter = 0;

/**
 * RadioGroup Component
 *
 * A radio group component that allows single selection from multiple options.
 * Integrates with Angular Reactive Forms via ControlValueAccessor.
 *
 * @example
 * ```html
 * <app-radio-group [(value)]="selectedOption">
 *   <app-radio-item value="option1">Option 1</app-radio-item>
 *   <app-radio-item value="option2">Option 2</app-radio-item>
 * </app-radio-group>
 *
 * <app-radio-group [formControl]="myControl">
 *   <app-radio-item value="a">A</app-radio-item>
 *   <app-radio-item value="b">B</app-radio-item>
 * </app-radio-group>
 * ```
 *
 * Reference: .vendor/aim/components/ui/radio-group.tsx
 */
@Component({
  selector: 'app-radio-group',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      role="radiogroup"
      [attr.aria-labelledby]="ariaLabelledBy() || null"
      [attr.aria-required]="required() || null"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      [attr.data-disabled]="disabled() ? '' : null"
      [attr.name]="name() || null"
      data-slot="radio-group"
      class="grid gap-3 w-full"
    >
      <ng-content />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
    {
      provide: RADIO_GROUP_TOKEN,
      useExisting: forwardRef(() => RadioGroupComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent
  implements RadioGroupContext, ControlValueAccessor, AfterContentInit, OnDestroy
{
  // ============================================================================
  // Inputs
  // ============================================================================
  readonly value = model<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly name = input<string>(`radio-group-${radioGroupIdCounter++}`);
  readonly required = input<boolean>(false);
  readonly ariaLabelledBy = input<string>();

  // ============================================================================
  // Internal State
  // ============================================================================

  protected onChange: (value: string | undefined) => void = () => {};
  protected onTouched: () => void = () => {};

  // ============================================================================
  // RadioGroupContext Implementation
  // ============================================================================

  select(newValue: string): void {
    if (this.disabled()) return;

    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  // ============================================================================
  // ControlValueAccessor Implementation
  // ============================================================================

  writeValue(value: string | undefined): void {
    this.value.set(value ?? undefined);
  }

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Note: disabled state is controlled via input
  }

  // ============================================================================
  // Lifecycle
  // ============================================================================

  ngAfterContentInit(): void {
    // Content initialized
  }

  ngOnDestroy(): void {
    // Cleanup
  }
}

// ============================================================================
// Radio Item Component
// ============================================================================

let radioItemIdCounter = 0;

/**
 * RadioItem Component
 *
 * Individual radio button item within a RadioGroup.
 *
 * @example
 * ```html
 * <app-radio-group [(value)]="selected">
 *   <app-radio-item value="option1">
 *     <label>Option 1</label>
 *   </app-radio-item>
 * </app-radio-group>
 * ```
 */
@Component({
  selector: 'app-radio-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      type="button"
      role="radio"
      [id]="id"
      [class]="computedClass()"
      [attr.aria-checked]="isChecked()"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      [attr.data-state]="isChecked() ? 'checked' : 'unchecked'"
      [attr.data-disabled]="isDisabled() ? '' : null"
      [disabled]="isDisabled()"
      (click)="onSelect()"
      (keydown)="onKeydown($event)"
      data-slot="radio-group-item"
    >
      <span
        class="flex size-4 items-center justify-center text-white"
        data-slot="radio-group-indicator"
      >
        @if (isChecked()) {
          <lucide-icon
            [img]="circleIcon"
            class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current"
          />
        }
      </span>
    </button>
    <ng-content select="label" />
  `,
  host: {
    '[class]': '"inline-flex items-center gap-2"',
    '[class.opacity-50]': 'isDisabled()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioItemComponent {
  // ============================================================================
  // Icons
  // ============================================================================
  protected readonly circleIcon = CircleIcon;

  // ============================================================================
  // Inputs
  // ============================================================================
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  // ============================================================================
  // Internal State
  // ============================================================================
  readonly id = `radio-item-${radioItemIdCounter++}`;

  // ============================================================================
  // DI
  // ============================================================================
  private readonly radioGroup = inject(RADIO_GROUP_TOKEN);

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly isChecked = computed(() => {
    return this.radioGroup.value() === this.value();
  });

  protected readonly isDisabled = computed(() => {
    return this.disabled() || this.radioGroup.disabled();
  });

  protected readonly computedClass = computed(() =>
    cn(
      'border-input text-primary dark:bg-input/30',
      'focus-visible:border-ring focus-visible:ring-ring/30',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'flex size-4 rounded-full transition-none',
      'focus-visible:ring-2 aria-invalid:ring-2 peer relative aspect-square shrink-0 border outline-none',
      'after:absolute after:-inset-x-3 after:-inset-y-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  // ============================================================================
  // Methods
  // ============================================================================

  protected onSelect(): void {
    if (this.isDisabled()) return;
    this.radioGroup.select(this.value());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.onSelect();
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

export const RadioGroupComponents = [RadioGroupComponent, RadioItemComponent];
