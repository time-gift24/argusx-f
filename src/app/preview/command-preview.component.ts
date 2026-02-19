import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxCommandComponents } from '@app/shared/ui/command';

@Component({
  selector: 'app-command-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxCommandComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Command</h1>
      <p class="mb-8 text-muted-foreground">
        Fast keyboard navigation and fuzzy command filtering.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Command Palette</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-4">
          <argusx-command
            [(value)]="selectedCommand"
            class="mx-auto max-w-lg rounded-lg border border-border"
          >
            <argusx-command-input placeholder="Type a command or search..." />
            <argusx-command-list>
              <argusx-command-empty>No results found.</argusx-command-empty>

              <argusx-command-group heading="Suggestions">
                <argusx-command-item value="calendar">
                  Calendar
                  <argusx-command-shortcut>⌘K</argusx-command-shortcut>
                </argusx-command-item>
                <argusx-command-item value="search-emojis">
                  Search Emojis
                  <argusx-command-shortcut>⌘E</argusx-command-shortcut>
                </argusx-command-item>
                <argusx-command-item value="calculator">
                  Calculator
                  <argusx-command-shortcut>⌘C</argusx-command-shortcut>
                </argusx-command-item>
              </argusx-command-group>

              <argusx-command-separator />

              <argusx-command-group heading="Settings">
                <argusx-command-item value="profile">Profile</argusx-command-item>
                <argusx-command-item value="billing">Billing</argusx-command-item>
                <argusx-command-item value="team" [disabled]="true">
                  Team
                  <argusx-command-shortcut>Pro</argusx-command-shortcut>
                </argusx-command-item>
              </argusx-command-group>
            </argusx-command-list>
          </argusx-command>
          <p class="mt-3 text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ selectedCommand() ?? 'None' }}</span>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class CommandPreviewComponent {
  readonly selectedCommand = signal<string | undefined>(undefined);
}
