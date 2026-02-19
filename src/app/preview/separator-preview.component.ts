import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxSeparatorComponent } from '@app/shared/ui/separator';

@Component({
  selector: 'app-separator-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxSeparatorComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Separator</h1>
      <p class="mb-8 text-muted-foreground">
        Visually or semantically separates content in a layout.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Horizontal</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <p class="text-xs font-medium">Account</p>
          <p class="text-xs text-muted-foreground">Manage your profile and security settings.</p>
          <argusx-separator />
          <p class="text-xs text-muted-foreground">Last synced 2 minutes ago.</p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Vertical</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex items-center gap-3 text-xs">
            <span>Overview</span>
            <argusx-separator orientation="vertical" class="h-4" />
            <span>Integrations</span>
            <argusx-separator orientation="vertical" class="h-4" />
            <span>Billing</span>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SeparatorPreviewComponent {}
