import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tabs-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Tabs</h1>
      <p class="mb-8 text-muted-foreground">A tabbed interface component.</p>
      <section class="mb-8">
        <div class="rounded-lg border border-dashed border-border p-6">
          <p class="text-sm text-muted-foreground">Tabs preview is under development.</p>
        </div>
      </section>
    </div>
  `,
})
export class TabsPreviewComponent {}
