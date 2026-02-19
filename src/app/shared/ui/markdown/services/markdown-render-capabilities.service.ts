import { Injectable } from '@angular/core';
import type { MarkdownCapabilities } from '../models/markdown-capabilities.models';
import type { MarkdownMermaidPlugin } from '../models/markdown-plugin.models';

export interface MarkdownRenderCapabilities {
  controls: { table: boolean; code: boolean; mermaid: boolean };
  linkSafety: {
    enabled: boolean;
    trustedPrefixes: string[];
    onLinkCheck?: (url: string) => boolean | Promise<boolean>;
  };
  image: { download: boolean };
  code: { copy: boolean; download: boolean; showLanguageLabel: boolean };
  mermaid: {
    enabled: boolean;
    copy: boolean;
    download: boolean;
    fullscreen: boolean;
    panZoom: boolean;
  };
  plugins: {
    mermaid?: MarkdownMermaidPlugin;
  };
}

@Injectable({ providedIn: 'root' })
export class MarkdownRenderCapabilitiesService {
  create(capabilities: MarkdownCapabilities): MarkdownRenderCapabilities {
    return {
      controls: {
        table: capabilities.controls?.table ?? true,
        code: capabilities.controls?.code ?? true,
        mermaid: capabilities.controls?.mermaid ?? true,
      },
      linkSafety: {
        enabled: capabilities.linkSafety?.enabled ?? false,
        trustedPrefixes: capabilities.linkSafety?.trustedPrefixes ?? [],
        onLinkCheck: capabilities.linkSafety?.onLinkCheck,
      },
      image: { download: capabilities.image?.download ?? false },
      code: {
        copy: capabilities.code?.copy ?? true,
        download: capabilities.code?.download ?? false,
        showLanguageLabel: capabilities.code?.showLanguageLabel ?? true,
      },
      mermaid: {
        enabled: capabilities.mermaid?.enabled ?? true,
        copy: capabilities.mermaid?.copy ?? true,
        download: capabilities.mermaid?.download ?? false,
        fullscreen: capabilities.mermaid?.fullscreen ?? false,
        panZoom: capabilities.mermaid?.panZoom ?? true,
      },
      plugins: {
        mermaid: capabilities.plugins?.mermaid,
      },
    };
  }
}
