import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ToggleGroupComponent, ToggleGroupItemComponent } from '@app/shared/ui/toggle-group';

@Component({
  selector: 'app-toggle-group-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleGroupComponent, ToggleGroupItemComponent],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Toggle Group</h1>
      <p class="mb-8 text-muted-foreground">
        Grouped toggles with single or multiple selection behavior.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Single</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-toggle-group
            #alignmentGroup
            type="single"
            variant="outline"
            (valueChange)="singleValue.set($event[0] || '')"
          >
            <app-toggle-group-item [group]="alignmentGroup" value="left">Left</app-toggle-group-item>
            <app-toggle-group-item [group]="alignmentGroup" value="center">Center</app-toggle-group-item>
            <app-toggle-group-item [group]="alignmentGroup" value="right">Right</app-toggle-group-item>
          </app-toggle-group>

          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ singleValue() || 'None' }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Multiple</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <app-toggle-group
            #formatGroup
            type="multiple"
            variant="outline"
            [value]="formats()"
            (valueChange)="formats.set($event)"
          >
            <app-toggle-group-item [group]="formatGroup" value="bold">Bold</app-toggle-group-item>
            <app-toggle-group-item [group]="formatGroup" value="italic">Italic</app-toggle-group-item>
            <app-toggle-group-item [group]="formatGroup" value="underline">Underline</app-toggle-group-item>
          </app-toggle-group>

          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ formats().length ? formats().join(', ') : 'None' }}</span>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class ToggleGroupPreviewComponent {
  readonly singleValue = signal<string>('');
  readonly formats = signal<string[]>(['bold']);
}
