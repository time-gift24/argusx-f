import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { LabelDirective } from '@app/shared/ui/label';
import {
  ArgusxPopoverAlign,
  ArgusxPopoverComponents,
  ArgusxPopoverSide,
} from '@app/shared/ui/popover';

interface PlacementCase {
  readonly id: string;
  readonly label: string;
  readonly side: ArgusxPopoverSide;
  readonly align: ArgusxPopoverAlign;
  readonly sideOffset: number;
}

@Component({
  selector: 'app-popover-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxPopoverComponents,
    ArgusxButtonDirective,
    LabelDirective,
    ArgusxInputDirective,
  ],
  template: `
    <div class="mx-auto max-w-6xl space-y-6 p-6">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold">Popover</h1>
        <p class="text-muted-foreground text-sm">
          shadcn-aligned popover API with plain defaults and ArgusX extension variants.
        </p>
      </header>

      <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
        <h2 class="text-sm font-medium text-muted-foreground">Shadcn Baseline</h2>
        <argusx-popover [(open)]="baselineOpen">
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
      </section>

      <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
        <h2 class="text-sm font-medium text-muted-foreground">Side + Align + Offset</h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          @for (placement of placementCases; track placement.id) {
            <div class="rounded-md border border-border/70 p-3">
              <div class="mb-2 text-xs text-muted-foreground">{{ placement.label }}</div>
              <argusx-popover>
                <button argusx-button variant="outline" size="sm" argusxPopoverTrigger class="w-full">
                  Preview
                </button>
                <argusx-popover-content
                  class="w-52"
                  [side]="placement.side"
                  [align]="placement.align"
                  [sideOffset]="placement.sideOffset"
                >
                  <p class="text-sm">side={{ placement.side }}, align={{ placement.align }}</p>
                </argusx-popover-content>
              </argusx-popover>
            </div>
          }
        </div>
      </section>

      <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
        <h2 class="text-sm font-medium text-muted-foreground">Controlled Open State</h2>
        <div class="mb-3 flex items-center gap-2">
          <button argusx-button variant="secondary" size="sm" (click)="controlledOpen.set(!controlledOpen())">
            {{ controlledOpen() ? 'Close from outside' : 'Open from outside' }}
          </button>
          <span class="text-muted-foreground text-xs">open={{ controlledOpen() }}</span>
        </div>
        <argusx-popover [(open)]="controlledOpen">
          <button argusx-button variant="outline" argusxPopoverTrigger>
            Controlled trigger
          </button>
          <argusx-popover-content class="w-72">
            <argusx-popover-header>
              <argusx-popover-title>Controlled Mode</argusx-popover-title>
              <argusx-popover-description>
                This panel can be toggled by either external or internal actions.
              </argusx-popover-description>
            </argusx-popover-header>
            <div class="flex gap-2">
              <button argusx-button size="sm" (click)="controlledOpen.set(false)">Close</button>
              <button argusx-button variant="outline" size="sm" (click)="controlledOpen.set(!controlledOpen())">
                Toggle
              </button>
            </div>
          </argusx-popover-content>
        </argusx-popover>
      </section>

      <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
        <h2 class="text-sm font-medium text-muted-foreground">ArgusX Extension Variant</h2>
        <div class="flex flex-wrap gap-3">
          <argusx-popover>
            <button argusx-button variant="outline" argusxPopoverTrigger>Plain (default)</button>
            <argusx-popover-content class="w-64">
              <argusx-popover-title>Plain Variant</argusx-popover-title>
              <argusx-popover-description>
                Default style stays neutral and token-based.
              </argusx-popover-description>
            </argusx-popover-content>
          </argusx-popover>

          <argusx-popover>
            <button argusx-button variant="outline" argusxPopoverTrigger>Glass extension</button>
            <argusx-popover-content variant="glass" side="right" class="w-64">
              <argusx-popover-title>Glass Variant</argusx-popover-title>
              <argusx-popover-description class="text-white/80">
                Optional ArgusX extension layered over the same shadcn API path.
              </argusx-popover-description>
            </argusx-popover-content>
          </argusx-popover>
        </div>
      </section>

      <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
        <h2 class="text-sm font-medium text-muted-foreground">Complex Combination (Anchor + Controlled + Variant)</h2>
        <div class="relative h-44 overflow-hidden rounded-md border border-border/70 bg-muted/20 p-3">
          <argusx-popover [(open)]="anchoredOpen">
            <span
              argusxPopoverAnchor
              class="bg-background absolute left-5 top-5 rounded-md border border-border px-2 py-1 text-xs font-medium"
            >
              Anchor Point
            </span>
            <button
              argusx-button
              variant="outline"
              size="sm"
              argusxPopoverTrigger
              class="absolute right-4 top-4"
            >
              Open anchored popover
            </button>
            <argusx-popover-content
              variant="glass"
              side="right"
              align="start"
              [sideOffset]="10"
              [alignOffset]="6"
              class="w-72"
            >
              <argusx-popover-header>
                <argusx-popover-title>Anchored Overlay</argusx-popover-title>
                <argusx-popover-description class="text-white/80">
                  Uses anchor + custom offsets + controlled state.
                </argusx-popover-description>
              </argusx-popover-header>
              <div class="mt-2 flex gap-2">
                <button argusx-button size="sm" (click)="anchoredOpen.set(false)">Done</button>
                <button argusx-button variant="outline" size="sm" (click)="anchoredOpen.set(!anchoredOpen())">
                  Toggle
                </button>
              </div>
            </argusx-popover-content>
          </argusx-popover>
        </div>

        <div class="pt-1">
          <argusx-popover>
            <button argusx-button variant="outline" disabled argusxPopoverTrigger>
              Disabled trigger (state guard)
            </button>
            <argusx-popover-content>
              <p class="text-sm">Disabled triggers are ignored by directive click handling.</p>
            </argusx-popover-content>
          </argusx-popover>
        </div>
      </section>
    </div>
  `,
})
export class PopoverPreviewComponent {
  readonly baselineOpen = signal(false);
  readonly controlledOpen = signal(false);
  readonly anchoredOpen = signal(false);

  readonly width = signal('100%');
  readonly height = signal('25px');

  readonly placementCases: readonly PlacementCase[] = [
    { id: 'bottom-start', label: 'Bottom / Start', side: 'bottom', align: 'start', sideOffset: 4 },
    { id: 'bottom-end', label: 'Bottom / End', side: 'bottom', align: 'end', sideOffset: 8 },
    { id: 'top-center', label: 'Top / Center', side: 'top', align: 'center', sideOffset: 6 },
    { id: 'right-center', label: 'Right / Center', side: 'right', align: 'center', sideOffset: 10 },
  ];
}
