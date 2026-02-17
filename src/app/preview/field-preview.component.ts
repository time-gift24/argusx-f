import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldComponent,
  FieldDescriptionComponent,
  FieldErrorComponent,
  FieldLegendComponent,
  FieldLabelComponent,
  FieldSetComponent,
  type FieldErrorItem,
} from '@app/shared/ui/field';
import { InputDirective } from '@app/shared/ui/input';

@Component({
  selector: 'app-field-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FieldComponent,
    FieldSetComponent,
    FieldLegendComponent,
    FieldLabelComponent,
    FieldDescriptionComponent,
    FieldErrorComponent,
    InputDirective,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Field</h1>
      <p class="mb-8 text-muted-foreground">
        Composable field primitives for labels, descriptions, and validation messages.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Basic Field</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-field>
            <app-field-label>Email address</app-field-label>
            <input appInput type="email" placeholder="name@example.com" size="md" />
            <app-field-description>We'll only use this for security notifications.</app-field-description>
          </app-field>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Field Set + Error</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <app-field-set>
            <app-field-legend>Account setup</app-field-legend>

            <app-field>
              <app-field-label>Username</app-field-label>
              <input appInput type="text" value="argus_admin" size="md" />
              <app-field-description>Only letters, numbers, and underscore.</app-field-description>
            </app-field>

            <app-field>
              <app-field-label>Password</app-field-label>
              <input appInput type="password" size="md" />
              <app-field-error [errors]="passwordErrors" />
            </app-field>
          </app-field-set>
        </div>
      </section>
    </div>
  `,
})
export class FieldPreviewComponent {
  readonly passwordErrors: FieldErrorItem[] = [
    { message: 'Password must be at least 8 characters.' },
  ];
}
