import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonGroupComponent, ButtonGroupTextComponent, ButtonGroupSeparatorComponent } from '@app/shared/ui/button-group';
import { ButtonComponent } from '@app/shared/ui/button';

@Component({
  selector: 'app-button-group-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupComponent, ButtonGroupTextComponent, ButtonGroupSeparatorComponent, ButtonComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Button Group</h1>
      <p class="mb-8 text-muted-foreground">
        Groups related buttons together with proper styling and keyboard navigation.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Horizontal</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-button-group>
            <button argus-button>Save</button>
            <button argus-button variant="outline">Cancel</button>
            <button argus-button variant="ghost">Delete</button>
          </app-button-group>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Vertical</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-button-group orientation="vertical">
            <button argus-button>Save</button>
            <button argus-button variant="outline">Cancel</button>
            <button argus-button variant="ghost">Delete</button>
          </app-button-group>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Text</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-button-group>
            <button argus-button>Save</button>
            <app-button-group-text>or</app-button-group-text>
            <button argus-button variant="outline">Cancel</button>
          </app-button-group>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Separator</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-button-group>
            <button argus-button>Save</button>
            <app-button-group-separator />
            <button argus-button variant="outline">Cancel</button>
          </app-button-group>
        </div>
      </section>
    </div>
  `,
})
export class ButtonGroupPreviewComponent {}
