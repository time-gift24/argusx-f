import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
} from '../shared/ui/accordion/accordion.component';
import { ButtonComponent } from '../shared/ui/button';
import {
  CardDirective,
  CardHeaderDirective,
  CardTitleDirective,
  CardDescriptionDirective,
  CardContentDirective,
} from '../shared/ui/card';

@Component({
  selector: 'app-accordion-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionTriggerComponent,
    AccordionContentComponent,
    ButtonComponent,
    CardDirective,
    CardHeaderDirective,
    CardTitleDirective,
    CardDescriptionDirective,
    CardContentDirective,
  ],
  template: `
    <div class="mx-auto w-full max-w-[800px] min-w-0 flex flex-col gap-6 pt-28 pb-6">
      <header class="space-y-2 px-1.5">
        <h1 class="text-2xl font-semibold tracking-tight">Accordion</h1>
        <p class="text-muted-foreground text-sm">
          A vertically stacked set of interactive headings that each reveal a section of content.
        </p>
      </header>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Basic</div>
        <div class="bg-background text-foreground w-full border border-dashed p-4 sm:p-6">
          <app-accordion type="single" [collapsible]="true" class="mx-auto w-full max-w-lg rounded-none border-0">
            <app-accordion-item value="item-1">
              <app-accordion-trigger>Is it accessible?</app-accordion-trigger>
              <app-accordion-content>
                <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item value="item-2">
              <app-accordion-trigger>Is it styled?</app-accordion-trigger>
              <app-accordion-content>
                <p>
                  Yes. It comes with default styles that matches the other components&apos;
                  aesthetic.
                </p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item value="item-3">
              <app-accordion-trigger>Is it animated?</app-accordion-trigger>
              <app-accordion-content>
                <p>Yes. It&apos;s animated by default, but you can disable it if you prefer.</p>
              </app-accordion-content>
            </app-accordion-item>
          </app-accordion>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">Multiple</div>
        <div class="bg-background text-foreground w-full border border-dashed p-4 sm:p-6">
          <app-accordion type="multiple" class="mx-auto w-full max-w-lg rounded-none border-0">
            <app-accordion-item value="item-1">
              <app-accordion-trigger>
                What are the key considerations when implementing a comprehensive
                enterprise-level authentication system?
              </app-accordion-trigger>
              <app-accordion-content>
                <p>
                  Implementing a robust enterprise authentication system requires careful
                  consideration of multiple factors. This includes secure password hashing and
                  storage, multi-factor authentication (MFA) implementation, session management,
                  OAuth2 and SSO integration, regular security audits, rate limiting to prevent
                  brute force attacks, and maintaining detailed audit logs. Additionally, you&apos;ll
                  need to consider scalability, performance impact, and compliance with relevant
                  data protection regulations such as GDPR or HIPAA.
                </p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item value="item-2">
              <app-accordion-trigger>
                How does modern distributed system architecture handle eventual consistency and data
                synchronization across multiple regions?
              </app-accordion-trigger>
              <app-accordion-content>
                <p>
                  Modern distributed systems employ various strategies to maintain data consistency
                  across regions. This often involves using techniques like CRDT (Conflict-Free
                  Replicated Data Types), vector clocks, and gossip protocols. Systems might
                  implement event sourcing patterns, utilize message queues for asynchronous updates,
                  and employ sophisticated conflict resolution strategies. Popular solutions like
                  Amazon&apos;s DynamoDB and Google&apos;s Spanner demonstrate different approaches to
                  solving these challenges, balancing between consistency, availability, and
                  partition tolerance as described in the CAP theorem.
                </p>
              </app-accordion-content>
            </app-accordion-item>
          </app-accordion>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Borders</div>
        <div class="bg-background text-foreground w-full border border-dashed p-4 sm:p-6">
          <app-accordion type="single" class="mx-auto w-full max-w-lg gap-2 rounded-none border-0">
            <app-accordion-item value="item-1" class="rounded-lg border">
              <app-accordion-trigger class="px-2.5 !py-5 font-medium">How does billing work?</app-accordion-trigger>
              <app-accordion-content class="px-2.5">
                <p>
                  We offer monthly and annual subscription plans. Billing is charged at the
                  beginning of each cycle, and you can cancel anytime. All plans include automatic
                  backups, 24/7 support, and unlimited team members. There are no hidden fees or
                  setup costs.
                </p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item value="item-2" class="rounded-lg border">
              <app-accordion-trigger class="px-2.5 !py-5 font-medium">Is my data secure?</app-accordion-trigger>
              <app-accordion-content class="px-2.5">
                <p>
                  Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular
                  third-party security audits. All data is encrypted at rest and in transit using
                  industry-standard protocols. We also offer optional two-factor authentication and
                  single sign-on for enterprise customers.
                </p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item value="item-3" class="rounded-lg border">
              <app-accordion-trigger class="px-2.5 !py-5 font-medium">
                What integrations do you support?
              </app-accordion-trigger>
              <app-accordion-content class="px-2.5">
                <p>
                  We integrate with 500+ popular tools including Slack, Zapier, Salesforce,
                  HubSpot, and more. You can also build custom integrations using our REST API and
                  webhooks. Our API documentation includes code examples in 10+ programming
                  languages.
                </p>
              </app-accordion-content>
            </app-accordion-item>
          </app-accordion>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">In Card</div>
        <div class="bg-background text-foreground w-full border border-dashed p-4 sm:p-6">
          <div appCard class="mx-auto w-full max-w-lg gap-4 rounded-none border-0">
            <div appCardHeader>
              <div appCardTitle>Subscription &amp; Billing</div>
              <div appCardDescription>
                Common questions about your account, plans, and payments
              </div>
            </div>
            <div appCardContent>
              <app-accordion type="single" [defaultValue]="'item-1'" class="w-full rounded-none border-0">
                <app-accordion-item value="item-1">
                  <app-accordion-trigger>What subscription plans do you offer?</app-accordion-trigger>
                  <app-accordion-content>
                    <p>
                      We offer three subscription tiers: Starter ($9/month), Professional
                      ($29/month), and Enterprise ($99/month). Each plan includes increasing storage
                      limits, API access, priority support, and team collaboration features.
                    </p>
                    <p>
                      <a href="#">Annual billing is available</a> with a 20% discount. All plans
                      include a 14-day free trial with no credit card required.
                    </p>
                    <button argus-button size="sm" class="mt-2">
                      View plans
                    </button>
                  </app-accordion-content>
                </app-accordion-item>
                <app-accordion-item value="item-2">
                  <app-accordion-trigger>How does billing work?</app-accordion-trigger>
                  <app-accordion-content>
                    <p>
                      Billing occurs automatically at the start of each billing cycle. We accept all
                      major credit cards, PayPal, and ACH transfers for enterprise customers.
                      You&apos;ll receive an invoice via email after each payment. You can update your
                      payment method or billing information anytime in your account settings. Failed
                      payments will trigger automated retry attempts and email notifications.
                    </p>
                  </app-accordion-content>
                </app-accordion-item>
                <app-accordion-item value="item-3">
                  <app-accordion-trigger>Can I upgrade or downgrade my plan?</app-accordion-trigger>
                  <app-accordion-content>
                    <p>
                      Yes, you can change your plan at any time. When upgrading, you&apos;ll be charged
                      a prorated amount for the remainder of your billing cycle and immediately gain
                      access to new features. When downgrading, the change takes effect at the end
                      of your current billing period, and you&apos;ll retain access to premium features
                      until then. No refunds are provided for downgrades.
                    </p>
                  </app-accordion-content>
                </app-accordion-item>
                <app-accordion-item value="item-4">
                  <app-accordion-trigger>How do I cancel my subscription?</app-accordion-trigger>
                  <app-accordion-content>
                    <p>
                      You can cancel your subscription anytime from your account settings. There are
                      no cancellation fees or penalties. Your access will continue until the end of
                      your current billing period. After cancellation, your data is retained for
                      30 days in case you want to reactivate. You can export all your data before or
                      after canceling. We&apos;d love to hear your feedback about why you&apos;re leaving.
                    </p>
                  </app-accordion-content>
                </app-accordion-item>
                <app-accordion-item value="item-5">
                  <app-accordion-trigger>What is your refund policy?</app-accordion-trigger>
                  <app-accordion-content>
                    <p>
                      We offer a 30-day money-back guarantee for new subscriptions. If you&apos;re not
                      satisfied within the first 30 days, contact our support team for a full refund.
                      After 30 days, we don&apos;t provide refunds for partial billing periods, but you
                      can cancel anytime to avoid future charges. Enterprise customers have custom
                      refund terms outlined in their contracts.
                    </p>
                  </app-accordion-content>
                </app-accordion-item>
              </app-accordion>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none">
        <div class="text-muted-foreground px-1.5 py-2 text-xs font-medium">With Disabled</div>
        <div class="bg-background text-foreground w-full border border-dashed p-4 sm:p-6">
          <app-accordion class="mx-auto w-full max-w-lg overflow-hidden">
            <app-accordion-item value="item-1" class="data-[state=open]:bg-muted/50 p-1">
              <app-accordion-trigger class="px-2.5">Can I access my account history?</app-accordion-trigger>
              <app-accordion-content class="px-2.5">
                <p>
                  Yes, you can view your complete account history including all transactions, plan
                  changes, and support tickets in the Account History section of your dashboard.
                </p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item
              value="item-2"
              [disabled]="true"
              class="data-[state=open]:bg-muted/50 p-1"
            >
              <app-accordion-trigger class="px-2.5">Premium feature information</app-accordion-trigger>
              <app-accordion-content class="px-2.5">
                <p>This feature is only available on enterprise and business plans.</p>
              </app-accordion-content>
            </app-accordion-item>
            <app-accordion-item value="item-3" class="data-[state=open]:bg-muted/50 p-1">
              <app-accordion-trigger class="px-2.5">How do I update my email address?</app-accordion-trigger>
              <app-accordion-content class="px-2.5">
                <p>
                  You can update your email address in your account settings. You&apos;ll receive a
                  verification email at your new address to confirm the change.
                </p>
              </app-accordion-content>
            </app-accordion-item>
          </app-accordion>
        </div>
      </section>
    </div>
  `,
})
export class AccordionPreviewComponent {}
