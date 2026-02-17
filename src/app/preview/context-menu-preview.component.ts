import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, SquareIcon, CopyIcon, ScissorsIcon, ClipboardIcon, Trash2Icon, PencilIcon, Share2Icon, ArchiveIcon } from 'lucide-angular';
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
import {
  DialogComponent,
  DialogContentComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../shared/ui/dialog';

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
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="bg-background w-full">
      <div class="mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl">
      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Basic</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Sides</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <div
            class="grid grid-cols-2 gap-6">
            <app-context-menu>
              <div
                appContextMenuTrigger
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Icons</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <app-context-menu-content>
              <app-context-menu-group>
                <app-context-menu-item>
                  <lucide-icon [img]="copyIcon" class="size-4" />
                  Copy
                </app-context-menu-item>
                <app-context-menu-item>
                  <lucide-icon [img]="scissorsIcon" class="size-4" />
                  Cut
                </app-context-menu-item>
                <app-context-menu-item>
                  <lucide-icon [img]="clipboardIcon" class="size-4" />
                  Paste
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-item variant="destructive">
                  <lucide-icon [img]="trash2Icon" class="size-4" />
                  Delete
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Shortcuts</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Submenu</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Groups, Labels & Separators</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Checkboxes</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Radio Group</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Destructive Items</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <app-context-menu-content>
              <app-context-menu-group>
                <app-context-menu-item>
                  <lucide-icon [img]="pencilIcon" class="size-4" />
                  Edit
                </app-context-menu-item>
                <app-context-menu-item>
                  <lucide-icon [img]="share2Icon" class="size-4" />
                  Share
                </app-context-menu-item>
              </app-context-menu-group>
              <app-context-menu-separator />
              <app-context-menu-group>
                <app-context-menu-item>
                  <lucide-icon [img]="archiveIcon" class="size-4" />
                  Archive
                </app-context-menu-item>
                <app-context-menu-item variant="destructive">
                  <lucide-icon [img]="trash2Icon" class="size-4" />
                  Delete
                </app-context-menu-item>
              </app-context-menu-group>
            </app-context-menu-content>
          </app-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">In Dialog</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
            (click)="dialogOpen.set(true)">
            Open Dialog
          </button>

          <div argus-dialog [(open)]="dialogOpen">
            <div argus-dialog-content>
              <div argus-dialog-header>
                <h3 argus-dialog-title>Context Menu Example</h3>
                <p argus-dialog-description>
                  Right click on the area below to see the context menu.
                </p>
              </div>

            <app-context-menu>
              <div
                appContextMenuTrigger
                class="cn-context-menu-trigger mt-4 select-none flex h-20 w-full items-center justify-center rounded-lg border text-sm">
                Right click here
              </div>
              <app-context-menu-content>
                <app-context-menu-group>
                  <app-context-menu-item>
                    <lucide-icon [img]="copyIcon" class="size-4" />
                    Copy
                  </app-context-menu-item>
                  <app-context-menu-item>
                    <lucide-icon [img]="scissorsIcon" class="size-4" />
                    Cut
                  </app-context-menu-item>
                  <app-context-menu-item>
                    <lucide-icon [img]="clipboardIcon" class="size-4" />
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
                    <lucide-icon [img]="trash2Icon" class="size-4" />
                    Delete
                  </app-context-menu-item>
                </app-context-menu-group>
              </app-context-menu-content>
            </app-context-menu>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Inset</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <app-context-menu>
            <div
              appContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <app-context-menu-content class="w-44">
              <app-context-menu-group>
                <app-context-menu-label>Actions</app-context-menu-label>
                <app-context-menu-item>
                  <lucide-icon [img]="copyIcon" class="size-4" />
                  Copy
                </app-context-menu-item>
                <app-context-menu-item>
                  <lucide-icon [img]="scissorsIcon" class="size-4" />
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
  protected readonly squareIcon = SquareIcon;
  protected readonly copyIcon = CopyIcon;
  protected readonly scissorsIcon = ScissorsIcon;
  protected readonly clipboardIcon = ClipboardIcon;
  protected readonly trash2Icon = Trash2Icon;
  protected readonly pencilIcon = PencilIcon;
  protected readonly share2Icon = Share2Icon;
  protected readonly archiveIcon = ArchiveIcon;

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
