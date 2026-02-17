import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollAreaComponents } from '@app/shared/ui/scroll-area/scroll-area.component';

@Component({
  selector: 'app-scroll-area-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollAreaComponents],
  template: `
    <div class="mx-auto max-w-4xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Scroll Area</h1>
      <p class="mb-8 text-muted-foreground">
        Custom scroll container with styled scrollbars while keeping native scrolling behavior.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Vertical</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <app-scroll-area class="h-56 rounded-md border">
            <div class="p-4 space-y-2">
              @for (item of messages; track item) {
                <div class="rounded-md border px-3 py-2 text-xs">{{ item }}</div>
              }
            </div>
          </app-scroll-area>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Horizontal</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <app-scroll-area class="w-full rounded-md border" orientation="horizontal">
            <div class="flex w-max gap-3 p-4">
              @for (card of boards; track card) {
                <div class="h-28 w-48 rounded-md border bg-muted/30 p-3 text-xs font-medium">
                  {{ card }}
                </div>
              }
            </div>
          </app-scroll-area>
        </div>
      </section>
    </div>
  `,
})
export class ScrollAreaPreviewComponent {
  readonly messages = [
    'Realtime update: deployment completed.',
    'Payment retry succeeded on second attempt.',
    'Background sync started for 128 records.',
    'Storage usage is at 72% of your quota.',
    'New team member accepted invitation.',
    'Webhook response latency exceeds threshold.',
    'Weekly report is ready for review.',
    'API key rotated successfully.',
    'Two-factor authentication enabled.',
    'Long running task finished in 3m 12s.',
  ] as const;

  readonly boards = [
    'Roadmap Q1',
    'Marketing Assets',
    'Bug Triage',
    'Design Reviews',
    'Client Requests',
    'Release Checklist',
  ] as const;
}
