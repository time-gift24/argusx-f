import type { PluggableList } from 'unified';
import type { AllowedTags } from './markdown.models';
import type { MarkdownPlugins } from './markdown-plugin.models';

export interface MarkdownPipelineCapabilities {
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  allowedTags?: AllowedTags;
}

export interface MarkdownCodeCapabilities {
  copy?: boolean;
  download?: boolean;
  showLanguageLabel?: boolean;
}

export interface MarkdownMermaidCapabilities {
  enabled?: boolean;
  copy?: boolean;
  download?: boolean;
  fullscreen?: boolean;
  panZoom?: boolean;
}

export interface MarkdownControlsCapabilities {
  table?: boolean;
  code?: boolean;
  mermaid?: boolean;
}

export interface MarkdownImageCapabilities {
  download?: boolean;
}

export interface MarkdownLinkSafetyCapabilities {
  enabled?: boolean;
  trustedPrefixes?: string[];
  onLinkCheck?: (url: string) => boolean | Promise<boolean>;
}

export interface MarkdownMathCapabilities {
  remarkPlugin?: unknown;
  rehypePlugin?: unknown;
}

export interface MarkdownCjkCapabilities {
  remarkPluginsBefore?: unknown[];
  remarkPluginsAfter?: unknown[];
}

export interface MarkdownCapabilities {
  pipeline?: MarkdownPipelineCapabilities;
  code?: MarkdownCodeCapabilities;
  mermaid?: MarkdownMermaidCapabilities;
  controls?: MarkdownControlsCapabilities;
  image?: MarkdownImageCapabilities;
  linkSafety?: MarkdownLinkSafetyCapabilities;
  math?: MarkdownMathCapabilities;
  cjk?: MarkdownCjkCapabilities;
  plugins?: MarkdownPlugins;
}
