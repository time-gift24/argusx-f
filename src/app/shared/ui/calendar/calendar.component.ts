import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

export type CalendarMode = 'single' | 'multiple' | 'range';

export type CalendarValue = Date | Date[] | null;

export type CalendarDay = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
};

export type CalendarDateSelectEvent = {
  date: Date;
  selectedDates: Date[];
};

// ============================================================================
// Utility Functions
// ============================================================================

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function makeSafeDate(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  // Handle month overflow
  if (date.getMonth() !== month) {
    date.setDate(0); // Set to last day of previous month
  }
  return date;
}

function normalizeDate(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function normalizeValue(value: Date | Date[] | null): Date | Date[] | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value.map(normalizeDate);
  }
  return normalizeDate(value);
}

function getSelectedDatesArray(
  value: Date | Date[] | null,
  mode: CalendarMode
): Date[] {
  const normalized = normalizeValue(value);
  if (!normalized) return [];
  if (Array.isArray(normalized)) return normalized;
  return [normalized];
}

// ============================================================================
// Calendar Component
// ============================================================================

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="containerClass()">
      <!-- Header with Navigation -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="hover:bg-accent hover:text-accent-foreground size-7 p-0 select-none rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
            [disabled]="isPreviousDisabled()"
            (click)="previousMonth()"
            aria-label="Previous month">
            <lucide-icon [img]="chevronLeftIcon" class="size-4"></lucide-icon>
          </button>
          <button
            type="button"
            class="hover:bg-accent hover:text-accent-foreground size-7 p-0 select-none rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
            [disabled]="isNextDisabled()"
            (click)="nextMonth()"
            aria-label="Next month">
            <lucide-icon [img]="chevronRightIcon" class="size-4"></lucide-icon>
          </button>
        </div>

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="hover:bg-accent hover:text-accent-foreground h-7 min-w-[64px] px-2 select-none rounded-md text-sm font-medium transition-colors"
            (click)="toggleMonthPicker()">
            {{ monthLabel() }}
          </button>
          <button
            type="button"
            class="hover:bg-accent hover:text-accent-foreground h-7 min-w-[48px] px-2 select-none rounded-md text-sm font-medium transition-colors"
            (click)="toggleYearPicker()">
            {{ yearLabel() }}
          </button>
        </div>
      </div>

      <!-- Weekdays Header -->
      <div class="grid grid-cols-7 text-center mb-1" role="row">
        @for (weekday of weekDays; track weekday) {
          <div
            class="text-muted-foreground text-xs font-normal select-none px-1 py-1.5"
            role="columnheader">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div
        [class]="dayGridClass()"
        role="grid"
        (keydown)="onKeyDown($event)">
        @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
          <div role="gridcell" class="flex justify-center">
            <button
              type="button"
              [id]="getDayId(i)"
              [class]="getDayButtonClasses(day, i)"
              (click)="selectDate(day)"
              [disabled]="day.isDisabled"
              [attr.aria-selected]="day.isSelected"
              [attr.aria-label]="getDayAriaLabel(day)"
              [attr.tabindex]="focusedDayIndexValue === i ? 0 : -1"
              role="gridcell">
              {{ day.day }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"calendar"',
    '[class]': 'containerClass()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements ControlValueAccessor {
  // Icons
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;

  // Public inputs
  readonly class = input<string>('');
  readonly mode = input<CalendarMode>('single');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);

  // Model for two-way binding (supports single date, array of dates, or null)
  readonly model = model<Date | Date[] | null>(null);

  // Public outputs
  readonly dateSelect = output<CalendarDateSelectEvent>();

  // Internal signals
  private readonly _currentMonth = signal(new Date().getMonth());
  private readonly _currentYear = signal(new Date().getFullYear());
  private readonly _focusedDayIndex = signal<number>(-1);

  // Expose signals as getters for template
  protected get currentYearValue(): number {
    return this._currentYear();
  }

  protected get currentMonthValue(): number {
    return this._currentMonth();
  }

  protected get focusedDayIndexValue(): number {
    return this._focusedDayIndex();
  }

  // ControlValueAccessor
  private onChange: (value: CalendarValue) => void = () => {};
  private onTouched: () => void = () => {};

  // Constants
  protected readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // ============================================================================
  // Computed Properties
  // ============================================================================

  protected readonly monthLabel = computed(() => {
    const date = new Date(2000, this._currentMonth(), 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  });

  protected readonly yearLabel = computed(() => {
    return this._currentYear().toString();
  });

  protected readonly containerClass = computed(() =>
    cn('p-3 w-fit bg-background relative', this.class())
  );

  protected readonly dayGridClass = computed(() =>
    cn('grid grid-cols-7', this.mode() === 'range' ? 'gap-0' : 'gap-0.5')
  );

  protected readonly selectedDates = computed(() =>
    getSelectedDatesArray(this.model(), this.mode())
  );

  protected readonly calendarDays = computed(() => {
    const year = this._currentYear();
    const month = this._currentMonth();
    const today = new Date();
    const normalizedToday = normalizeDate(today);
    const selectedDates = this.selectedDates();
    const mode = this.mode();
    const minDate = this.minDate();
    const maxDate = this.maxDate();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];

    // Previous month padding
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      const normalizedDate = normalizeDate(date);
      days.push({
        date: normalizedDate,
        day,
        isCurrentMonth: false,
        isToday: isSameDay(normalizedDate, normalizedToday),
        isSelected: this.isDateSelected(normalizedDate, selectedDates),
        isInRange: this.isInRange(normalizedDate, selectedDates, mode),
        isRangeStart: this.isRangeStart(normalizedDate, selectedDates, mode),
        isRangeEnd: this.isRangeEnd(normalizedDate, selectedDates, mode),
        isDisabled: this.isDisabled(normalizedDate, minDate, maxDate),
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const normalizedDate = normalizeDate(date);
      days.push({
        date: normalizedDate,
        day,
        isCurrentMonth: true,
        isToday: isSameDay(normalizedDate, normalizedToday),
        isSelected: this.isDateSelected(normalizedDate, selectedDates),
        isInRange: this.isInRange(normalizedDate, selectedDates, mode),
        isRangeStart: this.isRangeStart(normalizedDate, selectedDates, mode),
        isRangeEnd: this.isRangeEnd(normalizedDate, selectedDates, mode),
        isDisabled: this.isDisabled(normalizedDate, minDate, maxDate),
      });
    }

    // Next month padding (always 42 cells total for 6 weeks)
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      const normalizedDate = normalizeDate(date);
      days.push({
        date: normalizedDate,
        day,
        isCurrentMonth: false,
        isToday: isSameDay(normalizedDate, normalizedToday),
        isSelected: this.isDateSelected(normalizedDate, selectedDates),
        isInRange: this.isInRange(normalizedDate, selectedDates, mode),
        isRangeStart: this.isRangeStart(normalizedDate, selectedDates, mode),
        isRangeEnd: this.isRangeEnd(normalizedDate, selectedDates, mode),
        isDisabled: this.isDisabled(normalizedDate, minDate, maxDate),
      });
    }

    return days;
  });

  // ============================================================================
  // Public Methods
  // ============================================================================

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
    if (day.isInRange) {
      label += ', in range';
    }
    return label;
  }

  getDayButtonClasses(day: CalendarDay, index: number): string {
    const isFocused = this._focusedDayIndex() === index;
    const mode = this.mode();
    const isRangeMode = mode === 'range';

    return cn(
      // Base styles
      'relative w-full rounded-md h-full p-0 text-center text-sm transition-colors select-none aspect-square',
      // In current month
      day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground',
      // Disabled
      day.isDisabled && 'opacity-50 cursor-not-allowed',
      // Today
      day.isToday && !day.isSelected && 'bg-accent text-foreground',
      // Selected (non-range)
      day.isSelected && !isRangeMode && 'bg-primary text-primary-foreground rounded-md',
      // Range styles
      isRangeMode && this.getRangeClasses(day),
      // Focused
      isFocused && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
      // Hover
      !day.isDisabled && !day.isSelected && 'hover:bg-accent hover:text-accent-foreground'
    );
  }

  private getRangeClasses(day: CalendarDay): string {
    if (day.isSelected && day.isRangeStart && day.isRangeEnd) {
      return 'bg-primary text-primary-foreground rounded-md';
    }
    if (day.isRangeStart) {
      return 'bg-primary text-primary-foreground rounded-l-md rounded-r-none';
    }
    if (day.isRangeEnd) {
      return 'bg-primary text-primary-foreground rounded-r-md rounded-l-none';
    }
    if (day.isInRange) {
      return 'bg-muted text-foreground rounded-none';
    }
    if (day.isSelected) {
      return 'bg-primary text-primary-foreground';
    }
    return '';
  }

  selectDate(day: CalendarDay): void {
    if (day.isDisabled) return;

    const mode = this.mode();
    const currentValue = this.model();
    let newValue: Date | Date[] | null = null;
    let selectedDates: Date[] = [];

    if (mode === 'single') {
      newValue = day.date;
      selectedDates = [day.date];
    } else if (mode === 'multiple') {
      const existing = getSelectedDatesArray(currentValue, mode);
      const existsIndex = existing.findIndex(d => isSameDay(d, day.date));

      if (existsIndex >= 0) {
        // Remove from selection
        existing.splice(existsIndex, 1);
        newValue = existing.length > 0 ? existing : null;
        selectedDates = existing;
      } else {
        // Add to selection
        newValue = [...existing, day.date];
        selectedDates = newValue as Date[];
      }
    } else if (mode === 'range') {
      const existing = getSelectedDatesArray(currentValue, mode);

      if (existing.length === 0 || existing.length === 2) {
        // Start new range
        newValue = [day.date];
        selectedDates = [day.date];
      } else {
        // Complete the range
        const start = existing[0];
        if (day.date < start) {
          newValue = [day.date, start];
          selectedDates = this.generateRangeDates(day.date, start);
        } else {
          newValue = [start, day.date];
          selectedDates = this.generateRangeDates(start, day.date);
        }
      }
    }

    this.model.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.dateSelect.emit({ date: day.date, selectedDates });
  }

  private generateRangeDates(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(normalizeDate(new Date(current)));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  // ============================================================================
  // Navigation Methods
  // ============================================================================

  previousMonth(): void {
    this._currentMonth.update(m => {
      const newMonth = m - 1;
      if (newMonth < 0) {
        this._currentYear.update(y => y - 1);
        return 11;
      }
      return newMonth;
    });
    this.resetFocus();
  }

  nextMonth(): void {
    this._currentMonth.update(m => {
      const newMonth = m + 1;
      if (newMonth > 11) {
        this._currentYear.update(y => y + 1);
        return 0;
      }
      return newMonth;
    });
    this.resetFocus();
  }

  /**
   * Toggles the month picker dropdown.
   * @todo Implement month picker for direct month selection
   */
  toggleMonthPicker(): void {
    // Placeholder for future month picker implementation
    // Will show a dropdown/list to select month directly
  }

  /**
   * Toggles the year picker dropdown.
   * @todo Implement year picker for direct year selection with decade navigation
   */
  toggleYearPicker(): void {
    // Placeholder for future year picker implementation
    // Will show a dropdown/list to select year with decade navigation
  }

  // ============================================================================
  // Keyboard Navigation
  // ============================================================================

  onKeyDown(event: KeyboardEvent): void {
    const currentIndex = this._focusedDayIndex();
    const days = this.calendarDays();

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigateDay(currentIndex, -1, days);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateDay(currentIndex, 1, days);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateDay(currentIndex, -7, days);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateDay(currentIndex, 7, days);
        break;
      case 'Home':
        event.preventDefault();
        this.navigateToFirstDay(days);
        break;
      case 'End':
        event.preventDefault();
        this.navigateToLastDay(days);
        break;
      case 'PageUp':
        event.preventDefault();
        if (event.shiftKey) {
          this.navigateYear('prev');
        } else {
          this.previousMonth();
        }
        break;
      case 'PageDown':
        event.preventDefault();
        if (event.shiftKey) {
          this.navigateYear('next');
        } else {
          this.nextMonth();
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < days.length) {
          this.selectDate(days[currentIndex]);
        }
        break;
    }
  }

  private navigateDay(currentIndex: number, delta: number, days: CalendarDay[]): void {
    if (days.length === 0) return;

    let newIndex = currentIndex + delta;

    if (newIndex < 0) {
      this.previousMonth();
      // Adjust index for new month
      newIndex = days.length + newIndex;
    } else if (newIndex >= days.length) {
      this.nextMonth();
      newIndex = newIndex - days.length;
    }

    this._focusedDayIndex.set(newIndex);
  }

  private navigateToFirstDay(days: CalendarDay[]): void {
    if (days.length === 0) return;
    this._focusedDayIndex.set(0);
  }

  private navigateToLastDay(days: CalendarDay[]): void {
    if (days.length === 0) return;
    this._focusedDayIndex.set(days.length - 1);
  }

  private navigateYear(direction: 'prev' | 'next'): void {
    this._currentYear.update(y => direction === 'prev' ? y - 10 : y + 10);
    this.resetFocus();
  }

  protected focus(): void {
    const days = this.calendarDays();
    const selectedIndex = days.findIndex(d => d.isSelected && d.isCurrentMonth);

    if (selectedIndex >= 0) {
      this._focusedDayIndex.set(selectedIndex);
      const button = document.getElementById(this.getDayId(selectedIndex));
      button?.focus();
    } else {
      // Focus on first available day in current month
      const firstAvailableIndex = days.findIndex(d => d.isCurrentMonth && !d.isDisabled);
      if (firstAvailableIndex >= 0) {
        this._focusedDayIndex.set(firstAvailableIndex);
        const button = document.getElementById(this.getDayId(firstAvailableIndex));
        button?.focus();
      }
    }
  }

  protected resetFocus(): void {
    this._focusedDayIndex.set(-1);
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private isDateSelected(date: Date, selectedDates: Date[]): boolean {
    return selectedDates.some(d => isSameDay(d, date));
  }

  private isInRange(date: Date, selectedDates: Date[], mode: CalendarMode): boolean {
    if (mode !== 'range' || selectedDates.length !== 2) return false;
    const [start, end] = selectedDates;
    return date > start && date < end;
  }

  private isRangeStart(date: Date, selectedDates: Date[], mode: CalendarMode): boolean {
    if (mode !== 'range' || selectedDates.length !== 2) return false;
    return isSameDay(date, selectedDates[0]);
  }

  private isRangeEnd(date: Date, selectedDates: Date[], mode: CalendarMode): boolean {
    if (mode !== 'range' || selectedDates.length !== 2) return false;
    return isSameDay(date, selectedDates[1]);
  }

  private isDisabled(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
    if (minDate && date < normalizeDate(minDate)) return true;
    if (maxDate && date > normalizeDate(maxDate)) return true;
    return false;
  }

  protected isPreviousDisabled(): boolean {
    const minDate = this.minDate();
    if (!minDate) return false;
    const year = this._currentYear();
    const month = this._currentMonth();
    return minDate.getFullYear() >= year && minDate.getMonth() >= month;
  }

  protected isNextDisabled(): boolean {
    const maxDate = this.maxDate();
    if (!maxDate) return false;
    const year = this._currentYear();
    const month = this._currentMonth();
    return maxDate.getFullYear() <= year && maxDate.getMonth() <= month;
  }

  // ============================================================================
  // ControlValueAccessor Implementation
  // ============================================================================

  writeValue(value: CalendarValue): void {
    this.model.set(value);
    if (value) {
      const dates = getSelectedDatesArray(value, this.mode());
      if (dates.length > 0) {
        const date = dates[0];
        this._currentMonth.set(date.getMonth());
        this._currentYear.set(date.getFullYear());
      }
    }
  }

  registerOnChange(fn: (value: CalendarValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // When disabled, we could disable all interactive elements in the calendar
    // The current implementation handles disabled state per-day through isDisabled property
    // This method exists for ControlValueAccessor compliance
    // Future enhancement: add a visual disabled state to the entire calendar container
  }
}
