import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Skeleton</h1>
      <p class="mb-8 text-muted-foreground">A loading placeholder component.</p>
      <section class="mb-8">
        <div class="rounded-lg border border-dashed border-border p-6">
          <p class="text-sm text-muted-foreground">Skeleton preview is under development.</p>
        </div>
      </section>
    </div>
  `,
})
export class SkeletonPreviewComponent {}
