import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ArgusxCheckboxComponent, type ArgusxCheckboxCheckedState } from '@app/shared/ui/checkbox';

@Component({
  selector: 'app-checkbox-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxCheckboxComponent],
  template: `
    <div class="mx-auto max-w-4xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Checkbox</h1>
      <p class="mb-8 text-muted-foreground">
        Shadcn-aligned checkbox API with ArgusX plain-style extensions.
      </p>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">shadcn Baseline API</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-col gap-4">
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox
                id="baseline-terms"
                [checked]="agreeTerms()"
                (checkedChange)="agreeTerms.set($event)"
              />
              Accept terms and conditions
            </label>

            <div class="flex items-start gap-3">
              <argusx-checkbox id="baseline-default" [defaultChecked]="true" />
              <div class="grid gap-1.5">
                <label class="text-sm font-medium" for="baseline-default">
                  Enable account notifications
                </label>
                <p class="text-xs text-muted-foreground">
                  This row demonstrates uncontrolled usage via <code>defaultChecked</code>.
                </p>
              </div>
            </div>

            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="baseline-disabled" [disabled]="true" />
              Disabled option
            </label>

            <label
              class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 text-sm has-[[aria-checked=true]]:border-primary/40 has-[[aria-checked=true]]:bg-primary/10"
            >
              <argusx-checkbox
                id="baseline-custom"
                [defaultChecked]="true"
                class="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary/50"
              />
              Custom class override (theme token)
            </label>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Controlled + Form Semantics</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-4">
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox
                id="controlled-main"
                name="controlled-main"
                value="enabled"
                [required]="true"
                [checked]="controlledMain()"
                (checkedChange)="controlledMain.set($event)"
              />
              Required controlled checkbox
            </label>

            <div class="rounded-md border p-3">
              <p class="mb-2 text-xs text-muted-foreground">Task selections</p>
              <div class="grid gap-2">
                <label class="flex items-center gap-3 text-sm">
                  <argusx-checkbox
                    id="task-email"
                    name="tasks"
                    [checked]="isTaskSelected('email')"
                    (checkedChange)="onTaskToggle('email', $event)"
                  />
                  Email updates
                </label>
                <label class="flex items-center gap-3 text-sm">
                  <argusx-checkbox
                    id="task-push"
                    name="tasks"
                    [checked]="isTaskSelected('push')"
                    (checkedChange)="onTaskToggle('push', $event)"
                  />
                  Push updates
                </label>
                <label class="flex items-center gap-3 text-sm">
                  <argusx-checkbox
                    id="task-sms"
                    name="tasks"
                    [checked]="isTaskSelected('sms')"
                    (checkedChange)="onTaskToggle('sms', $event)"
                    [ariaInvalid]="taskSelectionCount() === 0"
                  />
                  SMS updates
                </label>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">
                Selected: {{ selectedTasksText() }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">ArgusX Plain Extensions</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-plain" [defaultChecked]="true" variant="plain" />
              variant = plain
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-destructive" [defaultChecked]="true" variant="destructive" />
              variant = destructive
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-default-size" [defaultChecked]="true" size="default" />
              size = default
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-lg-size" [defaultChecked]="true" size="lg" />
              size = lg
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-shape-default" [defaultChecked]="true" shape="default" />
              shape = default
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-shape-circle" [defaultChecked]="true" shape="circle" />
              shape = circle
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox id="ext-shape-square" [defaultChecked]="true" shape="square" />
              shape = square
            </label>
            <label class="flex items-center gap-3 text-sm">
              <argusx-checkbox
                id="ext-indeterminate"
                [checked]="'indeterminate'"
                ariaLabel="Indeterminate state"
              />
              checked = indeterminate
            </label>
          </div>
        </div>
      </section>

      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Complex Combination</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <label class="flex items-start gap-3 rounded-md border p-3">
            <argusx-checkbox
              id="complex-example"
              name="complex"
              value="critical"
              ariaLabel="Complex checkbox example"
              [required]="true"
              variant="destructive"
              size="lg"
              shape="circle"
              [checked]="complexState()"
              (checkedChange)="complexState.set($event)"
            />
            <div class="grid gap-1">
              <span class="text-sm font-medium">Critical alert subscription</span>
              <span class="text-xs text-muted-foreground">
                state={{ complexState() }}; variant=destructive; size=lg; shape=circle; required=true
              </span>
            </div>
          </label>
        </div>
      </section>
    </div>
  `,
})
export class CheckboxPreviewComponent {
  readonly agreeTerms = signal<ArgusxCheckboxCheckedState>(false);
  readonly controlledMain = signal<ArgusxCheckboxCheckedState>(true);
  readonly complexState = signal<ArgusxCheckboxCheckedState>('indeterminate');
  readonly selectedTasks = signal<string[]>(['email']);

  readonly taskSelectionCount = computed(() => this.selectedTasks().length);
  readonly selectedTasksText = computed(() => {
    const tasks = this.selectedTasks();
    return tasks.length > 0 ? tasks.join(', ') : 'none';
  });

  isTaskSelected(task: string): boolean {
    return this.selectedTasks().includes(task);
  }

  onTaskToggle(task: string, checked: ArgusxCheckboxCheckedState): void {
    this.selectedTasks.update((current) => {
      const hasTask = current.includes(task);

      if (checked === true && !hasTask) {
        return [...current, task];
      }

      if (checked !== true && hasTask) {
        return current.filter((item) => item !== task);
      }

      return current;
    });
  }
}
