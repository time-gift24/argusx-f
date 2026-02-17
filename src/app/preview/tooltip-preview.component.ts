import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tooltip-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Tooltip</h1>
      <p class="mb-8 text-muted-foreground">A floating tooltip component.</p>
      <section class="mb-8">
        <div class="rounded-lg border border-dashed border-border p-6">
          <p class="text-sm text-muted-foreground">Tooltip preview is under development.</p>
        </div>
      </section>
    </div>
  `,
})
export class TooltipPreviewComponent {}
