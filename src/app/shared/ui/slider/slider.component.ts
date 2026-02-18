import { ChangeDetectionStrategy, Component, input, output, signal, computed, HostListener, ElementRef, ViewChild } from '@angular/core';
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
    '[class]': 'computedClass()',
    '[attr.id]': 'id() || null',
    '[attr.name]': 'name() || null',
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
  },
  template: `
    <!-- Track -->
    <div class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <!-- Range (filled portion) -->
      <div
        class="absolute h-full bg-primary"
        [style.width.%]="fillPercentage()"
      ></div>
    </div>

    <!-- Thumb -->
    <div
      #thumb
      class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      [class.cursor-grab]="!disabled()"
      [class.cursor-grabbing]="isDragging()"
      [style.left.%]="position()"
      [style.transform]="'translateX(-50%)'"
    ></div>

    <!-- Hidden native input for form integration -->
    <input
      type="hidden"
      [attr.name]="name() || null"
      [value]="value()"
    />
  `,
})
export class SliderComponent {
  @ViewChild('thumb') thumb!: ElementRef<HTMLDivElement>;

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
    const val = this.value();
    return ((val - min) / (max - min)) * 100;
  });

  // Calculate fill percentage for the range portion
  protected readonly fillPercentage = computed(() => {
    return this.position();
  });

  protected readonly computedClass = (): string => {
    return cn(
      // Base styles
      'relative flex w-full touch-none select-none items-center',
      // Horizontal (default)
      'h-4',
      // Vertical orientation
      this.orientation() === 'vertical' && 'flex-col h-full w-4',
      // Disabled styles
      'disabled:opacity-50 disabled:pointer-events-none',
      this.class()
    );
  };

  @HostListener('pointerdown', ['$event'])
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

  private updateValueFromEvent(event: PointerEvent): void {
    const track = event.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
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
    const steppedValue = Math.round(rawValue / step) * step;

    // Clamp to min/max
    const finalValue = Math.max(min, Math.min(max, steppedValue));

    this.valueChange.emit(finalValue);
  }

  @HostListener('keydown', ['$event'])
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
