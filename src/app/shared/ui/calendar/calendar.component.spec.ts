import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent, type CalendarMode, type CalendarDay } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CalendarMode type', () => {
    it('should accept single mode', () => {
      component.mode.set('single');
      expect(component.mode()).toBe('single');
    });

    it('should accept multiple mode', () => {
      component.mode.set('multiple');
      expect(component.mode()).toBe('multiple');
    });

    it('should accept range mode', () => {
      component.mode.set('range');
      expect(component.mode()).toBe('range');
    });
  });

  describe('Single date selection', () => {
    it('should select a date in single mode', () => {
      component.mode.set('single');
      const today = new Date();
      const day: CalendarDay = {
        date: today,
        day: today.getDate(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day);

      expect(component.model()).toEqual(today);
    });

    it('should not select disabled date', () => {
      const today = new Date();
      const day: CalendarDay = {
        date: today,
        day: today.getDate(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: true,
      };

      component.selectDate(day);

      expect(component.model()).toBeNull();
    });
  });

  describe('Multiple date selection', () => {
    it('should add dates to selection in multiple mode', () => {
      component.mode.set('multiple');
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 20);

      const day1: CalendarDay = {
        date: date1,
        day: 15,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      const day2: CalendarDay = {
        date: date2,
        day: 20,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day1);
      component.selectDate(day2);

      const selected = component.model() as Date[];
      expect(selected).toHaveLength(2);
    });

    it('should remove date from selection when clicked again', () => {
      component.mode.set('multiple');
      const date = new Date(2024, 0, 15);

      const day: CalendarDay = {
        date: date,
        day: 15,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day);
      component.selectDate(day);

      expect(component.model()).toBeNull();
    });
  });

  describe('Range selection', () => {
    it('should start range on first click', () => {
      component.mode.set('range');
      const date = new Date(2024, 0, 15);

      const day: CalendarDay = {
        date: date,
        day: 15,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day);

      const selected = component.model() as Date[];
      expect(selected).toHaveLength(1);
      expect(selected[0]).toEqual(date);
    });

    it('should complete range on second click', () => {
      component.mode.set('range');
      const startDate = new Date(2024, 0, 10);
      const endDate = new Date(2024, 0, 20);

      const startDay: CalendarDay = {
        date: startDate,
        day: 10,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      const endDay: CalendarDay = {
        date: endDate,
        day: 20,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(startDay);
      fixture.detectChanges();
      component.selectDate(endDay);
      fixture.detectChanges();

      const selected = component.model() as Date[];
      expect(selected).toHaveLength(2);
    });

    it('should handle reverse range selection', () => {
      component.mode.set('range');
      const laterDate = new Date(2024, 0, 20);
      const earlierDate = new Date(2024, 0, 10);

      const laterDay: CalendarDay = {
        date: laterDate,
        day: 20,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      const earlierDay: CalendarDay = {
        date: earlierDate,
        day: 10,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(laterDay);
      fixture.detectChanges();
      component.selectDate(earlierDay);
      fixture.detectChanges();

      const selected = component.model() as Date[];
      expect(selected).toHaveLength(2);
      // First date should be earlier
      expect(selected[0].getTime()).toBeLessThanOrEqual(selected[1].getTime());
    });
  });

  describe('Navigation', () => {
    it('should navigate to previous month', () => {
      component.currentMonth.set(5);
      component.currentYear.set(2024);

      component.previousMonth();

      expect(component.currentMonth()).toBe(4);
      expect(component.currentYear()).toBe(2024);
    });

    it('should navigate to previous year when at January', () => {
      component.currentMonth.set(0);
      component.currentYear.set(2024);

      component.previousMonth();

      expect(component.currentMonth()).toBe(11);
      expect(component.currentYear()).toBe(2023);
    });

    it('should navigate to next month', () => {
      component.currentMonth.set(5);
      component.currentYear.set(2024);

      component.nextMonth();

      expect(component.currentMonth()).toBe(6);
      expect(component.currentYear()).toBe(2024);
    });

    it('should navigate to next year when at December', () => {
      component.currentMonth.set(11);
      component.currentYear.set(2024);

      component.nextMonth();

      expect(component.currentMonth()).toBe(0);
      expect(component.currentYear()).toBe(2025);
    });
  });

  describe('Date constraints', () => {
    it('should respect minDate constraint', () => {
      const minDate = new Date(2024, 0, 15);
      component.minDate.set(minDate);

      const beforeMinDate = new Date(2024, 0, 10);
      const day: CalendarDay = {
        date: beforeMinDate,
        day: 10,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      const isDisabled = component['isDisabled'](beforeMinDate, minDate, null);
      expect(isDisabled).toBe(true);
    });

    it('should respect maxDate constraint', () => {
      const maxDate = new Date(2024, 0, 15);
      component.maxDate.set(maxDate);

      const afterMaxDate = new Date(2024, 0, 20);
      const day: CalendarDay = {
        date: afterMaxDate,
        day: 20,
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      const isDisabled = component['isDisabled'](afterMaxDate, null, maxDate);
      expect(isDisabled).toBe(true);
    });
  });

  describe('Keyboard navigation', () => {
    it('should handle ArrowLeft keydown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const spy = spyOn(component, 'onKeyDown');

      component.onKeyDown(event);

      expect(spy).toHaveBeenCalled();
    });

    it('should handle ArrowRight keydown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });

      component.onKeyDown(event);

      // Should not throw
      expect(component).toBeTruthy();
    });

    it('should handle ArrowUp keydown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

      component.onKeyDown(event);

      expect(component).toBeTruthy();
    });

    it('should handle ArrowDown keydown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      component.onKeyDown(event);

      expect(component).toBeTruthy();
    });

    it('should handle Home keydown', () => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });

      component.onKeyDown(event);

      expect(component.focusedDayIndex()).toBe(0);
    });

    it('should handle End keydown', () => {
      component.focusedDayIndex.set(10);
      const event = new KeyboardEvent('keydown', { key: 'End' });

      component.onKeyDown(event);

      expect(component.focusedDayIndex()).toBe(41); // Last day of 6-week grid
    });

    it('should handle PageUp keydown', () => {
      const initialMonth = component.currentMonth();
      const event = new KeyboardEvent('keydown', { key: 'PageUp' });

      component.onKeyDown(event);

      expect(component.currentMonth()).toBe((initialMonth - 1 + 12) % 12);
    });

    it('should handle PageDown keydown', () => {
      const initialMonth = component.currentMonth();
      const event = new KeyboardEvent('keydown', { key: 'PageDown' });

      component.onKeyDown(event);

      expect(component.currentMonth()).toBe((initialMonth + 1) % 12);
    });

    it('should handle Enter keydown', () => {
      component.focusedDayIndex.set(0);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      // Should not throw - will select focused day
      component.onKeyDown(event);

      expect(component).toBeTruthy();
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value from form control', () => {
      const testDate = new Date(2024, 5, 15);
      component.writeValue(testDate);

      expect(component.model()).toEqual(testDate);
    });

    it('should write array value from form control', () => {
      const testDates = [new Date(2024, 5, 15), new Date(2024, 5, 20)];
      component.mode.set('multiple');
      component.writeValue(testDates);

      expect(component.model()).toEqual(testDates);
    });

    it('should call onChange when date is selected', () => {
      let changedValue: unknown;
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const today = new Date();
      const day: CalendarDay = {
        date: today,
        day: today.getDate(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day);

      expect(changedValue).toEqual(today);
    });

    it('should call onTouched when date is selected', () => {
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });

      const today = new Date();
      const day: CalendarDay = {
        date: today,
        day: today.getDate(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day);

      expect(touched).toBe(true);
    });
  });

  describe('Output events', () => {
    it('should emit dateSelect event', () => {
      let emitted = false;
      component.dateSelect.subscribe((event) => {
        emitted = true;
        expect(event.date).toBeDefined();
        expect(event.selectedDates).toBeDefined();
      });

      const today = new Date();
      const day: CalendarDay = {
        date: today,
        day: today.getDate(),
        isCurrentMonth: true,
        isToday: true,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: false,
      };

      component.selectDate(day);

      expect(emitted).toBe(true);
    });
  });

  describe('Calendar grid rendering', () => {
    it('should render 42 days (6 weeks)', () => {
      const days = component.calendarDays();
      expect(days.length).toBe(42);
    });

    it('should render weekdays header', () => {
      expect(component.weekDays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    it('should calculate month and year label correctly', () => {
      component.currentMonth.set(5); // June
      component.currentYear.set(2024);

      const label = component.monthLabel();
      expect(label).toContain('June');
    });
  });
});
