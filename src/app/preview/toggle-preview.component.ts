import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArgusxToggleComponent, ToggleDirective } from '@app/shared/ui/toggle';

@Component({
  selector: 'app-toggle-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxToggleComponent, FormsModule, ToggleDirective],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Toggle</h1>
      <p class="mb-8 text-muted-foreground">
        Two-state action button useful for formatting and mode switches.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Plain (Default)</h2>
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

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle Component - Plain (Default)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <argusx-toggle [default]="true">Bold</argusx-toggle>
            <argusx-toggle>Italic</argusx-toggle>
            <argusx-toggle>Underline</argusx-toggle>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle - Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex items-center gap-2">
          <argusx-toggle size="sm">Small</argusx-toggle>
          <argusx-toggle size="md">Medium</argusx-toggle>
          <argusx-toggle size="lg">Large</argusx-toggle>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle - Variants</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap items-center gap-2">
          <argusx-toggle variant="plain">Plain</argusx-toggle>
          <argusx-toggle variant="outline">Outline</argusx-toggle>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle - Controlled</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex items-center gap-2">
            <argusx-toggle [(ngModel)]="controlledValue">Controlled: {{ controlledValue() }}</argusx-toggle>
          </div>
          <button class="text-sm underline" (click)="toggleControlled()">
            Toggle via code
          </button>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle - Disabled</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex items-center gap-2">
          <argusx-toggle [disabled]="true">Disabled Off</argusx-toggle>
          <argusx-toggle [default]="true" [disabled]="true">Disabled On</argusx-toggle>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle - Events</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex items-center gap-2">
            <argusx-toggle (toggleChange)="onToggleChange($event)">Click to toggle</argusx-toggle>
          </div>
          <p class="text-xs text-muted-foreground">Last event: {{ lastEvent() }}</p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Argusx Toggle - Complex (Multiple States)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <argusx-toggle size="sm" variant="outline" (toggleChange)="logChange('sm-outline', $event)">
              Small Outline
            </argusx-toggle>
            <argusx-toggle size="md" variant="plain" [default]="true" (toggleChange)="logChange('md-plain', $event)">
              Medium Plain
            </argusx-toggle>
            <argusx-toggle size="lg" variant="outline" [disabled]="true">
              Disabled
            </argusx-toggle>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class TogglePreviewComponent {
  readonly bold = signal(true);
  readonly italic = signal(false);
  readonly underline = signal(false);

  readonly controlledValue = signal(false);
  readonly lastEvent = signal<string>('None');

  toggleControlled(): void {
    this.controlledValue.update((v) => !v);
  }

  readonly activeStates = () => {
    const states: string[] = [];
    if (this.bold()) states.push('Bold');
    if (this.italic()) states.push('Italic');
    if (this.underline()) states.push('Underline');
    return states.join(', ');
  };

  onToggleChange(value: boolean): void {
    this.lastEvent.set(`Value changed to: ${value}`);
  }

  logChange(name: string, value: boolean): void {
    console.log(`Toggle ${name} changed:`, value);
  }
}
