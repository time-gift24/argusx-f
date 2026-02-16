# Calendar - zardui 源码

## 目录结构
- calendar.component.ts - 主组件
- calendar-grid.component.ts - 网格组件
- calendar-navigation.component.ts - 导航组件
- calendar.types.ts - 类型定义
- calendar.utils.ts - 工具函数
- calendar.variants.ts - 样式变体

## 源码

### calendar.component.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { filter, map } from 'rxjs';

import { ZardCalendarGridComponent } from '@/shared/components/calendar/calendar-grid.component';
import { ZardCalendarNavigationComponent } from '@/shared/components/calendar/calendar-navigation.component';
import type { CalendarMode, CalendarValue } from '@/shared/components/calendar/calendar.types';
import {
  generateCalendarDays,
  getSelectedDatesArray,
  isSameDay,
  makeSafeDate,
  normalizeCalendarValue,
} from '@/shared/components/calendar/calendar.utils';
import { calendarVariants } from '@/shared/components/calendar/calendar.variants';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-calendar, [z-calendar]',
  imports: [ZardCalendarNavigationComponent, ZardCalendarGridComponent],
  template: `
    <div [class]="classes()">
      <z-calendar-navigation
        [currentMonth]="currentMonthValue()"
        [currentYear]="currentYearValue()"
        [minDate]="minDate()"
        [maxDate]="maxDate()"
        [disabled]="disabled()"
        (monthChange)="onMonthChange($event)"
        (yearChange)="onYearChange($event)"
        (previousMonth)="previousMonth()"
        (nextMonth)="nextMonth()"
      />

      <z-calendar-grid
        [calendarDays]="calendarDays()"
        [disabled]="disabled()"
        (dateSelect)="onDateSelect($event)"
        (previousMonth)="onGridPreviousMonth($event)"
        (nextMonth)="onGridNextMonth($event)"
        (navigateYear)="onNavigateYear($event)"
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCalendarComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.tabindex]': '0',
  },
  exportAs: 'zCalendar',
})
export class ZardCalendarComponent implements ControlValueAccessor {
  private readonly gridRef = viewChild.required(ZardCalendarGridComponent);

  // Public method to reset navigation (useful for date-picker)
  resetNavigation(): void {
    const value = this.currentDate();
    this.currentMonthValue.set(value.getMonth().toString());
    this.currentYearValue.set(value.getFullYear().toString());
    this.gridRef().setFocusedDayIndex(-1);
  }

  // Public inputs
  readonly class = input<ClassValue>('');
  readonly zMode = input<CalendarMode>('single');
  readonly value = model<CalendarValue>(null);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = model<boolean>(false);

  // Public outputs
  readonly dateChange = outputFromObservable(
    outputToObservable(this.value).pipe(
      map(v => normalizeCalendarValue(v)),
      filter((v): v is NonNullable<CalendarValue> => v !== null),
    ),
  );

  private onChange: (value: CalendarValue) => void = noopFn;
  private onTouched: () => void = noopFn;

  // Internal state
  private readonly normalizedValue = computed(() => normalizeCalendarValue(this.value()));
  private readonly currentDate = computed(() => {
    const val = this.normalizedValue();
    const mode = this.zMode();

    if (!val) {
      return new Date();
    }

    // For single mode, val is Date | null
    if (mode === 'single') {
      return val as Date;
    }

    // For multiple/range mode, val is Date[]
    if (Array.isArray(val) && val.length > 0) {
      return val[0];
    }

    return new Date();
  });

  protected readonly currentMonthValue = linkedSignal(() => this.currentDate().getMonth().toString());
  protected readonly currentYearValue = linkedSignal(() => this.currentDate().getFullYear().toString());

  protected readonly classes = computed(() => mergeClasses(calendarVariants(), this.class()));

  protected readonly calendarDays = computed(() => {
    const currentDate = this.currentDate();
    const navigationDate = makeSafeDate(
      Number.parseInt(this.currentYearValue()),
      Number.parseInt(this.currentMonthValue()),
      currentDate.getDate(),
    );
    const selectedDate = Number.isNaN(navigationDate.getTime()) ? currentDate : navigationDate;

    return generateCalendarDays({
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth(),
      mode: this.zMode(),
      selectedDates: getSelectedDatesArray(this.normalizedValue(), this.zMode()),
      minDate: this.minDate(),
      maxDate: this.maxDate(),
      disabled: this.disabled(),
    });
  });

  // ... (省略部分方法)

  writeValue(value: CalendarValue): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: CalendarValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
```

### calendar-grid.component.ts

```typescript
@Component({
  selector: 'z-calendar-grid',
  template: `
    <div #gridContainer>
      <!-- Weekdays Header -->
      <div class="grid w-fit grid-cols-7 text-center" role="row">
        @for (weekday of weekdays; track weekday) {
          <div [class]="weekdayClasses()" role="columnheader">
            {{ weekday }}
          </div>
        }
      </div>

      <!-- Calendar Days Grid -->
      <div class="mt-2 grid w-fit auto-rows-min grid-cols-7 gap-0" role="rowgroup">
        @for (day of calendarDays(); track day.date.getTime(); let i = $index) {
          <div [class]="dayContainerClasses()" role="gridcell">
            <button
              type="button"
              [id]="getDayId(i)"
              [class]="dayButtonClasses(day)"
              (click)="onDayClick(day.date, i)"
              [disabled]="day.isDisabled"
              [attr.aria-selected]="day.isSelected"
              [attr.aria-label]="getDayAriaLabel(day)"
              [attr.tabindex]="getFocusedDayIndex() === i ? 0 : -1"
              role="button"
            >
              {{ day.date.getDate() }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex justify-center',
    '[attr.role]': '"grid"',
    '(keydown.{arrowleft,arrowright,arrowup,arrowdown,home,end,pageup,pagedown,enter,space}.prevent)':
      'onKeyDown($event)',
  },
  exportAs: 'zCalendarGrid',
})
export class ZardCalendarGridComponent {
  // Full keyboard navigation implementation
  onKeyDown(e: Event): void {
    // Arrow keys, Home, End, PageUp, PageDown, Enter, Space support
  }
}
```
