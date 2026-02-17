import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  signal,
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
import {
  createStreamUpdateCoalescer,
  StreamUpdateCoalescer,
} from './services/stream-update-coalescer';

type AutoScrollTarget = 'nearest' | 'self';

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
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private cachedScrollContainer: HTMLElement | null = null;
  private previousContentLength = 0;
  private previousAutoScrollTarget: AutoScrollTarget | null = null;
  private streamCoalescer: StreamUpdateCoalescer | null = null;
  private coalescerThrottleMs = -1;
  private coalescerDebounceMs = -1;
  private readonly renderedContent = signal('');

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
  readonly autoScroll = input(false);
  readonly autoScrollBehavior = input<ScrollBehavior>('auto');
  readonly autoScrollTarget = input<AutoScrollTarget>('nearest');
  readonly streamThrottleMs = input(120);
  readonly streamDebounceMs = input(24);

  readonly blocks = computed(() =>
    this.engine.renderBlocks(this.renderedContent(), {
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

  constructor() {
    effect(() => {
      const mode = this.mode();
      const content = this.content();

      if (mode !== 'streaming') {
        this.destroyStreamCoalescer();
        this.renderedContent.set(content);
        return;
      }

      const coalescer = this.getOrCreateStreamCoalescer(
        this.streamThrottleMs(),
        this.streamDebounceMs()
      );
      coalescer.push(content);
    });

    afterEveryRender({
      write: () => {
        this.handleAutoScrollAfterRender();
      },
    });

    this.destroyRef.onDestroy(() => {
      this.destroyStreamCoalescer();
    });
  }

  private handleAutoScrollAfterRender(): void {
    const target = this.autoScrollTarget();
    if (this.previousAutoScrollTarget !== target) {
      this.cachedScrollContainer = null;
      this.previousAutoScrollTarget = target;
    }

    const contentLength = this.renderedContent().length;
    const hasNewContent = contentLength > this.previousContentLength;
    this.previousContentLength = contentLength;

    if (
      !this.autoScroll() ||
      this.mode() !== 'streaming' ||
      contentLength === 0 ||
      !hasNewContent
    ) {
      return;
    }

    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const scrollContainer = this.resolveScrollContainer();
    if (!scrollContainer) {
      return;
    }

    const behavior = this.autoScrollBehavior();
    if (typeof scrollContainer.scrollTo === 'function') {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior,
      });
      return;
    }

    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }

  private resolveScrollContainer(): HTMLElement | null {
    const host = this.hostElement.nativeElement;
    if (this.autoScrollTarget() === 'self') {
      return host;
    }

    if (this.cachedScrollContainer?.isConnected) {
      return this.cachedScrollContainer;
    }

    let current: HTMLElement | null = host.parentElement;
    while (current) {
      if (this.isScrollable(current)) {
        this.cachedScrollContainer = current;
        return current;
      }
      current = current.parentElement;
    }

    return host;
  }

  private isScrollable(element: HTMLElement): boolean {
    if (typeof getComputedStyle !== 'function') {
      return false;
    }

    const style = getComputedStyle(element);
    return (
      this.isScrollableOverflow(style.overflowY) ||
      this.isScrollableOverflow(style.overflow)
    );
  }

  private isScrollableOverflow(value: string): boolean {
    const normalized = value.toLowerCase().trim();
    return normalized === 'auto' || normalized === 'scroll' || normalized === 'overlay';
  }

  private getOrCreateStreamCoalescer(
    throttleMs: number,
    debounceMs: number
  ): StreamUpdateCoalescer {
    if (
      !this.streamCoalescer ||
      this.coalescerThrottleMs !== throttleMs ||
      this.coalescerDebounceMs !== debounceMs
    ) {
      this.destroyStreamCoalescer();
      this.streamCoalescer = createStreamUpdateCoalescer(
        (value) => this.renderedContent.set(value),
        throttleMs,
        debounceMs
      );
      this.coalescerThrottleMs = throttleMs;
      this.coalescerDebounceMs = debounceMs;
    }

    return this.streamCoalescer;
  }

  private destroyStreamCoalescer(): void {
    if (!this.streamCoalescer) {
      return;
    }

    this.streamCoalescer.destroy();
    this.streamCoalescer = null;
    this.coalescerThrottleMs = -1;
    this.coalescerDebounceMs = -1;
  }
}
