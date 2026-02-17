import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EmptyContentDirective,
  EmptyDescriptionDirective,
  EmptyDirective,
  EmptyHeaderDirective,
  EmptyMediaDirective,
  EmptyTitleDirective,
} from '@app/shared/ui/empty';
import { ButtonComponent } from '@app/shared/ui/button';

@Component({
  selector: 'app-empty-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EmptyDirective,
    EmptyHeaderDirective,
    EmptyMediaDirective,
    EmptyTitleDirective,
    EmptyDescriptionDirective,
    EmptyContentDirective,
    ButtonComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Empty</h1>
      <p class="mb-8 text-muted-foreground">
        Preset for empty states with media, copy, and actions.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Inbox Empty State</h2>
        </div>
        <div appEmpty class="border border-dashed border-border">
          <div appEmptyMedia variant="icon">
            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-6l-2 3H10l-2-3H2" />
              <path d="M5 12V4h14v8" />
              <path d="M5 12v7h14v-7" />
            </svg>
          </div>
          <div appEmptyHeader>
            <h3 appEmptyTitle>No messages yet</h3>
            <p appEmptyDescription>
              New conversations will appear here once your teammates send messages.
            </p>
          </div>
          <div appEmptyContent>
            <button argus-button size="sm">Start conversation</button>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Search Empty State</h2>
        </div>
        <div appEmpty class="border border-dashed border-border">
          <div appEmptyHeader>
            <h3 appEmptyTitle>No results found</h3>
            <p appEmptyDescription>
              Try adjusting filters or search with fewer keywords.
            </p>
          </div>
          <div appEmptyContent>
            <button argus-button variant="outline" size="sm">Reset filters</button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class EmptyPreviewComponent {}
