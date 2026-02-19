import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ArgusxComboboxComponents } from '@app/shared/ui/combobox';

interface PreviewOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-combobox-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxComboboxComponents],
  template: `
    <div class="mx-auto max-w-5xl space-y-8 p-8">
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold">Combobox</h1>
        <p class="text-muted-foreground text-sm">
          shadcn-aligned composition API with ArgusX plain extensions.
        </p>
      </header>

      <section class="space-y-3 rounded-lg border border-dashed border-border p-6">
        <h2 class="text-sm font-medium text-muted-foreground">shadcn Baseline (Single Select)</h2>
        <div class="max-w-sm space-y-3">
          <argusx-combobox [(value)]="selectedFramework">
            <argusx-combobox-input
              placeholder="Search framework..."
              [showTrigger]="true"
              [showClear]="true" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                <argusx-combobox-group>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item
                      [value]="framework.value"
                      [label]="framework.label"
                      [disabled]="framework.disabled ?? false">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-group>
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>

          <p class="text-xs text-muted-foreground">
            Selected:
            <span class="font-medium text-foreground">{{ selectedFramework() ?? 'None' }}</span>
          </p>
        </div>
      </section>

      <section class="space-y-3 rounded-lg border border-dashed border-border p-6">
        <h2 class="text-sm font-medium text-muted-foreground">ArgusX Plain Extension (Multiple + Chips + size="sm")</h2>
        <div class="max-w-lg space-y-3">
          <argusx-combobox [(value)]="selectedTags" [multiple]="true" size="sm">
            <argusx-combobox-chips>
              @for (tag of selectedTagItems(); track tag.value) {
                <argusx-combobox-chip [value]="tag.value">
                  {{ tag.label }}
                </argusx-combobox-chip>
              }
              <argusx-combobox-chips-input placeholder="Type to add tags..." />
            </argusx-combobox-chips>

            <argusx-combobox-content>
              <argusx-combobox-list [fixedHeight]="true">
                <argusx-combobox-empty>No tag found.</argusx-combobox-empty>
                <argusx-combobox-group>
                  <argusx-combobox-label>Tags</argusx-combobox-label>
                  @for (tag of tags; track tag.value) {
                    <argusx-combobox-item
                      [value]="tag.value"
                      [label]="tag.label"
                      [disabled]="tag.disabled ?? false">
                      {{ tag.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-group>
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>

          <p class="text-xs text-muted-foreground">
            Selected tags:
            <span class="font-medium text-foreground">{{
              selectedTags()?.length ? selectedTags()?.join(', ') : 'None'
            }}</span>
          </p>
        </div>
      </section>

      <section class="space-y-3 rounded-lg border border-dashed border-border p-6">
        <h2 class="text-sm font-medium text-muted-foreground">State Coverage (Disabled + Item Disabled)</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <p class="text-xs text-muted-foreground">Disabled combobox</p>
            <argusx-combobox [value]="'react'" [disabled]="true">
              <argusx-combobox-input placeholder="Disabled combobox" />
              <argusx-combobox-content>
                <argusx-combobox-list>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>
          </div>

          <div class="space-y-2">
            <p class="text-xs text-muted-foreground">Mixed enabled / disabled options</p>
            <argusx-combobox [(value)]="selectedOwner">
              <argusx-combobox-input placeholder="Select owner..." />
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No owner found.</argusx-combobox-empty>
                  @for (owner of owners; track owner.value) {
                    <argusx-combobox-item
                      [value]="owner.value"
                      [label]="owner.label"
                      [disabled]="owner.disabled ?? false">
                      {{ owner.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>
          </div>
        </div>
      </section>

      <section class="space-y-3 rounded-lg border border-dashed border-border p-6">
        <h2 class="text-sm font-medium text-muted-foreground">Complex Combined Scenario</h2>
        <div class="max-w-md space-y-3">
          <argusx-combobox [(value)]="selectedStatus" [(open)]="statusOpen" size="sm">
            <argusx-combobox-input
              placeholder="Filter status..."
              [showTrigger]="false"
              [showClear]="true" />
            <argusx-combobox-content side="top" align="end" [sideOffset]="8">
              <argusx-combobox-list>
                <argusx-combobox-empty>No status found.</argusx-combobox-empty>
                <argusx-combobox-group>
                  <argusx-combobox-label>Roadmap</argusx-combobox-label>
                  @for (status of statuses; track status.value) {
                    <argusx-combobox-item [value]="status.value" [label]="status.label">
                      {{ status.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-group>
                <argusx-combobox-separator />
                <argusx-combobox-group>
                  <argusx-combobox-label>Quick Actions</argusx-combobox-label>
                  <argusx-combobox-item value="clear">Clear Filters</argusx-combobox-item>
                </argusx-combobox-group>
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>

          <div class="text-xs text-muted-foreground">
            <p>Open state: <span class="font-medium text-foreground">{{ statusOpen() }}</span></p>
            <p>
              Selected status:
              <span class="font-medium text-foreground">{{ selectedStatus() ?? 'None' }}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ComboboxPreviewComponent {
  readonly selectedFramework = signal<string | undefined>('next.js');
  readonly selectedTags = signal<string[] | undefined>(['design-system', 'a11y']);
  readonly selectedOwner = signal<string | undefined>('lin');
  readonly selectedStatus = signal<string | undefined>('todo');
  readonly statusOpen = signal(false);

  readonly frameworks: readonly PreviewOption[] = [
    { value: 'next.js', label: 'Next.js' },
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'nuxt', label: 'Nuxt' },
    { value: 'remix', label: 'Remix' },
    { value: 'astro', label: 'Astro', disabled: true },
  ];

  readonly tags: readonly PreviewOption[] = [
    { value: 'design-system', label: 'Design System' },
    { value: 'components', label: 'Components' },
    { value: 'a11y', label: 'Accessibility' },
    { value: 'tokens', label: 'Tokens' },
    { value: 'experimental', label: 'Experimental', disabled: true },
  ];

  readonly owners: readonly PreviewOption[] = [
    { value: 'lin', label: 'Lin' },
    { value: 'mike', label: 'Mike', disabled: true },
    { value: 'sarah', label: 'Sarah' },
  ];

  readonly statuses: readonly PreviewOption[] = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  readonly selectedTagItems = computed(() => {
    const current = new Set(this.selectedTags() ?? []);
    return this.tags.filter((tag) => current.has(tag.value));
  });
}
