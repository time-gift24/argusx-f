import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ArgusxButtonDirective } from '@app/shared/ui/button';
import {
  DialogCloseDirective,
  DialogComponent,
  DialogContentComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '@app/shared/ui/dialog';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { ArgusxPopoverComponents } from '@app/shared/ui/popover';
import { ArgusxComboboxComponents } from '@app/shared/ui/combobox';

interface PreviewOption {
  value: string;
  label: string;
  disabled?: boolean;
  emoji?: string;
  meta?: string;
}

interface PreviewGroup {
  label: string;
  options: readonly PreviewOption[];
}

@Component({
  selector: 'app-combobox-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxComboboxComponents,
    ArgusxButtonDirective,
    ArgusxInputDirective,
    ArgusxPopoverComponents,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    DialogCloseDirective,
  ],
  template: `
    <div class="mx-auto max-w-6xl space-y-5 p-6">
      <header class="space-y-1.5">
        <h1 class="text-2xl font-semibold">Combobox</h1>
        <p class="text-muted-foreground text-sm">
          Rewritten on menu-core styling primitives and aligned with shadcn combobox-example coverage.
        </p>
      </header>

      <div class="grid gap-4 lg:grid-cols-2">
        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
          <argusx-combobox [(value)]="basicFramework">
            <argusx-combobox-input placeholder="Select a framework" [showClear]="false" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                <argusx-combobox-group>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-group>
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled</h2>
          <argusx-combobox [disabled]="true" [value]="'next.js'">
            <argusx-combobox-input placeholder="Select a framework" />
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
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Invalid</h2>
          <div class="rounded-md ring-1 ring-destructive/40">
            <argusx-combobox [(value)]="invalidFramework">
              <argusx-combobox-input placeholder="Select a framework" />
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>
          </div>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Framework</h2>
          <label class="text-xs font-medium">Framework</label>
          <div class="rounded-md ring-1 ring-destructive/40">
            <argusx-combobox [(value)]="labeledFramework">
              <argusx-combobox-input placeholder="Framework" />
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>
          </div>
          <p class="text-destructive text-xs">Please select a valid framework.</p>
          <p class="text-destructive/80 text-xs">This field is required.</p>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Clear Button</h2>
          <argusx-combobox [(value)]="clearFramework">
            <argusx-combobox-input placeholder="Select a framework" [showClear]="true" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                @for (framework of frameworks; track framework.value) {
                  <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                    {{ framework.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
          <p class="text-muted-foreground text-xs">
            Current value: {{ optionLabel(clearFramework(), frameworks) ?? 'None' }}
          </p>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Auto Highlight</h2>
          <argusx-combobox [(value)]="autoHighlightFramework" [autoHighlight]="true">
            <argusx-combobox-input placeholder="Select a framework" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                @for (framework of frameworks; track framework.value) {
                  <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                    {{ framework.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
          <p class="text-muted-foreground text-xs">Use arrow keys immediately after open.</p>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Groups</h2>
          <argusx-combobox [(value)]="timezoneValue">
            <argusx-combobox-input placeholder="Select a timezone" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No timezone found.</argusx-combobox-empty>
                @for (group of timezoneGroups; track group.label) {
                  <argusx-combobox-group>
                    <argusx-combobox-label>{{ group.label }}</argusx-combobox-label>
                    @for (zone of group.options; track zone.value) {
                      <argusx-combobox-item [value]="zone.value" [label]="zone.label">
                        {{ zone.label }}
                      </argusx-combobox-item>
                    }
                  </argusx-combobox-group>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Groups and Separator</h2>
          <argusx-combobox [(value)]="timezoneWithSeparatorValue">
            <argusx-combobox-input placeholder="Select a timezone" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No timezone found.</argusx-combobox-empty>
                <argusx-combobox-group>
                  <argusx-combobox-label>Popular</argusx-combobox-label>
                  @for (zone of popularTimezones; track zone.value) {
                    <argusx-combobox-item [value]="zone.value" [label]="zone.label">
                      {{ zone.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-group>
                <argusx-combobox-separator />
                <argusx-combobox-group>
                  <argusx-combobox-label>All Timezones</argusx-combobox-label>
                  @for (zone of timezoneOptions; track zone.value) {
                    <argusx-combobox-item [value]="zone.value" [label]="zone.label">
                      {{ zone.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-group>
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Large List (100 items)</h2>
          <argusx-combobox [(value)]="largeListValue" [autoHighlight]="true">
            <argusx-combobox-input placeholder="Search from 100 items" />
            <argusx-combobox-content>
              <argusx-combobox-list [fixedHeight]="true">
                <argusx-combobox-empty>No items found.</argusx-combobox-empty>
                @for (item of largeOptions; track item.value) {
                  <argusx-combobox-item [value]="item.value" [label]="item.label">
                    {{ item.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icon Addon</h2>
          <argusx-combobox [(value)]="iconTimezoneValue">
            <argusx-combobox-trigger
              class="border-input bg-input/20 focus-visible:border-ring focus-visible:ring-ring/30 inline-flex h-8 w-full items-center justify-between rounded-md border px-2 text-xs/relaxed outline-none focus-visible:ring-2">
              <span class="inline-flex items-center gap-1.5">
                <span aria-hidden="true">🌐</span>
                {{ optionLabel(iconTimezoneValue(), timezoneOptions) ?? 'Select a timezone' }}
              </span>
            </argusx-combobox-trigger>
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No timezone found.</argusx-combobox-empty>
                @for (zone of timezoneOptions; track zone.value) {
                  <argusx-combobox-item [value]="zone.value" [label]="zone.label">
                    {{ zone.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">Combobox in Popup</h2>
          <div class="flex flex-wrap items-center gap-2">
            <argusx-popover [(open)]="popupOpen">
              <button argusx-button variant="outline" argusxPopoverTrigger class="w-52 justify-between">
                {{ optionLabel(popupCountry(), countries) ?? 'Select country' }}
              </button>
              <argusx-popover-content class="w-80 p-3">
                <argusx-combobox [(value)]="popupCountry" [autoHighlight]="true">
                  <argusx-combobox-input placeholder="Search countries..." />
                  <argusx-combobox-content>
                    <argusx-combobox-list>
                      <argusx-combobox-empty>No country found.</argusx-combobox-empty>
                      @for (country of countries; track country.value) {
                        <argusx-combobox-item [value]="country.value" [label]="country.label">
                          <span class="inline-flex items-center gap-2">
                            <span aria-hidden="true">{{ country.emoji }}</span>
                            <span>{{ country.label }}</span>
                          </span>
                        </argusx-combobox-item>
                      }
                    </argusx-combobox-list>
                  </argusx-combobox-content>
                </argusx-combobox>
              </argusx-popover-content>
            </argusx-popover>
            <p class="text-muted-foreground text-xs">Open state: {{ popupOpen() }}</p>
          </div>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">Form with Combobox</h2>
          <form class="grid max-w-xl gap-2" (submit)="onSubmitFrameworkForm($event)">
            <label class="text-xs font-medium" for="framework-form">Framework</label>
            <div [class]="frameworkFormInvalid() ? 'rounded-md ring-1 ring-destructive/40' : ''">
              <argusx-combobox id="framework-form" [(value)]="frameworkFormValue" [autoHighlight]="true">
                <argusx-combobox-input placeholder="Framework" />
                <argusx-combobox-content>
                  <argusx-combobox-list>
                    <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                    @for (framework of frameworks; track framework.value) {
                      <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                        {{ framework.label }}
                      </argusx-combobox-item>
                    }
                  </argusx-combobox-list>
                </argusx-combobox-content>
              </argusx-combobox>
            </div>
            @if (frameworkFormInvalid()) {
              <p class="text-destructive text-xs">This field is required.</p>
            }
            <div>
              <button argusx-button type="submit" size="sm">Submit</button>
            </div>
            @if (frameworkFormSubmitted()) {
              <p class="text-muted-foreground text-xs">
                Submitted: {{ optionLabel(frameworkFormValue(), frameworks) ?? 'Invalid (missing value)' }}
              </p>
            }
          </form>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Combobox Multiple</h2>
          <argusx-combobox [(value)]="multipleFrameworks" [multiple]="true" [autoHighlight]="true">
            <argusx-combobox-chips>
              @for (framework of selectedMultipleFrameworks(); track framework.value) {
                <argusx-combobox-chip [value]="framework.value">
                  {{ framework.label }}
                </argusx-combobox-chip>
              }
              <argusx-combobox-chips-input placeholder="Select frameworks..." />
            </argusx-combobox-chips>
            <argusx-combobox-content>
              <argusx-combobox-list [fixedHeight]="true">
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                @for (framework of frameworks; track framework.value) {
                  <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                    {{ framework.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Combobox Multiple Disabled</h2>
          <argusx-combobox [(value)]="multipleDisabledFrameworks" [multiple]="true" [disabled]="true">
            <argusx-combobox-chips>
              @for (framework of selectedMultipleDisabledFrameworks(); track framework.value) {
                <argusx-combobox-chip [value]="framework.value">
                  {{ framework.label }}
                </argusx-combobox-chip>
              }
              <argusx-combobox-chips-input placeholder="Select frameworks..." />
            </argusx-combobox-chips>
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
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Combobox Multiple Invalid</h2>
          <div class="rounded-md ring-1 ring-destructive/40">
            <argusx-combobox [(value)]="multipleInvalidFrameworks" [multiple]="true">
              <argusx-combobox-chips>
                @for (framework of selectedMultipleInvalidFrameworks(); track framework.value) {
                  <argusx-combobox-chip [value]="framework.value">
                    {{ framework.label }}
                  </argusx-combobox-chip>
                }
                <argusx-combobox-chips-input placeholder="Select frameworks..." />
              </argusx-combobox-chips>
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>
          </div>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Frameworks</h2>
          <label class="text-xs font-medium">Frameworks</label>
          <div class="rounded-md ring-1 ring-destructive/40">
            <argusx-combobox [(value)]="frameworksFieldValue" [multiple]="true">
              <argusx-combobox-chips>
                @for (framework of selectedFrameworksFieldItems(); track framework.value) {
                  <argusx-combobox-chip [value]="framework.value">
                    {{ framework.label }}
                  </argusx-combobox-chip>
                }
                <argusx-combobox-chips-input placeholder="Frameworks" />
              </argusx-combobox-chips>
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>
          </div>
          <p class="text-destructive text-xs">Please select at least one framework.</p>
          <p class="text-destructive/80 text-xs">This field is required.</p>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">Combobox Multiple (No Remove)</h2>
          <argusx-combobox [(value)]="multipleNoRemoveFrameworks" [multiple]="true">
            <argusx-combobox-chips>
              @for (framework of selectedMultipleNoRemoveFrameworks(); track framework.value) {
                <argusx-combobox-chip [value]="framework.value" [showRemove]="false">
                  {{ framework.label }}
                </argusx-combobox-chip>
              }
              <argusx-combobox-chips-input placeholder="Select frameworks..." />
            </argusx-combobox-chips>
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                @for (framework of frameworks; track framework.value) {
                  <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                    {{ framework.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Custom Item Rendering</h2>
          <argusx-combobox [(value)]="customCountryValue" [autoHighlight]="true">
            <argusx-combobox-input placeholder="Search countries..." />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No country found.</argusx-combobox-empty>
                @for (country of countries; track country.value) {
                  <argusx-combobox-item [value]="country.value" [label]="country.label">
                    <div class="flex w-full items-center justify-between gap-2">
                      <span class="inline-flex items-center gap-2">
                        <span aria-hidden="true">{{ country.emoji }}</span>
                        <span>{{ country.label }}</span>
                      </span>
                      <span class="text-muted-foreground text-[10px]">{{ country.meta }}</span>
                    </div>
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">Combobox in Dialog</h2>
          <button argusx-button variant="outline" size="sm" (click)="dialogOpen.set(true)">Open Dialog</button>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">With Other Inputs</h2>
          <div class="grid gap-2 md:grid-cols-2">
            <argusx-combobox [(value)]="otherInputsFrameworkValue" [autoHighlight]="true">
              <argusx-combobox-input placeholder="Select a framework" />
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>

            <argusx-combobox [(value)]="otherTriggerFrameworkValue">
              <argusx-combobox-trigger
                class="border-input bg-input/20 focus-visible:border-ring focus-visible:ring-ring/30 inline-flex h-8 w-full items-center justify-between rounded-md border px-2 text-xs/relaxed outline-none focus-visible:ring-2">
                {{ optionLabel(otherTriggerFrameworkValue(), frameworks) ?? 'Select a framework' }}
              </argusx-combobox-trigger>
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

            <input argusxInput placeholder="Select a framework" />
            <input argusxInput placeholder="Select a framework" />
          </div>
        </section>

        <section class="space-y-2 rounded-lg border border-dashed border-border p-4 lg:col-span-2">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled Items</h2>
          <argusx-combobox [(value)]="disabledItemsValue" [autoHighlight]="true">
            <argusx-combobox-input placeholder="Select a framework" />
            <argusx-combobox-content>
              <argusx-combobox-list>
                <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                @for (framework of frameworksWithDisabledItems; track framework.value) {
                  <argusx-combobox-item
                    [value]="framework.value"
                    [label]="framework.label"
                    [disabled]="framework.disabled ?? false">
                    {{ framework.label }}
                  </argusx-combobox-item>
                }
              </argusx-combobox-list>
            </argusx-combobox-content>
          </argusx-combobox>
        </section>
      </div>

      @if (dialogOpen()) {
        <div argus-dialog [(open)]="dialogOpen">
          <div argus-dialog-content>
            <div argus-dialog-header>
              <h3 argus-dialog-title>Combobox in Dialog</h3>
              <p argus-dialog-description>
                Dialog focus trap + combobox overlay integration.
              </p>
            </div>

            <argusx-combobox [(value)]="dialogFrameworkValue" [autoHighlight]="true">
              <argusx-combobox-input placeholder="Select a framework" />
              <argusx-combobox-content>
                <argusx-combobox-list>
                  <argusx-combobox-empty>No framework found.</argusx-combobox-empty>
                  @for (framework of frameworks; track framework.value) {
                    <argusx-combobox-item [value]="framework.value" [label]="framework.label">
                      {{ framework.label }}
                    </argusx-combobox-item>
                  }
                </argusx-combobox-list>
              </argusx-combobox-content>
            </argusx-combobox>

            <div argus-dialog-footer>
              <button argusx-button variant="outline" argus-dialog-close>Close</button>
              <button argusx-button size="sm" (click)="dialogOpen.set(false)">Save</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ComboboxPreviewComponent {
  readonly basicFramework = signal<string | undefined>(undefined);
  readonly invalidFramework = signal<string | undefined>(undefined);
  readonly labeledFramework = signal<string | undefined>(undefined);

  readonly clearFramework = signal<string | undefined>('next.js');
  readonly autoHighlightFramework = signal<string | undefined>(undefined);

  readonly timezoneValue = signal<string | undefined>(undefined);
  readonly timezoneWithSeparatorValue = signal<string | undefined>(undefined);
  readonly largeListValue = signal<string | undefined>(undefined);
  readonly iconTimezoneValue = signal<string | undefined>(undefined);

  readonly popupOpen = signal(false);
  readonly popupCountry = signal<string | undefined>(undefined);

  readonly frameworkFormValue = signal<string | undefined>(undefined);
  readonly frameworkFormSubmitted = signal(false);
  readonly frameworkFormInvalid = computed(
    () => this.frameworkFormSubmitted() && !this.frameworkFormValue()
  );

  readonly multipleFrameworks = signal<string[] | undefined>(['next.js']);
  readonly multipleDisabledFrameworks = signal<string[] | undefined>([
    'next.js',
    'sveltekit',
  ]);
  readonly multipleInvalidFrameworks = signal<string[] | undefined>([
    'next.js',
    'sveltekit',
  ]);
  readonly frameworksFieldValue = signal<string[] | undefined>([
    'next.js',
    'sveltekit',
    'nuxt.js',
  ]);
  readonly multipleNoRemoveFrameworks = signal<string[] | undefined>([
    'next.js',
    'sveltekit',
  ]);

  readonly customCountryValue = signal<string | undefined>(undefined);

  readonly dialogOpen = signal(false);
  readonly dialogFrameworkValue = signal<string | undefined>(undefined);

  readonly otherInputsFrameworkValue = signal<string | undefined>(undefined);
  readonly otherTriggerFrameworkValue = signal<string | undefined>(undefined);

  readonly disabledItemsValue = signal<string | undefined>(undefined);

  readonly frameworks: readonly PreviewOption[] = [
    { value: 'next.js', label: 'Next.js' },
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'nuxt.js', label: 'Nuxt.js' },
    { value: 'remix', label: 'Remix' },
    { value: 'astro', label: 'Astro' },
  ];

  readonly frameworksWithDisabledItems: readonly PreviewOption[] = [
    { value: 'next.js', label: 'Next.js' },
    { value: 'sveltekit', label: 'SvelteKit', disabled: true },
    { value: 'nuxt.js', label: 'Nuxt.js' },
    { value: 'remix', label: 'Remix', disabled: true },
    { value: 'astro', label: 'Astro' },
  ];

  readonly timezoneGroups: readonly PreviewGroup[] = [
    {
      label: 'Americas',
      options: [
        { value: 'america/new_york', label: 'America/New_York' },
        { value: 'america/los_angeles', label: 'America/Los_Angeles' },
      ],
    },
    {
      label: 'Europe',
      options: [
        { value: 'europe/london', label: 'Europe/London' },
        { value: 'europe/berlin', label: 'Europe/Berlin' },
      ],
    },
    {
      label: 'Asia',
      options: [
        { value: 'asia/shanghai', label: 'Asia/Shanghai' },
        { value: 'asia/tokyo', label: 'Asia/Tokyo' },
      ],
    },
  ];

  readonly popularTimezones: readonly PreviewOption[] = [
    { value: 'utc', label: 'UTC' },
    { value: 'asia/shanghai', label: 'Asia/Shanghai' },
    { value: 'america/new_york', label: 'America/New_York' },
  ];

  readonly timezoneOptions: readonly PreviewOption[] = this.timezoneGroups.flatMap(
    (group) => group.options
  );

  readonly countries: readonly PreviewOption[] = [
    { value: 'cn', label: 'China', emoji: '🇨🇳', meta: '+86' },
    { value: 'jp', label: 'Japan', emoji: '🇯🇵', meta: '+81' },
    { value: 'us', label: 'United States', emoji: '🇺🇸', meta: '+1' },
    { value: 'de', label: 'Germany', emoji: '🇩🇪', meta: '+49' },
    { value: 'br', label: 'Brazil', emoji: '🇧🇷', meta: '+55' },
  ];

  readonly largeOptions: readonly PreviewOption[] = Array.from(
    { length: 100 },
    (_, index) => ({
      value: `item-${index + 1}`,
      label: `Item ${index + 1}`,
    })
  );

  readonly selectedMultipleFrameworks = computed(() =>
    this.pickSelected(this.multipleFrameworks(), this.frameworks)
  );

  readonly selectedMultipleDisabledFrameworks = computed(() =>
    this.pickSelected(this.multipleDisabledFrameworks(), this.frameworks)
  );

  readonly selectedMultipleInvalidFrameworks = computed(() =>
    this.pickSelected(this.multipleInvalidFrameworks(), this.frameworks)
  );

  readonly selectedFrameworksFieldItems = computed(() =>
    this.pickSelected(this.frameworksFieldValue(), this.frameworks)
  );

  readonly selectedMultipleNoRemoveFrameworks = computed(() =>
    this.pickSelected(this.multipleNoRemoveFrameworks(), this.frameworks)
  );

  onSubmitFrameworkForm(event: Event): void {
    event.preventDefault();
    this.frameworkFormSubmitted.set(true);
  }

  optionLabel(value: string | undefined, options: readonly PreviewOption[]): string | undefined {
    return options.find((option) => option.value === value)?.label;
  }

  private pickSelected(
    values: string[] | undefined,
    options: readonly PreviewOption[]
  ): PreviewOption[] {
    if (!values || values.length === 0) {
      return [];
    }

    const selected = new Set(values);
    return options.filter((option) => selected.has(option.value));
  }
}
