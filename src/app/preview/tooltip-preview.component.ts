import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonDirective } from '@app/shared/ui/button';
import { TooltipComponents } from '@app/shared/ui/tooltip';

@Component({
  selector: 'app-tooltip-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonDirective, TooltipComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Tooltip</h1>
      <p class="mb-8 text-muted-foreground">
        Contextual hints displayed on hover or focus.
      </p>

      <app-tooltip-provider [delayDuration]="180">
        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Sides</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-3">
            <app-tooltip side="top">
              <button argusButton variant="outline" size="sm" appTooltipTrigger>Top</button>
              <app-tooltip-content>Tooltip from top</app-tooltip-content>
            </app-tooltip>

            <app-tooltip side="right">
              <button argusButton variant="outline" size="sm" appTooltipTrigger>Right</button>
              <app-tooltip-content>Tooltip from right</app-tooltip-content>
            </app-tooltip>

            <app-tooltip side="bottom">
              <button argusButton variant="outline" size="sm" appTooltipTrigger>Bottom</button>
              <app-tooltip-content>Tooltip from bottom</app-tooltip-content>
            </app-tooltip>

            <app-tooltip side="left">
              <button argusButton variant="outline" size="sm" appTooltipTrigger>Left</button>
              <app-tooltip-content>Tooltip from left</app-tooltip-content>
            </app-tooltip>
          </div>
        </section>

        <section>
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Rich Content</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <app-tooltip side="top" [sideOffset]="8">
              <button argusButton appTooltipTrigger>Hover to inspect</button>
              <app-tooltip-content class="max-w-56">
                Press <span class="font-semibold">Shift + K</span> to open command palette shortcuts.
              </app-tooltip-content>
            </app-tooltip>
          </div>
        </section>
      </app-tooltip-provider>
    </div>
  `,
})
export class TooltipPreviewComponent {}
