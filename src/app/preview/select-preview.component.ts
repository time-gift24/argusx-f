import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  LucideAngularModule,
  ChartLineIcon,
  ChartBarIcon,
  ChartPieIcon,
  ChevronDownIcon,
} from 'lucide-angular';
import { ArgusxButtonDirective } from '../shared/ui/button';
import {
  DialogComponent,
  DialogContentComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../shared/ui/dialog';
import {
  FieldComponent,
  FieldDescriptionComponent,
  FieldErrorComponent,
  FieldLabelComponent,
} from '../shared/ui/field';
import { ArgusxInputDirective } from '../shared/ui/input';
import {
  NativeSelectDirective,
  NativeSelectIconDirective,
  NativeSelectOptionDirective,
  NativeSelectWrapperDirective,
} from '../shared/ui/native-select';
import {
  SelectComponent,
  SelectGroupComponent,
  SelectItemComponent,
  SelectLabelComponent,
  SelectSeparatorComponent,
  SelectValueComponent,
} from '../shared/ui/select';

interface NamedOption {
  value: string;
  label: string;
}

interface PlanOption {
  name: string;
  description: string;
}

@Component({
  selector: 'app-select-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SelectComponent,
    SelectGroupComponent,
    SelectItemComponent,
    SelectLabelComponent,
    SelectSeparatorComponent,
    SelectValueComponent,
    ArgusxButtonDirective,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
    FieldComponent,
    FieldLabelComponent,
    FieldDescriptionComponent,
    FieldErrorComponent,
    ArgusxInputDirective,
    NativeSelectWrapperDirective,
    NativeSelectDirective,
    NativeSelectOptionDirective,
    NativeSelectIconDirective,
    LucideAngularModule,
  ],
  template: `
    <div class="mx-auto w-full max-w-[980px] p-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Basic</h2>
          <app-select [(value)]="basicValue">
            <app-select-value>
              {{ optionLabel(fruits, basicValue(), 'Select a fruit') }}
            </app-select-value>
            <app-select-group>
              @for (fruit of fruits; track fruit.value) {
                <app-select-item [value]="fruit.value" [disabled]="fruit.value === 'grapes'">
                  {{ fruit.label }}
                </app-select-item>
              }
            </app-select-group>
          </app-select>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">With Icons</h2>
          <div class="flex flex-col gap-4">
            <app-select [(value)]="chartTypeSm" size="sm">
              <app-select-value class="flex items-center gap-1.5">
                <lucide-icon [img]="iconForChart(chartTypeSm())" class="size-3.5"></lucide-icon>
                {{ chartTypeSm() ? labelForChart(chartTypeSm()) : 'Chart Type' }}
              </app-select-value>
              <app-select-group>
                @for (chart of chartOptions; track chart.value) {
                  <app-select-item [value]="chart.value">
                    <lucide-icon [img]="iconForChart(chart.value)" class="size-3.5"></lucide-icon>
                    {{ chart.label }}
                  </app-select-item>
                }
              </app-select-group>
            </app-select>

            <app-select [(value)]="chartTypeDefault">
              <app-select-value class="flex items-center gap-1.5">
                <lucide-icon [img]="iconForChart(chartTypeDefault())" class="size-3.5"></lucide-icon>
                {{ chartTypeDefault() ? labelForChart(chartTypeDefault()) : 'Chart Type' }}
              </app-select-value>
              <app-select-group>
                @for (chart of chartOptions; track chart.value) {
                  <app-select-item [value]="chart.value">
                    <lucide-icon [img]="iconForChart(chart.value)" class="size-3.5"></lucide-icon>
                    {{ chart.label }}
                  </app-select-item>
                }
              </app-select-group>
            </app-select>
          </div>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">With Groups & Labels</h2>
          <app-select [(value)]="groupedValue">
            <app-select-value>
              {{ optionLabel(groupedOptions, groupedValue(), 'Select a fruit') }}
            </app-select-value>
            <app-select-group>
              <app-select-label>Fruits</app-select-label>
              @for (fruit of fruitsGroup; track fruit.value) {
                <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
              }
            </app-select-group>
            <app-select-separator></app-select-separator>
            <app-select-group>
              <app-select-label>Vegetables</app-select-label>
              @for (vegetable of vegetablesGroup; track vegetable.value) {
                <app-select-item [value]="vegetable.value">{{ vegetable.label }}</app-select-item>
              }
            </app-select-group>
          </app-select>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Large List</h2>
          <app-select [(value)]="largeListValue">
            <app-select-value>
              {{ optionLabel(largeListItems, largeListValue(), 'Select an item') }}
            </app-select-value>
            <app-select-group>
              @for (item of largeListItems; track item.value) {
                <app-select-item [value]="item.value">{{ item.label }}</app-select-item>
              }
            </app-select-group>
          </app-select>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Sizes</h2>
          <div class="flex flex-col gap-4">
            <app-select [(value)]="sizeSmallValue" size="sm">
              <app-select-value>
                {{ optionLabel(fruitsGroup, sizeSmallValue(), 'Small size') }}
              </app-select-value>
              <app-select-group>
                @for (fruit of fruitsGroup; track fruit.value) {
                  <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                }
              </app-select-group>
            </app-select>

            <app-select [(value)]="sizeDefaultValue">
              <app-select-value>
                {{ optionLabel(fruitsGroup, sizeDefaultValue(), 'Default size') }}
              </app-select-value>
              <app-select-group>
                @for (fruit of fruitsGroup; track fruit.value) {
                  <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                }
              </app-select-group>
            </app-select>
          </div>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Subscription Plan</h2>
          <app-select [(value)]="planValue" [class]="'h-auto! w-72'">
            <app-select-value>
              <div class="w-full">
                <div class="text-xs font-medium leading-snug">{{ selectedPlan().name }}</div>
                <div class="text-muted-foreground text-xs/relaxed">{{ selectedPlan().description }}</div>
              </div>
            </app-select-value>
            <app-select-group>
              @for (plan of plans; track plan.name) {
                <app-select-item [value]="plan.name">
                  <div class="w-full">
                    <div class="text-xs font-medium leading-snug">{{ plan.name }}</div>
                    <div class="text-muted-foreground text-xs/relaxed">{{ plan.description }}</div>
                  </div>
                </app-select-item>
              }
            </app-select-group>
          </app-select>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">With Button</h2>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <app-select [(value)]="withButtonSmallValue" size="sm">
                <app-select-value>
                  {{ optionLabel(fruitsGroup, withButtonSmallValue(), 'Small') }}
                </app-select-value>
                <app-select-group>
                  @for (fruit of fruitsGroup; track fruit.value) {
                    <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                  }
                </app-select-group>
              </app-select>
              <button argusx-button variant="outline" size="sm">Submit</button>
            </div>

            <div class="flex items-center gap-2">
              <app-select [(value)]="withButtonDefaultValue">
                <app-select-value>
                  {{ optionLabel(fruitsGroup, withButtonDefaultValue(), 'Default') }}
                </app-select-value>
                <app-select-group>
                  @for (fruit of fruitsGroup; track fruit.value) {
                    <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                  }
                </app-select-group>
              </app-select>
              <button argusx-button variant="outline">Submit</button>
            </div>
          </div>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Popper</h2>
          <app-select [(value)]="popperValue" position="popper">
            <app-select-value>
              {{ optionLabel(fruits, popperValue(), 'Select a fruit') }}
            </app-select-value>
            <app-select-group>
              @for (fruit of fruits; track fruit.value) {
                <app-select-item [value]="fruit.value" [disabled]="fruit.value === 'grapes'">
                  {{ fruit.label }}
                </app-select-item>
              }
            </app-select-group>
          </app-select>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">With Field</h2>
          <app-field>
            <app-field-label>Favorite Fruit</app-field-label>
            <app-select [(value)]="fieldValue">
              <app-select-value>
                {{ optionLabel(fruits, fieldValue(), 'Select a fruit') }}
              </app-select-value>
              <app-select-group>
                @for (fruit of fruits; track fruit.value) {
                  <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                }
              </app-select-group>
            </app-select>
            <app-field-description>
              Choose your favorite fruit from the list.
            </app-field-description>
          </app-field>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Invalid</h2>
          <div class="flex flex-col gap-4">
            <app-select [(value)]="invalidLooseValue" [invalid]="true">
              <app-select-value>
                {{ optionLabel(fruits, invalidLooseValue(), 'Select a fruit') }}
              </app-select-value>
              <app-select-group>
                @for (fruit of fruits; track fruit.value) {
                  <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                }
              </app-select-group>
            </app-select>

            <app-field [attr.data-invalid]="true">
              <app-field-label>Favorite Fruit</app-field-label>
              <app-select [(value)]="invalidFieldValue" [invalid]="true">
                <app-select-value>
                  {{ optionLabel(fruits, invalidFieldValue(), 'Select a fruit') }}
                </app-select-value>
                <app-select-group>
                  @for (fruit of fruits; track fruit.value) {
                    <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                  }
                </app-select-group>
              </app-select>
              <app-field-error [errors]="invalidErrors"></app-field-error>
            </app-field>
          </div>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Inline with Input & NativeSelect</h2>
          <div class="flex items-center gap-2">
            <input argusxInput placeholder="Search..." class="flex-1" />
            <app-select [(value)]="inlineFilterValue" [class]="'w-[140px]'">
              <app-select-value>
                {{ optionLabel(inlineFilters, inlineFilterValue(), 'Filter') }}
              </app-select-value>
              <app-select-group>
                @for (filter of inlineFilters; track filter.value) {
                  <app-select-item [value]="filter.value">{{ filter.label }}</app-select-item>
                }
              </app-select-group>
            </app-select>
            <div appNativeSelectWrapper class="w-[140px]">
              <select appNativeSelect>
                <option appNativeSelectOption value="">Sort by</option>
                <option appNativeSelectOption value="name">Name</option>
                <option appNativeSelectOption value="date">Date</option>
                <option appNativeSelectOption value="status">Status</option>
              </select>
              <lucide-icon [img]="chevronDownIcon" appNativeSelectIcon></lucide-icon>
            </div>
          </div>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">Disabled</h2>
          <app-select [(value)]="disabledValue" [disabled]="true">
            <app-select-value>
              {{ optionLabel(fruits, disabledValue(), 'Disabled') }}
            </app-select-value>
            <app-select-group>
              @for (fruit of fruits; track fruit.value) {
                <app-select-item [value]="fruit.value" [disabled]="fruit.value === 'grapes'">
                  {{ fruit.label }}
                </app-select-item>
              }
            </app-select-group>
          </app-select>
        </section>

        <section class="space-y-2 rounded-md border border-dashed p-4">
          <h2 class="text-muted-foreground text-xs">In Dialog</h2>
          <button argusx-button variant="outline" (click)="dialogOpen.set(true)">Open Dialog</button>

          @if (dialogOpen()) {
            <div argus-dialog [(open)]="dialogOpen">
              <div argus-dialog-content>
                <div argus-dialog-header>
                  <h3 argus-dialog-title>Select Example</h3>
                  <p argus-dialog-description>Use the select below to choose a fruit.</p>
                </div>
                <app-select [(value)]="dialogValue">
                  <app-select-value>
                    {{ optionLabel(fruits, dialogValue(), 'Select a fruit') }}
                  </app-select-value>
                  <app-select-group>
                    @for (fruit of fruits; track fruit.value) {
                      <app-select-item [value]="fruit.value">{{ fruit.label }}</app-select-item>
                    }
                  </app-select-group>
                </app-select>
              </div>
            </div>
          }
        </section>
      </div>
    </div>
  `,
})
export class SelectPreviewComponent {
  readonly chartLineIcon = ChartLineIcon;
  readonly chartBarIcon = ChartBarIcon;
  readonly chartPieIcon = ChartPieIcon;
  readonly chevronDownIcon = ChevronDownIcon;

