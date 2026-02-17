import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  PaginationComponent,
  PaginationContentComponent,
  PaginationEllipsisComponent,
  PaginationItemComponent,
  PaginationLinkComponent,
  PaginationNextComponent,
  PaginationPreviousComponent,
} from '@app/shared/ui/pagination';

@Component({
  selector: 'app-pagination-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PaginationComponent,
    PaginationContentComponent,
    PaginationItemComponent,
    PaginationLinkComponent,
    PaginationPreviousComponent,
    PaginationNextComponent,
    PaginationEllipsisComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Pagination</h1>
      <p class="mb-8 text-muted-foreground">
        Navigation controls for long lists and paged datasets.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <app-pagination>
            <app-pagination-content>
              <app-pagination-item>
                <app-pagination-previous (pageChange)="goPrevious()" />
              </app-pagination-item>

              @for (page of pages; track page) {
                <app-pagination-item>
                  <app-pagination-link
                    [page]="page"
                    [isActive]="currentPage() === page"
                    (pageChange)="currentPage.set($event)"
                  >
                    {{ page }}
                  </app-pagination-link>
                </app-pagination-item>
              }

              <app-pagination-item>
                <app-pagination-ellipsis />
              </app-pagination-item>

              <app-pagination-item>
                <app-pagination-link [page]="10" (pageChange)="currentPage.set($event)">
                  10
                </app-pagination-link>
              </app-pagination-item>

              <app-pagination-item>
                <app-pagination-next (pageChange)="goNext()" />
              </app-pagination-item>
            </app-pagination-content>
          </app-pagination>

          <p class="text-xs text-muted-foreground text-center">
            Current page:
            <span class="font-medium text-foreground">{{ currentPage() }}</span>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class PaginationPreviewComponent {
  readonly currentPage = signal(2);
  readonly pages = [1, 2, 3, 4, 5] as const;

  goPrevious(): void {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  goNext(): void {
    this.currentPage.update((page) => Math.min(10, page + 1));
  }
}
