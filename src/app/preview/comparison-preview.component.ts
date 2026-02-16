import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputDirective } from '../../shared/ui/input';
import { TextareaComponent } from '../../shared/ui/textarea';

@Component({
  selector: 'app-comparison-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDirective, TextareaComponent],
  template: `
    <div class="mx-auto max-w-5xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Input & Textarea Comparison</h1>
      <p class="mb-8 text-muted-foreground">
        本地组件与 shadcn/ui 组件对比展示
      </p>

      <!-- Input Section -->
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold">Input 组件</h2>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Basic Types -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">Types</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-text">Text</label>
                <input appInput type="text" id="comp-text" placeholder="Enter your name" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-email">Email</label>
                <input appInput type="email" id="comp-email" placeholder="email@example.com" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-password">Password</label>
                <input appInput type="password" id="comp-password" placeholder="Enter password" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-tel">Telephone</label>
                <input appInput type="tel" id="comp-tel" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>

          <!-- States -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">States</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-disabled">Disabled</label>
                <input appInput type="text" id="comp-disabled" placeholder="Disabled" disabled />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-readonly">Readonly</label>
                <input appInput type="text" id="comp-readonly" value="Readonly value" readonly />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-error">Error (status="error")</label>
                <input appInput type="email" id="comp-error" placeholder="Invalid email" status="error" aria-invalid="true" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-warning">Warning (status="warning")</label>
                <input appInput type="text" id="comp-warning" placeholder="Warning state" status="warning" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-success">Success (status="success")</label>
                <input appInput type="text" id="comp-success" placeholder="Success state" status="success" />
              </div>
            </div>
          </div>

          <!-- Borderless -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">Borderless Mode</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-borderless">Borderless Input</label>
                <input appInput type="text" id="comp-borderless" placeholder="No border" [borderless]="true" />
              </div>
            </div>
          </div>

          <!-- Two Way Binding -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">Two Way Binding</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-binding">Bindable Input</label>
                <input appInput type="text" id="comp-binding" placeholder="Type something..." [(value)]="inputValue" />
                <p class="text-xs text-muted-foreground">Current value: {{ inputValue }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Textarea Section -->
      <section class="mb-12">
        <h2 class="mb-4 text-xl font-semibold">Textarea 组件</h2>

        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Basic -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">Basic</h3>
            <div class="space-y-4">
              <app-textarea placeholder="Type your message here."></app-textarea>
            </div>
          </div>

          <!-- With Label -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">With Label</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-1">Message</label>
                <app-textarea id="comp-textarea-1" placeholder="Type your message here."></app-textarea>
              </div>
            </div>
          </div>

          <!-- With Description -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">With Description</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-2">Message</label>
                <app-textarea id="comp-textarea-2" placeholder="Type your message here."></app-textarea>
                <p class="text-xs text-muted-foreground">Type your message and press enter to send.</p>
              </div>
            </div>
          </div>

          <!-- States -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">States</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-disabled">Disabled</label>
                <app-textarea id="comp-textarea-disabled" placeholder="Disabled" [disabled]="true"></app-textarea>
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-error">Error (status="error")</label>
                <app-textarea id="comp-textarea-error" placeholder="Error state" status="error" aria-invalid="true"></app-textarea>
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-warning">Warning (status="warning")</label>
                <app-textarea id="comp-textarea-warning" placeholder="Warning state" status="warning"></app-textarea>
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-success">Success (status="success")</label>
                <app-textarea id="comp-textarea-success" placeholder="Success state" status="success"></app-textarea>
              </div>
            </div>
          </div>

          <!-- Rows -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">Custom Rows</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-rows">3 Rows</label>
                <app-textarea id="comp-textarea-rows" [rows]="3" placeholder="3 rows"></app-textarea>
              </div>
            </div>
          </div>

          <!-- Two Way Binding -->
          <div class="rounded-lg border border-border p-6">
            <h3 class="mb-4 text-sm font-medium text-muted-foreground">Two Way Binding</h3>
            <div class="space-y-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium" for="comp-textarea-binding">Bindable Textarea</label>
                <app-textarea id="comp-textarea-binding" placeholder="Type something..." [(value)]="textareaValue"></app-textarea>
                <p class="text-xs text-muted-foreground">Current value: {{ textareaValue }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Comparison Summary -->
      <section>
        <h2 class="mb-4 text-xl font-semibold">对比总结</h2>
        <div class="rounded-lg border border-border p-6">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 font-medium">特性</th>
                <th class="text-left py-2 font-medium">shadcn/ui</th>
                <th class="text-left py-2 font-medium">本地实现</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="py-2">实现方式</td>
                <td class="py-2">纯 CSS 类</td>
                <td class="py-2">Angular Directive/Component + CVA</td>
              </tr>
              <tr class="border-b">
                <td class="py-2">双向绑定</td>
                <td class="py-2">无</td>
                <td class="py-2">model() 信号双向绑定</td>
              </tr>
              <tr class="border-b">
                <td class="py-2">状态管理</td>
                <td class="py-2">aria-invalid</td>
                <td class="py-2">status: default/error/warning/success</td>
              </tr>
              <tr class="border-b">
                <td class="py-2">变体支持</td>
                <td class="py-2">无</td>
                <td class="py-2">CVA 多变体</td>
              </tr>
              <tr class="border-b">
                <td class="py-2">data-slot</td>
                <td class="py-2">data-slot="input/textarea"</td>
                <td class="py-2">data-slot + data-status</td>
              </tr>
              <tr>
                <td class="py-2">A11y</td>
                <td class="py-2">aria-invalid</td>
                <td class="py-2">aria-invalid + aria-describedby</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class ComparisonPreviewComponent {
  inputValue = '';
  textareaValue = '';
}
