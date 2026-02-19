import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type {
  RenderElementNode,
  RenderNode,
} from '../models/markdown.models';
import type { MarkdownRenderCapabilities } from '../services/markdown-render-capabilities.service';
import { CodeBlockComponent } from './code-block.component';
import { LinkSafetyDialogComponent } from './link-safety-dialog.component';
import { MermaidComponent } from './mermaid.component';
import { TableControlsComponent } from './table-controls.component';

const FILE_EXTENSION_PATTERN = /\.[^/.]+$/;
const HTML_VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

@Component({
  selector: 'sd-markdown-node',
  host: {
    'style': 'display: contents;',
  },
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
          @case ('input') {
            <input
              [attr.checked]="attr('checked')"
              [attr.disabled]="attr('disabled')"
              [attr.name]="attr('name')"
              [attr.placeholder]="attr('placeholder')"
              [attr.readonly]="attr('readonly')"
              [attr.style]="styleText()"
              [attr.type]="attr('type')"
              [attr.value]="attr('value')"
              [class]="className()"
            />
          }
          @case ('pre') {
            @if (codeChild() && preCodeLanguage() === 'mermaid' && renderCapabilities().mermaid.enabled) {
              @defer (when true) {
                <sd-mermaid
                  [chart]="preCodeText()"
                  [allowCopy]="renderCapabilities().mermaid.copy"
                  [allowDownload]="renderCapabilities().mermaid.download"
                  [allowFullscreen]="renderCapabilities().mermaid.fullscreen"
                  [plugin]="renderCapabilities().plugins.mermaid"
                  [showControlsBar]="renderCapabilities().controls.mermaid"
                  [showPanZoom]="renderCapabilities().mermaid.panZoom"></sd-mermaid>
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
                  [showCopy]="renderCapabilities().code.copy"
                  [showDownload]="renderCapabilities().code.download"
                  [showHeader]="renderCapabilities().controls.code"
                  [showLanguageLabel]="renderCapabilities().code.showLanguageLabel"
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
            <div class="sd-table-wrapper my-4 flex flex-col gap-2">
              @if (renderCapabilities().controls.table) {
                <sd-table-controls></sd-table-controls>
              }
              <div class="overflow-x-auto overscroll-y-auto">
                <table
                  [attr.style]="styleText()"
                  [class]="className()"
                  [innerHTML]="tableInnerSafeHtml()"></table>
              </div>
            </div>
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
          @case ('del') {
            <del [attr.style]="styleText()" [class]="className()">
              @for (child of children(); track $index) {
                <sd-markdown-node [node]="child" [renderCapabilities]="renderCapabilities()"></sd-markdown-node>
              }
            </del>
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
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly pendingLinkHref = signal<string | null>(null);
  private linkCheckVersion = 0;

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
  readonly tableInnerHtml = computed(() => {
    if (this.tagName() !== 'table') {
      return '';
    }

    return this.children().map((child) => this.serializeNodeToHtml(child)).join('');
  });
  readonly tableInnerSafeHtml = computed<SafeHtml>(() =>
    this.domSanitizer.bypassSecurityTrustHtml(this.tableInnerHtml())
  );

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

  async onLinkClick(event: MouseEvent): Promise<void> {
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
    const currentCheckVersion = ++this.linkCheckVersion;
    const onLinkCheck = this.renderCapabilities().linkSafety.onLinkCheck;

    if (onLinkCheck) {
      try {
        const shouldAllow = await onLinkCheck(href);
        if (currentCheckVersion !== this.linkCheckVersion) {
          return;
        }
        if (shouldAllow) {
          this.openExternalLink(href);
          return;
        }
      } catch {
        // Fall back to safety modal.
      }
    }

    this.pendingLinkHref.set(href);
  }

  confirmLinkNavigation(): void {
    const href = this.pendingLinkHref();
    if (!href) {
      return;
    }

    this.openExternalLink(href);
    this.pendingLinkHref.set(null);
  }

  cancelLinkNavigation(): void {
    this.linkCheckVersion += 1;
    this.pendingLinkHref.set(null);
  }

  async downloadImage(): Promise<void> {
    const src = this.attr('src');
    if (!src) {
      return;
    }

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const filename = this.resolveImageFilename(src, blob.type);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      if (typeof window !== 'undefined' && typeof window.open === 'function') {
        window.open(src, '_blank', 'noopener,noreferrer');
      }
    }
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

  private openExternalLink(href: string): void {
    if (typeof window === 'undefined' || typeof window.open !== 'function') {
      return;
    }

    const target = this.linkTarget() ?? '_blank';
    window.open(href, target, 'noopener,noreferrer');
  }

  private resolveImageFilename(src: string, mimeType: string): string {
    const fallbackBaseName = this.imgAlt() || 'image';

    let parsedPath = '';
    try {
      parsedPath = new URL(src, window.location.origin).pathname;
    } catch {
      parsedPath = src;
    }

    const originalFilename = parsedPath.split('/').pop() || '';
    const extension = originalFilename.split('.').pop();
    const hasExtension =
      originalFilename.includes('.') &&
      extension !== undefined &&
      extension.length > 0 &&
      extension.length <= 4;

    if (hasExtension) {
      return originalFilename;
    }

    let inferredExtension = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      inferredExtension = 'jpg';
    } else if (mimeType.includes('svg')) {
      inferredExtension = 'svg';
    } else if (mimeType.includes('gif')) {
      inferredExtension = 'gif';
    } else if (mimeType.includes('webp')) {
      inferredExtension = 'webp';
    }

    const baseName = (originalFilename || fallbackBaseName).replace(
      FILE_EXTENSION_PATTERN,
      ''
    );
    return `${baseName || 'image'}.${inferredExtension}`;
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

  private serializeNodeToHtml(node: RenderNode): string {
    if (node.kind === 'text') {
      return this.escapeHtml(node.value);
    }

    if (node.kind === 'root') {
      return node.children.map((child) => this.serializeNodeToHtml(child)).join('');
    }

    const tagName = node.tagName.toLowerCase();
    const attributes = this.serializeHtmlAttributes(node.properties);
    if (HTML_VOID_TAGS.has(tagName)) {
      return `<${tagName}${attributes}>`;
    }

    const children = node.children
      .map((child) => this.serializeNodeToHtml(child))
      .join('');
    return `<${tagName}${attributes}>${children}</${tagName}>`;
  }

  private serializeHtmlAttributes(properties: Record<string, unknown>): string {
    let serialized = '';

    for (const [rawKey, rawValue] of Object.entries(properties)) {
      if (rawValue === null || rawValue === undefined || rawValue === false) {
        continue;
      }

      const key = this.normalizeAttributeName(rawKey);
      const value =
        key === 'style'
          ? this.toStyleText(rawValue)
          : this.stringifyAttribute(rawValue);

      if (!value) {
        if (rawValue === true) {
          serialized += ` ${key}`;
        }
        continue;
      }

      serialized += ` ${key}="${this.escapeHtmlAttribute(value)}"`;
    }

    return serialized;
  }

  private normalizeAttributeName(name: string): string {
    if (name === 'className') {
      return 'class';
    }

    return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  private escapeHtmlAttribute(value: string): string {
    return this.escapeHtml(value)
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
