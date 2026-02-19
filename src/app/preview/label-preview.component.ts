import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { LabelDirective } from '@app/shared/ui/label';

@Component({
  selector: 'app-label-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabelDirective, ArgusxInputDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Label</h1>
      <p class="mb-8 text-muted-foreground">
        Semantic form labels with spacing and disabled peer styling.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Form Labels</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="space-y-1.5">
            <label appLabel for="label-email">Email</label>
            <input argusxInput id="label-email" type="email" placeholder="name@example.com" />
          </div>
          <div class="space-y-1.5">
            <label appLabel for="label-password">Password</label>
            <input argusxInput id="label-password" type="password" placeholder="••••••••" />
          </div>
          <div class="space-y-1.5">
            <label appLabel class="peer-disabled:opacity-50" for="label-disabled">Disabled input</label>
            <input argusxInput id="label-disabled" [disabled]="true" value="Locked field" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class LabelPreviewComponent {}
