import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * InputGroupTextarea - Textarea element styled for use inside InputGroup.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * @example
 * ```html
 * <argusx-input-group-textarea placeholder="Enter message" [(value)]="message" [rows]="4" />
 * ```
 */
@Component({
  selector: 'argusx-input-group-textarea',
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
      [attr.data-slot]="'input-group-control'"
      (input)="onInput($event)"
    ></textarea>
  `,
  host: {
    class: 'flex min-w-0 flex-1',
  },
})
export class InputGroupTextareaComponent {
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly value = model<string>('');
  readonly rows = input<number | undefined>(undefined);
  readonly cols = input<number | undefined>(undefined);
  readonly ariaInvalid = input<boolean | string | undefined>(undefined);
  readonly ariaDescribedby = input<string | undefined>(undefined);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent flex-1 resize-none',
      'w-full px-2 text-sm md:text-xs/relaxed outline-none placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }
}
