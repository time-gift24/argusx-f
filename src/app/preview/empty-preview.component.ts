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

      <!-- Default Empty State (matches shadcn empty-default.png) -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div appEmpty>
          <div appEmptyMedia variant="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16.5 9.4 7.55 4.24" />
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.29 7 12 12 20.71 7" />
              <line x1="12" x2="12" y1="22" y2="12" />
            </svg>
          </div>
          <div appEmptyHeader>
            <h3 appEmptyTitle>No conversations yet</h3>
            <p appEmptyDescription>
              Start a new conversation with your team members
            </p>
          </div>
          <div appEmptyContent>
            <button argus-button size="sm">Start new conversation</button>
          </div>
        </div>
      </section>

      <!-- With description only (no media) -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Description only</h2>
        </div>
        <div appEmpty>
          <div appEmptyHeader>
            <h3 appEmptyTitle>No results found</h3>
            <p appEmptyDescription>
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        </div>
      </section>

      <!-- With action button only -->
      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">With action</h2>
        </div>
        <div appEmpty>
          <div appEmptyHeader>
            <h3 appEmptyTitle>No items found</h3>
          </div>
          <div appEmptyContent>
            <button argus-button variant="outline" size="sm">Clear filters</button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class EmptyPreviewComponent {}
