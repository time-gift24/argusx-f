# Calendar - local 源码

## 文件位置
`src/app/shared/ui/calendar/`

## 源码

### calendar.component.ts

```typescript
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
            [disabled]="day.isDisabled"
            (click)="selectDate(day)">
            {{ day.day }}
          </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly class = input<string>('');
  readonly selected = input<Date | Date[] | undefined>();
  readonly min = input<Date | undefined>();
  readonly max = input<Date | undefined>();

  // ... basic implementation
}
```

## 缺失功能

1. ❌ 日期范围选择 (isRangeMode, isInRange 等方法返回 false)
2. ❌ 月份/年份下拉选择
3. ❌ ControlValueAccessor 表单集成
4. ❌ 键盘导航
5. ❌ 日期输出 (selectDate 只打印 console.log)
6. ❌ 周数显示
7. ❌ 完整的焦点管理
