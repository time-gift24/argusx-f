import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import {
  NativeSelectDirective,
  NativeSelectIconDirective,
  NativeSelectOptGroupDirective,
  NativeSelectOptionDirective,
  NativeSelectWrapperDirective,
} from '@app/shared/ui/native-select';

@Component({
  selector: 'app-native-select-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LucideAngularModule,
    NativeSelectWrapperDirective,
    NativeSelectDirective,
    NativeSelectOptionDirective,
    NativeSelectOptGroupDirective,
    NativeSelectIconDirective,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8 space-y-8">
      <h1 class="mb-2 text-2xl font-semibold">Native Select</h1>
      <p class="mb-8 text-muted-foreground">
        Styled browser-native select menus with grouped options.
      </p>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">Default</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-3">
          <div appNativeSelectWrapper class="w-64">
            <select
              appNativeSelect
              [value]="country()"
              (change)="country.set($any($event.target).value)"
            >
              <option appNativeSelectOption value="us">United States</option>
              <option appNativeSelectOption value="de">Germany</option>
              <option appNativeSelectOption value="jp">Japan</option>
            </select>
            <lucide-icon appNativeSelectIcon [img]="chevronDownIcon" />
          </div>
          <p class="text-xs text-muted-foreground">
            Selected: <span class="font-medium text-foreground">{{ country() }}</span>
          </p>
        </div>
      </section>

      <section>
        <div class="mb-3">
          <h2 class="text-sm font-medium text-muted-foreground">With Groups</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div appNativeSelectWrapper class="w-64" [size]="'sm'">
            <select
              appNativeSelect
              [size]="'sm'"
              [value]="timezone()"
              (change)="timezone.set($any($event.target).value)"
            >
              <optgroup appNativeSelectOptGroup label="Americas">
                <option appNativeSelectOption value="pst">Pacific (PST)</option>
                <option appNativeSelectOption value="est">Eastern (EST)</option>
              </optgroup>
              <optgroup appNativeSelectOptGroup label="Europe">
                <option appNativeSelectOption value="cet">Central Europe (CET)</option>
                <option appNativeSelectOption value="gmt">Greenwich (GMT)</option>
              </optgroup>
            </select>
            <lucide-icon appNativeSelectIcon [img]="chevronDownIcon" />
          </div>
        </div>
      </section>
    </div>
  `,
})
export class NativeSelectPreviewComponent {
  readonly chevronDownIcon = ChevronDown;
  readonly country = signal('us');
  readonly timezone = signal('pst');
}
