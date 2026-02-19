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
import { ArgusxInputDirective } from '@app/shared/ui/input';

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
    ArgusxInputDirective,
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
          <argusx-field>
            <argusx-field-label>Email address</argusx-field-label>
            <input argusxInput type="email" placeholder="name@example.com" />
            <argusx-field-description>We'll only use this for security notifications.</argusx-field-description>
          </argusx-field>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Field Set + Error</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-set>
            <argusx-field-legend>Account setup</argusx-field-legend>

            <argusx-field>
              <argusx-field-label>Username</argusx-field-label>
              <input argusxInput type="text" value="argus_admin" />
              <argusx-field-description>Only letters, numbers, and underscore.</argusx-field-description>
            </argusx-field>

            <argusx-field>
              <argusx-field-label>Password</argusx-field-label>
              <input argusxInput type="password" />
              <argusx-field-error [errors]="passwordErrors" />
            </argusx-field>
          </argusx-field-set>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Horizontal Orientation</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field orientation="horizontal">
            <input argusxInput type="checkbox" id="remember" />
            <argusx-field-label for="remember">Remember me</argusx-field-label>
          </argusx-field>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Field Legend</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-set>
            <argusx-field-legend>Personal Information</argusx-field-legend>
            <argusx-field-legend variant="label">Contact Details</argusx-field-legend>
          </argusx-field-set>
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
