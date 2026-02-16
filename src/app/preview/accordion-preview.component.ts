import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
} from '../shared/ui/accordion/accordion.component';

@Component({
  selector: 'app-accordion-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Accordion</h1>
      <p class="mb-8 text-muted-foreground">
        A vertically stacked set of interactive headings that each reveal a section of content.
      </p>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">Single (Default)</h2>
        <app-accordion type="single" [defaultValue]="'item-1'">
          <app-accordion-item value="item-1">
            <app-accordion-trigger>Is it accessible?</app-accordion-trigger>
            <app-accordion-content>
              Yes. It adheres to the WAI-ARIA design pattern for accordions.
            </app-accordion-content>
          </app-accordion-item>
          <app-accordion-item value="item-2">
            <app-accordion-trigger>Is it customizable?</app-accordion-trigger>
            <app-accordion-content>
              Yes. You can customize the styling using Tailwind CSS classes and CSS variables.
            </app-accordion-content>
          </app-accordion-item>
          <app-accordion-item value="item-3">
            <app-accordion-trigger>Is it animated?</app-accordion-trigger>
            <app-accordion-content>
              Yes. It uses CSS grid animation for smooth expand/collapse transitions.
            </app-accordion-content>
          </app-accordion-item>
        </app-accordion>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">Multiple</h2>
        <app-accordion type="multiple" [defaultValue]="['item-1', 'item-2']">
          <app-accordion-item value="item-1">
            <app-accordion-trigger>Can I open multiple items?</app-accordion-trigger>
            <app-accordion-content>
              Yes. Set type to "multiple" to allow multiple items to be open simultaneously.
            </app-accordion-content>
          </app-accordion-item>
          <app-accordion-item value="item-2">
            <app-accordion-trigger>Can I collapse all?</app-accordion-trigger>
            <app-accordion-content>
              Yes. With collapsible enabled (default), you can collapse all items.
            </app-accordion-content>
          </app-accordion-item>
          <app-accordion-item value="item-3">
            <app-accordion-trigger>What about the third?</app-accordion-trigger>
            <app-accordion-content>
              This is the third item. You can have as many as you need.
            </app-accordion-content>
          </app-accordion-item>
        </app-accordion>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">With Disabled Item</h2>
        <app-accordion type="single" [defaultValue]="'item-1'">
          <app-accordion-item value="item-1">
            <app-accordion-trigger>Enabled Item</app-accordion-trigger>
            <app-accordion-content>
              This item is enabled and can be toggled.
            </app-accordion-content>
          </app-accordion-item>
          <app-accordion-item value="item-2" [disabled]="true">
            <app-accordion-trigger>Disabled Item</app-accordion-trigger>
            <app-accordion-content>
              This content will not be accessible because the item is disabled.
            </app-accordion-content>
          </app-accordion-item>
          <app-accordion-item value="item-3">
            <app-accordion-trigger>Another Enabled Item</app-accordion-trigger>
            <app-accordion-content>
              This item is also enabled and can be toggled.
            </app-accordion-content>
          </app-accordion-item>
        </app-accordion>
      </section>

      <section class="mb-8">
        <h2 class="mb-4 text-lg font-medium">Implementation Notes</h2>
        <div class="rounded-lg border border-border bg-card p-4">
          <ul class="list-disc pl-4 text-sm text-muted-foreground space-y-1">
            <li>Uses AccordionRootDirective for state management</li>
            <li>OnPush change detection for performance</li>
            <li>Full ARIA support (aria-expanded, role="region")</li>
            <li>CSS Grid animation for smooth transitions</li>
            <li>Supports disabled items</li>
            <li>Based on comparison, local implementation is recommended</li>
          </ul>
        </div>
      </section>
    </div>
  `,
})
export class AccordionPreviewComponent {}
