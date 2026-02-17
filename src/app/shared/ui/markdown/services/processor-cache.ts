import type { PluggableList } from 'unified';

export interface CacheKeyOptions {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
  remarkRehypeOptions: unknown;
}

const pluginNameCache = new WeakMap<Function, string>();

const serializePlugins = (plugins: PluggableList): string =>
  plugins
    .map((plugin) => {
      if (Array.isArray(plugin)) {
        const [fn, options] = plugin;
        const name =
          typeof fn === 'function'
            ? (pluginNameCache.get(fn) ??
              (pluginNameCache.set(fn, fn.name), fn.name))
            : String(fn);
        return `${name}:${JSON.stringify(options)}`;
      }

      if (typeof plugin === 'function') {
        const name = pluginNameCache.get(plugin) ?? plugin.name;
        pluginNameCache.set(plugin, name);
        return name;
      }

      return String(plugin);
    })
    .join('|');

export class ProcessorCache<TProcessor> {
  private readonly cache = new Map<string, TProcessor>();

  constructor(private readonly maxSize = 100) {}

  get size(): number {
    return this.cache.size;
  }

  makeKey(options: CacheKeyOptions): string {
    const remark = serializePlugins(options.remarkPlugins);
    const rehype = serializePlugins(options.rehypePlugins);
    const remarkRehype = JSON.stringify(options.remarkRehypeOptions);
    return `${remark}::${rehype}::${remarkRehype}`;
  }

  get(key: string): TProcessor | undefined {
    const value = this.cache.get(key);
    if (!value) {
      return undefined;
    }

    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: TProcessor): void {
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(key, value);
  }
}
