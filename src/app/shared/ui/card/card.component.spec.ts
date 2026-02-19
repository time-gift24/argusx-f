import { ChangeDetectionStrategy, Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ArgusxCardActionDirective, ArgusxCardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [ArgusxCardComponent, ArgusxCardActionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <argusx-card>
      Body
      <div card-footer>Footer</div>
      <button card-action type="button">Custom Action</button>
    </argusx-card>

    <ng-template #titleTpl>
      <span>Template Title</span>
    </ng-template>
    <ng-template #descriptionTpl>
      <span>Template Description</span>
    </ng-template>
  `,
})
class ProjectedCardHostComponent {
  @ViewChild(ArgusxCardComponent, { static: true })
  card!: ArgusxCardComponent;

  @ViewChild('titleTpl', { static: true })
  titleTpl!: TemplateRef<void>;

  @ViewChild('descriptionTpl', { static: true })
  descriptionTpl!: TemplateRef<void>;
}

describe('ArgusxCardComponent', () => {
  let fixture: ComponentFixture<ArgusxCardComponent>;
  let component: ArgusxCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgusxCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgusxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const card = (): HTMLElement => fixture.nativeElement as HTMLElement;

  it('renders with default root styling and attributes', () => {
    expect(card().getAttribute('data-slot')).toBe('card');
    expect(card().getAttribute('data-size')).toBe('default');
    expect(card().className).toContain('bg-card');
    expect(card().className).toContain('text-card-foreground');
    expect(card().className).toContain('border');
    expect(card().className).toContain('shadow-sm');
    expect(card().className).toContain('rounded-xl');
  });

  it('applies sm and lg size variants', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(card().getAttribute('data-size')).toBe('sm');
    expect(card().className).toContain('rounded-lg');

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(card().getAttribute('data-size')).toBe('lg');
    expect(card().className).toContain('rounded-2xl');
  });

  it('renders header only when title exists', () => {
    expect(card().querySelector('[data-slot="card-header"]')).toBeNull();

    fixture.componentRef.setInput('title', 'Card Title');
    fixture.detectChanges();
    expect(card().querySelector('[data-slot="card-header"]')).toBeTruthy();
  });

  it('renders description only when title exists', () => {
    fixture.componentRef.setInput('description', 'Description only');
    fixture.detectChanges();
    expect(card().textContent).not.toContain('Description only');

    fixture.componentRef.setInput('title', 'Card Title');
    fixture.componentRef.setInput('description', 'Description only');
    fixture.detectChanges();
    expect(card().textContent).toContain('Description only');
  });

  it('renders default action button and emits actionClick on click', () => {
    fixture.componentRef.setInput('title', 'Card Title');
    fixture.componentRef.setInput('action', 'Edit');
    fixture.detectChanges();

    const actionButton = card().querySelector('[data-slot="card-header"] button') as HTMLButtonElement | null;
    expect(actionButton).toBeTruthy();
    expect(actionButton?.textContent?.trim()).toBe('Edit');

    const emitSpy = vi.spyOn(component.actionClick, 'emit');
    actionButton?.click();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('applies header and footer border styles', () => {
    fixture.componentRef.setInput('title', 'Title');
    fixture.componentRef.setInput('headerBorder', true);
    fixture.componentRef.setInput('footerBorder', true);
    fixture.detectChanges();

    const header = card().querySelector('[data-slot="card-header"]');
    const footer = card().querySelector('[data-slot="card-footer"]');
    expect(header?.className).toContain('border-b');
    expect(footer?.className).toContain('border-t');
  });

  it('sets aria-labelledby and aria-describedby from generated IDs', () => {
    fixture.componentRef.setInput('title', 'Card Title');
    fixture.componentRef.setInput('description', 'Card Description');
    fixture.detectChanges();

    const titleId = card().getAttribute('aria-labelledby');
    const descriptionId = card().getAttribute('aria-describedby');
    expect(titleId).toBeTruthy();
    expect(descriptionId).toBeTruthy();

    const title = card().querySelector('[data-slot="card-title"]');
    const description = card().querySelector('[data-slot="card-description"]');
    expect(title?.getAttribute('id')).toBe(titleId);
    expect(description?.getAttribute('id')).toBe(descriptionId);
  });

  it('keeps aria-labelledby ID stable when title value changes', () => {
    fixture.componentRef.setInput('title', 'Initial');
    fixture.detectChanges();

    const firstId = card().getAttribute('aria-labelledby');
    expect(firstId).toBeTruthy();

    fixture.componentRef.setInput('title', 'Updated');
    fixture.detectChanges();

    const secondId = card().getAttribute('aria-labelledby');
    expect(secondId).toBe(firstId);
    expect(card().querySelector('[data-slot="card-title"]')?.getAttribute('id')).toBe(firstId);
  });

  it('renders empty footer when no card-footer slot is projected', () => {
    const footer = card().querySelector('[data-slot="card-footer"]');
    expect(footer?.textContent?.trim()).toBe('');
  });
});

describe('ArgusxCardComponent projected content', () => {
  let fixture: ComponentFixture<ProjectedCardHostComponent>;
  let host: ProjectedCardHostComponent;
  let cardElement: HTMLElement;
  let cardDebugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectedCardHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectedCardHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    cardDebugElement = fixture.debugElement.query(By.directive(ArgusxCardComponent));
    cardElement = cardDebugElement.nativeElement as HTMLElement;
  });

  it('supports TemplateRef title and description inputs', () => {
    host.card.titleInput = host.titleTpl;
    host.card.descriptionInput = host.descriptionTpl;
    fixture.detectChanges();

    expect(cardElement.textContent).toContain('Template Title');
    expect(cardElement.textContent).toContain('Template Description');
  });

  it('renders footer content when card-footer slot is projected', () => {
    fixture.detectChanges();
    const footer = cardElement.querySelector('[data-slot="card-footer"]');
    expect(footer?.textContent).toContain('Footer');
  });

  it('prefers card-action slot over default action text button', () => {
    host.card.titleInput = 'Meeting Notes';
    host.card.actionInput = 'Transcribe';
    fixture.detectChanges();

    expect(cardElement.textContent).toContain('Custom Action');
    expect(cardElement.textContent).not.toContain('Transcribe');
  });
});
