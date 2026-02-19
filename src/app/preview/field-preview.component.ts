import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FieldComponent,
  FieldContentComponent,
  FieldDescriptionComponent,
  FieldErrorComponent,
  FieldGroupComponent,
  FieldLegendComponent,
  FieldLabelComponent,
  FieldSeparatorComponent,
  FieldSetComponent,
  type FieldErrorItem,
} from '@app/shared/ui/field';
import { ArgusxInputDirective } from '@app/shared/ui/input';
import { ArgusxCheckboxComponent } from '@app/shared/ui/checkbox';
import { ArgusxButtonDirective } from '@app/shared/ui/button';

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
    FieldGroupComponent,
    FieldSeparatorComponent,
    FieldContentComponent,
    ArgusxInputDirective,
    ArgusxCheckboxComponent,
    ArgusxButtonDirective,
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
            <argusx-checkbox id="remember" />
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

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Field Group</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-set>
            <argusx-field-legend>Notifications</argusx-field-legend>
            <argusx-field-description>
              Choose how you want to be notified.
            </argusx-field-description>
            <argusx-field-group>
              <argusx-field orientation="horizontal">
                <argusx-checkbox [checked]="true" [disabled]="true" />
                <argusx-field-label>Push notifications</argusx-field-label>
              </argusx-field>
              <argusx-field orientation="horizontal">
                <argusx-checkbox />
                <argusx-field-label>Email notifications</argusx-field-label>
              </argusx-field>
              <argusx-field orientation="horizontal">
                <argusx-checkbox />
                <argusx-field-label>SMS notifications</argusx-field-label>
              </argusx-field>
            </argusx-field-group>
          </argusx-field-set>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Field Separator</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-set>
            <argusx-field-legend>Account</argusx-field-legend>
            <argusx-field>
              <argusx-field-label>Username</argusx-field-label>
              <input argusxInput type="text" placeholder="johndoe" />
            </argusx-field>
            <argusx-field-separator />
            <argusx-field>
              <argusx-field-label>Email</argusx-field-label>
              <input argusxInput type="email" placeholder="john@example.com" />
            </argusx-field>
          </argusx-field-set>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Field Separator with Content</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-set>
            <argusx-field>
              <argusx-field-label>Phone</argusx-field-label>
              <input argusxInput type="tel" placeholder="+1 (555) 000-0000" />
            </argusx-field>
            <argusx-field-separator [hasContent]="true">OR</argusx-field-separator>
            <argusx-field>
              <argusx-field-label>Email</argusx-field-label>
              <input argusxInput type="email" placeholder="john@example.com" />
            </argusx-field>
          </argusx-field-set>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Responsive Orientation</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-set>
            <argusx-field-legend>Profile</argusx-field-legend>
            <argusx-field-description>Fill in your profile information.</argusx-field-description>
            <argusx-field-separator />
            <argusx-field-group>
              <argusx-field orientation="responsive">
                <argusx-field-content>
                  <argusx-field-label>Name</argusx-field-label>
                  <argusx-field-description>Your full name</argusx-field-description>
                </argusx-field-content>
                <input argusxInput type="text" placeholder="Evil Rabbit" />
              </argusx-field>
              <argusx-field-separator />
              <argusx-field orientation="responsive">
                <argusx-field-content>
                  <argusx-field-label>Message</argusx-field-label>
                  <argusx-field-description>Your message</argusx-field-description>
                </argusx-field-content>
                <textarea argusxInput placeholder="Hello, world!" class="resize-none min-h-[100px]"></textarea>
              </argusx-field>
              <argusx-field-separator />
              <argusx-field orientation="responsive">
                <button argusx-button variant="default" type="submit">Submit</button>
                <button argusx-button variant="outline" type="button">Cancel</button>
              </argusx-field>
            </argusx-field-group>
          </argusx-field-set>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Complex Form (Payment)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <argusx-field-group>
            <argusx-field-set>
              <argusx-field-legend>Payment Method</argusx-field-legend>
              <argusx-field-description>
                All transactions are secure and encrypted.
              </argusx-field-description>
              <argusx-field-group>
                <argusx-field>
                  <argusx-field-label htmlFor="card-name">Name on Card</argusx-field-label>
                  <input argusxInput id="card-name" type="text" placeholder="Evil Rabbit" required />
                </argusx-field>
                <argusx-field>
                  <argusx-field-label htmlFor="card-number">Card Number</argusx-field-label>
                  <input argusxInput id="card-number" type="text" placeholder="1234 5678 9012 3456" required />
                  <argusx-field-description>
                    Enter your 16-digit card number.
                  </argusx-field-description>
                </argusx-field>
                <div class="grid grid-cols-3 gap-4">
                  <argusx-field>
                    <argusx-field-label htmlFor="exp-month">Month</argusx-field-label>
                    <select id="exp-month" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">MM</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </argusx-field>
                  <argusx-field>
                    <argusx-field-label htmlFor="exp-year">Year</argusx-field-label>
                    <select id="exp-year" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">YYYY</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </argusx-field>
                  <argusx-field>
                    <argusx-field-label htmlFor="cvv">CVV</argusx-field-label>
                    <input argusxInput id="cvv" type="text" placeholder="123" required />
                  </argusx-field>
                </div>
              </argusx-field-group>
            </argusx-field-set>
            <argusx-field-separator />
            <argusx-field-set>
              <argusx-field-legend>Billing Address</argusx-field-legend>
              <argusx-field-description>
                The billing address associated with your payment method.
              </argusx-field-description>
              <argusx-field-group>
                <argusx-field orientation="horizontal">
                  <argusx-checkbox id="same-as-shipping" [checked]="true" />
                  <argusx-field-label for="same-as-shipping">Same as shipping address</argusx-field-label>
                </argusx-field>
              </argusx-field-group>
            </argusx-field-set>
            <argusx-field orientation="horizontal">
              <button argusx-button variant="default" type="submit">Submit</button>
              <button argusx-button variant="outline" type="button">Cancel</button>
            </argusx-field>
          </argusx-field-group>
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
