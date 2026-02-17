import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/ui/button';
import { InputDirective } from '@app/shared/ui/input';
import { LabelDirective } from '@app/shared/ui/label';
import { PopoverComponents } from '@app/shared/ui/popover';

@Component({
  selector: 'app-popover-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopoverComponents, ButtonComponent, LabelDirective, InputDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Popover</h1>
      <p class="mb-8 text-muted-foreground">
        Lightweight floating surface for contextual forms and metadata.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Dimensions Form</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-popover [(open)]="open">
            <button argus-button variant="outline" appPopoverTrigger>
              Open popover
            </button>
            <app-popover-content class="w-80">
              <app-popover-header>
                <app-popover-title>Dimensions</app-popover-title>
                <app-popover-description>
                  Set the dimensions for the layer.
                </app-popover-description>
              </app-popover-header>
              <div class="grid gap-2">
                <div class="grid grid-cols-[72px_1fr] items-center gap-2">
                  <label appLabel for="popover-width">Width</label>
                  <input appInput id="popover-width" size="md" [value]="width()" />
                </div>
                <div class="grid grid-cols-[72px_1fr] items-center gap-2">
                  <label appLabel for="popover-height">Height</label>
                  <input appInput id="popover-height" size="md" [value]="height()" />
                </div>
              </div>
            </app-popover-content>
          </app-popover>
        </div>
      </section>
    </div>
  `,
})
export class PopoverPreviewComponent {
  readonly open = signal(false);
  readonly width = signal('100%');
  readonly height = signal('25px');
}
