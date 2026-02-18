import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * A switch component that allows users to toggle between two states.
 * Aligned with shadcn/ui switch component.
 *
 * @example
 * ```html
 * <app-switch [checked]="isOn" (checkedChange)="isOn = $event" />
 * <app-switch [checked]="true" label="Enable notifications" />
 * ```
 */
@Component({
  selector: 'app-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    role: 'switch',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <span
      class="inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-200"
      [class.translate-x-4]="checked()"
      [class.translate-x-0.5]="!checked()"
    ></span>
  `,
})
export class SwitchComponent {
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly class = input<string>('');

  readonly checkedChange = output<boolean>();

  protected readonly computedClass = (): string => {
    return cn(
      // Base styles - switch track
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors',
      // Focus styles - visible ring
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // Disabled styles
      'disabled:pointer-events-none disabled:opacity-50',
      // Checked state - primary background
      'data-[state=checked]:bg-primary',
      // Unchecked state - muted background
      'data-[state=unchecked]:bg-input',
      // Disabled state - different background when disabled
      'data-[disabled]:bg-muted-foreground/30',
      this.class()
    );
  };

  onClick(): void {
    if (this.disabled()) {
      return;
    }
    const newValue = !this.checked();
    this.checkedChange.emit(newValue);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const newValue = !this.checked();
      this.checkedChange.emit(newValue);
    }
  }
}
