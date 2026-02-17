import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KbdDirective, KbdGroupDirective } from '@app/shared/ui/kbd';

@Component({
  selector: 'app-kbd-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KbdDirective, KbdGroupDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Kbd</h1>
      <p class="mb-8 text-muted-foreground">
        Keyboard key tokens for shortcut hints and command references.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Single Keys</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap gap-2">
          <kbd appKbd>⌘</kbd>
          <kbd appKbd>K</kbd>
          <kbd appKbd>Shift</kbd>
          <kbd appKbd>Esc</kbd>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Shortcut Group</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-2 text-xs text-muted-foreground">
          <div class="flex items-center justify-between">
            <span>Search</span>
            <kbd appKbdGroup>
              <kbd appKbd>⌘</kbd>
              <span>+</span>
              <kbd appKbd>K</kbd>
            </kbd>
          </div>
          <div class="flex items-center justify-between">
            <span>Close dialog</span>
            <kbd appKbd>Esc</kbd>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class KbdPreviewComponent {}
