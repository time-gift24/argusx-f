import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * InputGroupInput - Input element styled for use inside InputGroup.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/input-group.tsx)
 *
 * @example
 * ```html
 * <argusx-input-group-input placeholder="Enter email" [(value)]="email" />
 * ```
 */
@Component({
  selector: 'argusx-input-group-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      [class]="computedClass()"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [value]="value()"
      [attr.aria-invalid]="ariaInvalid()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.data-slot]="'input-group-control'"
      (input)="onInput($event)"
    />
  `,
  host: {
    class: 'flex min-w-0 flex-1',
  },
})
export class InputGroupInputComponent {
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly value = model<string>('');
  readonly ariaInvalid = input<boolean | string | undefined>(undefined);
  readonly ariaDescribedby = input<string | undefined>(undefined);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent flex-1',
      'h-full w-full px-2 py-0.5 text-sm md:text-xs/relaxed outline-none placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
