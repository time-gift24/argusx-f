import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '@app/shared/ui/button';
import { HoverCardComponents } from '@app/shared/ui/hover-card';

@Component({
  selector: 'app-hover-card-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HoverCardComponents, ButtonComponent],
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
          <app-hover-card>
            <button argus-button variant="link" appHoverCardTrigger>
              @argusx
            </button>
            <app-hover-card-content class="w-80">
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
            </app-hover-card-content>
          </app-hover-card>
        </div>
      </section>
    </div>
  `,
})
export class HoverCardPreviewComponent {}
