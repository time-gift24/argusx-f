import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ArgusxButtonDirective } from '@app/shared/ui/button';
import { LabelDirective } from '@app/shared/ui/label';
import { ArgusxTextareaDirective } from '@app/shared/ui/textarea';

@Component({
  selector: 'app-textarea-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArgusxTextareaDirective, LabelDirective, ArgusxButtonDirective],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Textarea</h1>
      <p class="mb-8 text-muted-foreground">
        Multi-line text input aligned with shadcn textarea-example, plus ArgusX plain extensions.
      </p>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Basic</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <textarea argusxTextarea placeholder="Type your message here."></textarea>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Invalid</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <textarea
              argusxTextarea
              aria-invalid="true"
              placeholder="Type your message here."
            ></textarea>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Label</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="grid w-full gap-3">
              <label appLabel for="textarea-preview-message">Message</label>
              <textarea
                id="textarea-preview-message"
                argusxTextarea
                placeholder="Type your message here."
              ></textarea>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">With Description</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="grid w-full gap-3">
              <label appLabel for="textarea-preview-description-message">Message</label>
              <textarea
                id="textarea-preview-description-message"
                argusxTextarea
                placeholder="Message"
              ></textarea>
              <p class="text-muted-foreground text-sm">
                Type your message and press enter to send.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Disabled</h2>
          </div>
          <div class="rounded-lg border border-dashed border-border p-6">
            <div class="grid w-full gap-3">
              <label appLabel for="textarea-preview-disabled-message">Message</label>
              <textarea
                id="textarea-preview-disabled-message"
                argusxTextarea
                disabled
                placeholder="Message"
              ></textarea>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">ArgusX Plain Extensions</h2>
          </div>
          <div class="space-y-3 rounded-lg border border-dashed border-border p-6">
            <textarea
              argusxTextarea
              [argusxSize]="'sm'"
              rows="3"
              placeholder="Small plain textarea"
            ></textarea>
            <textarea
              argusxTextarea
              [argusxSize]="'lg'"
              rows="4"
              [argusxStatus]="'success'"
              placeholder="Large + success state"
            ></textarea>
            <textarea
              argusxTextarea
              [argusxVariant]="'borderless'"
              [argusxStatus]="'warning'"
              rows="3"
              placeholder="Borderless + warning state"
            ></textarea>
          </div>
        </section>

        <section class="lg:col-span-2">
          <div class="mb-4">
            <h2 class="text-sm font-medium text-muted-foreground">Complex Combined Scenario</h2>
          </div>
          <div class="space-y-4 rounded-lg border border-dashed border-border p-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="grid gap-2">
                <label appLabel for="textarea-preview-support-note">Support note</label>
                <textarea
                  id="textarea-preview-support-note"
                  argusxTextarea
                  rows="6"
                  [argusxStatus]="supportNoteStatus()"
                  [value]="supportNote()"
                  aria-describedby="textarea-preview-support-note-help textarea-preview-support-note-count"
                  placeholder="Describe what happened..."
                  (input)="onSupportNoteInput($event)"
                ></textarea>
                <p id="textarea-preview-support-note-help" class="text-muted-foreground text-xs">
                  Add enough detail for triage and include expected behavior.
                </p>
                <p id="textarea-preview-support-note-count" class="text-muted-foreground text-xs">
                  {{ supportNoteCharacterCount() }}/320 characters
                </p>
              </div>

              <div class="grid gap-2">
                <label appLabel for="textarea-preview-internal-comment">Internal comment</label>
                <textarea
                  id="textarea-preview-internal-comment"
                  argusxTextarea
                  [argusxVariant]="'borderless'"
                  [argusxSize]="'sm'"
                  rows="6"
                  [value]="internalComment()"
                  placeholder="Private notes for reviewer..."
                  (input)="onInternalCommentInput($event)"
                ></textarea>
                <p class="text-muted-foreground text-xs">
                  This note is visible to workspace reviewers only.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap justify-end gap-2">
              <button argusx-button variant="outline" size="sm">Save Draft</button>
              <button
                argusx-button
                size="sm"
                [disabled]="supportNote().trim().length === 0"
              >
                Send Message
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class TextareaPreviewComponent {
  readonly supportNote = signal('The billing export crashes when selecting Q4 and CSV format.');
  readonly internalComment = signal('Escalate to analytics squad if reproducible on staging.');
  readonly supportNoteCharacterCount = computed(() => this.supportNote().length);
  readonly supportNoteStatus = computed(() => {
    const count = this.supportNoteCharacterCount();
    if (count >= 280) {
      return 'warning';
    }
    return 'default';
  });

  onSupportNoteInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement | null;
    this.supportNote.set(textareaElement?.value ?? '');
  }

  onInternalCommentInput(event: Event): void {
    const textareaElement = event.target as HTMLTextAreaElement | null;
    this.internalComment.set(textareaElement?.value ?? '');
  }
}
