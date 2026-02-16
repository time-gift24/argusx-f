import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CardDirective,
  CardHeaderDirective,
  CardTitleDirective,
  CardDescriptionDirective,
  CardActionDirective,
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
    CardActionDirective,
    CardContentDirective,
    CardFooterDirective,
  ],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Card</h1>
      <p class="mb-8 text-muted-foreground">
        Displays a card that contains information about a subject. Aligns with shadcn/ui Card component.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Basic Card -->
      <section>
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
      <section>
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

      <!-- Header with Border -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Header with Border</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard>
              <div appCardHeader class="border-b pb-4">
                <div appCardTitle>Header with Border</div>
                <div appCardDescription>
                  This is a card with a header that has a bottom border.
                </div>
              </div>
              <div appCardContent>
                <p class="text-sm text-muted-foreground">
                  The header has a border-b class applied, creating a visual separation between the header and content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer with Border -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Footer with Border</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard>
              <div appCardContent>
                <p class="text-sm text-muted-foreground">
                  The footer has a border-t class applied, creating a visual separation between the content and footer.
                </p>
              </div>
              <div appCardFooter class="border-t pt-4">
                <span class="text-xs text-muted-foreground">Footer with Border</span>
              </div>
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
                <div appCardTitle>Meeting Notes</div>
                <div appCardDescription>
                  Transcript from the meeting with the client.
                </div>
                <div appCardAction>
                  <button class="text-sm text-muted-foreground hover:text-foreground">
                    Transcribe
                  </button>
                </div>
              </div>
              <div appCardContent>
                <p class="text-sm text-muted-foreground">
                  Client requested dashboard redesign with focus on mobile responsiveness.
                </p>
              </div>
              <div appCardFooter>
                <span class="text-xs text-muted-foreground">+8 participants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- With Image -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Image</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard class="pt-0 relative">
              <div class="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=800&auto=format&fit=crop"
                  alt="Beautiful Landscape"
                  class="h-full w-full object-cover brightness-60 grayscale"
                />
              </div>
              <div appCardHeader class="relative z-10">
                <div appCardTitle class="text-white">Beautiful Landscape</div>
                <div appCardDescription class="text-gray-200">
                  A stunning view that captures the essence of natural beauty.
                </div>
              </div>
              <div appCardFooter class="relative z-10">
                <button class="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- With Image (Small) -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">With Image (Small)</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard size="sm" class="pt-0 relative">
              <div class="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=800&auto=format&fit=crop"
                  alt="Beautiful Landscape"
                  class="h-full w-full object-cover brightness-60 grayscale"
                />
              </div>
              <div appCardHeader class="relative z-10">
                <div appCardTitle class="text-white">Beautiful Landscape</div>
                <div appCardDescription class="text-gray-200">
                  A stunning view that captures the essence of natural beauty.
                </div>
              </div>
              <div appCardFooter class="relative z-10">
                <button class="w-full rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Login Form Example -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Login Form</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <div class="max-w-sm">
            <div appCard>
              <div appCardHeader>
                <div appCardTitle>Login to your account</div>
                <div appCardDescription>
                  Enter your email below to login to your account
                </div>
              </div>
              <div appCardContent>
                <div class="flex flex-col gap-3">
                  <label class="text-sm font-medium" for="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label class="text-sm font-medium" for="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div appCardFooter class="flex-col gap-2">
                <button class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Login
                </button>
                <button class="w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  `,
})
export class CardPreviewComponent {}
