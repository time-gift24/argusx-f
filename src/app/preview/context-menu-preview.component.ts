import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuTriggerComponent,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuItemComponent,
  ContextMenuCheckboxItemComponent,
  ContextMenuRadioGroupComponent,
  ContextMenuRadioItemComponent,
  ContextMenuLabelComponent,
  ContextMenuSeparatorComponent,
  ContextMenuShortcutComponent,
  ContextMenuSubComponent,
  ContextMenuSubTriggerComponent,
  ContextMenuSubContentComponent,
} from '../shared/ui/context-menu';

@Component({
  selector: 'app-context-menu-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContextMenuComponent,
    ContextMenuTriggerDirective,
    ContextMenuTriggerComponent,
    ContextMenuContentComponent,
    ContextMenuGroupComponent,
    ContextMenuItemComponent,
    ContextMenuCheckboxItemComponent,
    ContextMenuRadioGroupComponent,
    ContextMenuRadioItemComponent,
    ContextMenuLabelComponent,
    ContextMenuSeparatorComponent,
    ContextMenuShortcutComponent,
    ContextMenuSubComponent,
    ContextMenuSubTriggerComponent,
    ContextMenuSubContentComponent,
  ],
  template: `
    <div class="mx-auto max-w-4xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Context Menu</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a menu on right-click with groups, shortcuts, checkbox/radio
        items, and submenus.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">
            Basic / Disabled / Shortcuts
          </h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="flex h-24 w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <app-context-menu-content>
              <app-context-menu-group>
                <app-context-menu-item>
                  Back
                  <app-context-menu-shortcut>⌘[</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item [disabled]="true">
                  Forward
                  <app-context-menu-shortcut>⌘]</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Reload
                  <app-context-menu-shortcut>⌘R</app-context-menu-shortcut>
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">
            With Icons / Destructive
          </h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-context-menu>
            <app-context-menu-trigger
              class="flex h-24 w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </app-context-menu-trigger>
            <app-context-menu-content>
              <app-context-menu-group>
                <app-context-menu-item>
                  <span class="i-lucide-copy"></span>
                  Copy
                </app-context-menu-item>
                <app-context-menu-item>
                  <span class="i-lucide-scissors"></span>
                  Cut
                </app-context-menu-item>
                <app-context-menu-item>
                  <span class="i-lucide-clipboard"></span>
                  Paste
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-item variant="destructive">
                  <span class="i-lucide-trash-2"></span>
                  Delete
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">
            Submenu + Inset + Checkbox + Radio
          </h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="flex h-24 w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <app-context-menu-content class="w-56">
              <app-context-menu-group>
                <app-context-menu-label>Actions</app-context-menu-label>
                <app-context-menu-item>
                  <span class="i-lucide-copy"></span>
                  Copy
                </app-context-menu-item>
                <app-context-menu-item>
                  <span class="i-lucide-scissors"></span>
                  Cut
                </app-context-menu-item>
                <app-context-menu-item [inset]="true">Paste</app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-label [inset]="true">Options</app-context-menu-label>
                <app-context-menu-checkbox-item
                  [inset]="true"
                  [checked]="showBookmarksBar()"
                  (checkedChange)="showBookmarksBar.set($event)">
                  Show bookmarks bar
                </app-context-menu-checkbox-item>
                <app-context-menu-checkbox-item
                  [inset]="true"
                  [checked]="showFullUrls()"
                  (checkedChange)="showFullUrls.set($event)">
                  Show full URLs
                </app-context-menu-checkbox-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-label [inset]="true">Theme</app-context-menu-label>
                <app-context-menu-radio-group [(value)]="theme">
                  <app-context-menu-radio-item [inset]="true" value="light">
                    Light
                  </app-context-menu-radio-item>
                  <app-context-menu-radio-item [inset]="true" value="dark">
                    Dark
                  </app-context-menu-radio-item>
                  <app-context-menu-radio-item [inset]="true" value="system">
                    System
                  </app-context-menu-radio-item>
                </app-context-menu-radio-group>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-sub>
                <app-context-menu-sub-trigger [inset]="true">
                  More options
                </app-context-menu-sub-trigger>
                <app-context-menu-sub-content>
                  <app-context-menu-item>Save Page...</app-context-menu-item>
                  <app-context-menu-item>Create Shortcut...</app-context-menu-item>
                </app-context-menu-sub-content>
              </app-context-menu-sub>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Content Side</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-4 sm:grid-cols-2">
            @for (side of sides; track side) {
              <app-context-menu>
                <div
                  appContextMenuTrigger
                  class="flex h-16 w-full items-center justify-center rounded-lg border text-sm">
                  Right click ({{ side }})
                </div>
                <app-context-menu-content [side]="side">
                  <app-context-menu-item>Back</app-context-menu-item>
                  <app-context-menu-item>Forward</app-context-menu-item>
                  <app-context-menu-item>Reload</app-context-menu-item>
                </app-context-menu-content>
              </app-context-menu>
            }
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ContextMenuPreviewComponent {
  readonly showBookmarksBar = signal(true);
  readonly showFullUrls = signal(false);
  theme: 'light' | 'dark' | 'system' = 'system';
  readonly sides: Array<'top' | 'right' | 'bottom' | 'left'> = [
    'top',
    'right',
    'bottom',
    'left',
  ];
}
