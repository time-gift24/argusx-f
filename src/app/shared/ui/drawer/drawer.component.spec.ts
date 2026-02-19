import { argusxDrawerContentVariants } from './drawer.component';

describe('argusxDrawerContentVariants', () => {
  it('removes small-screen max width cap when size is full', () => {
    const classes = argusxDrawerContentVariants({ direction: 'right', size: 'full' });

    expect(classes).toContain('w-[calc(100vw-2rem)]');
    expect(classes).toContain('sm:!max-w-[calc(100vw-2rem)]');
    expect(classes).not.toContain('sm:max-w-sm');
  });

  it('keeps drawer floating away from viewport edges', () => {
    const rightClasses = argusxDrawerContentVariants({ direction: 'right', size: 'default' });
    const bottomClasses = argusxDrawerContentVariants({ direction: 'bottom', size: 'default' });

    expect(rightClasses).toContain('top-4');
    expect(rightClasses).toContain('bottom-4');
    expect(rightClasses).toContain('right-4');
    expect(rightClasses).toContain('rounded-lg');

    expect(bottomClasses).toContain('inset-x-4');
    expect(bottomClasses).toContain('bottom-4');
    expect(bottomClasses).toContain('rounded-lg');
  });
});
