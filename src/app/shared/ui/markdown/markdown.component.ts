import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import type { PluggableList } from 'unified';
import type {
  AllowElement,
  AllowedTags,
  StreamMode,
  UrlTransform,
} from './models/markdown.models';
import { MarkdownNodeComponent } from './components/markdown-node.component';
import { MarkdownEngineService } from './services/markdown-engine.service';

@Component({
  selector: 'sd-markdown',
  imports: [MarkdownNodeComponent],
  template: `
    <section [class]="containerClass()" aria-live="polite" role="region">
      @if (blocks().length === 0) {
        <p aria-hidden="true" class="sd-empty"></p>
      } @else {
        @for (block of blocks(); track block.id) {
          <article class="sd-block">
            <sd-markdown-node [node]="block.root" />
          </article>
        }
      }
    </section>
  `,
  styleUrl: './markdown.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdMarkdownComponent {
  private readonly engine = inject(MarkdownEngineService);

  readonly content = input<string>('');
  readonly mode = input<StreamMode>('streaming');
  readonly parseIncompleteMarkdown = input(true);
  readonly skipHtml = input(false);
  readonly unwrapDisallowed = input(false);
  readonly className = input<string>('');

  readonly allowedElements = input<readonly string[] | undefined>(undefined);
  readonly disallowedElements = input<readonly string[] | undefined>(undefined);
  readonly allowElement = input<AllowElement | undefined>(undefined);
  readonly urlTransform = input<UrlTransform | undefined>(undefined);

  readonly allowedTags = input<AllowedTags | undefined>(undefined);
  readonly remarkPlugins = input<PluggableList | undefined>(undefined);
  readonly rehypePlugins = input<PluggableList | undefined>(undefined);

  readonly blocks = computed(() =>
    this.engine.renderBlocks(this.content(), {
      mode: this.mode(),
      parseIncompleteMarkdown: this.parseIncompleteMarkdown(),
      skipHtml: this.skipHtml(),
      unwrapDisallowed: this.unwrapDisallowed(),
      allowedElements: this.allowedElements(),
      disallowedElements: this.disallowedElements(),
      allowElement: this.allowElement(),
      urlTransform: this.urlTransform(),
      allowedTags: this.allowedTags(),
      remarkPlugins: this.remarkPlugins(),
      rehypePlugins: this.rehypePlugins(),
    })
  );

  readonly containerClass = computed(() => {
    const customClass = this.className().trim();
    return customClass ? `sd-root ${customClass}` : 'sd-root';
  });
}
