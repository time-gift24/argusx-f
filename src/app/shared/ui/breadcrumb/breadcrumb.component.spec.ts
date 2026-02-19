import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  ArgusxBreadcrumbComponent,
  ArgusxBreadcrumbEllipsisComponent,
  ArgusxBreadcrumbItemComponent,
  ArgusxBreadcrumbLinkComponent,
  ArgusxBreadcrumbListComponent,
  ArgusxBreadcrumbPageComponent,
  ArgusxBreadcrumbSeparatorComponent,
} from './breadcrumb.component';

@Component({
  standalone: true,
  imports: [
    ArgusxBreadcrumbComponent,
    ArgusxBreadcrumbListComponent,
    ArgusxBreadcrumbItemComponent,
    ArgusxBreadcrumbLinkComponent,
    ArgusxBreadcrumbPageComponent,
    ArgusxBreadcrumbSeparatorComponent,
    ArgusxBreadcrumbEllipsisComponent,
  ],
  template: `
    <argusx-breadcrumb [size]="'lg'">
      <argusx-breadcrumb-list [align]="'center'" [wrap]="'nowrap'">
        <argusx-breadcrumb-item>
          <a argusxBreadcrumbLink href="/docs">Docs</a>
        </argusx-breadcrumb-item>
        <argusx-breadcrumb-separator />
        <argusx-breadcrumb-item>
          <argusx-breadcrumb-page>Current</argusx-breadcrumb-page>
        </argusx-breadcrumb-item>
      </argusx-breadcrumb-list>
    </argusx-breadcrumb>

    <argusx-breadcrumb>
      <argusx-breadcrumb-list>
        <argusx-breadcrumb-item>
          <span argusxBreadcrumbEllipsis [ellipsisColor]="'strong'"></span>
        </argusx-breadcrumb-item>
        <argusx-breadcrumb-separator><span>/</span></argusx-breadcrumb-separator>
      </argusx-breadcrumb-list>
    </argusx-breadcrumb>

    <nav argusxBreadcrumb>
      <ol argusxBreadcrumbList>
        <li argusxBreadcrumbItem>
          <a argusxBreadcrumbLink href="#">Home</a>
        </li>
        <li argusxBreadcrumbSeparator>
          <span class="custom-separator">›</span>
        </li>
        <li argusxBreadcrumbItem>
          <span argusxBreadcrumbPage>Products</span>
        </li>
      </ol>
    </nav>
  `,
})
class ComponentSelectorHostComponent {}

@Component({
  standalone: true,
  imports: [
    ArgusxBreadcrumbComponent,
    ArgusxBreadcrumbListComponent,
    ArgusxBreadcrumbItemComponent,
    ArgusxBreadcrumbLinkComponent,
    ArgusxBreadcrumbPageComponent,
    ArgusxBreadcrumbSeparatorComponent,
    RouterLink,
  ],
  template: `
    <nav argusxBreadcrumb size="sm">
      <ol argusxBreadcrumbList align="start" wrap="wrap">
        <li argusxBreadcrumbItem>
          <a argusxBreadcrumbLink [routerLink]="['/docs']">Docs</a>
        </li>
        <li argusxBreadcrumbSeparator></li>
        <li argusxBreadcrumbItem>
          <span argusxBreadcrumbPage>API</span>
        </li>
      </ol>
    </nav>
  `,
})
class SemanticSelectorHostComponent {}

