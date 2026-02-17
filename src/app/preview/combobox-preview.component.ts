import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComboboxComponents } from '@app/shared/ui/combobox';

@Component({
  selector: 'app-combobox-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComboboxComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Combobox</h1>
      <p class="mb-8 text-muted-foreground">
        A dropdown component with search and selection capabilities.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-combobox [(value)]="selectedFramework" placeholder="Select framework">
            <app-combobox-input placeholder="Search framework..." />
            <app-combobox-content>
              <app-combobox-empty>No framework found.</app-combobox-empty>
              <app-combobox-group>
                <app-combobox-label>Frameworks</app-combobox-label>
                @for (framework of frameworks; track framework.value) {
                  <app-combobox-item [value]="framework.value" [label]="framework.label">
                    {{ framework.label }}
                  </app-combobox-item>
                }
              </app-combobox-group>
            </app-combobox-content>
          </app-combobox>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ selectedFramework() ?? 'None' }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Multiple</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-combobox [(value)]="selectedTags" [multiple]="true" placeholder="Select tags">
            <app-combobox-input placeholder="Search tags..." />
            <app-combobox-content>
              <app-combobox-empty>No tag found.</app-combobox-empty>
              <app-combobox-group>
                <app-combobox-label>Tags</app-combobox-label>
                @for (tag of tags; track tag.value) {
                  <app-combobox-item [value]="tag.value" [label]="tag.label">
                    {{ tag.label }}
                  </app-combobox-item>
                }
              </app-combobox-group>
            </app-combobox-content>
          </app-combobox>
          <p class="text-xs text-muted-foreground">
            Selected:
            <span class="font-medium text-foreground">{{ selectedTags()?.length ? selectedTags()?.join(', ') : 'None' }}</span>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class ComboboxPreviewComponent {
  readonly selectedFramework = signal<string | undefined>('next.js');
  readonly selectedTags = signal<string[] | undefined>(['design-system']);

  readonly frameworks = [
    { value: 'next.js', label: 'Next.js' },
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt' },
    { value: 'remix', label: 'Remix' },
    { value: 'astro', label: 'Astro' },
  ] as const;

  readonly tags = [
    { value: 'design-system', label: 'Design System' },
    { value: 'components', label: 'Components' },
    { value: 'accessibility', label: 'Accessibility' },
    { value: 'animations', label: 'Animations' },
    { value: 'forms', label: 'Forms' },
  ] as const;
}
