import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponents } from '@app/shared/ui/breadcrumb';

@Component({
  selector: 'app-breadcrumb-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BreadcrumbComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Breadcrumb</h1>
      <p class="mb-8 text-muted-foreground">
        Displays the path of navigation in a hierarchical structure.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-breadcrumb>
            <app-breadcrumb-list>
              <app-breadcrumb-item>
                <a app-breadcrumb-link href="#">Home</a>
              </app-breadcrumb-item>
              <app-breadcrumb-separator />
              <app-breadcrumb-item>
                <a app-breadcrumb-link href="#">Components</a>
              </app-breadcrumb-item>
              <app-breadcrumb-separator />
              <app-breadcrumb-item>
                <app-breadcrumb-page>Breadcrumb</app-breadcrumb-page>
              </app-breadcrumb-item>
            </app-breadcrumb-list>
          </app-breadcrumb>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Custom Separator</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-breadcrumb>
            <app-breadcrumb-list>
              <app-breadcrumb-item>
                <a app-breadcrumb-link href="#">Home</a>
              </app-breadcrumb-item>
              <app-breadcrumb-separator>/</app-breadcrumb-separator>
              <app-breadcrumb-item>
                <a app-breadcrumb-link href="#">Shop</a>
              </app-breadcrumb-item>
              <app-breadcrumb-separator>/</app-breadcrumb-separator>
              <app-breadcrumb-item>
                <app-breadcrumb-page>Products</app-breadcrumb-page>
              </app-breadcrumb-item>
            </app-breadcrumb-list>
          </app-breadcrumb>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Ellipsis</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-breadcrumb>
            <app-breadcrumb-list>
              <app-breadcrumb-item>
                <a app-breadcrumb-link href="#">Home</a>
              </app-breadcrumb-item>
              <app-breadcrumb-separator />
              <app-breadcrumb-item>
                <app-breadcrumb-ellipsis />
              </app-breadcrumb-item>
              <app-breadcrumb-separator />
              <app-breadcrumb-item>
                <a app-breadcrumb-link href="#">Components</a>
              </app-breadcrumb-item>
              <app-breadcrumb-separator />
              <app-breadcrumb-item>
                <app-breadcrumb-page>Breadcrumb</app-breadcrumb-page>
              </app-breadcrumb-item>
            </app-breadcrumb-list>
          </app-breadcrumb>
        </div>
      </section>
    </div>
  `,
})
export class BreadcrumbPreviewComponent {}
