import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, inject, input, output, signal } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * A slider component that allows users to select a value from a range.
 * Aligned with shadcn/ui slider component.
 *
 * @example
 * ```html
 * <app-slider [min]="0" [max]="100" [step]="1" [value]="50" (valueChange)="onValueChange($event)" />
 * <app-slider [min]="0" [max]="1" [step]="0.1" [value]="0.5" [orientation]="'vertical'" />
 * ```
 */
@Component({
  selector: 'app-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"slider"',
    '[class]': 'computedClass()',
    '[attr.id]': 'id() || null',
    '[attr.name]': 'name() || null',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    role: 'slider',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledby() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-orientation]': 'orientation()',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown)': 'onKeyDown($event)',
  },
  template: `
    <div
      data-slot="slider-track"
      [attr.data-orientation]="orientation()"
      class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
    >
      <div
        data-slot="slider-range"
        [attr.data-orientation]="orientation()"
        class="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        [style.left.%]="orientation() === 'horizontal' ? 0 : null"
        [style.width.%]="orientation() === 'horizontal' ? position() : null"
        [style.bottom.%]="orientation() === 'vertical' ? 0 : null"
        [style.height.%]="orientation() === 'vertical' ? position() : null"
      ></div>
    </div>

    <div
      data-slot="slider-thumb"
      [attr.data-orientation]="orientation()"
      class="border-primary bg-background ring-ring/50 absolute block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 disabled:pointer-events-none"
      [class.cursor-grab]="!disabled()"
      [class.cursor-grabbing]="isDragging()"
      [class.ring-4]="isDragging()"
      [style.left.%]="orientation() === 'horizontal' ? position() : 50"
      [style.top.%]="orientation() === 'vertical' ? 100 - position() : 50"
      [style.transform]="'translate(-50%, -50%)'"
    ></div>

    <input
      type="hidden"
      [attr.name]="name() || null"
      [value]="value()"
    />
  `,
})
export class SliderComponent implements OnDestroy {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly value = input<number>(0);
  readonly disabled = input<boolean>(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly ariaLabel = input<string>('');
  readonly ariaLabelledby = input<string>('');
  readonly class = input<string>('');

  readonly valueChange = output<number>();

  protected readonly isDragging = signal(false);

  // Calculate the position as a percentage (0-100)
  protected readonly position = computed(() => {
    const min = this.min();
    const max = this.max();
    if (max <= min) {
      return 0;
    }
    const val = this.value();
    const normalized = (val - min) / (max - min);
    return Math.max(0, Math.min(100, normalized * 100));
  });

  protected readonly computedClass = (): string => {
    return cn(
      'relative flex w-full touch-none select-none items-center data-[orientation=horizontal]:h-4',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'focus-visible:outline-none focus-visible:[&_[data-slot=slider-thumb]]:ring-4 focus-visible:[&_[data-slot=slider-thumb]]:ring-ring/50',
      this.class()
    );
  };

  onPointerDown(event: PointerEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.isDragging.set(true);
    this.updateValueFromEvent(event);

    // Add global event listeners
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.isDragging()) {
      return;
    }
    this.updateValueFromEvent(event);
  };

  private onPointerUp = (): void => {
    this.isDragging.set(false);
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  };

  ngOnDestroy(): void {
    // Clean up event listeners to prevent memory leaks
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  private updateValueFromEvent(event: PointerEvent): void {
    const rect = this.hostElement.nativeElement.getBoundingClientRect();
    const clientKey = this.orientation() === 'vertical' ? 'clientY' : 'clientX';

    // For vertical, we need to calculate from bottom to top
    let percentage: number;
    if (this.orientation() === 'vertical') {
      const offset = rect.bottom - event[clientKey];
      percentage = (offset / rect.height) * 100;
    } else {
      percentage = ((event[clientKey] - rect.left) / rect.width) * 100;
    }

    // Clamp percentage between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));

    // Convert to value
    const min = this.min();
    const max = this.max();
    const range = max - min;
    const rawValue = min + (percentage / 100) * range;

    // Snap to step
    const step = this.step();
    const safeStep = step > 0 ? step : 1;
    const steppedValue = min + Math.round((rawValue - min) / safeStep) * safeStep;
    const precision = this.getPrecision(safeStep);
    const roundedSteppedValue = Number(steppedValue.toFixed(precision));

    // Clamp to min/max
    const finalValue = Math.max(min, Math.min(max, roundedSteppedValue));

    this.valueChange.emit(finalValue);
  }

  private getPrecision(step: number): number {
    const parts = step.toString().split('.');
    return parts[1]?.length ?? 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const step = this.step();
    let newValue: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(this.value() + step, this.max());
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(this.value() - step, this.min());
        break;
      case 'Home':
        event.preventDefault();
        newValue = this.min();
        break;
      case 'End':
        event.preventDefault();
        newValue = this.max();
        break;
    }

    if (newValue !== null) {
      this.valueChange.emit(newValue);
    }
  }
}
