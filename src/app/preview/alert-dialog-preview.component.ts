import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AlertDialogComponents } from '@app/shared/ui/alert-dialog';
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

@Component({
  selector: 'app-alert-dialog-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertDialogComponents,
    ArgusxButtonDirective,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    DialogFooterComponent,
    DialogCloseDirective,
  ],
  template: `
    <div class="mx-auto max-w-5xl px-8 py-10">
      <div class="grid gap-6 md:grid-cols-2">
        <section class="space-y-2">
          <h2 class="text-xs text-muted-foreground">Basic</h2>
          <div class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <app-alert-dialog>
              <button argusx-button variant="outline" size="sm" app-alert-dialog-trigger>
                Default
              </button>
              <div app-alert-dialog-content>
                <div app-alert-dialog-header>
                  <h3 app-alert-dialog-title>Are you absolutely sure?</h3>
                  <p app-alert-dialog-description>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </p>
                </div>
                <div app-alert-dialog-footer>
                  <button app-alert-dialog-cancel size="sm">Cancel</button>
                  <button app-alert-dialog-action size="sm">Continue</button>
                </div>
              </div>
            </app-alert-dialog>
          </div>
        </section>

        <section class="space-y-2">
          <h2 class="text-xs text-muted-foreground">Small</h2>
          <div class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <app-alert-dialog size="sm">
              <button argusx-button variant="outline" size="sm" app-alert-dialog-trigger>
                Small
              </button>
              <div app-alert-dialog-content>
                <div app-alert-dialog-header>
                  <h3 app-alert-dialog-title>Allow accessory to connect?</h3>
                  <p app-alert-dialog-description>
                    Do you want to allow the USB accessory to connect to this device?
                  </p>
                </div>
                <div app-alert-dialog-footer>
                  <button app-alert-dialog-cancel size="sm">Don't allow</button>
                  <button app-alert-dialog-action size="sm">Allow</button>
                </div>
              </div>
            </app-alert-dialog>
          </div>
        </section>

        <section class="space-y-2">
          <h2 class="text-xs text-muted-foreground">With Media</h2>
          <div class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <app-alert-dialog>
              <button argusx-button variant="outline" size="sm" app-alert-dialog-trigger>
                Default (Media)
              </button>
              <div app-alert-dialog-content>
                <div app-alert-dialog-header>
                  <div app-alert-dialog-media>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="m13 3-.87 1.74a3 3 0 0 0 0 2.52l.74 1.48-4.53 4.53a3 3 0 1 0 2.12 2.12L15 10.87l1.48.74a3 3 0 0 0 2.52 0L21 10.74l-1.12-2.24a3 3 0 0 0-1.34-1.34L16.3 6.04a3 3 0 0 0-2.52 0Z"
                      />
                    </svg>
                  </div>
                  <h3 app-alert-dialog-title>Are you absolutely sure?</h3>
                  <p app-alert-dialog-description>
                    This will permanently delete your account and remove your data from our servers.
                  </p>
                </div>
                <div app-alert-dialog-footer>
                  <button app-alert-dialog-cancel size="sm">Cancel</button>
                  <button app-alert-dialog-action size="sm">Continue</button>
                </div>
              </div>
            </app-alert-dialog>
          </div>
        </section>

        <section class="space-y-2">
          <h2 class="text-xs text-muted-foreground">Small With Media</h2>
          <div class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <app-alert-dialog size="sm">
              <button argusx-button variant="outline" size="sm" app-alert-dialog-trigger>
                Small (Media)
              </button>
              <div app-alert-dialog-content>
                <div app-alert-dialog-header>
                  <div app-alert-dialog-media>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="m13 3-.87 1.74a3 3 0 0 0 0 2.52l.74 1.48-4.53 4.53a3 3 0 1 0 2.12 2.12L15 10.87l1.48.74a3 3 0 0 0 2.52 0L21 10.74l-1.12-2.24a3 3 0 0 0-1.34-1.34L16.3 6.04a3 3 0 0 0-2.52 0Z"
                      />
                    </svg>
                  </div>
                  <h3 app-alert-dialog-title>Allow accessory to connect?</h3>
                  <p app-alert-dialog-description>
                    Do you want to allow the USB accessory to connect to this device?
                  </p>
                </div>
                <div app-alert-dialog-footer>
                  <button app-alert-dialog-cancel size="sm">Don't allow</button>
                  <button app-alert-dialog-action size="sm">Allow</button>
                </div>
              </div>
            </app-alert-dialog>
          </div>
        </section>

        <section class="space-y-2">
          <h2 class="text-xs text-muted-foreground">Destructive</h2>
          <div class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <app-alert-dialog>
              <button argusx-button variant="destructive" size="sm" app-alert-dialog-trigger>
                Delete Chat
              </button>
              <div app-alert-dialog-content>
                <div app-alert-dialog-header>
                  <div app-alert-dialog-media class="bg-destructive/10 text-destructive">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 6h18M8 6V4h8v2m-8 0v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 11v6m4-6v6"
                      />
                    </svg>
                  </div>
                  <h3 app-alert-dialog-title>Delete chat?</h3>
                  <p app-alert-dialog-description>
                    This will permanently delete this chat conversation. View
                    <a href="#">Settings</a>
                    delete any memories saved during this chat.
                  </p>
                </div>
                <div app-alert-dialog-footer>
                  <button app-alert-dialog-cancel size="sm">Cancel</button>
                  <button app-alert-dialog-action variant="destructive" size="sm">Delete</button>
                </div>
              </div>
            </app-alert-dialog>
          </div>
        </section>

        <section class="space-y-2">
          <h2 class="text-xs text-muted-foreground">In Dialog</h2>
          <div class="flex min-h-24 items-center justify-center rounded-md border border-dashed border-border">
            <button argusx-button variant="outline" size="sm" (click)="inDialogOpen.set(true)">
              Open Dialog
            </button>
          </div>
        </section>
      </div>

      @if (inDialogOpen()) {
        <div argus-dialog [(open)]="inDialogOpen">
          <div argus-dialog-content size="sm" [showCloseButton]="false">
            <div argus-dialog-header>
              <h3 argus-dialog-title>Alert Dialog Example</h3>
              <p argus-dialog-description>
                Click the button below to open an alert dialog.
              </p>
            </div>

            <div class="flex justify-center">
              <app-alert-dialog>
                <button argusx-button variant="outline" size="sm" app-alert-dialog-trigger>
                  Open Alert Dialog
                </button>
                <div app-alert-dialog-content>
                  <div app-alert-dialog-header>
                    <h3 app-alert-dialog-title>Are you absolutely sure?</h3>
                    <p app-alert-dialog-description>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </p>
                  </div>
                  <div app-alert-dialog-footer>
                    <button app-alert-dialog-cancel size="sm">Cancel</button>
                    <button app-alert-dialog-action size="sm">Continue</button>
                  </div>
                </div>
              </app-alert-dialog>
            </div>

            <div argus-dialog-footer>
              <button argusx-button variant="outline" size="sm" argus-dialog-close>
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AlertDialogPreviewComponent {
  readonly inDialogOpen = signal(false);
}
