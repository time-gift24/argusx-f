import { Directive, ElementRef, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const argusxTextareaVariants = cva(
  'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        plain: '',
        borderless:
          'border-0 bg-transparent px-0 shadow-none focus-visible:border-transparent focus-visible:ring-0',
      },
      size: {
        default: '',
        sm: 'min-h-14 px-2.5 py-1.5 text-sm md:text-xs',
        lg: 'min-h-20 px-4 py-3 text-base md:text-base',
      },
      status: {
        default: '',
        error:
          'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
        warning:
          'border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/30',
        success:
          'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/30',
      },
    },
    defaultVariants: {
      variant: 'plain',
      size: 'default',
      status: 'default',
    },
  }
);

type ArgusxTextareaVariants = VariantProps<typeof argusxTextareaVariants>;
type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

export type ArgusxTextareaVariant = NonNullable<ArgusxTextareaVariants['variant']>;
export type ArgusxTextareaSize = NonNullable<ArgusxTextareaVariants['size']>;
export type ArgusxTextareaStatus = NonNullable<ArgusxTextareaVariants['status']>;

@Directive({
  selector: 'textarea[argusxTextarea]',
  exportAs: 'argusxTextarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArgusxTextareaDirective),
      multi: true,
    },
  ],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"textarea"',
    '[attr.data-variant]': 'argusxVariant',
    '[attr.data-size]': 'argusxSize',
    '[attr.data-status]': 'argusxStatus === "default" ? null : argusxStatus',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
  },
})
export class ArgusxTextareaDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLTextAreaElement>);
  private onTouched: OnTouchedType = () => {};
  private onChangeFn: OnChangeType = () => {};

  @Input() argusxVariant: ArgusxTextareaVariant = 'plain';
  @Input() argusxSize: ArgusxTextareaSize = 'default';
  @Input() argusxStatus: ArgusxTextareaStatus = 'default';
  @Input('class') userClass = '';

  protected computedClass(): string {
    return cn(
      argusxTextareaVariants({
        variant: this.argusxVariant,
        size: this.argusxSize,
        status: this.argusxStatus,
      }),
      this.userClass
    );
  }

  protected onInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement | null;
    this.onChangeFn(textareaElement?.value ?? '');
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

export { argusxTextareaVariants };
