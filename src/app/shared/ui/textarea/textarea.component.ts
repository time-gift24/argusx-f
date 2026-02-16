import { ChangeDetectionStrategy, Component, input, signal, model, computed } from '@angular/core';
import { cn } from '../../utils/cn';

export type TextareaStatus = 'default' | 'error' | 'warning' | 'success';

@Component({
  selector: 'app-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <textarea
      [class]="computedClass()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [value]="value()"
      [attr.rows]="rows()"
      [attr.cols]="cols()"
      [attr.aria-invalid]="ariaInvalid()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.data-status]="status()"
      (input)="onInput($event)"
      data-slot="textarea"
    ></textarea>
  `,
  host: {
    '[class.flex]': 'true',
    '[class.flex-col]': 'true',
  },
})
export class TextareaComponent {
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly value = model<string>('');
  readonly rows = input<number | undefined>(undefined);
  readonly cols = input<number | undefined>(undefined);
  readonly ariaInvalid = input<boolean | string | undefined>(undefined);
  readonly ariaDescribedby = input<string | undefined>(undefined);
  readonly status = input<TextareaStatus>('default');
  readonly class = input<string>('');

  protected baseClasses =
    'border-input bg-input/20 dark:bg-input/30 ' +
    'focus-visible:border-ring focus-visible:ring-ring/30 ' +
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 ' +
    'aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 ' +
    'resize-none rounded-md border px-2 py-2 text-sm transition-colors ' +
    'focus-visible:ring-2 aria-invalid:ring-2 md:text-xs/relaxed ' +
    'placeholder:text-muted-foreground flex field-sizing-content ' +
    'min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50';

  protected statusClasses: Record<TextareaStatus, string> = {
    default: '',
    error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
    warning: 'border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/30',
    success: 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/30',
  };

  protected computedClass = computed(() =>
    cn(this.baseClasses, this.statusClasses[this.status()], this.class())
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }
}
