import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../shared/ui/calendar/calendar.component';

@Component({
  selector: 'app-calendar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarComponent, FormsModule],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Calendar</h1>
      <p class="mb-8 text-muted-foreground">
        A date picker component for selecting single dates, date ranges, or multiple dates.
      </p>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">Single Date</h2>
        <div class="flex flex-wrap gap-4">
          <app-calendar
            [model]="singleDate()"
            (dateSelect)="onSingleDateSelect($event)"
          />
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Selected: {{ singleDate()?.toDateString() || 'None' }}
        </p>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">With Min/Max Constraints</h2>
        <div class="flex flex-wrap gap-4">
          <app-calendar
            [model]="constrainedDate()"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
            (dateSelect)="onConstrainedDateSelect($event)"
          />
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Min: {{ minDate().toDateString() }} | Max: {{ maxDate().toDateString() }}
        </p>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">Implementation Notes</h2>
        <div class="rounded-lg border border-border bg-card p-4">
          <ul class="list-disc pl-4 text-sm text-muted-foreground space-y-1">
            <li>Current local implementation lacks range selection support</li>
            <li>Missing month/year dropdown selectors</li>
            <li>No keyboard navigation (zardui has full keyboard support)</li>
            <li>No ControlValueAccessor for form integration</li>
            <li>Based on comparison, zardui implementation is recommended for production</li>
          </ul>
        </div>
      </section>
    </div>
  `,
})
export class CalendarPreviewComponent {
  readonly singleDate = signal<Date | null>(new Date());

  readonly constrainedDate = signal<Date | null>(new Date());

  private getMinDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

  private getMaxDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  }

  readonly minDate = signal<Date>(this.getMinDate());

  readonly maxDate = signal<Date>(this.getMaxDate());

  onSingleDateSelect(event: { date: Date; selectedDates: Date[] }): void {
    this.singleDate.set(event.date);
  }

  onConstrainedDateSelect(event: { date: Date; selectedDates: Date[] }): void {
    this.constrainedDate.set(event.date);
  }
}
