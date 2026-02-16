import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import type { CalendarDay } from './calendar.component';

@Component({
  selector: 'app-calendar-grid',
  imports: [CommonModule],
  template: `
    <!-- Weekdays Header -->
    <div class="grid grid-cols-7 text-center mb-1" role="row">
      @for (weekday of weekdays; track weekday) {
        <div
          class="text-muted-foreground text-xs font-normal select-none px-1 py-1.5"
          role="columnheader">
          {{ weekday }}
        </div>
      }
    </div>

    <!-- Calendar Days Grid -->
    <div
      class="grid grid-cols-7 gap-0.5"
      role="grid"
      (keydown)="onKeyDown($event)">
      @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
        <div role="gridcell" class="flex justify-center">
          <button
            type="button"
            [id]="getDayId(i)"
            [class]="getDayButtonClasses(day, i)"
            (click)="onDayClick(day, i)"
            [disabled]="day.isDisabled || disabled()"
            [attr.aria-selected]="day.isSelected"
            [attr.aria-label]="getDayAriaLabel(day)"
            [attr.tabindex]="focusedDayIndex() === i ? 0 : -1"
            role="gridcell">
            {{ day.day }}
          </button>
        </div>
      }
    </div>
  `,
  host: {
    '[class]': '"flex justify-center"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGridComponent {
  readonly calendarDays = input.required<CalendarDay[]>();
  readonly disabled = input<boolean>(false);

  readonly dateSelect = output<{ date: Date; index: number }>();
  readonly previousMonth = output<void>();
  readonly nextMonth = output<void>();
  readonly navigateYear = output<'prev' | 'next'>();

  protected readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  protected readonly focusedDayIndex = signal<number>(-1);

  getDayId(index: number): string {
    return `calendar-day-${index}`;
  }

  getDayAriaLabel(day: CalendarDay): string {
    const dateStr = day.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    let label = dateStr;
    if (day.isSelected) {
      label += ', selected';
    }
    if (day.isToday) {
      label += ', today';
    }
    if (day.isDisabled) {
      label += ', disabled';
    }
    return label;
  }

  getDayButtonClasses(day: CalendarDay, index: number): string {
    const isFocused = this.focusedDayIndex() === index;

    return cn(
      // Base styles
      'relative w-full rounded-md h-full p-0 text-center text-sm transition-colors select-none aspect-square',
      // In current month
      day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground',
      // Disabled
      (day.isDisabled || this.disabled()) && 'opacity-50 cursor-not-allowed',
      // Today
      day.isToday && !day.isSelected && 'bg-accent text-foreground',
      // Selected (non-range)
      day.isSelected && !this.isRangeMode(day) && 'bg-primary text-primary-foreground rounded-md',
      // Range styles
      this.isRangeMode(day) && this.getRangeClasses(day),
      // Focused
      isFocused && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
      // Hover
      !day.isDisabled && !this.disabled() && !day.isSelected && 'hover:bg-accent hover:text-accent-foreground'
    );
  }

  /**
   * Determines if the calendar is in range selection mode.
   * @todo Implement range mode detection - requires mode input from parent
   * @param day - The calendar day (not used in current implementation)
   * @returns Always returns false - range handling delegated to parent component
   */
  private isRangeMode(day: CalendarDay): boolean {
    // Check if there's a range - this would require having access to the range start/end
    // For now, we'll handle this through parent component
    return false;
  }

  /**
   * Gets CSS classes for range selection styling.
   * @todo Implement range classes - requires range start/end inputs from parent
   * @param day - The calendar day to get classes for
   * @returns Empty string - range styling delegated to parent component
   */
  private getRangeClasses(day: CalendarDay): string {
    // Range classes will be handled by the parent component
    return '';
  }

  onDayClick(day: CalendarDay, index: number): void {
    if (day.isDisabled || this.disabled()) return;
    this.focusedDayIndex.set(index);
    this.dateSelect.emit({ date: day.date, index });
  }

  setFocusedDayIndex(index: number): void {
    this.focusedDayIndex.set(index);
  }

  resetFocus(): void {
    this.focusedDayIndex.set(-1);
  }

  onKeyDown(event: KeyboardEvent): void {
    const days = this.calendarDays();
    const currentIndex = this.focusedDayIndex();

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigateDay(currentIndex, -1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateDay(currentIndex, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateDay(currentIndex, -7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDay(currentIndex, 7);
        break;
      case 'Home':
        event.preventDefault();
        this.navigateToFirstDay(currentIndex);
        break;
      case 'End':
        event.preventDefault();
        this.navigateToLastDay(currentIndex);
        break;
      case 'PageUp':
        event.preventDefault();
        if (event.shiftKey) {
          this.navigateYear.emit('prev');
        } else {
          this.previousMonth.emit();
        }
        break;
      case 'PageDown':
        event.preventDefault();
        if (event.shiftKey) {
          this.navigateYear.emit('next');
        } else {
          this.nextMonth.emit();
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < days.length) {
          this.onDayClick(days[currentIndex], currentIndex);
        }
        break;
    }
  }

  private navigateDay(currentIndex: number, delta: number): void {
    const days = this.calendarDays();
    if (days.length === 0) return;

    let newIndex = currentIndex + delta;
    if (newIndex < 0) {
      // Navigate to previous month
      this.previousMonth.emit();
      newIndex = days.length + newIndex;
    } else if (newIndex >= days.length) {
      // Navigate to next month
      this.nextMonth.emit();
      newIndex = newIndex - days.length;
    }

    this.focusedDayIndex.set(newIndex);
  }

  private navigateToFirstDay(currentIndex: number): void {
    const days = this.calendarDays();
    if (days.length === 0) return;
    this.focusedDayIndex.set(0);
  }

  private navigateToLastDay(currentIndex: number): void {
    const days = this.calendarDays();
    if (days.length === 0) return;
    this.focusedDayIndex.set(days.length - 1);
  }
}
