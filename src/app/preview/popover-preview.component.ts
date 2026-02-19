import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { LabelDirective } from '@app/shared/ui/label';
import { ArgusxPopoverComponents } from '@app/shared/ui/popover';

@Component({
  selector: 'app-popover-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxPopoverComponents, ArgusxButtonDirective, LabelDirective, ArgusxInputDirective],
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
          <argusx-popover [(open)]="open">
            <button argusx-button variant="outline" argusxPopoverTrigger>
              Open popover
            </button>
            <argusx-popover-content class="w-80">
              <argusx-popover-header>
                <argusx-popover-title>Dimensions</argusx-popover-title>
                <argusx-popover-description>
                  Set the dimensions for the layer.
                </argusx-popover-description>
              </argusx-popover-header>
              <div class="grid gap-2">
                <div class="grid grid-cols-[72px_1fr] items-center gap-2">
                  <label appLabel for="popover-width">Width</label>
                  <input argusxInput id="popover-width" [value]="width()" />
                </div>
                <div class="grid grid-cols-[72px_1fr] items-center gap-2">
                  <label appLabel for="popover-height">Height</label>
                  <input argusxInput id="popover-height" [value]="height()" />
                </div>
              </div>
            </argusx-popover-content>
          </argusx-popover>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Glass Variant</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-popover [(open)]="glassOpen">
            <button argusx-button variant="outline" argusxPopoverTrigger>
              Open glass popover
            </button>
            <argusx-popover-content class="w-80" variant="glass">
              <argusx-popover-header>
                <argusx-popover-title>Glass Effect</argusx-popover-title>
                <argusx-popover-description>
                  A glassmorphism styled popover.
                </argusx-popover-description>
              </argusx-popover-header>
            </argusx-popover-content>
          </argusx-popover>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Position: Top</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-popover [(open)]="topOpen" side="top">
            <button argusx-button variant="outline" argusxPopoverTrigger>
              Open top popover
            </button>
            <argusx-popover-content class="w-80">
              <argusx-popover-header>
                <argusx-popover-title>Top Position</argusx-popover-title>
                <argusx-popover-description>
                  This popover appears above the trigger.
                </argusx-popover-description>
              </argusx-popover-header>
            </argusx-popover-content>
          </argusx-popover>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Align: Start</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-popover [(open)]="startOpen" align="start">
            <button argusx-button variant="outline" argusxPopoverTrigger>
              Open start-aligned popover
            </button>
            <argusx-popover-content class="w-80">
              <argusx-popover-header>
                <argusx-popover-title>Start Aligned</argusx-popover-title>
                <argusx-popover-description>
                  This popover is aligned to the start.
                </argusx-popover-description>
              </argusx-popover-header>
            </argusx-popover-content>
          </argusx-popover>
        </div>
      </section>
    </div>
  `,
})
export class PopoverPreviewComponent {
  readonly open = signal(false);
  readonly glassOpen = signal(false);
  readonly topOpen = signal(false);
  readonly startOpen = signal(false);
  readonly width = signal('100%');
  readonly height = signal('25px');
}
