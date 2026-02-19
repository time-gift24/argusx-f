import { ChangeDetectionStrategy, Component, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import {
  ArgusxTooltipDirective,
  ArgusxTooltipContentComponent,
} from '@app/shared/ui/tooltip';

@Component({
  selector: 'app-tooltip-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ArgusxButtonDirective, ArgusxTooltipDirective, ArgusxTooltipContentComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Tooltip</h1>
      <p class="mb-8 text-muted-foreground">
        Contextual hints displayed on hover or focus. ArgusX tooltip uses a directive-based API.
      </p>

      <!-- Positions / Sides -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Positions</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-3">
          <button
            argusx-button
            variant="outline"
            size="sm"
            [argusxTooltip]="'Tooltip from top'"
            argusxTooltipPosition="top"
          >
            Top
          </button>

          <button
            argusx-button
            variant="outline"
            size="sm"
            [argusxTooltip]="'Tooltip from right'"
            argusxTooltipPosition="right"
          >
            Right
          </button>

          <button
            argusx-button
            variant="outline"
            size="sm"
            [argusxTooltip]="'Tooltip from bottom'"
            argusxTooltipPosition="bottom"
          >
            Bottom
          </button>

          <button
            argusx-button
            variant="outline"
            size="sm"
            [argusxTooltip]="'Tooltip from left'"
            argusxTooltipPosition="left"
          >
            Left
          </button>
        </div>
      </section>

      <!-- Trigger Types -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Triggers</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-3">
          <button
            argusx-button
            variant="outline"
            [argusxTooltip]="'Hover trigger (default)'"
            [argusxTooltipTrigger]="'hover'"
          >
            Hover (default)
          </button>

          <button
            argusx-button
            variant="outline"
            [argusxTooltip]="'Click trigger'"
            [argusxTooltipTrigger]="'click'"
          >
            Click
          </button>
        </div>
      </section>

      <!-- Controlled Mode -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Controlled Mode</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-3 items-center">
          <button
            argusx-button
            variant="outline"
            [argusxTooltip]="'Controlled tooltip'"
            [argusxTooltipTrigger]="'click'"
            [argusxTooltipOpen]="isOpen()"
            (argusxTooltipShow)="onShow()"
            (argusxTooltipHide)="onHide()"
          >
            {{ isOpen() ? 'Open' : 'Closed' }}
          </button>

          <button
            argusx-button
            variant="secondary"
            (click)="toggleOpen()"
          >
            Toggle
          </button>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">Status: {{ isOpen() ? 'Open' : 'Closed' }}</p>
      </section>

      <!-- Rich Content with TemplateRef -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Rich Content (TemplateRef)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <button
            argusx-button
            [argusxTooltip]="richTooltipTemplate"
            argusxTooltipPosition="top"
          >
            Hover for rich content
          </button>
        </div>
        <ng-template #richTooltipTemplate>
          <div class="text-center">
            <p class="font-semibold">Custom Tooltip</p>
            <p class="text-xs opacity-80">With multiple lines of content</p>
          </div>
        </ng-template>
      </section>

      <!-- Delay Configuration -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Delay Configuration</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-3">
          <button
            argusx-button
            variant="secondary"
            [argusxTooltip]="'Quick show/hide (50ms)'"
            [argusxShowDelay]="50"
            [argusxHideDelay]="50"
          >
            50ms delay
          </button>

          <button
            argusx-button
            variant="secondary"
            [argusxTooltip]="'Slow show/hide (800ms)'"
            [argusxShowDelay]="800"
            [argusxHideDelay]="800"
          >
            800ms delay
          </button>
        </div>
      </section>

      <!-- API Reference -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">API Reference</h2>
        </div>
        <div class="rounded-lg border border-border p-4 bg-card">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 pr-4 font-medium">Input</th>
                <th class="text-left py-2 pr-4 font-medium">Type</th>
                <th class="text-left py-2 font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono text-xs">argusxTooltip</td>
                <td class="py-2 pr-4">string | TemplateRef</td>
                <td class="py-2">null</td>
              </tr>
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono text-xs">argusxTooltipPosition</td>
                <td class="py-2 pr-4">'top' | 'right' | 'bottom' | 'left'</td>
                <td class="py-2">'top'</td>
              </tr>
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono text-xs">argusxTooltipTrigger</td>
                <td class="py-2 pr-4">'hover' | 'click'</td>
                <td class="py-2">'hover'</td>
              </tr>
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono text-xs">argusxTooltipOpen</td>
                <td class="py-2 pr-4">boolean</td>
                <td class="py-2">undefined (uncontrolled)</td>
              </tr>
              <tr class="border-b">
                <td class="py-2 pr-4 font-mono text-xs">argusxShowDelay</td>
                <td class="py-2 pr-4">number</td>
                <td class="py-2">150</td>
              </tr>
              <tr>
                <td class="py-2 pr-4 font-mono text-xs">argusxHideDelay</td>
                <td class="py-2 pr-4">number</td>
                <td class="py-2">100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class TooltipPreviewComponent {
  readonly isOpen = signal(false);

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  onShow(): void {
    console.log('Tooltip shown');
  }

  onHide(): void {
    console.log('Tooltip hidden');
  }
}
