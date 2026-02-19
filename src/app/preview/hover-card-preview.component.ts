import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxHoverCardComponents } from '@app/shared/ui/hover-card';

@Component({
  selector: 'app-hover-card-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxHoverCardComponents, ArgusxButtonDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Hover Card</h1>
      <p class="mb-8 text-muted-foreground">
        Preview additional profile or context data on hover/focus.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Profile Preview</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex justify-center">
          <argusx-hover-card>
            <button argusx-button variant="link" argusxHoverCardTrigger>
              &#64;argusx
            </button>
            <argusx-hover-card-content class="w-80">
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full bg-muted"></div>
                  <div>
                    <p class="text-sm font-semibold">Argus X Team</p>
                    <p class="text-xs text-muted-foreground">UI primitives for Angular</p>
                  </div>
                </div>
                <p class="text-xs text-muted-foreground">
                  Open-source component collection aligned with shadcn design language.
                </p>
              </div>
            </argusx-hover-card-content>
          </argusx-hover-card>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Position Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex justify-around">
          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              Top
            </button>
            <argusx-hover-card-content side="top">
              <p class="text-sm">Content appears above the trigger</p>
            </argusx-hover-card-content>
          </argusx-hover-card>

          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              Right
            </button>
            <argusx-hover-card-content side="right">
              <p class="text-sm">Content appears to the right</p>
            </argusx-hover-card-content>
          </argusx-hover-card>

          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              Bottom
            </button>
            <argusx-hover-card-content side="bottom">
              <p class="text-sm">Content appears below</p>
            </argusx-hover-card-content>
          </argusx-hover-card>

          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              Left
            </button>
            <argusx-hover-card-content side="left">
              <p class="text-sm">Content appears to the left</p>
            </argusx-hover-card-content>
          </argusx-hover-card>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Align Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex justify-around">
          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              Start
            </button>
            <argusx-hover-card-content align="start">
              <p class="text-sm">Aligned to start</p>
            </argusx-hover-card-content>
          </argusx-hover-card>

          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              Center
            </button>
            <argusx-hover-card-content align="center">
              <p class="text-sm">Aligned to center</p>
            </argusx-hover-card-content>
          </argusx-hover-card>

          <argusx-hover-card>
            <button argusx-button argusxHoverCardTrigger>
              End
            </button>
            <argusx-hover-card-content align="end">
              <p class="text-sm">Aligned to end</p>
            </argusx-hover-card-content>
          </argusx-hover-card>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">With Custom Delay</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex justify-center">
          <argusx-hover-card [openDelay]="500" [closeDelay]="500">
            <button argusx-button argusxHoverCardTrigger>
              Slow hover (500ms)
            </button>
            <argusx-hover-card-content>
              <p class="text-sm">Takes 500ms to open/close</p>
            </argusx-hover-card-content>
          </argusx-hover-card>
        </div>
      </section>
    </div>
  `,
})
export class HoverCardPreviewComponent {}
