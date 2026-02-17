import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ToggleDirective } from '@app/shared/ui/toggle';

@Component({
  selector: 'app-toggle-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Toggle</h1>
      <p class="mb-8 text-muted-foreground">
        Two-state action button useful for formatting and mode switches.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Formatting</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <button
              appToggle
              [attr.aria-pressed]="bold()"
              [attr.data-state]="bold() ? 'on' : 'off'"
              (click)="bold.set(!bold())"
            >
              Bold
            </button>
            <button
              appToggle
              [attr.aria-pressed]="italic()"
              [attr.data-state]="italic() ? 'on' : 'off'"
              (click)="italic.set(!italic())"
            >
              Italic
            </button>
            <button
              appToggle
              [attr.aria-pressed]="underline()"
              [attr.data-state]="underline() ? 'on' : 'off'"
              (click)="underline.set(!underline())"
            >
              Underline
            </button>
          </div>
          <p class="text-xs text-muted-foreground">
            Active: {{ activeStates() || 'None' }}
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Outline + Size</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex items-center gap-2">
          <button appToggle variant="outline" size="sm">Small</button>
          <button appToggle variant="outline">Default</button>
          <button appToggle variant="outline" size="lg">Large</button>
        </div>
      </section>
    </div>
  `,
})
export class TogglePreviewComponent {
  readonly bold = signal(true);
  readonly italic = signal(false);
  readonly underline = signal(false);

  readonly activeStates = () => {
    const states: string[] = [];
    if (this.bold()) states.push('Bold');
    if (this.italic()) states.push('Italic');
    if (this.underline()) states.push('Underline');
    return states.join(', ');
  };
}
