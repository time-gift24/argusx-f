import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, SquareIcon, CopyIcon, ScissorsIcon, ClipboardIcon, Trash2Icon, PencilIcon, Share2Icon, ArchiveIcon } from 'lucide-angular';
import {
  ArgusxContextMenuCheckboxItemComponent,
  ArgusxContextMenuComponent,
  ArgusxContextMenuContentComponent,
  ArgusxContextMenuGroupComponent,
  ArgusxContextMenuItemComponent,
  ArgusxContextMenuLabelComponent,
  ArgusxContextMenuRadioGroupComponent,
  ArgusxContextMenuRadioItemComponent,
  ArgusxContextMenuSeparatorComponent,
  ArgusxContextMenuShortcutComponent,
  ArgusxContextMenuSubComponent,
  ArgusxContextMenuSubContentComponent,
  ArgusxContextMenuSubTriggerComponent,
  ArgusxContextMenuTriggerDirective,
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
    ArgusxContextMenuComponent,
    ArgusxContextMenuTriggerDirective,
    ArgusxContextMenuContentComponent,
    ArgusxContextMenuGroupComponent,
    ArgusxContextMenuItemComponent,
    ArgusxContextMenuCheckboxItemComponent,
    ArgusxContextMenuRadioGroupComponent,
    ArgusxContextMenuRadioItemComponent,
    ArgusxContextMenuLabelComponent,
    ArgusxContextMenuSeparatorComponent,
    ArgusxContextMenuShortcutComponent,
    ArgusxContextMenuSubComponent,
    ArgusxContextMenuSubTriggerComponent,
    ArgusxContextMenuSubContentComponent,
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
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-item>Back</argusx-context-menu-item>
                <argusx-context-menu-item [disabled]="true">Forward</argusx-context-menu-item>
                <argusx-context-menu-item>Reload</argusx-context-menu-item>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Sides</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <div
            class="grid grid-cols-2 gap-6">
            <argusx-context-menu>
              <div
                argusxContextMenuTrigger
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (top)
              </div>
              <argusx-context-menu-content side="top">
                <argusx-context-menu-group>
                  <argusx-context-menu-item>Back</argusx-context-menu-item>
                  <argusx-context-menu-item>Forward</argusx-context-menu-item>
                  <argusx-context-menu-item>Reload</argusx-context-menu-item>
                </argusx-context-menu-group>
              </argusx-context-menu-content>
            </argusx-context-menu>

            <argusx-context-menu>
              <div
                argusxContextMenuTrigger
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (right)
              </div>
              <argusx-context-menu-content side="right">
                <argusx-context-menu-group>
                  <argusx-context-menu-item>Back</argusx-context-menu-item>
                  <argusx-context-menu-item>Forward</argusx-context-menu-item>
                  <argusx-context-menu-item>Reload</argusx-context-menu-item>
                </argusx-context-menu-group>
              </argusx-context-menu-content>
            </argusx-context-menu>

            <argusx-context-menu>
              <div
                argusxContextMenuTrigger
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (bottom)
              </div>
              <argusx-context-menu-content side="bottom">
                <argusx-context-menu-group>
                  <argusx-context-menu-item>Back</argusx-context-menu-item>
                  <argusx-context-menu-item>Forward</argusx-context-menu-item>
                  <argusx-context-menu-item>Reload</argusx-context-menu-item>
                </argusx-context-menu-group>
              </argusx-context-menu-content>
            </argusx-context-menu>

            <argusx-context-menu>
              <div
                argusxContextMenuTrigger
                class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
                Right click (left)
              </div>
              <argusx-context-menu-content side="left">
                <argusx-context-menu-group>
                  <argusx-context-menu-item>Back</argusx-context-menu-item>
                  <argusx-context-menu-item>Forward</argusx-context-menu-item>
                  <argusx-context-menu-item>Reload</argusx-context-menu-item>
                </argusx-context-menu-group>
              </argusx-context-menu-content>
            </argusx-context-menu>
          </div>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Icons</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-item>
                  <lucide-icon [img]="copyIcon" class="size-4" />
                  Copy
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  <lucide-icon [img]="scissorsIcon" class="size-4" />
                  Cut
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  <lucide-icon [img]="clipboardIcon" class="size-4" />
                  Paste
                </argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-item variant="destructive">
                  <lucide-icon [img]="trash2Icon" class="size-4" />
                  Delete
                </argusx-context-menu-item>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Shortcuts</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-item>
                  Back
                  <argusx-context-menu-shortcut>⌘[</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item [disabled]="true">
                  Forward
                  <argusx-context-menu-shortcut>⌘]</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Reload
                  <argusx-context-menu-shortcut>⌘R</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-item>
                  Save
                  <argusx-context-menu-shortcut>⌘S</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Save As...
                  <argusx-context-menu-shortcut>⇧⌘S</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Submenu</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-item>
                  Copy
                  <argusx-context-menu-shortcut>⌘C</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Cut
                  <argusx-context-menu-shortcut>⌘X</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-sub>
                <argusx-context-menu-sub-trigger>More Tools</argusx-context-menu-sub-trigger>
                <argusx-context-menu-sub-content>
                  <argusx-context-menu-group>
                    <argusx-context-menu-item>Save Page...</argusx-context-menu-item>
                    <argusx-context-menu-item>Create Shortcut...</argusx-context-menu-item>
                    <argusx-context-menu-item>Name Window...</argusx-context-menu-item>
                  </argusx-context-menu-group>
                  <argusx-context-menu-separator />
                  <argusx-context-menu-group>
                    <argusx-context-menu-item>Developer Tools</argusx-context-menu-item>
                  </argusx-context-menu-group>
                  <argusx-context-menu-separator />
                  <argusx-context-menu-group>
                    <argusx-context-menu-item variant="destructive">
                      Delete
                    </argusx-context-menu-item>
                  </argusx-context-menu-group>
                </argusx-context-menu-sub-content>
              </argusx-context-menu-sub>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Groups, Labels & Separators</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-label>File</argusx-context-menu-label>
                <argusx-context-menu-item>
                  New File
                  <argusx-context-menu-shortcut>⌘N</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Open File
                  <argusx-context-menu-shortcut>⌘O</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Save
                  <argusx-context-menu-shortcut>⌘S</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-label>Edit</argusx-context-menu-label>
                <argusx-context-menu-item>
                  Undo
                  <argusx-context-menu-shortcut>⌘Z</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Redo
                  <argusx-context-menu-shortcut>⇧⌘Z</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-separator />
                <argusx-context-menu-item>
                  Cut
                  <argusx-context-menu-shortcut>⌘X</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Copy
                  <argusx-context-menu-shortcut>⌘C</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  Paste
                  <argusx-context-menu-shortcut>⌘V</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-item variant="destructive">
                  Delete
                  <argusx-context-menu-shortcut>⌫</argusx-context-menu-shortcut>
                </argusx-context-menu-item>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Checkboxes</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-checkbox-item
                  [checked]="showBookmarksBar()"
                  (checkedChange)="showBookmarksBar.set($event)">
                  Show Bookmarks Bar
                </argusx-context-menu-checkbox-item>
                <argusx-context-menu-checkbox-item
                  [checked]="showFullUrls()"
                  (checkedChange)="showFullUrls.set($event)">
                  Show Full URLs
                </argusx-context-menu-checkbox-item>
                <argusx-context-menu-checkbox-item
                  [checked]="showDeveloperTools()"
                  (checkedChange)="showDeveloperTools.set($event)">
                  Show Developer Tools
                </argusx-context-menu-checkbox-item>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Radio Group</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-label>People</argusx-context-menu-label>
                <argusx-context-menu-radio-group [(value)]="user">
                  <argusx-context-menu-radio-item value="pedro">
                    Pedro Duarte
                  </argusx-context-menu-radio-item>
                  <argusx-context-menu-radio-item value="colm">
                    Colm Tuite
                  </argusx-context-menu-radio-item>
                </argusx-context-menu-radio-group>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-label>Theme</argusx-context-menu-label>
                <argusx-context-menu-radio-group [(value)]="radioTheme">
                  <argusx-context-menu-radio-item value="light">
                    Light
                  </argusx-context-menu-radio-item>
                  <argusx-context-menu-radio-item value="dark">
                    Dark
                  </argusx-context-menu-radio-item>
                  <argusx-context-menu-radio-item value="system">
                    System
                  </argusx-context-menu-radio-item>
                </argusx-context-menu-radio-group>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Destructive Items</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content>
              <argusx-context-menu-group>
                <argusx-context-menu-item>
                  <lucide-icon [img]="pencilIcon" class="size-4" />
                  Edit
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  <lucide-icon [img]="share2Icon" class="size-4" />
                  Share
                </argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-item>
                  <lucide-icon [img]="archiveIcon" class="size-4" />
                  Archive
                </argusx-context-menu-item>
                <argusx-context-menu-item variant="destructive">
                  <lucide-icon [img]="trash2Icon" class="size-4" />
                  Delete
                </argusx-context-menu-item>
              </argusx-context-menu-group>
            </argusx-context-menu-content>
          </argusx-context-menu>
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

            <argusx-context-menu>
              <div
                argusxContextMenuTrigger
                class="cn-context-menu-trigger mt-4 select-none flex h-20 w-full items-center justify-center rounded-lg border text-sm">
                Right click here
              </div>
              <argusx-context-menu-content>
                <argusx-context-menu-group>
                  <argusx-context-menu-item>
                    <lucide-icon [img]="copyIcon" class="size-4" />
                    Copy
                  </argusx-context-menu-item>
                  <argusx-context-menu-item>
                    <lucide-icon [img]="scissorsIcon" class="size-4" />
                    Cut
                  </argusx-context-menu-item>
                  <argusx-context-menu-item>
                    <lucide-icon [img]="clipboardIcon" class="size-4" />
                    Paste
                  </argusx-context-menu-item>
                </argusx-context-menu-group>
                <argusx-context-menu-separator />
                <argusx-context-menu-sub>
                  <argusx-context-menu-sub-trigger>More Options</argusx-context-menu-sub-trigger>
                  <argusx-context-menu-sub-content>
                    <argusx-context-menu-group>
                      <argusx-context-menu-item>Save Page...</argusx-context-menu-item>
                      <argusx-context-menu-item>Create Shortcut...</argusx-context-menu-item>
                      <argusx-context-menu-item>Name Window...</argusx-context-menu-item>
                    </argusx-context-menu-group>
                    <argusx-context-menu-separator />
                    <argusx-context-menu-group>
                      <argusx-context-menu-item>Developer Tools</argusx-context-menu-item>
                    </argusx-context-menu-group>
                  </argusx-context-menu-sub-content>
                </argusx-context-menu-sub>
                <argusx-context-menu-separator />
                <argusx-context-menu-group>
                  <argusx-context-menu-item variant="destructive">
                    <lucide-icon [img]="trash2Icon" class="size-4" />
                    Delete
                  </argusx-context-menu-item>
                </argusx-context-menu-group>
              </argusx-context-menu-content>
            </argusx-context-menu>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Inset</div>
        <div class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full">
          <argusx-context-menu>
            <div
              argusxContextMenuTrigger
              class="cn-context-menu-trigger select-none flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
              Right click here
            </div>
            <argusx-context-menu-content class="w-44">
              <argusx-context-menu-group>
                <argusx-context-menu-label>Actions</argusx-context-menu-label>
                <argusx-context-menu-item>
                  <lucide-icon [img]="copyIcon" class="size-4" />
                  Copy
                </argusx-context-menu-item>
                <argusx-context-menu-item>
                  <lucide-icon [img]="scissorsIcon" class="size-4" />
                  Cut
                </argusx-context-menu-item>
                <argusx-context-menu-item [inset]="true">Paste</argusx-context-menu-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-label [inset]="true">Appearance</argusx-context-menu-label>
                <argusx-context-menu-checkbox-item
                  [inset]="true"
                  [checked]="insetShowBookmarks()"
                  (checkedChange)="insetShowBookmarks.set($event)">
                  Bookmarks
                </argusx-context-menu-checkbox-item>
                <argusx-context-menu-checkbox-item
                  [inset]="true"
                  [checked]="insetShowUrls()"
                  (checkedChange)="insetShowUrls.set($event)">
                  Full URLs
                </argusx-context-menu-checkbox-item>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-group>
                <argusx-context-menu-label [inset]="true">Theme</argusx-context-menu-label>
                <argusx-context-menu-radio-group [(value)]="insetTheme">
                  <argusx-context-menu-radio-item [inset]="true" value="light">
                    Light
                  </argusx-context-menu-radio-item>
                  <argusx-context-menu-radio-item [inset]="true" value="dark">
                    Dark
                  </argusx-context-menu-radio-item>
                  <argusx-context-menu-radio-item [inset]="true" value="system">
                    System
                  </argusx-context-menu-radio-item>
                </argusx-context-menu-radio-group>
              </argusx-context-menu-group>
              <argusx-context-menu-separator />
              <argusx-context-menu-sub>
                <argusx-context-menu-sub-trigger [inset]="true">
                  More Options
                </argusx-context-menu-sub-trigger>
                <argusx-context-menu-sub-content>
                  <argusx-context-menu-group>
                    <argusx-context-menu-item>Save Page...</argusx-context-menu-item>
                    <argusx-context-menu-item>Create Shortcut...</argusx-context-menu-item>
                  </argusx-context-menu-group>
                </argusx-context-menu-sub-content>
              </argusx-context-menu-sub>
            </argusx-context-menu-content>
          </argusx-context-menu>
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
