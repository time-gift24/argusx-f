import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RadioGroupComponents } from '@app/shared/ui/radio-group';

@Component({
  selector: 'app-radio-group-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioGroupComponents],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Radio Group</h1>
      <p class="mb-8 text-muted-foreground">
        A set of mutually exclusive options where only one item can be selected.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <app-radio-group [(value)]="planType">
            <app-radio-item value="starter">
              <label class="text-xs">Starter - Free for personal use</label>
            </app-radio-item>
            <app-radio-item value="pro">
              <label class="text-xs">Pro - $12/month with analytics</label>
            </app-radio-item>
            <app-radio-item value="team">
              <label class="text-xs">Team - $39/month for collaboration</label>
            </app-radio-item>
          </app-radio-group>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ planType() ?? 'None' }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled Group</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-radio-group [value]="'email'" [disabled]="true">
            <app-radio-item value="email">
              <label class="text-xs">Email notification</label>
            </app-radio-item>
            <app-radio-item value="sms">
              <label class="text-xs">SMS notification</label>
            </app-radio-item>
          </app-radio-group>
        </div>
      </section>
    </div>
  `,
})
export class RadioGroupPreviewComponent {
  readonly planType = signal<string | undefined>('pro');
}
