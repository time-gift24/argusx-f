import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SwitchComponent } from '../shared/ui/switch';

@Component({
  selector: 'app-switch-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwitchComponent],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Switch</h1>
      <p class="mb-8 text-muted-foreground">
        A control that allows the user to toggle between checked and not checked.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Basic Usage -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Basic Usage</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex items-center gap-4">
              <app-switch [checked]="false" (checkedChange)="onSwitchChange($event)" />
              <span class="text-sm">Current state: {{ switchState() }}</span>
            </div>
          </div>
        </section>

        <!-- Checked State -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Checked State</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex items-center gap-4">
              <app-switch [checked]="true" />
              <span class="text-sm text-muted-foreground">On</span>
            </div>
          </div>
        </section>

        <!-- Unchecked State -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Unchecked State</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex items-center gap-4">
              <app-switch [checked]="false" />
              <span class="text-sm text-muted-foreground">Off</span>
            </div>
          </div>
        </section>

        <!-- Disabled State -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Disabled State</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex flex-wrap items-center gap-4">
              <app-switch [checked]="false" [disabled]="true" />
              <span class="text-sm text-muted-foreground">Disabled off</span>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-4">
              <app-switch [checked]="true" [disabled]="true" />
              <span class="text-sm text-muted-foreground">Disabled on</span>
            </div>
          </div>
        </section>

        <!-- With Label -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Label</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex items-center gap-4">
              <app-switch
                [checked]="notificationsEnabled()"
                (checkedChange)="notificationsEnabled.set($event)"
                id="notifications"
              />
              <label for="notifications" class="text-sm cursor-pointer select-none">
                Enable notifications
              </label>
            </div>
            <div class="mt-4 flex items-center gap-4">
              <app-switch
                [checked]="marketingEmails()"
                (checkedChange)="marketingEmails.set($event)"
                id="marketing"
              />
              <label for="marketing" class="text-sm cursor-pointer select-none">
                Receive marketing emails
              </label>
            </div>
          </div>
        </section>

        <!-- Required -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Required</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex items-center gap-4">
              <app-switch
                [checked]="termsAccepted()"
                (checkedChange)="termsAccepted.set($event)"
                id="terms"
                [required]="true"
              />
              <label for="terms" class="text-sm cursor-pointer select-none">
                I accept the terms and conditions
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SwitchPreviewComponent {
  readonly switchState = signal<'off' | 'on'>('off');
  readonly notificationsEnabled = signal(false);
  readonly marketingEmails = signal(true);
  readonly termsAccepted = signal(false);

  onSwitchChange(checked: boolean): void {
    this.switchState.set(checked ? 'on' : 'off');
  }
}
