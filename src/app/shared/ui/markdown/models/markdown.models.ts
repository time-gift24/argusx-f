import type { Element, Parents } from 'hast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';
import type { RemendOptions } from 'remend';
import type { PluggableList } from 'unified';
import type { MarkdownCapabilities } from './markdown-capabilities.models';
import type { MarkdownPlugins } from './markdown-plugin.models';

export type StreamMode = 'streaming' | 'static';

export type AllowElement = (
  element: Readonly<Element>,
  index: number,
  parent: Readonly<Parents> | undefined
) => boolean | null | undefined;

export type UrlTransform = (
  url: string,
  key: string,
  node: Readonly<Element>
) => string | null | undefined;

export type AllowedTags = Record<string, string[]>;

export interface RenderTextNode {
  kind: 'text';
  value: string;
}

export interface RenderElementNode {
  kind: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: RenderNode[];
}

export interface RenderRootNode {
  kind: 'root';
  children: RenderNode[];
}

export type RenderNode = RenderTextNode | RenderElementNode | RenderRootNode;

export interface RenderBlock {
  id: string;
  raw: string;
  root: RenderRootNode;
}

export interface RenderOptions {
  capabilities?: MarkdownCapabilities;
  plugins?: MarkdownPlugins;
  mode?: StreamMode;
  parseIncompleteMarkdown?: boolean;
  remendOptions?: RemendOptions;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions>;
  allowedElements?: readonly string[];
  disallowedElements?: readonly string[];
  allowElement?: AllowElement;
  skipHtml?: boolean;
  unwrapDisallowed?: boolean;
  urlTransform?: UrlTransform;
  allowedTags?: AllowedTags;
}
