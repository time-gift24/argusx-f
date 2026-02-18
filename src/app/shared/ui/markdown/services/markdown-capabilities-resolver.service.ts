import { Injectable } from '@angular/core';
import type { PluggableList } from 'unified';
import type { MarkdownCapabilities } from '../models/markdown-capabilities.models';
import {
  getDefaultRehypePlugins,
  getDefaultRemarkPlugins,
} from './default-markdown-plugins';

export interface ResolvedCapabilities {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
}

@Injectable({ providedIn: 'root' })
export class MarkdownCapabilitiesResolverService {
  resolve(capabilities: MarkdownCapabilities): ResolvedCapabilities {
    const baseRemark =
      capabilities.pipeline?.remarkPlugins ?? getDefaultRemarkPlugins();
    const baseRehype =
      capabilities.pipeline?.rehypePlugins ??
      getDefaultRehypePlugins(capabilities.pipeline?.allowedTags);
    const cjkBefore =
      (capabilities.cjk?.remarkPluginsBefore as PluggableList | undefined) ?? [];
    const cjkAfter =
      (capabilities.cjk?.remarkPluginsAfter as PluggableList | undefined) ?? [];

    let remarkPlugins: PluggableList = [
      ...cjkBefore,
      ...baseRemark,
    ];

    remarkPlugins = [
      ...remarkPlugins,
      ...cjkAfter,
    ];

    if (capabilities.math?.remarkPlugin) {
      remarkPlugins = [...remarkPlugins, capabilities.math.remarkPlugin as any];
    }

    let rehypePlugins: PluggableList = [...baseRehype];
    if (capabilities.math?.rehypePlugin) {
      rehypePlugins = [...rehypePlugins, capabilities.math.rehypePlugin as any];
    }

    return { remarkPlugins, rehypePlugins };
  }
}
