import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import type { RenderNode, RenderElementNode, RenderTextNode, RenderRootNode } from '../models/markdown.models';

@Component({
  selector: 'sd-markdown-node',
  imports: [forwardRef(() => MarkdownNodeComponent)],
  template: `
    @switch (node().kind) {
      @case ('text') {
        {{ textValue() }}
      }
      @case ('root') {
        @for (child of children(); track $index) {
          <sd-markdown-node [node]="child" />
        }
      }
      @case ('element') {
        @switch (tagName()) {
          @case ('p') {
            <p [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </p>
          }
          @case ('h1') { <h1 [class]="className()">{{ elementTextContent() }}</h1> }
          @case ('h2') { <h2 [class]="className()">{{ elementTextContent() }}</h2> }
          @case ('h3') { <h3 [class]="className()">{{ elementTextContent() }}</h3> }
          @case ('h4') { <h4 [class]="className()">{{ elementTextContent() }}</h4> }
          @case ('h5') { <h5 [class]="className()">{{ elementTextContent() }}</h5> }
          @case ('h6') { <h6 [class]="className()">{{ elementTextContent() }}</h6> }
          @case ('ul') {
            <ul [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </ul>
          }
          @case ('ol') {
            <ol [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </ol>
          }
          @case ('li') {
            <li [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </li>
          }
          @case ('blockquote') {
            <blockquote [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </blockquote>
          }
          @case ('a') {
            <a [href]="attr('href')" [class]="className()" target="_blank" rel="noopener noreferrer">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </a>
          }
          @case ('img') {
            <img [src]="attr('src')" [alt]="attr('alt')" [class]="className()" />
          }
          @case ('pre') {
            <pre [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </pre>
          }
          @case ('code') {
            <code [class]="className()">{{ elementTextContent() }}</code>
          }
          @case ('strong') {
            <strong [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </strong>
          }
          @case ('em') {
            <em [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </em>
          }
          @case ('table') {
            <table [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </table>
          }
          @case ('thead') {
            <thead [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </thead>
          }
          @case ('tbody') {
            <tbody [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </tbody>
          }
          @case ('tr') {
            <tr [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </tr>
          }
          @case ('th') {
            <th [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </th>
          }
          @case ('td') {
            <td [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </td>
          }
          @case ('hr') { <hr [class]="className()" /> }
          @case ('br') { <br /> }
          @case ('del') {
            <del [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </del>
          }
          @case ('sup') {
            <sup [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </sup>
          }
          @case ('sub') {
            <sub [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </sub>
          }
          @case ('section') {
            <section [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
              }
            </section>
          }
          @default {
            <span [class]="className()">
              @for (child of elementChildren(); track $index) {
                <sd-markdown-node [node]="child" />
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
  readonly node = input.required<RenderNode>();

  readonly elementNode = computed<RenderElementNode | null>(() => {
    const n = this.node();
    return n.kind === 'element' ? (n as RenderElementNode) : null;
  });

  readonly tagName = computed(() => this.elementNode()?.tagName ?? '');

  readonly className = computed(() => {
    const props = this.elementNode()?.properties;
    if (!props) return null;
    return (props['className'] as string) ?? (props['class'] as string) ?? null;
  });

  readonly children = computed<RenderNode[]>(() => {
    const n = this.node();
    if (n.kind === 'text') return [];
    return (n as RenderRootNode).children;
  });

  readonly elementChildren = computed<RenderNode[]>(() => {
    const n = this.node();
    if (n.kind !== 'element') return [];
    return (n as RenderElementNode).children;
  });

  readonly textValue = computed(() => {
    const n = this.node();
    if (n.kind !== 'text') return '';
    return (n as RenderTextNode).value;
  });

  readonly elementTextContent = computed(() => {
    const children = this.elementChildren();
    return children
      .filter((c): c is RenderTextNode => c.kind === 'text')
      .map(c => c.value)
      .join('');
  });

  attr(name: string): string | null {
    const props = this.elementNode()?.properties;
    if (!props) return null;
    return props[name] as string ?? null;
  }
}
