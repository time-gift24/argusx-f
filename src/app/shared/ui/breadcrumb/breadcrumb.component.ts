import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { LucideAngularModule, ChevronRight, MoreHorizontal } from 'lucide-angular';

// ============================================================================
// Breadcrumb Component
// ============================================================================

/**
 * Breadcrumb navigation container.
 * Aligned with official shadcn preset (.vendor/aim/components/ui/breadcrumb.tsx)
 *
 * @example
 * ```html
 * <app-breadcrumb>
 *   <app-breadcrumb-list>
 *     <app-breadcrumb-item>
 *       <app-breadcrumb-link href="/">Home</app-breadcrumb-link>
 *     </app-breadcrumb-item>
 *     <app-breadcrumb-separator />
 *     <app-breadcrumb-item>
 *       <app-breadcrumb-link href="/products">Products</app-breadcrumb-link>
 *     </app-breadcrumb-item>
 *     <app-breadcrumb-separator />
 *     <app-breadcrumb-item>
 *       <app-breadcrumb-page>Current Page</app-breadcrumb-page>
 *     </app-breadcrumb-item>
 *   </app-breadcrumb-list>
 * </app-breadcrumb>
 * ```
 */
@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb"',
    '[attr.aria-label]': '"breadcrumb"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(this.class())
  );
}

// ============================================================================
// Breadcrumb List
// ============================================================================

/**
 * Ordered list container for breadcrumb items.
 */
@Component({
  selector: 'app-breadcrumb-list',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-list"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbListComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground gap-1.5 text-xs/relaxed flex flex-wrap items-center wrap-break-word',
      this.class()
    )
  );
}

// ============================================================================
// Breadcrumb Item
// ============================================================================

/**
 * List item container for breadcrumb elements.
 */
@Component({
  selector: 'app-breadcrumb-item',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-item"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbItemComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('gap-1 inline-flex items-center', this.class())
  );
}

// ============================================================================
// Breadcrumb Link
// ============================================================================

/**
 * Clickable link for navigation in breadcrumb.
 * Supports both RouterLink and native anchor elements.
 */
@Component({
  selector: 'a[app-breadcrumb-link], app-breadcrumb-link',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-link"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbLinkComponent {
  readonly class = input<string>('');
  readonly href = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('hover:text-foreground transition-colors', this.class())
  );
}

// ============================================================================
// Breadcrumb Page
// ============================================================================

/**
 * Current page indicator (non-clickable).
 */
@Component({
  selector: 'app-breadcrumb-page',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"breadcrumb-page"',
    '[attr.role]': '"link"',
    '[attr.aria-disabled]': 'true',
    '[attr.aria-current]': '"page"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbPageComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-foreground font-normal', this.class())
  );
}

// ============================================================================
// Breadcrumb Separator
// ============================================================================

/**
 * Visual separator between breadcrumb items.
 */
@Component({
  selector: 'app-breadcrumb-separator',
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (customContent()) {
      <ng-content />
    } @else {
      <lucide-icon [img]="chevronRightIcon" class="size-3.5"></lucide-icon>
    }
  `,
  host: {
    '[attr.data-slot]': '"breadcrumb-separator"',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': 'true',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbSeparatorComponent {
  readonly class = input<string>('');
  readonly chevronRightIcon = ChevronRight;

  /**
   * Whether custom content is provided via ng-content.
   * Used to determine whether to render default icon or custom content.
   */
  readonly customContent = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn('[&>svg]:size-3.5', this.class())
  );
}

// ============================================================================
// Breadcrumb Ellipsis
// ============================================================================

/**
 * Ellipsis indicator for collapsed breadcrumb items.
 */
@Component({
  selector: 'app-breadcrumb-ellipsis',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="moreHorizontalIcon" class="size-3.5"></lucide-icon>
    <span class="sr-only">More</span>
  `,
  host: {
    '[attr.data-slot]': '"breadcrumb-ellipsis"',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': 'true',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbEllipsisComponent {
  readonly class = input<string>('');
  readonly moreHorizontalIcon = MoreHorizontal;

  protected readonly computedClass = computed(() =>
    cn(
      'size-4 [&>svg]:size-3.5 flex items-center justify-center',
      this.class()
    )
  );
}

// ============================================================================
// Exports
// ============================================================================

export const BreadcrumbComponents = [
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  BreadcrumbEllipsisComponent,
];
