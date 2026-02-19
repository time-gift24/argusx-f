import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { ARGUSX_INPUT_GROUP_CONTEXT } from './input-group.component';

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
        [attr.id]="resolvedId()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [readonly]="readonly()"
        [required]="required()"
        [value]="value()"
        [attr.rows]="rows()"
        [attr.cols]="cols()"
        [attr.aria-invalid]="ariaInvalid()"
        [attr.aria-describedby]="ariaDescribedby()"
        [attr.data-size]="groupSize()"
        [attr.data-slot]="'input-group-control'"
        (input)="onInput($event)"
      ></textarea>
  `,
  host: {
    class: 'flex min-w-0 flex-1 w-full',
    '[attr.id]': 'null',
  },
})
export class InputGroupTextareaComponent {
  readonly id = input<string | undefined>(undefined);
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

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly group = inject(ARGUSX_INPUT_GROUP_CONTEXT, { optional: true });
  private readonly hostId = this.elementRef.nativeElement.getAttribute('id') ?? undefined;

  protected readonly isDisabled = computed(
    () =>
      this.disabled() ||
      this.group?.disabled() === true ||
      this.group?.loading() === true
  );

  protected readonly groupSize = computed(() => this.group?.size() ?? 'default');
  protected readonly resolvedId = computed(() => this.id() ?? this.hostId);

  protected readonly computedClass = computed(() =>
    cn(
      'rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent flex-1 resize-none',
      'w-full px-2 text-sm/relaxed outline-none placeholder:text-muted-foreground',
      'group-data-[size=sm]/input-group:px-1.5 group-data-[size=sm]/input-group:py-1.5 group-data-[size=sm]/input-group:text-xs/relaxed',
      'group-data-[size=lg]/input-group:px-2.5 group-data-[size=lg]/input-group:py-2.5 group-data-[size=lg]/input-group:text-base/relaxed',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }
}
