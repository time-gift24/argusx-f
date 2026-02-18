import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import type {
  RenderElementNode,
  RenderNode,
  RenderTextNode,
} from '../models/markdown.models';
import type { MarkdownRenderCapabilities } from '../services/markdown-render-capabilities.service';
import { CodeBlockComponent } from './code-block.component';
import { LinkSafetyDialogComponent } from './link-safety-dialog.component';
import { MermaidComponent } from './mermaid.component';
import { TableControlsComponent } from './table-controls.component';

@Component({
  selector: 'sd-markdown-node',
  imports: [
    forwardRef(() => MarkdownNodeComponent),
    CodeBlockComponent,
    LinkSafetyDialogComponent,
    MermaidComponent,
    TableControlsComponent,
  ],
  template: `
    @switch (node().kind) {
      @case ('text') {
        {{ textValue() }}
      }
      @case ('root') {
        @for (child of children(); track $index) {
          <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
        }
      }
      @case ('element') {
        @switch (tagName()) {
          @case ('p') {
            <p [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </p>
          }
          @case ('h1') {
            <h1 [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </h1>
          }
          @case ('h2') {
            <h2 [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </h2>
          }
          @case ('h3') {
            <h3 [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </h3>
          }
          @case ('h4') {
            <h4 [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </h4>
          }
          @case ('h5') {
            <h5 [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </h5>
          }
          @case ('h6') {
            <h6 [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </h6>
          }
          @case ('ul') {
            <ul [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </ul>
          }
          @case ('ol') {
            <ol [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </ol>
          }
          @case ('li') {
            <li [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </li>
          }
          @case ('blockquote') {
            <blockquote [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </blockquote>
          }
          @case ('a') {
            <a
              [attr.aria-disabled]="isIncompleteLink() ? 'true' : null"
              [attr.href]="linkHref()"
              [attr.rel]="linkRel()"
              [attr.style]="styleText()"
              [attr.target]="linkTarget()"
              [class]="className()"
              (click)="onLinkClick($event)"
            >
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </a>
            @if (showLinkSafetyDialog()) {
              <sd-link-safety-dialog
                [url]="pendingLinkUrl()"
                (confirm)="confirmLinkNavigation()"
                (cancel)="cancelLinkNavigation()">
              </sd-link-safety-dialog>
            }
          }
          @case ('img') {
            <div class="relative inline-block">
              <img
                [attr.alt]="imgAlt()"
                [attr.height]="attr('height')"
                [attr.src]="attr('src')"
                [attr.style]="styleText()"
                [attr.title]="attr('title')"
                [attr.width]="attr('width')"
                [class]="className()"
              />

              @if (renderCapabilities().image.download) {
                <button
                  type="button"
                  class="absolute right-2 top-2 rounded border bg-background/90 px-2 py-1 text-xs"
                  (click)="downloadImage()">
                  Download
                </button>
              }
            </div>
          }
          @case ('pre') {
            @if (codeChild() && preCodeLanguage() === 'mermaid') {
              @defer (when true) {
                <sd-mermaid [chart]="preCodeText()"></sd-mermaid>
              } @placeholder {
                <div class="my-4 min-h-[100px] text-muted-foreground">
                  Loading diagram...
                </div>
              }
            } @else if (codeChild() && preCodeLanguage()) {
              @defer (when true) {
                <sd-code-block
                  [code]="preCodeText()"
                  [language]="preCodeLanguage()"
                ></sd-code-block>
              } @placeholder {
                <pre class="overflow-x-auto p-4"><code>{{ preCodeText() }}</code></pre>
              }
            } @else {
              <pre [attr.style]="styleText()" [class]="className()">
                @for (child of children(); track $index) {
                  <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
                }
              </pre>
            }
          }
          @case ('code') {
            <code [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </code>
          }
          @case ('table') {
            @if (renderCapabilities().controls.table) {
              <sd-table-controls [tableMarkdown]="tableMarkdown()"></sd-table-controls>
            }
            <table [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </table>
          }
          @case ('thead') {
            <thead [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </thead>
          }
          @case ('tbody') {
            <tbody [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </tbody>
          }
          @case ('tr') {
            <tr [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </tr>
          }
          @case ('th') {
            <th [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </th>
          }
          @case ('td') {
            <td [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </td>
          }
          @case ('strong') {
            <strong [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </strong>
          }
          @case ('em') {
            <em [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </em>
          }
          @case ('sup') {
            <sup [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </sup>
          }
          @case ('sub') {
            <sub [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </sub>
          }
          @case ('section') {
            <section [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </section>
          }
          @case ('hr') {
            <hr [attr.style]="styleText()" [class]="className()" />
          }
          @case ('br') {
            <br />
          }
          @default {
            <span
              [attr.data-tag]="tagName()"
              [attr.style]="styleText()"
              [class]="className()"
            >
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </span>
          }
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownNodeComponent {
  private readonly pendingLinkHref = signal<string | null>(null);

  readonly node = input.required<RenderNode>();
  readonly renderCapabilities = input.required<MarkdownRenderCapabilities>();

  readonly elementNode = computed<RenderElementNode | null>(() => {
    const currentNode = this.node();
    return currentNode.kind === 'element' ? currentNode : null;
  });

  readonly textValue = computed(() => {
    const currentNode = this.node();
    return currentNode.kind === 'text' ? currentNode.value : '';
  });

  readonly children = computed(() => {
    const currentNode = this.node();
    return currentNode.kind === 'text' ? [] : currentNode.children;
  });

  readonly tagName = computed(() => this.elementNode()?.tagName ?? '');

  readonly className = computed(() => {
    const properties = this.elementNode()?.properties;
    if (!properties) {
      return null;
    }

    return (
      this.stringifyAttribute(properties['className']) ??
      this.stringifyAttribute(properties['class']) ??
      null
    );
  });

  readonly styleText = computed(() => {
    const properties = this.elementNode()?.properties;
    if (!properties) {
      return null;
    }

    return this.toStyleText(properties['style']);
  });

  readonly codeChild = computed<RenderElementNode | null>(() => {
    if (this.tagName() !== 'pre') {
      return null;
    }

    const firstCode = this.children().find(
      (child): child is RenderElementNode =>
        child.kind === 'element' && child.tagName === 'code'
    );

    return firstCode ?? null;
  });

  readonly preCodeLanguage = computed(() => {
    const codeNode = this.codeChild();
    if (!codeNode) {
      return '';
    }

    const className =
      this.stringifyAttribute(codeNode.properties['className']) ??
      this.stringifyAttribute(codeNode.properties['class']) ??
      '';

    const match = className.match(/language-([^\s]+)/);
    return match ? match[1] : '';
  });

  readonly preCodeText = computed(() => {
    const codeNode = this.codeChild();
    if (!codeNode) {
      return '';
    }

    return this.collectText(codeNode.children);
  });

  readonly tableMarkdown = computed(() => {
    if (this.tagName() !== 'table') {
      return '';
    }

    return this.collectText(this.children());
  });

  readonly isIncompleteLink = computed(() => {
    if (this.tagName() !== 'a') {
      return false;
    }

    return this.attr('href') === 'streamdown:incomplete-link';
  });

  readonly linkHref = computed(() =>
    this.isIncompleteLink() ? null : this.attr('href')
  );

  readonly linkTarget = computed(() => {
    if (this.isIncompleteLink()) {
      return null;
    }

    return this.attr('target') ?? '_blank';
  });

  readonly linkRel = computed(() => {
    if (this.isIncompleteLink()) {
      return null;
    }

    return this.attr('rel') ?? 'noreferrer noopener';
  });

  readonly showLinkSafetyDialog = computed(
    () =>
      this.tagName() === 'a' &&
      this.renderCapabilities().linkSafety.enabled &&
      this.pendingLinkHref() !== null
  );
  readonly pendingLinkUrl = computed(() => this.pendingLinkHref() ?? '');

  readonly imgAlt = computed(() => this.attr('alt') ?? '');

  onLinkClick(event: MouseEvent): void {
    const href = this.linkHref();
    if (
      this.tagName() !== 'a' ||
      !href ||
      !this.renderCapabilities().linkSafety.enabled ||
      this.isTrustedLink(href)
    ) {
      return;
    }

    event.preventDefault();
    this.pendingLinkHref.set(href);
  }

  confirmLinkNavigation(): void {
    const href = this.pendingLinkHref();
    if (!href) {
      return;
    }

    const target = this.linkTarget() ?? '_blank';
    const features = 'noopener,noreferrer';

    if (typeof window === 'undefined' || typeof window.open !== 'function') {
      this.pendingLinkHref.set(null);
      return;
    }

    window.open(href, target, features);
    this.pendingLinkHref.set(null);
  }

  cancelLinkNavigation(): void {
    this.pendingLinkHref.set(null);
  }

  downloadImage(): void {
    const src = this.attr('src');
    if (!src) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = src;
    anchor.download = src.split('/').pop() || 'image';
    anchor.click();
  }

  attr(name: string): string | null {
    const properties = this.elementNode()?.properties;
    if (!properties) {
      return null;
    }

    return this.stringifyAttribute(properties[name]);
  }

  private isTrustedLink(href: string): boolean {
    const trustedPrefixes = this.renderCapabilities().linkSafety.trustedPrefixes;
    return trustedPrefixes.some((prefix) => href.startsWith(prefix));
  }

  private collectText(nodes: RenderNode[]): string {
    let output = '';

    for (const child of nodes) {
      if (child.kind === 'text') {
        output += child.value;
        continue;
      }

      output += this.collectText(child.children);
    }

    return output;
  }

  private stringifyAttribute(value: unknown): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      const rendered = value
        .map((item) => this.stringifyAttribute(item))
        .filter((item): item is string => item !== null && item.length > 0);

      return rendered.length > 0 ? rendered.join(' ') : null;
    }

    return null;
  }

  private toStyleText(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (!value || typeof value !== 'object') {
      return null;
    }

    const styleEntries = Object.entries(value as Record<string, unknown>)
      .map(([key, rawValue]) => {
        const renderedValue = this.stringifyAttribute(rawValue);
        return renderedValue ? `${key}:${renderedValue}` : null;
      })
      .filter((item): item is string => item !== null);

    return styleEntries.length > 0 ? `${styleEntries.join(';')};` : null;
  }
}
