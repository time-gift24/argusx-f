import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { CalendarComponent } from '../shared/ui/calendar/calendar.component';

@Component({
  selector: 'app-calendar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CalendarComponent],
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
            [(model)]="singleDate"
          />
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Selected: {{ singleDate()?.toDateString() || 'None' }}
        </p>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">Range Selection</h2>
        <div class="flex flex-wrap gap-4">
          <app-calendar
            mode="range"
            [(model)]="rangeDate"
          />
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          Selected: {{ rangeDate() ? rangeDate()!.join(' → ') : 'None' }}
        </p>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">With Min/Max Constraints</h2>
        <div class="flex flex-wrap gap-4">
          <app-calendar
            [(model)]="constrainedDate"
            [minDate]="minDate()"
            [maxDate]="maxDate()"
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
            <li>Supports single, range, and multiple selection modes</li>
            <li>Range mode renders in-between days with connected muted styling</li>
            <li>Supports keyboard navigation and ControlValueAccessor integration</li>
            <li>Month/year picker dropdowns are still placeholders</li>
            <li>zardui provides a more feature-complete calendar for production-scale use cases</li>
          </ul>
        </div>
      </section>
    </div>
  `,
})
export class CalendarPreviewComponent {
  readonly singleDate = signal<Date | null>(new Date());

  readonly constrainedDate = signal<Date | null>(new Date());

  readonly rangeDate = signal<Date[] | null>(null);

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
}
