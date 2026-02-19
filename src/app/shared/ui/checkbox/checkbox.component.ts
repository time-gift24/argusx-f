import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckIcon, LucideAngularModule, MinusIcon } from 'lucide-angular';

import type { ClassValue } from 'clsx';

import { cn } from '../../utils/cn';
import {
  ArgusxCheckboxShape,
  ArgusxCheckboxSize,
  ArgusxCheckboxVariant,
  argusxCheckboxVariants,
} from './checkbox.variants';

export type ArgusxCheckboxCheckedState = boolean | 'indeterminate';

let checkboxIdCounter = 0;

export const ARGUSX_CHECKBOX_ROOT_TOKEN = new InjectionToken<ArgusxCheckboxComponent>(
  'ARGUSX_CHECKBOX_ROOT_TOKEN'
);

@Component({
  selector: 'argusx-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {
    class: 'inline-flex leading-none',
    '[attr.id]': 'null',
  },
  template: `
    <button
      type="button"
      role="checkbox"
      [id]="resolvedId()"
      [class]="classes()"
      [attr.data-slot]="'checkbox'"
      [attr.data-state]="state()"
      [attr.data-disabled]="isDisabled() ? '' : null"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
      [attr.aria-checked]="ariaChecked()"
      [attr.aria-required]="required() || null"
      [attr.aria-disabled]="isDisabled() || null"
      [attr.aria-invalid]="ariaInvalid() || null"
      [attr.aria-label]="ariaLabel() || null"
      [attr.name]="name() || null"
      [attr.value]="value() || null"
      [disabled]="isDisabled()"
      (click)="toggle()"
      (keydown)="onKeydown($event)"
      (blur)="onBlur()"
    >
      <span
        data-slot="checkbox-indicator"
        class="pointer-events-none grid place-content-center text-current transition-none"
      >
        @if (checkedState() === 'indeterminate') {
          <lucide-icon [img]="minusIcon" [class]="indicatorClass()" />
        } @else if (checkedState() === true) {
          <lucide-icon [img]="checkIcon" [class]="indicatorClass()" />
        }
      </span>
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArgusxCheckboxComponent),
      multi: true,
    },
    {
      provide: ARGUSX_CHECKBOX_ROOT_TOKEN,
      useExisting: forwardRef(() => ArgusxCheckboxComponent),
    },
  ],
})
export class ArgusxCheckboxComponent implements ControlValueAccessor {
  protected readonly checkIcon = CheckIcon;
  protected readonly minusIcon = MinusIcon;

  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly initialHostId = this.hostElement.nativeElement.getAttribute('id') ?? undefined;

  readonly checked = input<ArgusxCheckboxCheckedState | undefined>(undefined);
  readonly defaultChecked = input<ArgusxCheckboxCheckedState>(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaInvalid = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();
  readonly checkboxId = input<string>(undefined, { alias: 'id' });
  readonly name = input<string>();
  readonly value = input<string>();
  readonly variant = input<ArgusxCheckboxVariant>('plain');
  readonly size = input<ArgusxCheckboxSize>('default');
  readonly shape = input<ArgusxCheckboxShape>('default');
  readonly class = input<ClassValue>('');

  readonly checkedChange = output<ArgusxCheckboxCheckedState>();

  private readonly generatedId = `argusx-checkbox-${checkboxIdCounter++}`;
  private readonly disabledByForm = signal(false);
  private readonly uncontrolledChecked = signal<ArgusxCheckboxCheckedState>(false);
  private readonly cvaChecked = signal<ArgusxCheckboxCheckedState>(false);
  private readonly cvaBound = signal(false);
  private readonly hasUncontrolledUpdate = signal(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly isDisabled = computed(() => this.disabled() || this.disabledByForm());

  protected readonly resolvedId = computed(
    () => this.checkboxId() || this.initialHostId || this.generatedId
  );

  protected readonly checkedState = computed<ArgusxCheckboxCheckedState>(() => {
    const checked = this.checked();

    if (checked !== undefined) {
      return checked;
    }

    if (this.cvaBound()) {
      return this.cvaChecked();
    }

    if (this.hasUncontrolledUpdate()) {
      return this.uncontrolledChecked();
    }

    return this.defaultChecked();
  });

  protected readonly state = computed<'checked' | 'unchecked' | 'indeterminate'>(() => {
    const value = this.checkedState();

    if (value === 'indeterminate') {
      return 'indeterminate';
    }

    return value ? 'checked' : 'unchecked';
  });

  protected readonly ariaChecked = computed<'true' | 'false' | 'mixed'>(() => {
    const value = this.checkedState();

    if (value === 'indeterminate') {
      return 'mixed';
    }

    return value ? 'true' : 'false';
  });

  protected readonly classes = computed(() =>
    cn(
      argusxCheckboxVariants({
        variant: this.variant(),
        size: this.size(),
        shape: this.shape(),
      }),
      this.class()
    )
  );

  protected readonly indicatorClass = computed(() => (this.size() === 'lg' ? 'size-4' : 'size-3.5'));

  toggle(): void {
    if (this.isDisabled()) {
      return;
    }

    const nextValue = this.nextCheckedState(this.checkedState());

    if (this.checked() === undefined) {
      if (this.cvaBound()) {
        this.cvaChecked.set(nextValue);
      } else {
        this.uncontrolledChecked.set(nextValue);
        this.hasUncontrolledUpdate.set(true);
      }
    }

    this.onChange(nextValue === true);
    this.onTouched();
    this.checkedChange.emit(nextValue);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.toggle();
  }

  protected onBlur(): void {
    this.onTouched();
  }

  writeValue(value: ArgusxCheckboxCheckedState | null | undefined): void {
    this.cvaBound.set(true);
    this.cvaChecked.set(this.normalizeCheckedState(value));
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  private normalizeCheckedState(value: ArgusxCheckboxCheckedState | null | undefined): ArgusxCheckboxCheckedState {
    if (value === true || value === 'indeterminate') {
      return value;
    }

    return false;
  }

  private nextCheckedState(value: ArgusxCheckboxCheckedState): ArgusxCheckboxCheckedState {
    return value === true ? false : true;
  }
}
