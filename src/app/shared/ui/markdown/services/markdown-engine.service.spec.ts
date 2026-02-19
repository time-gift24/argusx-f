import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { describe, expect, it } from 'vitest';
import type { Root as MdastRoot } from 'mdast';
import { MarkdownEngineService } from './markdown-engine.service';
import { MarkdownParserService } from './markdown-parser.service';
import { RemendService } from './remend.service';

const createService = (): MarkdownEngineService => {
  const injector = Injector.create({
    providers: [MarkdownParserService, RemendService],
  });

  return runInInjectionContext(
    injector,
    () => new MarkdownEngineService()
  );
};

const findFirstElementByTag = (node: any, tagName: string): any | null => {
  if (node?.kind === 'element' && node.tagName === tagName) {
    return node;
  }

  if (!Array.isArray(node?.children)) {
    return null;
  }

  for (const child of node.children) {
    const found = findFirstElementByTag(child, tagName);
    if (found) {
      return found;
    }
  }

  return null;
};

const collectText = (node: any): string => {
  if (!node) {
    return '';
  }

  if (node.kind === 'text') {
    return node.value ?? '';
  }

  if (!Array.isArray(node.children)) {
    return '';
  }

  return node.children.map((child: any) => collectText(child)).join('');
};

const rowValues = (row: any): string[] =>
  (row?.children ?? [])
    .filter(
      (cell: any) =>
        cell?.kind === 'element' && (cell.tagName === 'td' || cell.tagName === 'th')
    )
    .map((cell: any) => collectText(cell).trim());

describe('MarkdownEngineService', () => {
  it('does not reuse processor cache for different remark plugin functions', () => {
    const service = createService();

    const pluginA = () => (tree: MdastRoot) => {
      tree.children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: 'PLUGIN_A' }],
      } as MdastRoot['children'][number]);
    };

    const pluginB = () => (tree: MdastRoot) => {
      tree.children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: 'PLUGIN_B' }],
      } as MdastRoot['children'][number]);
    };

    const blocksA = service.renderBlocks('base', {
      mode: 'static',
      remarkPlugins: [pluginA],
      rehypePlugins: [],
    });

    const blocksB = service.renderBlocks('base', {
      mode: 'static',
      remarkPlugins: [pluginB],
      rehypePlugins: [],
    });

    const asText = (value: unknown): string => JSON.stringify(value);
    expect(asText(blocksA[0].root)).toContain('PLUGIN_A');
    expect(asText(blocksB[0].root)).toContain('PLUGIN_B');
    expect(asText(blocksB[0].root)).not.toContain('PLUGIN_A');
  });

  it('caps processor cache size at 100 entries', () => {
    const service = createService();

    const plugin = () => () => {};

    for (let i = 0; i < 150; i += 1) {
      service.renderBlocks(`# ${i}`, {
        mode: 'static',
        remarkPlugins: [[plugin, { i }]],
        rehypePlugins: [],
      });
    }

    const cacheSize = (service as any).processorCache.size;
    expect(cacheSize).toBeLessThanOrEqual(100);
  });

  it('splits flattened html table rows using header column count', () => {
    const service = createService();
    const markdown = [
      '<table>',
      '  <thead><tr><th>Step</th><th>Status</th></tr></thead>',
      '  <tbody><tr><td>Parse</td><td>Done</td><td>Render</td><td>Running</td><td>Verify</td><td>Pending</td></tr></tbody>',
      '</table>',
    ].join('\n');

    const blocks = service.renderBlocks(markdown, {
      mode: 'static',
    });

    const table = findFirstElementByTag(blocks[0].root, 'table');
    const tbody = findFirstElementByTag(table, 'tbody');
    expect(tbody).toBeTruthy();

    const rows = (tbody.children ?? []).filter(
      (child: any) => child?.kind === 'element' && child.tagName === 'tr'
    );
    expect(rows).toHaveLength(3);
    expect(rowValues(rows[0])).toEqual(['Parse', 'Done']);
    expect(rowValues(rows[1])).toEqual(['Render', 'Running']);
    expect(rowValues(rows[2])).toEqual(['Verify', 'Pending']);
  });

  it('groups orphan table cells under tbody into rows by header column count', () => {
    const service = createService();
    const markdown = [
      '<table>',
      '  <thead><tr><th>Step</th><th>Status</th></tr></thead>',
      '  <tbody><td>Parse</td><td>Done</td><td>Render</td><td>Running</td></tbody>',
      '</table>',
    ].join('\n');

    const blocks = service.renderBlocks(markdown, {
      mode: 'static',
    });

    const table = findFirstElementByTag(blocks[0].root, 'table');
    const tbody = findFirstElementByTag(table, 'tbody');
    expect(tbody).toBeTruthy();

    const rows = (tbody.children ?? []).filter(
      (child: any) => child?.kind === 'element' && child.tagName === 'tr'
    );
    expect(rows).toHaveLength(2);
    expect(rowValues(rows[0])).toEqual(['Parse', 'Done']);
    expect(rowValues(rows[1])).toEqual(['Render', 'Running']);
  });

  it('splits table rows with whitespace text nodes between cells', () => {
    const service = createService();
    const markdown = [
      '<table>',
      '  <thead>',
      '    <tr>',
      '      <th>Step</th>',
      '      <th>Status</th>',
      '      <th>Owner</th>',
      '    </tr>',
      '  </thead>',
      '  <tbody>',
      '    <tr>',
      '      <td>Parse</td>',
      '      <td>Done</td>',
      '      <td>Alice</td>',
      '      <td>Render</td>',
      '      <td>Running</td>',
      '      <td>Bob</td>',
      '    </tr>',
      '  </tbody>',
      '</table>',
    ].join('\n');

    const blocks = service.renderBlocks(markdown, { mode: 'static' });
    const table = findFirstElementByTag(blocks[0].root, 'table');
    const tbody = findFirstElementByTag(table, 'tbody');
    expect(tbody).toBeTruthy();

    const rows = (tbody.children ?? []).filter(
      (child: any) => child?.kind === 'element' && child.tagName === 'tr'
    );
    expect(rows).toHaveLength(2);
    expect(rowValues(rows[0])).toEqual(['Parse', 'Done', 'Alice']);
    expect(rowValues(rows[1])).toEqual(['Render', 'Running', 'Bob']);
  });
});
