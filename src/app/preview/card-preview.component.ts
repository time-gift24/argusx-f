import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CardDirective,
  CardHeaderDirective,
  CardTitleDirective,
  CardDescriptionDirective,
  CardContentDirective,
  CardFooterDirective,
} from '../shared/ui/card';

@Component({
  selector: 'app-card-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardDirective,
    CardHeaderDirective,
    CardTitleDirective,
    CardDescriptionDirective,
    CardContentDirective,
    CardFooterDirective,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Card</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a card that contains information about a subject.
      </p>

      <!-- Basic Card -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Basic Card</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard>
              <div appCardHeader>
                <div appCardTitle>Card Title</div>
                <div appCardDescription>Card description text</div>
              </div>
              <div appCardContent>
                This is the card content. You can add any content here.
              </div>
              <div appCardFooter>
                <span class="text-xs text-muted-foreground">Card Footer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sizes -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="flex flex-wrap gap-4">
            <div appCard>
              <div appCardHeader>
                <div appCardTitle>Default Size</div>
                <div appCardDescription>Standard card size</div>
              </div>
              <div appCardContent>Content goes here</div>
            </div>
            <div appCard size="sm">
              <div appCardHeader>
                <div appCardTitle>Small Size</div>
                <div appCardDescription>Compact card</div>
              </div>
              <div appCardContent>Content</div>
            </div>
          </div>
        </div>
      </section>

      <!-- With Action -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Action</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard>
              <div appCardHeader>
                <div appCardTitle>Manage Subscription</div>
                <div appCardDescription>
                  You can manage or cancel your subscription at any time.
                </div>
              </div>
              <div appCardContent>
                <p class="text-sm text-muted-foreground">
                  Upgrade to Pro to unlock unlimited access to all features.
                </p>
              </div>
              <div appCardFooter>
                <button class="text-sm font-medium text-primary hover:underline">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CardPreviewComponent {}
