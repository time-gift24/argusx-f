import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CheckboxComponent } from '@app/shared/ui/checkbox';

@Component({
  selector: 'app-checkbox-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Checkbox</h1>
      <p class="mb-8 text-muted-foreground">
        A control that allows the user to toggle between checked and not checked.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-2 text-sm">
              <app-checkbox [(checked)]="agreeTerms" />
              I agree to the terms and conditions
            </label>
            <label class="flex items-center gap-2 text-sm">
              <app-checkbox [(checked)]="newsletter" />
              Subscribe to newsletter
            </label>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Description</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <label class="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/50 cursor-pointer">
            <app-checkbox [(checked)]="notifications" class="mt-0.5" />
            <div class="grid gap-1">
              <span class="text-sm font-medium">Email notifications</span>
              <span class="text-xs text-muted-foreground">
                Receive email updates about your account activity.
              </span>
            </div>
          </label>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-2 text-sm">
              <app-checkbox [checked]="true" [disabled]="true" />
              Disabled checked
            </label>
            <label class="flex items-center gap-2 text-sm">
              <app-checkbox [disabled]="true" />
              Disabled unchecked
            </label>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CheckboxPreviewComponent {
  readonly agreeTerms = signal(false);
  readonly newsletter = signal(true);
  readonly notifications = signal(true);
}
