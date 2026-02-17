import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MarkdownEngineService } from './services/markdown-engine.service';
import { MarkdownNodeComponent } from './components/markdown-node.component';

@Component({
  selector: 'sd-markdown',
  imports: [MarkdownNodeComponent],
  template: `
    <section [class]="containerClass()" aria-live="polite" role="region">
      @if (blocks().length === 0) {
        <span></span>
      } @else {
        @for (block of blocks(); track block.id) {
          <article class="sd-block">
            <sd-markdown-node [node]="block.root" />
          </article>
        }
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .sd-root { margin-top: 1rem; margin-bottom: 1rem; }
    .sd-block { margin-top: 0; margin-bottom: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdMarkdownComponent {
  private engine = inject(MarkdownEngineService);

  readonly content = input<string>('');
  readonly mode = input<'streaming' | 'static'>('streaming');
  readonly className = input<string>('');

  readonly blocks = computed(() =>
    this.engine.renderBlocks(this.content(), {
      mode: this.mode(),
      parseIncompleteMarkdown: this.mode() === 'streaming',
    })
  );

  readonly containerClass = computed(() => {
    const custom = this.className().trim();
    return custom ? `sd-root ${custom}` : 'sd-root';
  });
}
