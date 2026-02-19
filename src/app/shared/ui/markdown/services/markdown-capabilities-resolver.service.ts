import { Injectable } from '@angular/core';
import type { PluggableList } from 'unified';
import type { MarkdownCapabilities } from '../models/markdown-capabilities.models';
import type {
  MarkdownCjkPlugin,
  MarkdownMermaidPlugin,
} from '../models/markdown-plugin.models';
import {
  getDefaultRehypePlugins,
  getDefaultRemarkPlugins,
} from './default-markdown-plugins';

interface ResolvedRuntimePlugins {
  mermaid?: MarkdownMermaidPlugin;
}

export interface ResolvedCapabilities {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
  plugins: ResolvedRuntimePlugins;
}

@Injectable({ providedIn: 'root' })
export class MarkdownCapabilitiesResolverService {
  resolve(capabilities: MarkdownCapabilities): ResolvedCapabilities {
    const baseRemark =
      capabilities.pipeline?.remarkPlugins ?? getDefaultRemarkPlugins();
    const baseRehype =
      capabilities.pipeline?.rehypePlugins ??
      getDefaultRehypePlugins(capabilities.pipeline?.allowedTags);
    const cjkPlugin = capabilities.plugins?.cjk;
    const mathPlugin = capabilities.plugins?.math;

    const cjkBefore = this.resolveCjkBefore(capabilities, cjkPlugin);
    const cjkAfter = this.resolveCjkAfter(capabilities, cjkPlugin);

    let remarkPlugins: PluggableList = [
      ...cjkBefore,
      ...baseRemark,
    ];

    remarkPlugins = [
      ...remarkPlugins,
      ...cjkAfter,
    ];

    const mathRemarkPlugin =
      mathPlugin?.remarkPlugin ?? capabilities.math?.remarkPlugin;
    if (mathRemarkPlugin) {
      remarkPlugins = [...remarkPlugins, mathRemarkPlugin as any];
    }

    let rehypePlugins: PluggableList = [...baseRehype];
    const mathRehypePlugin =
      mathPlugin?.rehypePlugin ?? capabilities.math?.rehypePlugin;
    if (mathRehypePlugin) {
      rehypePlugins = [...rehypePlugins, mathRehypePlugin as any];
    }

    return {
      remarkPlugins,
      rehypePlugins,
      plugins: {
        mermaid: capabilities.plugins?.mermaid,
      },
    };
  }

  private resolveCjkBefore(
    capabilities: MarkdownCapabilities,
    plugin: MarkdownCjkPlugin | undefined
  ): PluggableList {
    if (plugin?.remarkPluginsBefore?.length) {
      return [...plugin.remarkPluginsBefore];
    }

    const legacyBefore =
      (capabilities.cjk?.remarkPluginsBefore as PluggableList | undefined) ?? [];
    if (legacyBefore.length) {
      return [...legacyBefore];
    }

    return [];
  }

  private resolveCjkAfter(
    capabilities: MarkdownCapabilities,
    plugin: MarkdownCjkPlugin | undefined
  ): PluggableList {
    if (plugin?.remarkPluginsAfter?.length) {
      return [...plugin.remarkPluginsAfter];
    }

    const legacyAfter =
      (capabilities.cjk?.remarkPluginsAfter as PluggableList | undefined) ?? [];
    if (legacyAfter.length) {
      return [...legacyAfter];
    }

    if (plugin?.remarkPlugins?.length) {
      return [...plugin.remarkPlugins];
    }

    return [];
  }
}
