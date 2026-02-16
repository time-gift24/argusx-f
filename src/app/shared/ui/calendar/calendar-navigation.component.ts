import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-calendar-navigation',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center justify-between w-full mb-2">
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="hover:bg-accent hover:text-accent-foreground size-7 p-0 select-none rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
          [disabled]="isPreviousDisabled()"
          (click)="previousMonth.emit()"
          aria-label="Previous month">
          <lucide-icon [img]="chevronLeftIcon" class="size-4"></lucide-icon>
        </button>
        <button
          type="button"
          class="hover:bg-accent hover:text-accent-foreground size-7 p-0 select-none rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
          [disabled]="isNextDisabled()"
          (click)="nextMonth.emit()"
          aria-label="Next month">
          <lucide-icon [img]="chevronRightIcon" class="size-4"></lucide-icon>
        </button>
      </div>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="hover:bg-accent hover:text-accent-foreground h-7 min-w-[64px] px-2 select-none rounded-md text-sm font-medium transition-colors"
          (click)="monthChange.emit(currentMonth())"
          aria-label="Select month">
          {{ monthLabel() }}
        </button>
        <button
          type="button"
          class="hover:bg-accent hover:text-accent-foreground h-7 min-w-[48px] px-2 select-none rounded-md text-sm font-medium transition-colors"
          (click)="yearChange.emit(currentYear())"
          aria-label="Select year">
          {{ currentYear() }}
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarNavigationComponent {
  readonly chevronLeftIcon = ChevronLeft;
  readonly chevronRightIcon = ChevronRight;

  readonly currentMonth = input.required<number>();
  readonly currentYear = input.required<number>();
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabled = input<boolean>(false);

  readonly monthChange = output<number>();
  readonly yearChange = output<number>();
  readonly previousMonth = output<void>();
  readonly nextMonth = output<void>();

  protected readonly monthLabel = computed(() => {
    const date = new Date(2000, this.currentMonth(), 1);
    return date.toLocaleDateString('en-US', { month: 'long' });
  });

  protected isPreviousDisabled(): boolean {
    if (this.disabled()) return true;
    const minDate = this.minDate();
    if (!minDate) return false;
    const currentYear = this.currentYear();
    const currentMonth = this.currentMonth();
    return (
      minDate.getFullYear() >= currentYear && minDate.getMonth() >= currentMonth
    );
  }

  protected isNextDisabled(): boolean {
    if (this.disabled()) return true;
    const maxDate = this.maxDate();
    if (!maxDate) return false;
    const currentYear = this.currentYear();
    const currentMonth = this.currentMonth();
    return (
      maxDate.getFullYear() <= currentYear && maxDate.getMonth() <= currentMonth
    );
  }
}
