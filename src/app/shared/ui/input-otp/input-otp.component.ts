import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { LucideAngularModule, Minus } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';

/**
 * Input OTP Slot Interface
 * Represents the state of each OTP input slot
 */
export interface InputOtpSlot {
  char: string | null;
  placeholderChar: string | null;
  isActive: boolean;
  hasFakeCaret: boolean;
}

/**
 * Regular expression patterns for OTP validation
 * Aligned with input-otp library patterns
 */
export const REGEXP_ONLY_DIGITS = '^\\d+$';
export const REGEXP_ONLY_CHARS = '^[a-zA-Z]+$';
export const REGEXP_ONLY_DIGITS_AND_CHARS = '^[a-zA-Z0-9]+$';

/**
 * Input OTP Component
 * One-time password input component for verification codes
 *
 * @example
 * ```html
 * <argusx-input-otp [(value)]="otp" [maxLength]="6" (complete)="onComplete($event)" />
 * ```
 *
 * @example
 * ```html
 * <argusx-input-otp [(value)]="otp" [pattern]="REGEXP_ONLY_DIGITS">
 *   <argusx-input-otp-group>
 *     @for (i of [0,1,2]; track i) {
 *       <argusx-input-otp-slot [index]="i" />
 *     }
 *     <argusx-input-otp-separator />
 *     @for (i of [3,4,5]; track i) {
 *       <argusx-input-otp-slot [index]="i" />
 *     }
 *   </argusx-input-otp-group>
 * </argusx-input-otp>
 * ```
 */
@Component({
  selector: 'argusx-input-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"input-otp"',
    '[class]': 'computedClass()',
  },
  template: `
    <div #container class="flex items-center has-disabled:opacity-50" [class]="class()">
      <ng-content />
    </div>
    <input
      #input
      type="text"
      [attr.data-input-otp]="true"
      [attr.maxLength]="maxLength()"
      [attr.inputMode]="inputMode()"
      [attr.pattern]="patternSource()"
      [attr.data-input-otp-mss]="selectionStart() ?? undefined"
      [attr.data-input-otp-mse]="selectionEnd() ?? undefined"
      [attr.aria-placeholder]="placeholder()"
      [attr.aria-invalid]="ariaInvalid()"
      [attr.aria-describedby]="ariaDescribedby()"
      [disabled]="disabled()"
      [attr.autocomplete]="autoComplete()"
      [style.position]="'absolute'"
      [style.inset]="'0'"
      [style.width]="'100%'"
      [style.height]="'100%'"
      [style.display]="'flex'"
      [style.textAlign]="textAlign()"
      [style.opacity]="'1'"
      [style.color]="'transparent'"
      [style.pointerEvents]="'all'"
      [style.background]="'transparent'"
      [style.caretColor]="'transparent'"
      [style.border]="'0 solid transparent'"
      [style.outline]="'0 solid transparent'"
      [style.boxShadow]="'none'"
      [style.lineHeight]="'1'"
      [style.letterSpacing]="'-.5em'"
      [style.fontSize]="'var(--root-height)'"
      [style.fontFamily]="'monospace'"
      [style.fontVariantNumeric]="'tabular-nums'"
    />
  `,
})
export class InputOtpComponent {
  private readonly elementRef = inject(ElementRef);

  readonly value = model<string>('');
  readonly maxLength = input<number>(6);
  readonly pattern = input<string | RegExp | null>(null);
  readonly placeholder = input<string>('');
  readonly inputMode = input<'numeric' | 'text' | 'tel'>('numeric');
  readonly textAlign = input<'left' | 'center' | 'right'>('left');
  readonly autoComplete = input<string>('one-time-code');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');
  readonly ariaDescribedby = input<string>('');
  readonly ariaInvalidInput = input<boolean | 'false' | 'true'>('false');

  readonly complete = output<string>();
  readonly valueChange = output<string>();

  @ViewChildren('container') containerRef!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('input') inputRef!: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly selectionStart = computed(() => this.internalState.selectionStart);
  protected readonly selectionEnd = computed(() => this.internalState.selectionEnd);
  protected readonly isFocused = computed(() => this.internalState.isFocused);

  protected readonly computedClass = computed(() =>
    cn(
      'disabled:cursor-not-allowed relative',
      this.disabled() && 'opacity-50 pointer-events-none'
    )
  );

