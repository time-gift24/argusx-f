import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DialogCloseDirective,
  DialogComponent,
  DialogContentComponent,
  DialogDescriptionComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '@app/shared/ui/dialog';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { LabelDirective } from '@app/shared/ui/label';

type ChatTab = 'general' | 'notifications' | 'personalization' | 'security';

@Component({
  selector: 'app-dialog-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    DialogCloseDirective,
    ArgusxButtonDirective,
    ArgusxInputDirective,
    LabelDirective,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Dialog</h1>
      <p class="mb-8 text-muted-foreground">
        A window overlaid on the primary content, rendering the content underneath inert.
      </p>

      <div class="space-y-4">
        <section class="rounded-lg border border-dashed border-border p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-medium">With Form</h2>
              <p class="text-xs text-muted-foreground">Basic profile form with actions.</p>
            </div>
            <button argusx-button variant="outline" (click)="formOpen.set(true)">Edit Profile</button>
          </div>
        </section>

        <section class="rounded-lg border border-dashed border-border p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-medium">Scrollable Content</h2>
              <p class="text-xs text-muted-foreground">Long content area with internal scroll.</p>
            </div>
            <button argusx-button variant="outline" (click)="scrollableOpen.set(true)">Scrollable Content</button>
          </div>
        </section>

        <section class="rounded-lg border border-dashed border-border p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-medium">With Sticky Footer</h2>
              <p class="text-xs text-muted-foreground">Scrollable body with pinned action row.</p>
            </div>
            <button argusx-button variant="outline" (click)="stickyFooterOpen.set(true)">Sticky Footer</button>
          </div>
        </section>

        <section class="rounded-lg border border-dashed border-border p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-medium">No Close Button</h2>
              <p class="text-xs text-muted-foreground">Top-right close button is intentionally hidden.</p>
            </div>
            <button argusx-button variant="outline" (click)="noCloseOpen.set(true)">No Close Button</button>
          </div>
        </section>

        <section class="rounded-lg border border-dashed border-border p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-sm font-medium">Chat Settings</h2>
              <p class="text-xs text-muted-foreground">Advanced configuration layout inside dialog.</p>
            </div>
            <button argusx-button variant="outline" (click)="chatSettingsOpen.set(true)">Chat Settings</button>
          </div>
        </section>
      </div>

      @if (formOpen()) {
        <div argus-dialog [(open)]="formOpen">
          <div argus-dialog-content>
            <div argus-dialog-header>
              <h3 argus-dialog-title>Edit profile</h3>
              <p argus-dialog-description>
                Make changes to your profile here. Click save when you're done. Your profile will be updated immediately.
              </p>
            </div>

            <div class="grid gap-3">
              <div class="grid gap-1.5">
                <label appLabel for="dialog-form-name">Name</label>
                <input argusxInput id="dialog-form-name" value="Pedro Duarte" />
              </div>
              <div class="grid gap-1.5">
                <label appLabel for="dialog-form-username">Username</label>
                <input argusxInput id="dialog-form-username" value="@peduarte" />
              </div>
            </div>

            <div argus-dialog-footer>
              <button argusx-button variant="outline" argus-dialog-close>Cancel</button>
              <button argusx-button (click)="formOpen.set(false)">Save changes</button>
            </div>
          </div>
        </div>
      }

      @if (scrollableOpen()) {
        <div argus-dialog [(open)]="scrollableOpen">
          <div argus-dialog-content>
            <div argus-dialog-header>
              <h3 argus-dialog-title>Scrollable Content</h3>
              <p argus-dialog-description>
                This is a dialog with scrollable content.
              </p>
            </div>

            <div class="max-h-72 space-y-3 overflow-y-auto pr-1 text-xs/relaxed text-muted-foreground">
              @for (paragraph of longParagraphs; track $index) {
                <p>{{ paragraph }}</p>
              }
            </div>

            <div argus-dialog-footer>
              <button argusx-button variant="outline" argus-dialog-close>Close</button>
            </div>
          </div>
        </div>
      }

      @if (stickyFooterOpen()) {
        <div argus-dialog [(open)]="stickyFooterOpen">
          <div argus-dialog-content>
            <div argus-dialog-header>
              <h3 argus-dialog-title>Scrollable Content</h3>
              <p argus-dialog-description>
                This is a dialog with scrollable content.
              </p>
            </div>

            <div class="max-h-72 overflow-y-auto pr-1">
              <div class="space-y-3 pb-16 text-xs/relaxed text-muted-foreground">
                @for (paragraph of longParagraphs; track $index) {
                  <p>{{ paragraph }}</p>
                }
              </div>

              <div class="sticky bottom-0 -mx-4 border-t border-border bg-popover/95 px-4 pt-3 pb-1 backdrop-blur">
                <div class="flex justify-end">
                  <button argusx-button variant="outline" argus-dialog-close>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (noCloseOpen()) {
        <div argus-dialog [(open)]="noCloseOpen">
          <div argus-dialog-content [showCloseButton]="false">
            <div argus-dialog-header>
              <h3 argus-dialog-title>No Close Button</h3>
              <p argus-dialog-description>
                This dialog doesn't have a close button in the top-right corner.
              </p>
            </div>

            <div argus-dialog-footer>
              <button argusx-button variant="outline" argus-dialog-close>Close</button>
            </div>
          </div>
        </div>
      }

      @if (chatSettingsOpen()) {
        <div argus-dialog [(open)]="chatSettingsOpen">
          <div argus-dialog-content>
            <div argus-dialog-header>
              <h3 argus-dialog-title>Chat Settings</h3>
              <p argus-dialog-description>
                Customize your chat settings: theme, accent color, spoken language, voice, personality, and custom instructions.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-[140px_1fr]">
              <div class="grid grid-cols-2 gap-1 md:grid-cols-1">
                @for (tab of chatTabs; track tab.id) {
                  <button
                    argusx-button
                    [variant]="chatTab() === tab.id ? 'secondary' : 'ghost'"
                    class="justify-start"
                    (click)="chatTab.set(tab.id)"
                  >
                    {{ tab.label }}
                  </button>
                }
              </div>

              <div class="space-y-3">
                @if (chatTab() === 'general') {
                  <div class="grid gap-1.5">
                    <label appLabel for="chat-theme">Theme</label>
                    <select id="chat-theme" class="h-7 rounded-md border border-input bg-input/20 px-2 text-xs/relaxed outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2">
                      <option>System</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>

                  <div class="grid gap-1.5">
                    <label appLabel for="chat-accent">Accent Color</label>
                    <select id="chat-accent" class="h-7 rounded-md border border-input bg-input/20 px-2 text-xs/relaxed outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2">
                      <option>Default</option>
                      <option>Cyan</option>
                      <option>Blue</option>
                    </select>
                  </div>

                  <div class="grid gap-1.5">
                    <label appLabel for="chat-language">Spoken Language</label>
                    <select id="chat-language" class="h-7 rounded-md border border-input bg-input/20 px-2 text-xs/relaxed outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2">
                      <option>English</option>
                      <option>Chinese</option>
                      <option>Spanish</option>
                    </select>
                    <p class="text-xs text-muted-foreground">
                      For best results, select the language you mainly use in conversation.
                    </p>
                  </div>

                  <div class="grid gap-1.5">
                    <label appLabel for="chat-voice">Voice</label>
                    <select id="chat-voice" class="h-7 rounded-md border border-input bg-input/20 px-2 text-xs/relaxed outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2">
                      <option>Samantha</option>
                      <option>Aria</option>
                      <option>Nova</option>
                    </select>
                  </div>
                } @else {
                  <div class="rounded-md border border-border bg-muted/30 p-3 text-xs/relaxed text-muted-foreground">
                    {{ chatTabLabel() }} settings are not configured in this preview yet.
                  </div>
                }
              </div>
            </div>

            <div argus-dialog-footer>
              <button argusx-button variant="outline" argus-dialog-close>Close</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DialogPreviewComponent {
  readonly formOpen = signal(false);
  readonly scrollableOpen = signal(false);
  readonly stickyFooterOpen = signal(false);
  readonly noCloseOpen = signal(false);
  readonly chatSettingsOpen = signal(false);

  readonly chatTab = signal<ChatTab>('general');

  readonly chatTabs: ReadonlyArray<{ id: ChatTab; label: string }> = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'personalization', label: 'Personalization' },
    { id: 'security', label: 'Security' },
  ];

  readonly longParagraphs: ReadonlyArray<string> = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.',
  ];

  readonly chatTabLabel = () => {
    const current = this.chatTabs.find((tab) => tab.id === this.chatTab());
    return current?.label ?? 'Current';
  };
}
