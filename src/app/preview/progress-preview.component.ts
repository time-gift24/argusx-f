import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-progress-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Progress</h1>
      <p class="mb-8 text-muted-foreground">
        A progress indicator component.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Coming Soon</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <p class="text-sm text-muted-foreground">Progress preview component is under development.</p>
        </div>
      </section>
    </div>
  `,
})
export class ProgressPreviewComponent {}
