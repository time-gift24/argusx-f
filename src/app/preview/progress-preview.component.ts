import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressComponent } from '@app/shared/ui/progress';

@Component({
  selector: 'app-progress-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Progress</h1>
      <p class="mb-8 text-muted-foreground">
        Visual indicator for task completion and loading states.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span>Upload</span>
              <span>25%</span>
            </div>
            <app-progress [value]="25" />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span>Indexing</span>
              <span>66%</span>
            </div>
            <app-progress [value]="66" />
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Small</span>
            <app-progress [value]="50" size="sm" />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Default</span>
            <app-progress [value]="50" size="default" />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Large</span>
            <app-progress [value]="50" size="lg" />
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Colors</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Default</span>
            <app-progress [value]="75" variant="default" />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Success</span>
            <app-progress [value]="75" variant="success" />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Warning</span>
            <app-progress [value]="75" variant="warning" />
          </div>
          <div class="space-y-2">
            <span class="text-xs text-muted-foreground">Danger</span>
            <app-progress [value]="75" variant="danger" />
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Indeterminate</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-2">
          <p class="text-xs text-muted-foreground">Preparing environment...</p>
          <app-progress [indeterminate]="true" />
        </div>
      </section>
    </div>
  `,
})
export class ProgressPreviewComponent {}
