import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  InputOtpComponent,
  InputOtpGroupComponent,
  InputOtpSeparatorComponent,
  InputOtpSlotComponent,
  REGEXP_ONLY_DIGITS,
} from '@app/shared/ui/input-otp';

@Component({
  selector: 'app-input-otp-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputOtpComponent,
    InputOtpGroupComponent,
    InputOtpSlotComponent,
    InputOtpSeparatorComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Input OTP</h1>
      <p class="mb-8 text-muted-foreground">
        One-time password entry with fixed slots and keyboard-friendly focus behavior.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">6-digit code</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <argusx-input-otp
            [(value)]="otpCode"
            [maxLength]="6"
            [pattern]="digitsPattern"
            placeholder="------"
          >
            <argusx-input-otp-group>
              @for (index of leftSlots; track index) {
                <argusx-input-otp-slot [index]="index" />
              }
              <argusx-input-otp-separator />
              @for (index of rightSlots; track index) {
                <argusx-input-otp-slot [index]="index" />
              }
            </argusx-input-otp-group>
          </argusx-input-otp>
          <p class="text-xs text-muted-foreground">
            Current value: <span class="font-medium text-foreground">{{ otpCode() || '—' }}</span>
          </p>
        </div>
      </section>
    </div>
  `,
})
export class InputOtpPreviewComponent {
  readonly otpCode = signal('');
  readonly digitsPattern = REGEXP_ONLY_DIGITS;
  readonly leftSlots = [0, 1, 2] as const;
  readonly rightSlots = [3, 4, 5] as const;
}
