import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ArgusxRadioGroupComponents } from '@app/shared/ui/radio-group';

@Component({
  selector: 'app-radio-group-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxRadioGroupComponents],
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
          <argusx-radio-group [(value)]="planType">
            <argusx-radio-item value="starter">
              <label class="text-xs">Starter - Free for personal use</label>
            </argusx-radio-item>
            <argusx-radio-item value="pro">
              <label class="text-xs">Pro - $12/month with analytics</label>
            </argusx-radio-item>
            <argusx-radio-item value="team">
              <label class="text-xs">Team - $39/month for collaboration</label>
            </argusx-radio-item>
          </argusx-radio-group>
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
          <argusx-radio-group [value]="'email'" [disabled]="true">
            <argusx-radio-item value="email">
              <label class="text-xs">Email notification</label>
            </argusx-radio-item>
            <argusx-radio-item value="sms">
              <label class="text-xs">SMS notification</label>
            </argusx-radio-item>
          </argusx-radio-group>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Disabled Item</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <argusx-radio-group [(value)]="deliveryMethod">
            <argusx-radio-item value="standard">
              <label class="text-xs">Standard Shipping (5-7 days)</label>
            </argusx-radio-item>
            <argusx-radio-item value="express">
              <label class="text-xs">Express Shipping (2-3 days)</label>
            </argusx-radio-item>
            <argusx-radio-item value="overnight" [disabled]="true">
              <label class="text-xs">Overnight Shipping (unavailable)</label>
            </argusx-radio-item>
          </argusx-radio-group>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ deliveryMethod() ?? 'None' }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Custom Name</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <argusx-radio-group [(value)]="color" name="preferred-color">
            <argusx-radio-item value="red">
              <label class="text-xs">Red</label>
            </argusx-radio-item>
            <argusx-radio-item value="green">
              <label class="text-xs">Green</label>
            </argusx-radio-item>
            <argusx-radio-item value="blue">
              <label class="text-xs">Blue</label>
            </argusx-radio-item>
          </argusx-radio-group>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ color() ?? 'None' }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Required</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <argusx-radio-group [(value)]="priority" [required]="true" aria-labelledby="priority-label">
            <span id="priority-label" class="text-xs font-medium">Select priority:</span>
            <argusx-radio-item value="low">
              <label class="text-xs">Low</label>
            </argusx-radio-item>
            <argusx-radio-item value="medium">
              <label class="text-xs">Medium</label>
            </argusx-radio-item>
            <argusx-radio-item value="high">
              <label class="text-xs">High</label>
            </argusx-radio-item>
          </argusx-radio-group>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ priority() ?? 'None' }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">With Custom Class</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <argusx-radio-group [(value)]="size">
            <argusx-radio-item value="small" className="mb-2">
              <label class="text-xs">Small</label>
            </argusx-radio-item>
            <argusx-radio-item value="medium" className="mb-2">
              <label class="text-xs">Medium</label>
            </argusx-radio-item>
            <argusx-radio-item value="large">
              <label class="text-xs">Large</label>
            </argusx-radio-item>
          </argusx-radio-group>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ size() ?? 'None' }}</span>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class RadioGroupPreviewComponent {
  readonly planType = signal<string | undefined>('pro');
  readonly deliveryMethod = signal<string | undefined>('standard');
  readonly color = signal<string | undefined>('blue');
  readonly priority = signal<string | undefined>('medium');
  readonly size = signal<string | undefined>('medium');
}