  protected readonly patternSource = computed(() => {
    const pattern = this.pattern();
    if (!pattern) return undefined;
    return typeof pattern === 'string' ? pattern : pattern.source;
  });

  protected readonly ariaInvalid = computed(() => {
    const invalid = this.ariaInvalidInput();
    if (typeof invalid === 'boolean') return invalid ? 'true' : 'false';
    return invalid;
  });

  private internalState = {
    value: '',
    selectionStart: 0 as number | null,
    selectionEnd: 0 as number | null,
    isFocused: false,
  };

  private readonly compiledPattern = computed(() => {
    const pattern = this.pattern();
    if (!pattern) return null;
    return typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  });

  private readonly slots = computed<InputOtpSlot[]>(() => {
    const currentLength = this.maxLength();
    const currentValue = this.value() || '';
    const currentPlaceholder = this.placeholder() || '';
    const currentSelectionStart = this.internalState.selectionStart;
    const currentSelectionEnd = this.internalState.selectionEnd;
    const currentIsFocused = this.internalState.isFocused;

    return Array.from({ length: currentLength }).map((_, index) => {
      const char = currentValue[index] !== undefined ? currentValue[index] : null;
      const placeholderChar =
        currentValue[0] !== undefined ? null : (currentPlaceholder[index] != null ? currentPlaceholder[index] : null);

      // Determine if this slot is active (has selection or cursor)
      const isActive =
        currentIsFocused &&
        currentSelectionStart !== null &&
        currentSelectionEnd !== null &&
        ((currentSelectionStart === currentSelectionEnd && index === currentSelectionStart) ||
        (index >= currentSelectionStart && index < currentSelectionEnd));

      const hasFakeCaret = isActive && char === null;

      return { char, placeholderChar, isActive, hasFakeCaret };
    });
  });

  constructor() {
    effect(() => {
      const value = this.value() || '';
      const length = this.maxLength();

      // Emit valueChange for Angular standard change notification
      this.valueChange.emit(value);

      // Emit complete event when OTP is fully filled
      if (value.length === length) {
        this.complete.emit(value);
      }

      this.internalState.value = value;
    });

    // Set up input event listeners
    effect(() => {
      const input = this.inputRef?.first;
      if (!input) return;

      const nativeElement = input.nativeElement;

      const input$ = fromEvent<InputEvent>(nativeElement, 'input');
      const paste$ = fromEvent<ClipboardEvent>(nativeElement, 'paste');
      const focus$ = fromEvent<FocusEvent>(nativeElement, 'focus');
      const blur$ = fromEvent<FocusEvent>(nativeElement, 'blur');
      const selectionChange$ = fromEvent(document, 'selectionchange');

      merge(input$, paste$, focus$, blur$, selectionChange$)
        .pipe(takeUntilDestroyed())
        .subscribe((event) => this.handleEvent(event as Event));
    });
  }

  private handleEvent(event: Event): void {
    const input = this.inputRef?.first?.nativeElement;
    if (!input) return;

    switch (event.type) {
      case 'input':
        this.handleInput(event as InputEvent);
        break;
      case 'paste':
        this.handlePaste(event as ClipboardEvent);
        break;
      case 'focus':
        this.handleFocus();
        break;
      case 'blur':
        this.handleBlur();
        break;
      case 'selectionchange':
        this.handleSelectionChange();
        break;
    }
  }

  private handleInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const newValue = input.value.slice(0, this.maxLength());
    const pattern = this.compiledPattern();

    // Validate against pattern if provided
    if (newValue.length > 0 && pattern && !pattern.test(newValue)) {
      event.preventDefault();
      input.value = this.value() || '';
      return;
    }

    // Update value
    this.value.set(newValue);

