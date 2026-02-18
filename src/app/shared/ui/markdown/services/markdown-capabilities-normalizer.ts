import type { PluggableList } from 'unified';
import type { MarkdownCapabilities } from '../models/markdown-capabilities.models';
import type { AllowedTags } from '../models/markdown.models';

export interface LegacyCapabilityInputs {
  capabilities?: MarkdownCapabilities;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  allowedTags?: AllowedTags;
}

export const normalizeCapabilities = ({
  capabilities,
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
});
