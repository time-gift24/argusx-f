# Markdown Capabilities API

`SdMarkdownComponent` now supports a typed `capabilities` input as the primary entry point for pipeline and UI feature configuration.

## Usage

```ts
import type { MarkdownCapabilities } from '@app/shared/ui';

const capabilities: MarkdownCapabilities = {
  controls: { table: true, code: true, mermaid: true },
  code: { copy: true, download: false, showLanguageLabel: true },
  mermaid: { enabled: true, copy: true, download: false, fullscreen: false, panZoom: true },
  image: { download: true },
  linkSafety: { enabled: true, trustedPrefixes: ['https://argusx.ai'] },
};
```

```html
<sd-markdown [content]="markdown" [capabilities]="capabilities"></sd-markdown>
```

## Compatibility

Legacy inputs are still supported:

- `remarkPlugins`
- `rehypePlugins`
- `allowedTags`

When both typed and legacy inputs are provided, typed pipeline fields take precedence, and legacy values are merged into `capabilities.pipeline` when missing.
