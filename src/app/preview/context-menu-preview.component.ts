import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ContextMenuCheckboxItemComponent,
  ContextMenuComponent,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuItemComponent,
  ContextMenuLabelComponent,
  ContextMenuRadioGroupComponent,
  ContextMenuRadioItemComponent,
  ContextMenuSeparatorComponent,
  ContextMenuShortcutComponent,
  ContextMenuSubComponent,
  ContextMenuSubContentComponent,
  ContextMenuSubTriggerComponent,
  ContextMenuTriggerDirective,
} from '../shared/ui/context-menu';
import { DialogComponent } from '../shared/ui/dialog';

@Component({
  selector: 'app-context-menu-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContextMenuComponent,
    ContextMenuTriggerDirective,
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
    DialogComponent,
  ],
  template: `
    <div class="mx-auto max-w-7xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Context Menu</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a menu on right-click with groups, labels, shortcuts, and nested
        menu items.
      </p>

      <div class="grid grid-cols-1 gap-8 xl:grid-cols-2">
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
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
                <app-context-menu-item>Back</app-context-menu-item>
                <app-context-menu-item [disabled]="true">Forward</app-context-menu-item>
                <app-context-menu-item>Reload</app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section class="xl:col-span-2">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Sides</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div
            class="grid gap-6"
            style="grid-template-columns: repeat(2, minmax(0, 1fr));">
            <app-context-menu>
              <div
                appContextMenuTrigger
                class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (top)
              </div>
              <app-context-menu-content side="top">
                <app-context-menu-group>
                  <app-context-menu-item>Back</app-context-menu-item>
                  <app-context-menu-item>Forward</app-context-menu-item>
                  <app-context-menu-item>Reload</app-context-menu-item>
                </app-context-menu-group>
              </app-context-menu-content>
            </app-context-menu>

            <app-context-menu>
              <div
                appContextMenuTrigger
                class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (right)
              </div>
              <app-context-menu-content side="right">
                <app-context-menu-group>
                  <app-context-menu-item>Back</app-context-menu-item>
                  <app-context-menu-item>Forward</app-context-menu-item>
                  <app-context-menu-item>Reload</app-context-menu-item>
                </app-context-menu-group>
              </app-context-menu-content>
            </app-context-menu>

            <app-context-menu>
              <div
                appContextMenuTrigger
                class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (bottom)
              </div>
              <app-context-menu-content side="bottom">
                <app-context-menu-group>
                  <app-context-menu-item>Back</app-context-menu-item>
                  <app-context-menu-item>Forward</app-context-menu-item>
                  <app-context-menu-item>Reload</app-context-menu-item>
                </app-context-menu-group>
              </app-context-menu-content>
            </app-context-menu>

            <app-context-menu>
              <div
                appContextMenuTrigger
                class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (left)
              </div>
              <app-context-menu-content side="left">
                <app-context-menu-group>
                  <app-context-menu-item>Back</app-context-menu-item>
                  <app-context-menu-item>Forward</app-context-menu-item>
                  <app-context-menu-item>Reload</app-context-menu-item>
                </app-context-menu-group>
              </app-context-menu-content>
            </app-context-menu>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Icons</h2>
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

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Shortcuts</h2>
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
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-item>
                  Save
                  <app-context-menu-shortcut>⌘S</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Save As...
                  <app-context-menu-shortcut>⇧⌘S</app-context-menu-shortcut>
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Submenu</h2>
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
                  Copy
                  <app-context-menu-shortcut>⌘C</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Cut
                  <app-context-menu-shortcut>⌘X</app-context-menu-shortcut>
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-sub>
                <app-context-menu-sub-trigger>More Tools</app-context-menu-sub-trigger>
                <app-context-menu-sub-content>
                  <app-context-menu-group>
                    <app-context-menu-item>Save Page...</app-context-menu-item>
                    <app-context-menu-item>Create Shortcut...</app-context-menu-item>
                    <app-context-menu-item>Name Window...</app-context-menu-item>
                  </app-context-menu-group>
                  <app-context-menu-separator />
                  <app-context-menu-group>
                    <app-context-menu-item>Developer Tools</app-context-menu-item>
                  </app-context-menu-group>
                  <app-context-menu-separator />
                  <app-context-menu-group>
                    <app-context-menu-item variant="destructive">
                      Delete
                    </app-context-menu-item>
                  </app-context-menu-group>
                </app-context-menu-sub-content>
              </app-context-menu-sub>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">
            With Groups, Labels & Separators
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
                <app-context-menu-label>File</app-context-menu-label>
                <app-context-menu-item>
                  New File
                  <app-context-menu-shortcut>⌘N</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Open File
                  <app-context-menu-shortcut>⌘O</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Save
                  <app-context-menu-shortcut>⌘S</app-context-menu-shortcut>
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-label>Edit</app-context-menu-label>
                <app-context-menu-item>
                  Undo
                  <app-context-menu-shortcut>⌘Z</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Redo
                  <app-context-menu-shortcut>⇧⌘Z</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-separator />
                <app-context-menu-item>
                  Cut
                  <app-context-menu-shortcut>⌘X</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Copy
                  <app-context-menu-shortcut>⌘C</app-context-menu-shortcut>
                </app-context-menu-item>
                <app-context-menu-item>
                  Paste
                  <app-context-menu-shortcut>⌘V</app-context-menu-shortcut>
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-item variant="destructive">
                  Delete
                  <app-context-menu-shortcut>⌫</app-context-menu-shortcut>
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Checkboxes</h2>
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
                <app-context-menu-checkbox-item
                  [checked]="showBookmarksBar()"
                  (checkedChange)="showBookmarksBar.set($event)">
                  Show Bookmarks Bar
                </app-context-menu-checkbox-item>
                <app-context-menu-checkbox-item
                  [checked]="showFullUrls()"
                  (checkedChange)="showFullUrls.set($event)">
                  Show Full URLs
                </app-context-menu-checkbox-item>
                <app-context-menu-checkbox-item
                  [checked]="showDeveloperTools()"
                  (checkedChange)="showDeveloperTools.set($event)">
                  Show Developer Tools
                </app-context-menu-checkbox-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Radio Group</h2>
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
                <app-context-menu-label>People</app-context-menu-label>
                <app-context-menu-radio-group [(value)]="user">
                  <app-context-menu-radio-item value="pedro">
                    Pedro Duarte
                  </app-context-menu-radio-item>
                  <app-context-menu-radio-item value="colm">
                    Colm Tuite
                  </app-context-menu-radio-item>
                </app-context-menu-radio-group>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-label>Theme</app-context-menu-label>
                <app-context-menu-radio-group [(value)]="radioTheme">
                  <app-context-menu-radio-item value="light">
                    Light
                  </app-context-menu-radio-item>
                  <app-context-menu-radio-item value="dark">
                    Dark
                  </app-context-menu-radio-item>
                  <app-context-menu-radio-item value="system">
                    System
                  </app-context-menu-radio-item>
                </app-context-menu-radio-group>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">
            With Destructive Items
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
                  <span class="i-lucide-pencil"></span>
                  Edit
                </app-context-menu-item>
                <app-context-menu-item>
                  <span class="i-lucide-share-2"></span>
                  Share
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-item>
                  <span class="i-lucide-archive"></span>
                  Archive
                </app-context-menu-item>
                <app-context-menu-item variant="destructive">
                  <span class="i-lucide-trash-2"></span>
                  Delete
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">In Dialog</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
            (click)="dialogOpen.set(true)">
            Open Dialog
          </button>

          <div argus-dialog [(open)]="dialogOpen">
            <div class="grid gap-2">
              <h3 class="text-lg font-semibold">Context Menu Example</h3>
              <p class="text-sm text-muted-foreground">
                Right click on the area below to see the context menu.
              </p>
            </div>

            <app-context-menu>
              <div
                appContextMenuTrigger
                class="mt-4 flex h-20 w-full items-center justify-center rounded-lg border text-sm">
                Right click here
              </div>
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
                <app-context-menu-sub>
                  <app-context-menu-sub-trigger>More Options</app-context-menu-sub-trigger>
                  <app-context-menu-sub-content>
                    <app-context-menu-group>
                      <app-context-menu-item>Save Page...</app-context-menu-item>
                      <app-context-menu-item>Create Shortcut...</app-context-menu-item>
                      <app-context-menu-item>Name Window...</app-context-menu-item>
                    </app-context-menu-group>
                    <app-context-menu-separator />
                    <app-context-menu-group>
                      <app-context-menu-item>Developer Tools</app-context-menu-item>
                    </app-context-menu-group>
                  </app-context-menu-sub-content>
                </app-context-menu-sub>
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
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Inset</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="flex h-24 w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <app-context-menu-content class="w-44">
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
                <app-context-menu-label [inset]="true">Appearance</app-context-menu-label>
                <app-context-menu-checkbox-item
                  [inset]="true"
                  [checked]="insetShowBookmarks()"
                  (checkedChange)="insetShowBookmarks.set($event)">
                  Bookmarks
                </app-context-menu-checkbox-item>
                <app-context-menu-checkbox-item
                  [inset]="true"
                  [checked]="insetShowUrls()"
                  (checkedChange)="insetShowUrls.set($event)">
                  Full URLs
                </app-context-menu-checkbox-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-label [inset]="true">Theme</app-context-menu-label>
                <app-context-menu-radio-group [(value)]="insetTheme">
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
                  More Options
                </app-context-menu-sub-trigger>
                <app-context-menu-sub-content>
                  <app-context-menu-group>
                    <app-context-menu-item>Save Page...</app-context-menu-item>
                    <app-context-menu-item>Create Shortcut...</app-context-menu-item>
                  </app-context-menu-group>
                </app-context-menu-sub-content>
              </app-context-menu-sub>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>
      </div>
    </div>
  `,
})
export class ContextMenuPreviewComponent {
  readonly dialogOpen = signal(false);

  readonly showBookmarksBar = signal(true);
  readonly showFullUrls = signal(false);
  readonly showDeveloperTools = signal(false);

  user: 'pedro' | 'colm' = 'pedro';
  radioTheme: 'light' | 'dark' | 'system' = 'light';

  readonly insetShowBookmarks = signal(true);
  readonly insetShowUrls = signal(false);
  insetTheme: 'light' | 'dark' | 'system' = 'system';
}
