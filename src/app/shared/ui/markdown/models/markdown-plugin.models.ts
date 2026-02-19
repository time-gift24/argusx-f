import type { MermaidConfig } from 'mermaid';
import type { Pluggable } from 'unified';

export interface MarkdownMermaidInstance {
  initialize(config: MermaidConfig): void;
  render(id: string, source: string): Promise<{ svg: string }>;
}

export interface MarkdownMermaidPlugin {
  name: 'mermaid';
  type: 'diagram';
  language: string;
  getMermaid(config?: MermaidConfig): MarkdownMermaidInstance;
}

export interface MarkdownMathPlugin {
  name: 'katex';
  type: 'math';
  remarkPlugin: Pluggable;
  rehypePlugin: Pluggable;
  getStyles?: () => string;
}

export interface MarkdownCjkPlugin {
  name: 'cjk';
  type: 'cjk';
  remarkPluginsBefore: Pluggable[];
  remarkPluginsAfter: Pluggable[];
  remarkPlugins?: Pluggable[];
}

export interface MarkdownPlugins {
  mermaid?: MarkdownMermaidPlugin;
  math?: MarkdownMathPlugin;
  cjk?: MarkdownCjkPlugin;
}
