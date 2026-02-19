import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ArgusxTypographyBlockquoteDirective,
  ArgusxTypographyCodeDirective,
  ArgusxTypographyH1Directive,
  ArgusxTypographyH2Directive,
  ArgusxTypographyH3Directive,
  ArgusxTypographyH4Directive,
  ArgusxTypographyLargeDirective,
  ArgusxTypographyLeadDirective,
  ArgusxTypographyListDirective,
  ArgusxTypographyMutedDirective,
  ArgusxTypographyPDirective,
  ArgusxTypographySmallDirective,
} from '@app/shared/ui/typography';

@Component({
  selector: 'app-typography-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ArgusxTypographyH1Directive,
    ArgusxTypographyH2Directive,
    ArgusxTypographyH3Directive,
    ArgusxTypographyH4Directive,
    ArgusxTypographyPDirective,
    ArgusxTypographyBlockquoteDirective,
    ArgusxTypographyCodeDirective,
    ArgusxTypographyLeadDirective,
    ArgusxTypographyLargeDirective,
    ArgusxTypographySmallDirective,
    ArgusxTypographyMutedDirective,
    ArgusxTypographyListDirective,
  ],
  template: `
    <div class="mx-auto max-w-3xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Typography</h1>
      <p class="mb-8 text-muted-foreground">
        Typography styles based on shadcn's official preset.
      </p>

      <!-- Headings -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Headings</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <h1 argusxTypographyH1>The Joke Tax Chronicles</h1>
          <h2 argusxTypographyH2>The King's Plan</h2>
          <h3 argusxTypographyH3>The Joke Tax</h3>
          <h4 argusxTypographyH4>A Far-off Land</h4>
        </div>
      </section>

      <!-- Paragraphs -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Paragraphs</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <p argusxTypographyP>
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne. One day, his advisors came to him
            with a problem: the kingdom was running out of money.
          </p>
          <p argusxTypographyLead>
            This is a lead paragraph - used for introductory content that stands out.
          </p>
          <p argusxTypographyMuted>
            This is muted text - used for secondary or less important information.
          </p>
        </div>
      </section>

      <!-- Text Sizes -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Text Sizes</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <div argusxTypographyLarge>Large Text</div>
          <div>Default text size</div>
          <small argusxTypographySmall>Small Text</small>
        </div>
      </section>

      <!-- Inline Text -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Inline Text</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <p>
            Use <code argusxTypographyCode>npm install</code> to install dependencies.
            You can also use <code argusxTypographyCode>yarn add</code> or
            <code argusxTypographyCode>pnpm install</code>.
          </p>
        </div>
      </section>

      <!-- Blockquote -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Blockquote</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <blockquote argusxTypographyBlockquote>
            "After all," he said, "everyone enjoys a good joke, so
            it's only fair that they should pay for the privilege."
          </blockquote>
        </div>
      </section>

      <!-- Lists -->
      <section class="mb-8">
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Lists</h2>
        </div>
        <div class="rounded-lg border border-dashed border-border p-6">
          <ul argusxTypographyList>
            <li>First level of puns: 5 gold coins</li>
            <li>Second level of jokes: 10 gold coins</li>
            <li>Third level of one-liners: 20 gold coins</li>
          </ul>
        </div>
      </section>

      <!-- Combined Scenario -->
      <section>
        <div class="mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">Combined Scenario - Demo Article</h2>
        </div>
        <article class="rounded-lg border border-dashed border-border p-6 space-y-4">
          <h1 argusxTypographyH1>Taxing Laughter: The Joke Tax Chronicles</h1>
          <p argusxTypographyLead>
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne.
          </p>
          <h2 argusxTypographyH2>The King's Plan</h2>
          <p argusxTypographyP>
            The king thought long and hard, and finally came up with a brilliant plan:
            he would tax the jokes in the kingdom.
          </p>
          <blockquote argusxTypographyBlockquote>
            "After all," he said, "everyone enjoys a good joke, so
            it's only fair that they should pay for the privilege."
          </blockquote>
          <h3 argusxTypographyH3>The Joke Tax</h3>
          <p argusxTypographyP>
            The king's subjects were not amused. They grumbled and complained,
            but the king was firm:
          </p>
          <ul argusxTypographyList>
            <li>1st level of puns: 5 gold coins</li>
            <li>2nd level of jokes: 10 gold coins</li>
            <li>3rd level of one-liners: 20 gold coins</li>
          </ul>
          <p argusxTypographyP>
            As a result, people stopped telling jokes, and the kingdom fell into a
            gloom. But there was one person who refused to let the king's
            foolishness get him down: a court jester named Jokester.
          </p>
          <p argusxTypographyMuted>
            The moral of the story is: never underestimate the power of a good laugh
            and always be careful of bad ideas.
          </p>
        </article>
      </section>
    </div>
  `,
})
export class TypographyPreviewComponent {}
