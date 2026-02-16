import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { LucideAngularModule, Calendar as CalendarIcon } from 'lucide-angular';
import { CalendarComponent } from '../shared/ui/calendar/calendar.component';
import { ButtonComponent } from '../shared/ui/button';
import {
  PopoverComponent,
  PopoverContentComponent,
  PopoverTriggerDirective,
} from '../shared/ui/popover';
import {
  CardDirective,
  CardHeaderDirective,
  CardTitleDirective,
  CardDescriptionDirective,
  CardContentDirective,
  CardFooterDirective,
} from '../shared/ui/card';

@Component({
  selector: 'app-calendar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CalendarComponent,
    ButtonComponent,
    PopoverComponent,
    PopoverContentComponent,
    PopoverTriggerDirective,
    CardDirective,
    CardHeaderDirective,
    CardTitleDirective,
    CardDescriptionDirective,
    CardContentDirective,
    CardFooterDirective,
    LucideAngularModule,
  ],
  template: `
    <div class="mx-auto max-w-7xl p-8">
      <div class="rounded-2xl border border-border/80 bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-2">
            <span class="inline-flex rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              Radix-style Showcase
            </span>
            <h1 class="text-3xl font-semibold tracking-tight">Calendar</h1>
            <p class="max-w-3xl text-sm text-muted-foreground">
              High-fidelity calendar examples inspired by shadcn preview, implemented with local
              Angular components and signal-based models.
            </p>
          </div>
          <div class="rounded-lg border border-border bg-card/70 px-3 py-2 text-xs text-muted-foreground">
            Built with <span class="font-medium text-foreground">app-calendar</span>,
            <span class="font-medium text-foreground">app-popover</span>, and
            <span class="font-medium text-foreground">app-card</span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section>
            <div appCard class="h-full">
              <div appCardHeader>
                <div appCardTitle>Single</div>
                <div appCardDescription>Basic single date selection.</div>
              </div>
              <div appCardContent class="space-y-4">
                <div class="flex justify-center rounded-lg border border-dashed border-border p-4">
                  <app-calendar [(model)]="singleDate" />
                </div>
              </div>
              <div appCardFooter class="text-xs text-muted-foreground">
                Selected: {{ formatDate(singleDate()) }}
              </div>
            </div>
          </section>

          <section>
            <div appCard class="h-full">
              <div appCardHeader>
                <div appCardTitle>Single with Dropdowns</div>
                <div appCardDescription>Month and year are selectable from native dropdowns.</div>
              </div>
              <div appCardContent class="space-y-4">
                <div class="flex justify-center rounded-lg border border-dashed border-border p-4">
                  <app-calendar [showMonthYearSelectors]="true" [(model)]="singleWithSelectorsDate" />
                </div>
              </div>
              <div appCardFooter class="text-xs text-muted-foreground">
                Selected: {{ formatDate(singleWithSelectorsDate()) }}
              </div>
            </div>
          </section>

          <section>
            <div appCard class="h-full">
              <div appCardHeader>
                <div appCardTitle>Multiple</div>
                <div appCardDescription>Select and toggle multiple independent dates.</div>
              </div>
              <div appCardContent class="space-y-4">
                <div class="flex justify-center rounded-lg border border-dashed border-border p-4">
                  <app-calendar mode="multiple" [showMonthYearSelectors]="true" [(model)]="multipleDates" />
                </div>
              </div>
              <div appCardFooter class="text-xs text-muted-foreground">
                Selected: {{ formatDateList(multipleDates()) }}
              </div>
            </div>
          </section>

          <section>
            <div appCard class="h-full">
              <div appCardHeader>
                <div appCardTitle>Range</div>
                <div appCardDescription>
                  Connected range rendering with muted in-between cells.
                </div>
              </div>
              <div appCardContent class="space-y-4">
                <div class="flex justify-center rounded-lg border border-dashed border-border p-4">
                  <app-calendar mode="range" [showMonthYearSelectors]="true" [(model)]="rangeDate" />
                </div>
              </div>
              <div appCardFooter class="text-xs text-muted-foreground">
                Selected: {{ formatDateRange(rangeDate()) }}
              </div>
            </div>
          </section>

          <section>
            <div appCard class="h-full">
              <div appCardHeader>
                <div appCardTitle>Date Picker in Popover</div>
                <div appCardDescription>Trigger calendar selection from an overlay panel.</div>
              </div>
              <div appCardContent class="space-y-4">
                <div class="rounded-lg border border-dashed border-border p-4">
                  <app-popover [(open)]="popoverOpen">
                    <button
                      appPopoverTrigger
                      argus-button
                      variant="outline"
                      class="w-[220px] justify-start font-normal"
                    >
                      <lucide-icon [img]="calendarIcon" class="mr-1.5 size-3.5"></lucide-icon>
                      {{ popoverDate() ? formatDate(popoverDate()) : 'Pick a date' }}
                    </button>
                    <app-popover-content class="w-auto p-2">
                      <app-calendar
                        [showMonthYearSelectors]="true"
                        [(model)]="popoverDate"
                        (dateSelect)="popoverOpen.set(false)"
                      />
                    </app-popover-content>
                  </app-popover>
                </div>
              </div>
              <div appCardFooter class="text-xs text-muted-foreground">
                Selected: {{ formatDate(popoverDate()) }}
              </div>
            </div>
          </section>

          <section>
            <div appCard class="h-full">
              <div appCardHeader>
                <div appCardTitle>With Constraints</div>
                <div appCardDescription>Selection is limited to a rolling date window.</div>
              </div>
              <div appCardContent class="space-y-4">
                <div class="flex justify-center rounded-lg border border-dashed border-border p-4">
                  <app-calendar
                    [showMonthYearSelectors]="true"
                    [(model)]="constrainedDate"
                    [minDate]="minDate()"
                    [maxDate]="maxDate()"
                  />
                </div>
              </div>
              <div appCardFooter class="text-xs text-muted-foreground">
                Min: {{ formatDate(minDate()) }} | Max: {{ formatDate(maxDate()) }}
              </div>
            </div>
          </section>

          <section class="xl:col-span-2">
            <div appCard>
              <div appCardHeader>
                <div appCardTitle>In Card</div>
                <div appCardDescription>
                  Embedded card treatment similar to shadcn dashboard-style examples.
                </div>
              </div>
              <div appCardContent>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
                  <div class="rounded-xl border border-border bg-card p-3">
                    <app-calendar [showMonthYearSelectors]="true" [(model)]="cardDate" />
                  </div>
                  <div class="rounded-xl border border-border bg-muted/30 p-4">
                    <h3 class="mb-2 text-sm font-semibold">Selection Summary</h3>
                    <p class="mb-4 text-sm text-muted-foreground">
                      This area simulates downstream UI that reacts to date changes.
                    </p>
                    <div class="grid gap-2 text-xs">
                      <div class="rounded-md border border-border bg-background px-3 py-2">
                        Chosen date: {{ formatDate(cardDate()) }}
                      </div>
                      <div class="rounded-md border border-border bg-background px-3 py-2">
                        Min bound: {{ formatDate(minDate()) }}
                      </div>
                      <div class="rounded-md border border-border bg-background px-3 py-2">
                        Max bound: {{ formatDate(maxDate()) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div appCardFooter class="flex-wrap gap-2 text-xs text-muted-foreground">
                @for (item of roadmapItems; track item) {
                  <span class="rounded-full border border-border bg-background px-2.5 py-1">
                    {{ item }}
                  </span>
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class CalendarPreviewComponent {
  readonly calendarIcon = CalendarIcon;

  readonly singleDate = signal<Date | null>(null);
  readonly singleWithSelectorsDate = signal<Date | null>(null);
  readonly constrainedDate = signal<Date | null>(null);
  readonly multipleDates = signal<Date[] | null>(null);
  readonly rangeDate = signal<Date[] | null>(null);
  readonly popoverDate = signal<Date | null>(null);
  readonly cardDate = signal<Date | null>(null);
  readonly popoverOpen = signal<boolean>(false);

  readonly roadmapItems: ReadonlyArray<string> = [
    'Week Numbers · Coming soon',
    'Range Multiple Months · Coming soon',
    'With Presets · Coming soon',
    'With Time · Coming soon',
  ];

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

  formatDate(date: Date | null): string {
    if (!date) return 'None';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatDateRange(range: Date[] | null): string {
    if (!range || range.length === 0) return 'None';
    if (range.length === 1) return `${this.formatDate(range[0])} (start)`;
    return `${this.formatDate(range[0])} -> ${this.formatDate(range[range.length - 1])}`;
  }

  formatDateList(dates: Date[] | null): string {
    if (!dates || dates.length === 0) return 'None';
    const formatted = dates.map((date) => this.formatDate(date));
    if (formatted.length <= 3) return formatted.join(', ');
    return `${formatted.slice(0, 3).join(', ')} +${formatted.length - 3} more`;
  }
}
