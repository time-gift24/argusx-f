import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import {
  NativeSelectDirective,
  NativeSelectIconDirective,
  NativeSelectOptionDirective,
  NativeSelectWrapperDirective,
} from '@app/shared/ui/native-select';
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
    NativeSelectWrapperDirective,
    NativeSelectDirective,
    NativeSelectOptionDirective,
    NativeSelectIconDirective,
    LucideAngularModule,
  ],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <div class="mb-8">
        <h1 class="mb-2 text-2xl font-semibold">Pagination</h1>
        <p class="text-muted-foreground">
          A list of pagination pages for navigation.
        </p>
      </div>

      <div
        class="mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8"
      >
        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Basic</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <app-pagination>
              <app-pagination-content>
                <app-pagination-item>
                  <app-pagination-previous href="#" />
                </app-pagination-item>

                <app-pagination-item>
                  <app-pagination-link href="#" [page]="1">1</app-pagination-link>
                </app-pagination-item>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="2" [isActive]="true">2</app-pagination-link>
                </app-pagination-item>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="3">3</app-pagination-link>
                </app-pagination-item>

                <app-pagination-item>
                  <app-pagination-ellipsis />
                </app-pagination-item>

                <app-pagination-item>
                  <app-pagination-next href="#" />
                </app-pagination-item>
              </app-pagination-content>
            </app-pagination>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Simple</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <app-pagination>
              <app-pagination-content>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="1">1</app-pagination-link>
                </app-pagination-item>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="2" [isActive]="true">2</app-pagination-link>
                </app-pagination-item>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="3">3</app-pagination-link>
                </app-pagination-item>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="4">4</app-pagination-link>
                </app-pagination-item>
                <app-pagination-item>
                  <app-pagination-link href="#" [page]="5">5</app-pagination-link>
                </app-pagination-item>
              </app-pagination-content>
            </app-pagination>
          </div>
        </section>

        <section
          class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch md:col-span-2 lg:max-w-none"
        >
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Select</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <div class="flex w-full items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="text-sm">Rows per page</span>
                <div appNativeSelectWrapper class="w-20">
                  <select
                    appNativeSelect
                    [value]="rowsPerPage()"
                    (change)="rowsPerPage.set($any($event.target).value)"
                  >
                    <option appNativeSelectOption value="10">10</option>
                    <option appNativeSelectOption value="25">25</option>
                    <option appNativeSelectOption value="50">50</option>
                    <option appNativeSelectOption value="100">100</option>
                  </select>
                  <lucide-icon appNativeSelectIcon [img]="chevronDownIcon"></lucide-icon>
                </div>
              </div>
              <app-pagination [class]="'mx-0 w-auto'">
                <app-pagination-content>
                  <app-pagination-item>
                    <app-pagination-previous href="#" />
                  </app-pagination-item>
                  <app-pagination-item>
                    <app-pagination-next href="#" />
                  </app-pagination-item>
                </app-pagination-content>
              </app-pagination>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class PaginationPreviewComponent {
  readonly chevronDownIcon = ChevronDown;
  readonly rowsPerPage = signal('100');
}
