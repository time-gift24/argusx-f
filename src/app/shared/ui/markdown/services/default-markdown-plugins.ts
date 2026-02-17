import { harden } from 'rehype-harden';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';
import type { AllowedTags } from '../models/markdown.models';

interface SanitizeSchemaLike {
  protocols?: Record<string, string[] | undefined>;
  tagNames?: string[];
  attributes?: Record<string, string[] | undefined>;
  [key: string]: unknown;
}

const BASE_SANITIZE_SCHEMA = defaultSchema as unknown as SanitizeSchemaLike;
const BASE_SANITIZE: SanitizeSchemaLike = {
  ...BASE_SANITIZE_SCHEMA,
  protocols: {
    ...(BASE_SANITIZE_SCHEMA.protocols ?? {}),
    href: [...(BASE_SANITIZE_SCHEMA.protocols?.['href'] ?? []), 'tel'],
  },
};

const DEFAULT_REMARK_PLUGINS: PluggableList = [[remarkGfm, {}]];
const DEFAULT_REHYPE_PLUGINS: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, BASE_SANITIZE],
  [
    harden,
    {
      allowedImagePrefixes: ['*'],
      allowedLinkPrefixes: ['*'],
      allowedProtocols: ['*'],
      allowDataImages: true,
    },
  ],
];

export const getDefaultRemarkPlugins = (): PluggableList => DEFAULT_REMARK_PLUGINS;

export const getDefaultRehypePlugins = (allowedTags?: AllowedTags): PluggableList => {
  if (!allowedTags || Object.keys(allowedTags).length === 0) {
    return DEFAULT_REHYPE_PLUGINS;
  }

  return [
    rehypeRaw,
    [
      rehypeSanitize,
      {
        ...BASE_SANITIZE,
        tagNames: [...(BASE_SANITIZE.tagNames ?? []), ...Object.keys(allowedTags)],
        attributes: {
          ...(BASE_SANITIZE.attributes ?? {}),
          ...allowedTags,
        },
      },
    ],
    [
      harden,
      {
        allowedImagePrefixes: ['*'],
        allowedLinkPrefixes: ['*'],
        allowedProtocols: ['*'],
        allowDataImages: true,
      },
    ],
  ];
};
