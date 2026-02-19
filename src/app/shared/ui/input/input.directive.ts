import { computed, Directive, ElementRef, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const argusxInputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-7 w-full min-w-0 rounded-md border bg-transparent px-2 py-0.5 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
);

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Directive({
  selector: 'input[argusxInput]',
  exportAs: 'argusxInput',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArgusxInputDirective),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"input"',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
  },
})
export class ArgusxInputDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private onTouched: OnTouchedType = () => {};
  private onChangeFn: OnChangeType = () => {};

  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn(argusxInputVariants(), this.class()));

  protected onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.onChangeFn(inputElement?.value ?? '');
  }

  protected onBlur(): void {
    this.onTouched();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  writeValue(value?: string): void {
    this.elementRef.nativeElement.value = value ?? '';
  }
}

export { argusxInputVariants };
