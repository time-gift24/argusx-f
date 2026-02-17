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
          <h2 class="text-sm font-medium text-muted-foreground">Determinate</h2>
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