describe('ArgusxBreadcrumbComponent (component selectors)', () => {
  let fixture: ComponentFixture<ComponentSelectorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSelectorHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentSelectorHostComponent);
    fixture.detectChanges();
  });

  it('does not render default icon when projected separator icon is provided', () => {
    const semanticSeparators = fixture.nativeElement.querySelectorAll('li[data-slot="breadcrumb-separator"]');
    const customSeparator = semanticSeparators[0] as HTMLElement;
    expect(customSeparator.querySelector('lucide-icon[data-default-separator-icon]')).toBeFalsy();
    expect(customSeparator.querySelector('.custom-separator')).toBeTruthy();
  });

  it('renders breadcrumb slots and accessibility attributes', () => {
    const root = fixture.nativeElement.querySelector('[data-slot="breadcrumb"]');
    const list = fixture.nativeElement.querySelector('[data-slot="breadcrumb-list"]');
    const item = fixture.nativeElement.querySelector('[data-slot="breadcrumb-item"]');
    const link = fixture.nativeElement.querySelector('[data-slot="breadcrumb-link"]');
    const page = fixture.nativeElement.querySelector('[data-slot="breadcrumb-page"]');
    const separator = fixture.nativeElement.querySelector('[data-slot="breadcrumb-separator"]');
    const ellipsis = fixture.nativeElement.querySelector('[data-slot="breadcrumb-ellipsis"]');

    expect(root).toBeTruthy();
    expect(list).toBeTruthy();
    expect(item).toBeTruthy();
    expect(link).toBeTruthy();
    expect(page).toBeTruthy();
    expect(separator).toBeTruthy();
    expect(ellipsis).toBeTruthy();

    expect(root.getAttribute('aria-label')).toBe('breadcrumb');
    expect(page.getAttribute('role')).toBe('link');
    expect(page.getAttribute('aria-disabled')).toBe('true');
    expect(page.getAttribute('aria-current')).toBe('page');
    expect(separator.getAttribute('role')).toBe('presentation');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies size/align/wrap and ellipsisColor states', () => {
    const root = fixture.nativeElement.querySelector('argusx-breadcrumb[data-size="lg"]');
    const list = fixture.nativeElement.querySelector('argusx-breadcrumb-list');
    const ellipsis = fixture.nativeElement.querySelector('[data-slot="breadcrumb-ellipsis"]');

    expect(root).toBeTruthy();
    expect(root.className).toContain('text-base');

    expect(list.getAttribute('data-align')).toBe('center');
    expect(list.getAttribute('data-wrap')).toBe('nowrap');
    expect(list.className).toContain('justify-center');
    expect(list.className).toContain('flex-nowrap');

    expect(ellipsis.getAttribute('data-color')).toBe('strong');
    expect(ellipsis.className).toContain('text-foreground');
  });

  it('renders default separator icon and prefers projected content when provided', () => {
    const separators = fixture.nativeElement.querySelectorAll('[data-slot="breadcrumb-separator"]');
    const defaultSeparator = separators[0] as HTMLElement;
    const customSeparator = separators[1] as HTMLElement;

    expect(defaultSeparator.querySelector('lucide-icon')).toBeTruthy();
    expect(customSeparator.querySelector('lucide-icon')).toBeFalsy();
    expect(customSeparator.textContent?.trim()).toBe('/');
  });
});

describe('ArgusxBreadcrumbComponent (semantic selectors)', () => {
  let fixture: ComponentFixture<SemanticSelectorHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemanticSelectorHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SemanticSelectorHostComponent);
    fixture.detectChanges();
  });

  it('supports semantic attribute selectors with correct slots', () => {
    const nav = fixture.nativeElement.querySelector('nav[data-slot="breadcrumb"]');
    const ol = fixture.nativeElement.querySelector('ol[data-slot="breadcrumb-list"]');
    const li = fixture.nativeElement.querySelector('li[data-slot="breadcrumb-item"]');
    const anchor = fixture.nativeElement.querySelector('a[data-slot="breadcrumb-link"]');
    const page = fixture.nativeElement.querySelector('span[data-slot="breadcrumb-page"]');

    expect(nav).toBeTruthy();
    expect(ol).toBeTruthy();
    expect(li).toBeTruthy();
    expect(anchor).toBeTruthy();
    expect(page).toBeTruthy();
  });

  it('keeps routerLink usable on anchor selector path', () => {
    const routerLink = fixture.debugElement.query(By.directive(RouterLink));
    expect(routerLink).toBeTruthy();
  });
});
