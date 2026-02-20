import { describe, expect, it } from 'vitest';

import {
  focusAdjacentItem,
  focusAdjacentMenuItem,
  focusItemByIndex,
  getCommandFocusableItems,
  getFocusableItemsBySelector,
  focusMenuItemByIndex,
  getMenuFocusableItems,
} from './focus';

describe('menu-core focus utilities', () => {
  it('collects only focusable menu roles', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button role="menuitem" tabindex="0">A</button>
      <button role="menuitemcheckbox" tabindex="0">B</button>
      <button role="menuitemradio" tabindex="-1">C</button>
      <button role="button" tabindex="0">D</button>
    `;

    const items = getMenuFocusableItems(container);
    expect(items.length).toBe(2);
    expect(items[0]?.textContent).toContain('A');
    expect(items[1]?.textContent).toContain('B');
  });

  it('collects command options including tabIndex -1 items', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div role="option" tabindex="-1">A</div>
      <div role="option" tabindex="0" aria-disabled="true">B</div>
      <div role="option" tabindex="0">C</div>
    `;

    const items = getCommandFocusableItems(container);
    expect(items.length).toBe(2);
    expect(items[0]?.textContent).toContain('A');
    expect(items[1]?.textContent).toContain('C');
  });

  it('queries focusable items by selector and custom tab index', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button class="target" tabindex="-1">A</button>
      <button class="target" tabindex="0">B</button>
      <button class="target" tabindex="0" disabled>C</button>
    `;

    const defaultItems = getFocusableItemsBySelector(container, '.target');
    expect(defaultItems.length).toBe(1);
    expect(defaultItems[0]?.textContent).toContain('B');

    const includeMinusOne = getFocusableItemsBySelector(container, '.target', -1);
    expect(includeMinusOne.length).toBe(2);
  });

  it('focuses first and last items by index semantics', () => {
    const first = document.createElement('button');
    first.role = 'menuitem';
    first.tabIndex = 0;

    const second = document.createElement('button');
    second.role = 'menuitem';
    second.tabIndex = 0;

    document.body.append(first, second);

    focusMenuItemByIndex([first, second], 0);
    expect(document.activeElement).toBe(first);

    focusMenuItemByIndex([first, second], -1);
    expect(document.activeElement).toBe(second);

    first.remove();
    second.remove();
  });

  it('focuses items via generic index helper', () => {
    const first = document.createElement('button');
    first.tabIndex = 0;
    const second = document.createElement('button');
    second.tabIndex = 0;

    document.body.append(first, second);

    focusItemByIndex([first, second], 1);
    expect(document.activeElement).toBe(second);

    focusItemByIndex([first, second], -1);
    expect(document.activeElement).toBe(second);

    first.remove();
    second.remove();
  });

  it('moves focus to adjacent item with wrap-around', () => {
    const first = document.createElement('button');
    first.role = 'menuitem';
    first.tabIndex = 0;

    const second = document.createElement('button');
    second.role = 'menuitem';
    second.tabIndex = 0;

    document.body.append(first, second);
    first.focus();

    focusAdjacentMenuItem([first, second], 1, document.activeElement);
    expect(document.activeElement).toBe(second);

    focusAdjacentMenuItem([first, second], 1, document.activeElement);
    expect(document.activeElement).toBe(first);

    first.remove();
    second.remove();
  });

  it('moves focus with generic adjacent helper', () => {
    const first = document.createElement('button');
    first.tabIndex = 0;
    const second = document.createElement('button');
    second.tabIndex = 0;

    document.body.append(first, second);
    first.focus();

    focusAdjacentItem([first, second], 1, document.activeElement);
    expect(document.activeElement).toBe(second);

    second.remove();
    first.remove();
  });
});
