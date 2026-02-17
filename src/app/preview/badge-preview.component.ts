import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeDirective } from '@app/shared/ui/badge';

@Component({
  selector: 'app-badge-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Badge</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a badge or a component that looks like a badge.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span appBadge>Default</span>
            <span appBadge variant="secondary">Secondary</span>
            <span appBadge variant="destructive">Destructive</span>
            <span appBadge variant="outline">Outline</span>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Ghost</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <span appBadge variant="ghost">Ghost</span>
            <span appBadge variant="ghost">With text</span>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Link</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-2">
            <a appBadge variant="link" href="#">Link Badge</a>
            <a appBadge variant="link" href="#">Another Link</a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class BadgePreviewComponent {}
