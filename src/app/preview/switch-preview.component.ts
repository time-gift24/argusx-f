import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SwitchComponent } from '../shared/ui/switch';

@Component({
  selector: 'app-switch-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwitchComponent],
  template: `
    <div class="mx-auto max-w-5xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Switch</h1>
      <p class="mb-8 text-muted-foreground">
        A control that allows the user to toggle between checked and not checked.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="flex items-center gap-3">
              <app-switch
                id="airplane-mode"
                [checked]="airplaneMode()"
                (checkedChange)="airplaneMode.set($event)"
              />
              <label for="airplane-mode" class="cursor-pointer select-none text-sm font-medium">
                Airplane Mode
              </label>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Description</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <label
              for="share-across-devices"
              class="flex cursor-pointer items-start justify-between gap-3 rounded-md border border-border p-3"
            >
              <div class="space-y-1 text-sm">
                <p class="font-medium">Share across devices</p>
                <p class="text-xs text-muted-foreground">
                  Focus is shared across devices, and turns off when you leave the app.
                </p>
              </div>
              <app-switch
                id="share-across-devices"
                class="mt-0.5 shrink-0"
                [checked]="shareAcrossDevices()"
                (checkedChange)="shareAcrossDevices.set($event)"
              />
            </label>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Disabled</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <label class="flex items-center gap-3 text-sm text-muted-foreground">
                <app-switch [checked]="false" [disabled]="true" />
                Disabled (Unchecked)
              </label>
              <label class="flex items-center gap-3 text-sm text-muted-foreground">
                <app-switch [checked]="true" [disabled]="true" />
                Disabled (Checked)
              </label>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Sizes</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="space-y-4">
              <label for="small-switch" class="flex items-center gap-3 text-sm font-medium">
                <app-switch
                  id="small-switch"
                  class="origin-left scale-90"
                  [checked]="smallSizeEnabled()"
                  (checkedChange)="smallSizeEnabled.set($event)"
                />
                Small
              </label>
              <label for="default-switch" class="flex items-center gap-3 text-sm font-medium">
                <app-switch
                  id="default-switch"
                  [checked]="defaultSizeEnabled()"
                  (checkedChange)="defaultSizeEnabled.set($event)"
                />
                Default
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SwitchPreviewComponent {
  readonly airplaneMode = signal(false);
  readonly shareAcrossDevices = signal(false);
  readonly smallSizeEnabled = signal(false);
  readonly defaultSizeEnabled = signal(false);
}