    // Update cursor position
    const newPosition = Math.min(newValue.length, this.maxLength() - 1);
    input.setSelectionRange(newPosition, newValue.length);
    this.internalState.selectionStart = newPosition;
    this.internalState.selectionEnd = newValue.length;
  }

  private handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const input = this.inputRef?.first?.nativeElement;
    if (!input) return;

    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const currentValue = this.value() || '';
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const pattern = this.compiledPattern();

    // Build new value with pasted content
    const newValue =
      selectionStart !== selectionEnd
        ? currentValue.slice(0, selectionStart) + pastedText + currentValue.slice(selectionEnd)
        : currentValue.slice(0, selectionStart) + pastedText + currentValue.slice(selectionStart);

    const truncatedValue = newValue.slice(0, this.maxLength());

    // Validate against pattern if provided
    if (truncatedValue.length > 0 && pattern && !pattern.test(truncatedValue)) {
      return;
    }

    // Update value and cursor
    input.value = truncatedValue;
    this.value.set(truncatedValue);

    const newPosition = Math.min(truncatedValue.length, this.maxLength() - 1);
    input.setSelectionRange(newPosition, truncatedValue.length);
    this.internalState.selectionStart = newPosition;
    this.internalState.selectionEnd = truncatedValue.length;
  }

  private handleFocus(): void {
    const input = this.inputRef?.first?.nativeElement;
    if (!input) return;

    this.internalState.isFocused = true;

    // Set cursor to end or next empty position
    const currentValue = this.value() || '';
    const newPosition = Math.min(currentValue.length, this.maxLength() - 1);
    input.setSelectionRange(newPosition, currentValue.length);
    this.internalState.selectionStart = newPosition;
    this.internalState.selectionEnd = currentValue.length;
  }

  private handleBlur(): void {
    this.internalState.isFocused = false;
    this.internalState.selectionStart = null;
    this.internalState.selectionEnd = null;
  }

  private handleSelectionChange(): void {
    const input = this.inputRef?.first?.nativeElement;
    if (!input || document.activeElement !== input) return;

    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    this.internalState.selectionStart = selectionStart;
    this.internalState.selectionEnd = selectionEnd;
  }

  /**
   * Get the current slot states for child components
   */
  getSlotStates(): InputOtpSlot[] {
    return this.slots();
  }

  /**
   * Focus the input element
   */
  focus(): void {
    this.inputRef?.first?.nativeElement.focus();
  }

  /**
   * Blur the input element
   */
  blur(): void {
    this.inputRef?.first?.nativeElement.blur();
  }
}

/**
 * Input OTP Group Component
 * Container for grouping OTP slots
 */
@Component({
  selector: 'argusx-input-otp-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"input-otp-group"',
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class InputOtpGroupComponent {
  readonly class = input<string>('');
  readonly ariaInvalid = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive rounded-md has-aria-invalid:ring-2 flex items-center',
      this.ariaInvalid() && 'ring-2 ring-destructive/20 border-destructive dark:ring-destructive/40',
      this.class()
    )
  );
}

/**
 * Input OTP Slot Component
 * Individual slot for displaying a single character of the OTP
 */
@Component({
  selector: 'argusx-input-otp-slot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"input-otp-slot"',
    '[attr.data-active]': 'slotState().isActive()',
    '[class]': 'computedClass()',
  },
  template: `
    @if (slotState().char()) {
      <span>{{ slotState().char() }}</span>
    }
    @if (slotState().placeholderChar()) {
      <span class="text-muted-foreground">{{ slotState().placeholderChar() }}</span>
    }
    @if (slotState().hasFakeCaret()) {
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
      </div>
    }
  `,
})
export class InputOtpSlotComponent {
  readonly index = input.required<number>();
  readonly class = input<string>('');

  private readonly otpComponent = inject(InputOtpComponent);

  protected readonly slotState = computed(() => {
    const slots = this.otpComponent.getSlotStates();
    const slot = slots[this.index()];
    return {
      char: () => slot?.char,
      placeholderChar: () => slot?.placeholderChar,
      isActive: () => slot?.isActive ?? false,
      hasFakeCaret: () => slot?.hasFakeCaret ?? false,
    };
  });

  protected readonly computedClass = computed(() =>
    cn(
      'bg-input/20 dark:bg-input/30 border-input data-[active=true]:border-ring data-[active=true]:ring-ring/30 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive size-7 border-y border-r text-xs/relaxed transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:ring-2 relative flex items-center justify-center data-[active=true]:z-10',
      this.class()
    )
  );
}

/**
 * Input OTP Separator Component
 * Visual separator between OTP slot groups
 */
@Component({
  selector: 'argusx-input-otp-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {
    '[attr.data-slot]': '"input-otp-separator"',
    '[attr.role]': '"separator"',
    '[class]': 'computedClass()',
  },
  template: `
    <div class="[&_svg:not([class*='size-'])]:size-4 flex items-center">
      <lucide-icon [img]="minusIcon"></lucide-icon>
    </div>
  `,
})
export class InputOtpSeparatorComponent {
  readonly minusIcon = Minus;
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('[&_svg:not([class*=size-])]:size-4 flex items-center', this.class())
  );
}
