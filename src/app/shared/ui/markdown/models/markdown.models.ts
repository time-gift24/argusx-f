export type RenderNodeKind = 'text' | 'element' | 'root';

export interface RenderTextNode {
  kind: RenderNodeKind;
  value: string;
}

export interface RenderElementNode {
  kind: RenderNodeKind;
  tagName: string;
  properties: Record<string, unknown>;
  children: RenderNode[];
}

export interface RenderRootNode {
  kind: RenderNodeKind;
  children: RenderNode[];
}

export type RenderNode = RenderTextNode | RenderElementNode | RenderRootNode;

export interface RenderBlock {
  id: string;
  raw: string;
  root: RenderRootNode;
}

export interface RenderOptions {
  mode: 'streaming' | 'static';
  parseIncompleteMarkdown: boolean;
  remendOptions?: RemendOptions;
  remarkPlugins?: unknown[];
  rehypePlugins?: unknown[];
}

export interface RemendOptions {
  links?: boolean;
  images?: boolean;
  bold?: boolean;
  italic?: boolean;
  boldItalic?: boolean;
  inlineCode?: boolean;
  strikethrough?: boolean;
  katex?: boolean;
  setextHeadings?: boolean;
  comparisonOperators?: boolean;
  htmlTags?: boolean;
}
