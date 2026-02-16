import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-angular';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

export type CalendarDay = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
};

// ============================================================================
// Calendar Component
// ============================================================================

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="computedClass()">
      <!-- Header -->
      <div class="nav flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between">
        <button
          class="hover:bg-accent hover:text-accent-foreground size-6 p-0 select-none rounded-md transition-colors"
          (click)="previousMonth()"
          aria-label="Previous month">
          <lucide-icon [img]="chevronLeftIcon" class="size-4"></lucide-icon>
        </button>
        <button
          class="hover:bg-accent hover:text-accent-foreground size-6 p-0 select-none rounded-md transition-colors"
          (click)="nextMonth()"
          aria-label="Next month">
          <lucide-icon [img]="chevronRightIcon" class="size-4"></lucide-icon>
        </button>
      </div>

      <!-- Caption -->
      <div class="flex items-center justify-center h-6 w-full px-6">
        <span class="text-sm font-medium">{{ monthYearLabel() }}</span>
      </div>

      <!-- Weekdays -->
      <div class="flex weekdays">
        @for (day of weekDays; track day) {
          <div class="text-muted-foreground rounded-md flex-1 font-normal text-xs select-none flex-1 text-center py-1.5">
            {{ day }}
          </div>
        }
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 gap-1 mt-2">
        @for (day of calendarDays(); track day.date.toISOString()) {
          <button
            class="relative w-full rounded-md h-full p-0 text-center text-sm transition-colors select-none aspect-square"
            [class.bg-primary]="day.isSelected && !isRangeMode()"
            [class.text-primary-foreground]="day.isSelected && !isRangeMode()"
            [class.bg-muted]="isInRange(day) && !day.isSelected"
            [class.text-foreground]="isInRange(day) && !day.isSelected"
            [class.rounded-l-md]="isRangeStart(day)"
            [class.rounded-r-md]="isRangeEnd(day)"
            [class.rounded-md]="day.isSelected && !isRangeMode()"
            [class.rounded-none]="isRangeMiddle(day)"
            [class.bg-muted]="day.isToday && !day.isSelected"
            [class.text-muted-foreground]="!day.isCurrentMonth"
            [class.opacity-50]="day.isDisabled"
            [disabled]="day.isDisabled"
            (click)="selectDate(day)">
            {{ day.day }}
          </button>
        }
      </div>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"calendar"',
    '[class]': 'containerClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly class = input<string>('');
  readonly selected = input<Date | Date[] | undefined>();
  readonly min = input<Date | undefined>();
  readonly max = input<Date | undefined>();

  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;
  readonly chevronDownIcon = ChevronDown;

  private readonly currentMonth = signal(new Date());

  protected readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  protected readonly monthYearLabel = computed(() => {
    const month = this.currentMonth();
    return month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  protected readonly calendarDays = computed(() => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const startPadding = firstDay.getDay();

    const days: CalendarDay[] = [];
    const selected = this.selected();

    // Previous month padding
    const prevMonth = new Date(year, monthIndex, 0);
    for (let i = startPadding - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      const date = new Date(year, monthIndex - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: this.isDateSelected(date, selected),
        isDisabled: this.isDisabled(date),
      });
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        isSelected: this.isDateSelected(date, selected),
        isDisabled: this.isDisabled(date),
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, monthIndex + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: this.isDateSelected(date, selected),
        isDisabled: this.isDisabled(date),
      });
    }

    return days;
  });

  protected readonly computedClass = computed(() =>
    cn(
      'p-3 w-fit bg-background',
      this.class()
    )
  );

  protected readonly containerClass = computed(() =>
    cn('w-fit relative')
  );

  protected isRangeMode(): boolean {
    return false;
  }

  protected isInRange(day: CalendarDay): boolean {
    return false;
  }

  protected isRangeStart(day: CalendarDay): boolean {
    return false;
  }

  protected isRangeEnd(day: CalendarDay): boolean {
    return false;
  }

  protected isRangeMiddle(day: CalendarDay): boolean {
    return false;
  }

  protected isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  protected isDateSelected(date: Date, selected: Date | Date[] | undefined): boolean {
    if (!selected) return false;
    if (Array.isArray(selected)) {
      return selected.some((d) => this.isSameDay(d, date));
    }
    return this.isSameDay(date, selected);
  }

  protected isDisabled(date: Date): boolean {
    const min = this.min();
    const max = this.max();
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  protected selectDate(day: CalendarDay): void {
    // This would typically emit an event
    console.log('Selected:', day.date);
  }

  protected previousMonth(): void {
    this.currentMonth.update((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  protected nextMonth(): void {
    this.currentMonth.update((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }
}

// ============================================================================
// Exports
// ============================================================================

export const CalendarComponents = [CalendarComponent];
