import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Captions, LucideAngularModule, Plus } from 'lucide-angular';

import {
  AvatarComponent,
  AvatarGroupComponent,
  AvatarGroupCountComponent,
  AvatarImageDirective,
} from '../shared/ui/avatar';
import { ArgusxButtonDirective } from '../shared/ui/button';
import { ArgusxCardActionDirective, ArgusxCardComponent } from '../shared/ui/card';
import { ArgusxInputDirective } from '../shared/ui/input';
import { LabelDirective } from '../shared/ui/label';

@Component({
  selector: 'app-card-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxCardComponent,
    ArgusxCardActionDirective,
    ArgusxButtonDirective,
    ArgusxInputDirective,
    LabelDirective,
    AvatarComponent,
    AvatarGroupComponent,
    AvatarGroupCountComponent,
    AvatarImageDirective,
    LucideAngularModule,
  ],
  template: `
    <div data-slot="example-wrapper" class="mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl">
      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Default Size</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card class="w-full" title="Default Card" description="This card uses the default size variant.">
            <p>The card component supports a size prop that defaults to "default" for standard spacing and sizing.</p>
            <div card-footer class="w-full">
              <button argusx-button variant="outline" size="default" class="w-full">Action</button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Small Size</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="w-full"
            size="sm"
            title="Small Card"
            description="This card uses the small size variant."
          >
            <p>The card component supports a size prop that can be set to "sm" for a more compact appearance.</p>
            <div card-footer class="w-full">
              <button argusx-button variant="outline" size="sm" class="w-full">Action</button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Large Size</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="w-full"
            size="lg"
            title="Large Card"
            description="This card uses the large size variant."
          >
            <p>The card component supports a size prop that can be set to "lg" for a spacious appearance.</p>
            <div card-footer class="w-full">
              <button argusx-button variant="outline" size="default" class="w-full">Action</button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Header with Border</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="w-full"
            [headerBorder]="true"
            title="Header with Border"
            description="This is a card with a header that has a bottom border."
          >
            <p>The header border creates a visual separation between the header and content sections.</p>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Footer with Border</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card class="w-full" [footerBorder]="true">
            <p>The footer border creates a visual separation between the content and footer sections.</p>
            <div card-footer class="w-full">
              <button argusx-button variant="outline" size="default" class="w-full">Footer with Border</button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Header with Border (Small)</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="w-full"
            size="sm"
            [headerBorder]="true"
            title="Header with Border"
            description="This is a small card with a header that has a bottom border."
          >
            <p>The header border creates a visual separation between the header and content sections.</p>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Footer with Border (Small)</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card class="w-full" size="sm" [footerBorder]="true">
            <p>The footer border creates a visual separation between the content and footer sections.</p>
            <div card-footer class="w-full">
              <button argusx-button variant="outline" size="sm" class="w-full">Footer with Border</button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Image</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="relative w-full"
            title="Beautiful Landscape"
            description="A stunning view that captures the essence of natural beauty."
          >
            <div class="relative">
              <div class="bg-primary pointer-events-none absolute inset-0 z-30 opacity-50 mix-blend-color"></div>
              <img
                src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Photo by mymind on Unsplash"
                title="Photo by mymind on Unsplash"
                class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
              />
            </div>
            <div card-footer class="w-full">
              <button argusx-button variant="default" size="default" class="w-full">
                <lucide-icon [img]="plusIcon" class="size-3.5" data-icon="inline-start"></lucide-icon>
                Button
              </button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Image (Small)</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="relative w-full"
            size="sm"
            title="Beautiful Landscape"
            description="A stunning view that captures the essence of natural beauty."
          >
            <div class="relative">
              <div class="bg-primary pointer-events-none absolute inset-0 z-30 opacity-50 mix-blend-color"></div>
              <img
                src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Photo by mymind on Unsplash"
                title="Photo by mymind on Unsplash"
                class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
              />
            </div>
            <div card-footer class="w-full">
              <button argusx-button variant="default" size="sm" class="w-full">
                <lucide-icon [img]="plusIcon" class="size-3" data-icon="inline-start"></lucide-icon>
                Button
              </button>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Login</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card
            class="w-full"
            title="Login to your account"
            description="Enter your email below to login to your account"
          >
            <form>
              <div class="flex w-full flex-col gap-6">
                <div class="grid gap-2">
                  <label appLabel for="email" class="items-center">Email</label>
                  <input
                    argusxInput
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    class="h-7 rounded-md px-2 py-0.5 text-xs/relaxed md:text-xs/relaxed"
                    required
                  />
                </div>
                <div class="grid gap-2">
                  <div class="flex items-center">
                    <label appLabel for="password" class="items-center">Password</label>
                    <a href="#" class="ml-auto inline-block underline-offset-4 hover:underline">Forgot your password?</a>
                  </div>
                  <input
                    argusxInput
                    id="password"
                    type="password"
                    class="h-7 rounded-md px-2 py-0.5 text-xs/relaxed md:text-xs/relaxed"
                    required
                  />
                </div>
              </div>
            </form>
            <div card-footer class="mt-2 w-full items-stretch gap-2">
              <button argusx-button variant="default" size="default" class="w-full" type="submit">Login</button>
              <button argusx-button variant="outline" size="default" class="w-full">Login with Google</button>
              <div class="mt-4 text-center">Don't have an account? <a href="#" class="underline underline-offset-4">Sign up</a></div>
            </div>
          </argusx-card>
        </div>
      </div>

      <div data-slot="example" class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Meeting Notes</div>
        <div data-slot="example-content" class="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6">
          <argusx-card class="w-full" title="Meeting Notes" description="Transcript from the meeting with the client." size="lg">
            <button card-action argusx-button variant="outline" size="sm">
              <lucide-icon [img]="captionsIcon" class="size-3" data-icon="inline-start"></lucide-icon>
              Transcribe
            </button>
            <p>Client requested dashboard redesign with focus on mobile responsiveness.</p>
            <ol class="mt-4 flex list-decimal flex-col gap-2 pl-6">
              <li>New analytics widgets for daily/weekly metrics</li>
              <li>Simplified navigation menu</li>
              <li>Dark mode support</li>
              <li>Timeline: 6 weeks</li>
              <li>Follow-up meeting scheduled for next Tuesday</li>
            </ol>
            <div card-footer class="w-full items-start">
              <app-avatar-group>
                <app-avatar>
                  <img appAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                </app-avatar>
                <app-avatar>
                  <img appAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                </app-avatar>
                <app-avatar>
                  <img appAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                </app-avatar>
                <app-avatar-group-count>+8</app-avatar-group-count>
              </app-avatar-group>
            </div>
          </argusx-card>
        </div>
      </div>
    </div>
  `,
})
export class CardPreviewComponent {
  protected readonly plusIcon = Plus;
  protected readonly captionsIcon = Captions;
}