  readonly fruits: ReadonlyArray<NamedOption> = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
  ];

  readonly fruitsGroup: ReadonlyArray<NamedOption> = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
  ];

  readonly vegetablesGroup: ReadonlyArray<NamedOption> = [
    { value: 'carrot', label: 'Carrot' },
    { value: 'broccoli', label: 'Broccoli' },
    { value: 'spinach', label: 'Spinach' },
  ];
  readonly groupedOptions: ReadonlyArray<NamedOption> = [
    ...this.fruitsGroup,
    ...this.vegetablesGroup,
  ];

  readonly chartOptions: ReadonlyArray<NamedOption> = [
    { value: 'line', label: 'Line' },
    { value: 'bar', label: 'Bar' },
    { value: 'pie', label: 'Pie' },
  ];

  readonly inlineFilters: ReadonlyArray<NamedOption> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  readonly plans: ReadonlyArray<PlanOption> = [
    { name: 'Starter', description: 'Perfect for individuals getting started.' },
    { name: 'Professional', description: 'Ideal for growing teams and businesses.' },
    { name: 'Enterprise', description: 'Advanced features for large organizations.' },
  ];

  readonly largeListItems: ReadonlyArray<NamedOption> = Array.from(
    { length: 100 },
    (_, index) => ({ value: `item-${index}`, label: `Item ${index}` })
  );

  readonly invalidErrors = [{ message: 'Please select a valid fruit.' }];

  readonly basicValue = signal<string | undefined>(undefined);
  readonly chartTypeSm = signal<string | undefined>(undefined);
  readonly chartTypeDefault = signal<string | undefined>(undefined);
  readonly groupedValue = signal<string | undefined>(undefined);
  readonly largeListValue = signal<string | undefined>(undefined);
  readonly sizeSmallValue = signal<string | undefined>(undefined);
  readonly sizeDefaultValue = signal<string | undefined>(undefined);
  readonly planValue = signal<string>('Starter');
  readonly withButtonSmallValue = signal<string | undefined>(undefined);
  readonly withButtonDefaultValue = signal<string | undefined>(undefined);
  readonly popperValue = signal<string | undefined>(undefined);
  readonly fieldValue = signal<string | undefined>(undefined);
  readonly invalidLooseValue = signal<string | undefined>(undefined);
  readonly invalidFieldValue = signal<string | undefined>(undefined);
  readonly inlineFilterValue = signal<string | undefined>(undefined);
  readonly disabledValue = signal<string | undefined>(undefined);
  readonly dialogValue = signal<string | undefined>(undefined);
  readonly dialogOpen = signal(false);

  readonly selectedPlan = computed(
    () => this.plans.find((plan) => plan.name === this.planValue()) ?? this.plans[0]
  );

  optionLabel(
    options: ReadonlyArray<NamedOption>,
    value: string | undefined,
    placeholder: string
  ): string {
    if (!value) {
      return placeholder;
    }
    return options.find((option) => option.value === value)?.label ?? placeholder;
  }

  iconForChart(value: string | undefined) {
    if (value === 'bar') {
      return this.chartBarIcon;
    }
    if (value === 'pie') {
      return this.chartPieIcon;
    }
    return this.chartLineIcon;
  }

  labelForChart(value: string | undefined): string {
    if (value === 'bar') {
      return 'Bar';
    }
    if (value === 'pie') {
      return 'Pie';
    }
    return 'Line';
  }
}
