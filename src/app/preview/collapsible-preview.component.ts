import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CollapsibleComponent, CollapsibleContentComponent } from '@app/shared/ui/collapsible';

@Component({
  selector: 'app-collapsible-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CollapsibleComponent, CollapsibleContentComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Collapsible</h1>
      <p class="mb-8 text-muted-foreground">
        A component that allows users to expand or collapse content.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-collapsible [(open)]="isOpen">
            <button app-collapsible-trigger class="flex items-center gap-2 text-sm font-medium hover:underline">
              @if (isOpen()) {
                <span>-</span>
              } @else {
                <span>+</span>
              }
              Can I collapse this?
            </button>
            <app-collapsible-content class="mt-2 text-sm text-muted-foreground">
              This is a collapsible section. You can hide or show this content by clicking the trigger above.
            </app-collapsible-content>
          </app-collapsible>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Multiple</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="space-y-4">
            <app-collapsible [(open)]="item1Open">
              <button app-collapsible-trigger class="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
                <span>Item 1</span>
                <span>{{ item1Open() ? '-' : '+' }}</span>
              </button>
              <app-collapsible-content class="mt-2 text-sm text-muted-foreground">
                Content for item 1. This can be collapsed or expanded independently.
              </app-collapsible-content>
            </app-collapsible>

            <app-collapsible [(open)]="item2Open">
              <button app-collapsible-trigger class="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
                <span>Item 2</span>
                <span>{{ item2Open() ? '-' : '+' }}</span>
              </button>
              <app-collapsible-content class="mt-2 text-sm text-muted-foreground">
                Content for item 2. Each collapsible section works independently.
              </app-collapsible-content>
            </app-collapsible>

            <app-collapsible [(open)]="item3Open">
              <button app-collapsible-trigger class="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
                <span>Item 3</span>
                <span>{{ item3Open() ? '-' : '+' }}</span>
              </button>
              <app-collapsible-content class="mt-2 text-sm text-muted-foreground">
                Content for item 3. Click to toggle visibility.
              </app-collapsible-content>
            </app-collapsible>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CollapsiblePreviewComponent {
  readonly isOpen = signal(false);
  readonly item1Open = signal(true);
  readonly item2Open = signal(false);
  readonly item3Open = signal(false);
}
