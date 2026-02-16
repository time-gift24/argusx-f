import { ChangeDetectionStrategy, computed, Component, ElementRef, input, model, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDirective, type InputStatus, type InputSize } from './input.directive';

/**
 * Component that provides a styled input with full form integration.
 * Use when you need ngModel or FormControl binding.
 *
 * @example
 * ```html
 * <app-input [(ngModel)]="value" />
 * <app-input formControlName="email" status="error" />
 * ```
 */
@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDirective],
  host: {
    '[class]': 'computedClass()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <input
      #inputElement
      appInput
      [type]="type()"
      [status]="status()"
      [size]="size()"
      [borderless]="borderless()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [placeholder]="placeholder()"
      [attr.data-slot]="'input'"
      [attr.data-status]="status()"
      [attr.data-size]="size()"
      (input)="onInput($event)"
      (blur)="onTouched()"
    />
  `,
})
export class InputComponent implements ControlValueAccessor {
  readonly type = input<string>('text');
  readonly status = input<InputStatus>('default');
  readonly size = input<InputSize>('md');
  readonly borderless = input<boolean>(false);
  readonly disabled = model<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    // 只传递 class，不传递 border 样式（由内部 input 指令处理）
    this.class()
  );

  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  // ControlValueAccessor implementation
  protected onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (this.inputElement?.nativeElement) {
      this.inputElement.nativeElement.value = value ?? '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }
}
