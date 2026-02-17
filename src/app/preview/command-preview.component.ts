import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommandComponents } from '@app/shared/ui/command';

@Component({
  selector: 'app-command-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommandComponents],
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
          <app-command
            [(value)]="selectedCommand"
            class="mx-auto max-w-lg rounded-lg border border-border"
          >
            <app-command-input placeholder="Type a command or search..." />
            <app-command-list>
              <app-command-empty>No results found.</app-command-empty>

              <app-command-group heading="Suggestions">
                <app-command-item value="calendar">
                  Calendar
                  <app-command-shortcut>⌘K</app-command-shortcut>
                </app-command-item>
                <app-command-item value="search-emojis">
                  Search Emojis
                  <app-command-shortcut>⌘E</app-command-shortcut>
                </app-command-item>
                <app-command-item value="calculator">
                  Calculator
                  <app-command-shortcut>⌘C</app-command-shortcut>
                </app-command-item>
              </app-command-group>

              <app-command-separator />

              <app-command-group heading="Settings">
                <app-command-item value="profile">Profile</app-command-item>
                <app-command-item value="billing">Billing</app-command-item>
                <app-command-item value="team" [disabled]="true">
                  Team
                  <app-command-shortcut>Pro</app-command-shortcut>
                </app-command-item>
              </app-command-group>
            </app-command-list>
          </app-command>
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
