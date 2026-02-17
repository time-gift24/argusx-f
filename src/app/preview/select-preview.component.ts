import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { SelectComponents } from '@app/shared/ui/select';

@Component({
  selector: 'app-select-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Select</h1>
      <p class="mb-8 text-muted-foreground">
        Trigger-based select component with keyboard navigation and grouped options.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-select [value]="framework()" (valueChange)="framework.set($event)">
            <app-select-value>{{ frameworkLabel() }}</app-select-value>

            <app-select-group>
              <app-select-label>Frameworks</app-select-label>
              @for (item of frameworks; track item.value) {
                <app-select-item [value]="item.value">
                  {{ item.label }}
                </app-select-item>
              }
            </app-select-group>
          </app-select>

          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ frameworkLabel() }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Small + Disabled</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 flex flex-wrap items-center gap-3">
          <app-select [value]="timezone()" (valueChange)="timezone.set($event)" size="sm">
            <app-select-value>{{ timezoneLabel() }}</app-select-value>

            <app-select-group>
              <app-select-label>Timezone</app-select-label>
              @for (item of timezones; track item.value) {
                <app-select-item [value]="item.value">
                  {{ item.label }}
                </app-select-item>
              }
            </app-select-group>
          </app-select>

          <app-select [disabled]="true">
            <app-select-value>Disabled</app-select-value>
          </app-select>
        </div>
      </section>
    </div>
  `,
})
export class SelectPreviewComponent {
  readonly framework = signal<string | undefined>('next.js');
  readonly timezone = signal<string | undefined>('utc+8');

  readonly frameworks = [
    { value: 'next.js', label: 'Next.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt' },
    { value: 'remix', label: 'Remix' },
  ] as const;

  readonly timezones = [
    { value: 'utc-5', label: 'UTC-05:00 (New York)' },
    { value: 'utc+1', label: 'UTC+01:00 (Berlin)' },
    { value: 'utc+8', label: 'UTC+08:00 (Shanghai)' },
    { value: 'utc+9', label: 'UTC+09:00 (Tokyo)' },
  ] as const;

  readonly frameworkLabel = computed(
    () => this.frameworks.find((item) => item.value === this.framework())?.label ?? 'Select framework'
  );

  readonly timezoneLabel = computed(
    () => this.timezones.find((item) => item.value === this.timezone())?.label ?? 'Select timezone'
  );
}
