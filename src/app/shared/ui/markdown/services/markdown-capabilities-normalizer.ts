import type { PluggableList } from 'unified';
import type { MarkdownCapabilities } from '../models/markdown-capabilities.models';
import type { MarkdownPlugins } from '../models/markdown-plugin.models';
import type { AllowedTags } from '../models/markdown.models';

export interface LegacyCapabilityInputs {
  capabilities?: MarkdownCapabilities;
  plugins?: MarkdownPlugins;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  allowedTags?: AllowedTags;
}

export const normalizeCapabilities = ({
  capabilities,
  plugins,
  remarkPlugins,
  rehypePlugins,
  allowedTags,
}: LegacyCapabilityInputs): MarkdownCapabilities => ({
  ...capabilities,
  pipeline: {
    ...(capabilities?.pipeline ?? {}),
    remarkPlugins: capabilities?.pipeline?.remarkPlugins ?? remarkPlugins,
    rehypePlugins: capabilities?.pipeline?.rehypePlugins ?? rehypePlugins,
    allowedTags: capabilities?.pipeline?.allowedTags ?? allowedTags,
  },
  plugins: {
    ...(plugins ?? {}),
    ...(capabilities?.plugins ?? {}),
    mermaid: capabilities?.plugins?.mermaid ?? plugins?.mermaid,
    math: capabilities?.plugins?.math ?? plugins?.math,
    cjk: capabilities?.plugins?.cjk ?? plugins?.cjk,
  },
});
