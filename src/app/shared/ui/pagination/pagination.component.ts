import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { LucideAngularModule, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-angular';
import { ButtonDirective } from '../button/button.directive';

/**
 * Pagination navigation container.
 * Wraps the entire pagination component.
 *
 * @example
 * ```html
 * <app-pagination>
 *   <!-- pagination content -->
 * </app-pagination>
 * ```
 */
@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"navigation"',
    '[attr.aria-label]': '"pagination"',
    '[attr.data-slot]': '"pagination"',
  },
  template: `<ng-content />`,
})
export class PaginationComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('mx-auto flex w-full justify-center', this.class())
  );
}

/**
 * Pagination content list container.
 * Contains pagination items.
 *
 * @example
 * ```html
 * <app-pagination-content>
 *   <app-pagination-item>...</app-pagination-item>
 * </app-pagination-content>
 * ```
 */
@Component({
  selector: 'app-pagination-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"contents"',
  },
  template: `<ul [class]="computedClass()" data-slot="pagination-content"><ng-content /></ul>`,
})
export class PaginationContentComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-row items-center gap-0.5', this.class())
  );
}

/**
 * Pagination list item.
 *
 * @example
 * ```html
 * <app-pagination-item>
 *   <app-pagination-link>1</app-pagination-link>
 * </app-pagination-item>
 * ```
 */
@Component({
  selector: 'app-pagination-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"contents"',
  },
  template: `<li data-slot="pagination-item"><ng-content /></li>`,
})
export class PaginationItemComponent {}

/**
 * Pagination link button.
 * Used for individual page numbers.
 *
 * @example
 * ```html
 * <app-pagination-link [page]="1" [isActive]="true">1</app-pagination-link>
 * ```
 */
@Component({
  selector: 'app-pagination-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, LucideAngularModule],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"pagination-link"',
    '[attr.data-active]': 'isActive() ? "true" : null',
    '[attr.aria-current]': 'isActive() ? "page" : null',
  },
  template: `
    <button
      argusButton
      [variant]="isActive() ? 'outline' : 'ghost'"
      [size]="size()"
      (click)="onClick($event)"
    >
      <ng-content />
    </button>
  `,
})
export class PaginationLinkComponent {
  readonly page = input.required<number>();
  readonly isActive = input<boolean>(false);
  readonly size = input<'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-xs' | 'icon-lg'>('icon');
  readonly class = input<string>('');
  readonly pageChange = output<number>();

  protected readonly computedClass = computed(() => this.class());

  onClick(event: Event): void {
    event.preventDefault();
    this.pageChange.emit(this.page());
  }
}

/**
 * Previous page button.
 *
 * @example
 * ```html
 * <app-pagination-previous (pageChange)="onPageChange($event)" />
 * ```
 */
@Component({
  selector: 'app-pagination-previous',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, LucideAngularModule],
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-label]': '"Go to previous page"',
    '[attr.data-slot]': '"pagination-link"',
  },
  template: `
    <button
      argusButton
      variant="ghost"
      size="default"
      class="pl-2!"
      (click)="onClick($event)"
    >
      <lucide-icon [img]="chevronLeftIcon" data-icon="inline-start" class="size-3.5"></lucide-icon>
      <span class="hidden sm:block">{{ text() }}</span>
    </button>
  `,
})
export class PaginationPreviousComponent {
  readonly text = input<string>('Previous');
  readonly class = input<string>('');
  readonly pageChange = output<number>();

  protected readonly chevronLeftIcon = ChevronLeft;

  protected readonly computedClass = computed(() => this.class());

  onClick(event: Event): void {
    event.preventDefault();
    this.pageChange.emit(0); // Signal previous page
  }
}

/**
 * Next page button.
 *
 * @example
 * ```html
 * <app-pagination-next (pageChange)="onPageChange($event)" />
 * ```
 */
@Component({
  selector: 'app-pagination-next',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, LucideAngularModule],
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-label]': '"Go to next page"',
    '[attr.data-slot]': '"pagination-link"',
  },
  template: `
    <button
      argusButton
      variant="ghost"
      size="default"
      class="pr-2!"
      (click)="onClick($event)"
    >
      <span class="hidden sm:block">{{ text() }}</span>
      <lucide-icon [img]="chevronRightIcon" data-icon="inline-end" class="size-3.5"></lucide-icon>
    </button>
  `,
})
export class PaginationNextComponent {
  readonly text = input<string>('Next');
  readonly class = input<string>('');
  readonly pageChange = output<number>();

  protected readonly chevronRightIcon = ChevronRight;

  protected readonly computedClass = computed(() => this.class());

  onClick(event: Event): void {
    event.preventDefault();
    this.pageChange.emit(1); // Signal next page
  }
}

/**
 * Ellipsis for pagination (showing more pages).
 *
 * @example
 * ```html
 * <app-pagination-ellipsis />
 * ```
 */
@Component({
  selector: 'app-pagination-ellipsis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {
    '[class]': 'computedClass()',
    '[attr.aria-hidden]': '"true"',
    '[attr.data-slot]': '"pagination-ellipsis"',
  },
  template: `
    <span class="sr-only">More pages</span>
    <lucide-icon [img]="moreHorizontalIcon" class="size-3.5"></lucide-icon>
  `,
})
export class PaginationEllipsisComponent {
  readonly class = input<string>('');

  protected readonly moreHorizontalIcon = MoreHorizontal;

  protected readonly computedClass = computed(() =>
    cn('size-7 [&_svg:not([class*=\'size-\'])]:size-3.5 flex items-center justify-center', this.class())
  );
}
