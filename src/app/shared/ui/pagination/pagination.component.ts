import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cn } from '../../utils/cn';
import { LucideAngularModule, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-angular';
import {
  argusxButtonVariants,
  type ArgusxButtonSize,
  type ArgusxButtonVariant,
} from '../button/button.directive';

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
    cn('flex flex-row items-center gap-1', this.class())
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
  host: {
    '[class]': '"contents"',
  },
  template: `
    <a
      [href]="href()"
      [class]="computedClass()"
      data-slot="pagination-link"
      [attr.data-active]="isActive()"
      [attr.aria-current]="isActive() ? 'page' : null"
      (click)="onClick($event)"
    >
      <ng-content />
    </a>
  `,
})
export class PaginationLinkComponent {
  readonly page = input.required<number>();
  readonly href = input<string>('#');
  readonly isActive = input<boolean>(false);
  readonly size = input<ArgusxButtonSize>('icon');
  readonly variant = input<ArgusxButtonVariant>('ghost');
  readonly class = input<string>('');
  readonly pageChange = output<number>();

  /**
   * Computed variant based on isActive state and variant input.
   * If isActive is true, always use 'outline' variant.
   */
  protected readonly computedVariant = computed(() =>
    this.isActive() ? 'outline' : this.variant()
  );

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({
        variant: this.computedVariant(),
        size: this.size(),
      }),
      this.class()
    )
  );

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
  imports: [LucideAngularModule],
  host: {
    '[class]': '"contents"',
  },
  template: `
    <a
      [href]="href()"
      [class]="computedClass()"
      aria-label="Go to previous page"
      data-slot="pagination-link"
      (click)="onClick($event)"
    >
      <lucide-icon [img]="chevronLeftIcon" data-icon="inline-start" class="size-3.5"></lucide-icon>
      <span class="hidden sm:block">{{ text() }}</span>
    </a>
  `,
})
export class PaginationPreviousComponent {
  readonly href = input<string>('#');
  readonly text = input<string>('Previous');
  readonly class = input<string>('');
  readonly pageChange = output<number>();

  protected readonly chevronLeftIcon = ChevronLeft;

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: 'ghost', size: 'default' }),
      'gap-1 px-2.5 sm:pl-2.5',
      this.class(),
    )
  );

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
  imports: [LucideAngularModule],
  host: {
    '[class]': '"contents"',
  },
  template: `
    <a
      [href]="href()"
      [class]="computedClass()"
      aria-label="Go to next page"
      data-slot="pagination-link"
      (click)="onClick($event)"
    >
      <span class="hidden sm:block">{{ text() }}</span>
      <lucide-icon [img]="chevronRightIcon" data-icon="inline-end" class="size-3.5"></lucide-icon>
    </a>
  `,
})
export class PaginationNextComponent {
  readonly href = input<string>('#');
  readonly text = input<string>('Next');
  readonly class = input<string>('');
  readonly pageChange = output<number>();

  protected readonly chevronRightIcon = ChevronRight;

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: 'ghost', size: 'default' }),
      'gap-1 px-2.5 sm:pr-2.5',
      this.class(),
    )
  );

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
    '[class]': '"contents"',
  },
  template: `
    <span aria-hidden="true" data-slot="pagination-ellipsis" [class]="computedClass()">
      <lucide-icon [img]="moreHorizontalIcon" class="size-4"></lucide-icon>
      <span class="sr-only">More pages</span>
    </span>
  `,
})
export class PaginationEllipsisComponent {
  readonly class = input<string>('');

  protected readonly moreHorizontalIcon = MoreHorizontal;

  protected readonly computedClass = computed(() =>
    cn('flex size-9 items-center justify-center', this.class())
  );
}
