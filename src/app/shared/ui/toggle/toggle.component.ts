import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { cn } from '../../utils/cn';

import { toggleVariants, type ArgusxToggleVariants } from './toggle.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'argusx-toggle',
  template: `
    <button
      type="button"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-pressed]="value()"
      [attr.data-state]="value() ? 'on' : 'off'"
      [class]="classes()"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <ng-content />
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArgusxToggleComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(mouseenter)': 'handleHover()',
  },
})
export class ArgusxToggleComponent implements ControlValueAccessor {
  readonly value = input<boolean | undefined>();
  readonly default = input<boolean>(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<ArgusxToggleVariants['variant']>('plain');
  readonly size = input<ArgusxToggleVariants['size']>('md');
  readonly ariaLabel = input<string>('');
  readonly class = input<ClassValue>('');

  readonly toggleClick = output<void>();
  readonly toggleHover = output<void>();
  readonly toggleChange = output<boolean>();

  private readonly isUsingNgModel = signal(false);

  protected readonly state = linkedSignal(() => this.value() ?? this.default());

  protected readonly disabledState = linkedSignal(() => this.disabled());

  protected readonly classes = computed(() =>
    cn(
      toggleVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  handleHover(): void {
    this.toggleHover.emit();
  }

  toggle(): void {
    if (this.disabledState()) return;

    const next = !this.state();

    if (this.value() === undefined) {
      this.state.set(next);
    }

    this.toggleClick.emit();
    this.toggleChange.emit(next);
    this.onChangeFn(next);
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.state.set(val ?? this.default());
  }

  registerOnChange(fn: unknown): void {
    this.onChangeFn = fn as OnChangeType;
    this.isUsingNgModel.set(true);
  }

  registerOnTouched(fn: unknown): void {
    this.onTouched = fn as OnTouchedType;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
