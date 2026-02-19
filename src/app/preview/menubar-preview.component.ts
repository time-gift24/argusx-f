import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxMenubarComponents } from '@app/shared/ui/menubar';

@Component({
  selector: 'app-menubar-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxMenubarComponents],
  template: `
    <div class="bg-background w-full">
      <div class="mx-auto grid w-full max-w-5xl min-w-0 content-start gap-8 p-4 sm:p-6 md:grid-cols-2 lg:p-12">
        <section class="md:col-span-2">
          <h1 class="mb-2 text-2xl font-semibold">Menubar</h1>
          <p class="text-muted-foreground text-sm">
            Application-style top menu with nested items, toggles, shortcuts, destructive actions, and inset rows.
          </p>
        </section>

        <section class="md:col-span-2">
          <div class="mb-3">
            <h2 class="text-sm font-medium text-muted-foreground">Shadcn Menubar Example (Local)</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
            <argusx-menubar>
              <argusx-menubar-menu value="file">
                <argusx-menubar-trigger>File</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>
                    New Tab
                    <argusx-menubar-shortcut>⌘T</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item>
                    New Window
                    <argusx-menubar-shortcut>⌘N</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item [disabled]="true">
                    New Incognito Window
                  </argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-sub>
                    <argusx-menubar-sub-trigger>Share</argusx-menubar-sub-trigger>
                    <argusx-menubar-sub-content>
                      <argusx-menubar-item>Email link</argusx-menubar-item>
                      <argusx-menubar-item>Messages</argusx-menubar-item>
                      <argusx-menubar-item>Notes</argusx-menubar-item>
                    </argusx-menubar-sub-content>
                  </argusx-menubar-sub>
                  <argusx-menubar-separator />
                  <argusx-menubar-item>
                    Print...
                    <argusx-menubar-shortcut>⌘P</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>

              <argusx-menubar-menu value="edit">
                <argusx-menubar-trigger>Edit</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>
                    Undo
                    <argusx-menubar-shortcut>⌘Z</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item>
                    Redo
                    <argusx-menubar-shortcut>⇧⌘Z</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-sub>
                    <argusx-menubar-sub-trigger>Find</argusx-menubar-sub-trigger>
                    <argusx-menubar-sub-content>
                      <argusx-menubar-item>Search the web</argusx-menubar-item>
                      <argusx-menubar-separator />
                      <argusx-menubar-item>Find...</argusx-menubar-item>
                      <argusx-menubar-item>Find Next</argusx-menubar-item>
                      <argusx-menubar-item>Find Previous</argusx-menubar-item>
                    </argusx-menubar-sub-content>
                  </argusx-menubar-sub>
                  <argusx-menubar-separator />
                  <argusx-menubar-item>Cut</argusx-menubar-item>
                  <argusx-menubar-item>Copy</argusx-menubar-item>
                  <argusx-menubar-item>Paste</argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>

              <argusx-menubar-menu value="view">
                <argusx-menubar-trigger>View</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-checkbox-item
                    [checked]="alwaysShowBookmarksBar()"
                    (checkedChange)="alwaysShowBookmarksBar.set($event)"
                  >
                    Always Show Bookmarks Bar
                  </argusx-menubar-checkbox-item>
                  <argusx-menubar-checkbox-item
                    [checked]="alwaysShowFullUrls()"
                    (checkedChange)="alwaysShowFullUrls.set($event)"
                  >
                    Always Show Full URLs
                  </argusx-menubar-checkbox-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-item [inset]="true">
                    Reload
                    <argusx-menubar-shortcut>⌘R</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item [disabled]="true" [inset]="true">
                    Force Reload
                    <argusx-menubar-shortcut>⇧⌘R</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-item [inset]="true">Toggle Fullscreen</argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-item [inset]="true">Hide Sidebar</argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>

              <argusx-menubar-menu value="profiles">
                <argusx-menubar-trigger>Profiles</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-radio-group [(value)]="profile">
                    <argusx-menubar-radio-item value="andy">Andy</argusx-menubar-radio-item>
                    <argusx-menubar-radio-item value="benoit">Benoit</argusx-menubar-radio-item>
                    <argusx-menubar-radio-item value="luis">Luis</argusx-menubar-radio-item>
                  </argusx-menubar-radio-group>
                  <argusx-menubar-separator />
                  <argusx-menubar-item [inset]="true">Edit...</argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-item [inset]="true">Add Profile...</argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>

            <div class="space-y-1 text-xs text-muted-foreground">
              <p>
                Bookmarks Bar:
                <span class="font-medium text-foreground">{{ alwaysShowBookmarksBar() ? 'On' : 'Off' }}</span>
              </p>
              <p>
                Full URLs:
                <span class="font-medium text-foreground">{{ alwaysShowFullUrls() ? 'On' : 'Off' }}</span>
              </p>
              <p>Profile: <span class="font-medium text-foreground">{{ profile() ?? 'benoit' }}</span></p>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Basic</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="basic-file">
                <argusx-menubar-trigger>File</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>Back</argusx-menubar-item>
                  <argusx-menubar-item [disabled]="true">Forward</argusx-menubar-item>
                  <argusx-menubar-item>Reload</argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>
              <argusx-menubar-menu value="basic-edit">
                <argusx-menubar-trigger>Edit</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>Cut</argusx-menubar-item>
                  <argusx-menubar-item>Copy</argusx-menubar-item>
                  <argusx-menubar-item>Paste</argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Shortcuts</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="shortcut-file">
                <argusx-menubar-trigger>File</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>
                    Back
                    <argusx-menubar-shortcut>⌘[</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item [disabled]="true">
                    Forward
                    <argusx-menubar-shortcut>⌘]</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item>
                    Reload
                    <argusx-menubar-shortcut>⌘R</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-item>
                    Save
                    <argusx-menubar-shortcut>⌘S</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Submenu</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="submenu-file">
                <argusx-menubar-trigger>File</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>
                    Copy
                    <argusx-menubar-shortcut>⌘C</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-item>
                    Cut
                    <argusx-menubar-shortcut>⌘X</argusx-menubar-shortcut>
                  </argusx-menubar-item>
                  <argusx-menubar-sub>
                    <argusx-menubar-sub-trigger>More Tools</argusx-menubar-sub-trigger>
                    <argusx-menubar-sub-content>
                      <argusx-menubar-item>Save Page...</argusx-menubar-item>
                      <argusx-menubar-item>Create Shortcut...</argusx-menubar-item>
                      <argusx-menubar-item>Name Window...</argusx-menubar-item>
                      <argusx-menubar-separator />
                      <argusx-menubar-item variant="destructive">Delete</argusx-menubar-item>
                    </argusx-menubar-sub-content>
                  </argusx-menubar-sub>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Checkboxes</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="checkboxes-view">
                <argusx-menubar-trigger>View</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-checkbox-item
                    [checked]="showBookmarksBar()"
                    (checkedChange)="showBookmarksBar.set($event)">
                    Show Bookmarks Bar
                  </argusx-menubar-checkbox-item>
                  <argusx-menubar-checkbox-item
                    [checked]="showFullUrls()"
                    (checkedChange)="showFullUrls.set($event)">
                    Show Full URLs
                  </argusx-menubar-checkbox-item>
                  <argusx-menubar-checkbox-item
                    [checked]="showDeveloperTools()"
                    (checkedChange)="showDeveloperTools.set($event)">
                    Show Developer Tools
                  </argusx-menubar-checkbox-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>

            <div class="space-y-1 text-xs text-muted-foreground">
              <p>Bookmarks Bar: <span class="font-medium text-foreground">{{ showBookmarksBar() ? 'On' : 'Off' }}</span></p>
              <p>Full URLs: <span class="font-medium text-foreground">{{ showFullUrls() ? 'On' : 'Off' }}</span></p>
              <p>Developer Tools: <span class="font-medium text-foreground">{{ showDeveloperTools() ? 'On' : 'Off' }}</span></p>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Radio Group</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="radio-profiles">
                <argusx-menubar-trigger>Profiles</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-label>People</argusx-menubar-label>
                  <argusx-menubar-radio-group [(value)]="user">
                    <argusx-menubar-radio-item value="pedro">Pedro Duarte</argusx-menubar-radio-item>
                    <argusx-menubar-radio-item value="colm">Colm Tuite</argusx-menubar-radio-item>
                  </argusx-menubar-radio-group>
                  <argusx-menubar-separator />
                  <argusx-menubar-label>Theme</argusx-menubar-label>
                  <argusx-menubar-radio-group [(value)]="radioTheme">
                    <argusx-menubar-radio-item value="light">Light</argusx-menubar-radio-item>
                    <argusx-menubar-radio-item value="dark">Dark</argusx-menubar-radio-item>
                    <argusx-menubar-radio-item value="system">System</argusx-menubar-radio-item>
                  </argusx-menubar-radio-group>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>

            <div class="space-y-1 text-xs text-muted-foreground">
              <p>User: <span class="font-medium text-foreground">{{ user() }}</span></p>
              <p>Theme: <span class="font-medium text-foreground">{{ radioTheme() }}</span></p>
            </div>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Destructive Items</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="destructive-actions">
                <argusx-menubar-trigger>Actions</argusx-menubar-trigger>
                <argusx-menubar-content>
                  <argusx-menubar-item>Edit</argusx-menubar-item>
                  <argusx-menubar-item>Share</argusx-menubar-item>
                  <argusx-menubar-separator />
                  <argusx-menubar-item>Archive</argusx-menubar-item>
                  <argusx-menubar-item variant="destructive">Delete</argusx-menubar-item>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>
          </div>
        </section>

        <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
          <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Inset</div>
          <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
            <argusx-menubar>
              <argusx-menubar-menu value="inset-preferences">
                <argusx-menubar-trigger>Preferences</argusx-menubar-trigger>
                <argusx-menubar-content class="w-56">
                  <argusx-menubar-group>
                    <argusx-menubar-label>Actions</argusx-menubar-label>
                    <argusx-menubar-item>
                      Copy
                      <argusx-menubar-shortcut>⌘C</argusx-menubar-shortcut>
                    </argusx-menubar-item>
                    <argusx-menubar-item>
                      Cut
                      <argusx-menubar-shortcut>⌘X</argusx-menubar-shortcut>
                    </argusx-menubar-item>
                    <argusx-menubar-item [inset]="true">Paste</argusx-menubar-item>
                  </argusx-menubar-group>
                  <argusx-menubar-separator />
                  <argusx-menubar-group>
                    <argusx-menubar-label [inset]="true">Appearance</argusx-menubar-label>
                    <argusx-menubar-checkbox-item
                      [inset]="true"
                      [checked]="insetShowBookmarks()"
                      (checkedChange)="insetShowBookmarks.set($event)">
                      Bookmarks
                    </argusx-menubar-checkbox-item>
                    <argusx-menubar-checkbox-item
                      [inset]="true"
                      [checked]="insetShowUrls()"
                      (checkedChange)="insetShowUrls.set($event)">
                      Full URLs
                    </argusx-menubar-checkbox-item>
                  </argusx-menubar-group>
                  <argusx-menubar-separator />
                  <argusx-menubar-group>
                    <argusx-menubar-label [inset]="true">Theme</argusx-menubar-label>
                    <argusx-menubar-radio-group [(value)]="insetTheme">
                      <argusx-menubar-radio-item [inset]="true" value="light">Light</argusx-menubar-radio-item>
                      <argusx-menubar-radio-item [inset]="true" value="dark">Dark</argusx-menubar-radio-item>
                      <argusx-menubar-radio-item [inset]="true" value="system">System</argusx-menubar-radio-item>
                    </argusx-menubar-radio-group>
                  </argusx-menubar-group>
                  <argusx-menubar-separator />
                  <argusx-menubar-sub>
                    <argusx-menubar-sub-trigger [inset]="true">More Options</argusx-menubar-sub-trigger>
                    <argusx-menubar-sub-content>
                      <argusx-menubar-item>Save Page...</argusx-menubar-item>
                      <argusx-menubar-item>Create Shortcut...</argusx-menubar-item>
                    </argusx-menubar-sub-content>
                  </argusx-menubar-sub>
                </argusx-menubar-content>
              </argusx-menubar-menu>
            </argusx-menubar>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class MenubarPreviewComponent {
  readonly alwaysShowBookmarksBar = signal(false);
  readonly alwaysShowFullUrls = signal(true);
  readonly profile = signal<string | undefined>('benoit');

  readonly showBookmarksBar = signal(true);
  readonly showFullUrls = signal(false);
  readonly showDeveloperTools = signal(false);

  readonly user = signal<'pedro' | 'colm'>('pedro');
  readonly radioTheme = signal<'light' | 'dark' | 'system'>('light');

  readonly insetShowBookmarks = signal(true);
  readonly insetShowUrls = signal(false);
  readonly insetTheme = signal<'light' | 'dark' | 'system'>('system');
}
