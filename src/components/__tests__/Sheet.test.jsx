import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => 'X',
}));

describe('Sheet', () => {
  // Renders SheetContent with children
  it('should render SheetContent with children', () => {
    render(
      <Sheet open>
        <SheetContent>
          <p>Sheet body content</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Sheet body content')).toBeInTheDocument();
  });

  // Renders SheetContent with side prop variations
  it('should render SheetContent with side="top"', () => {
    render(
      <Sheet open>
        <SheetContent side="top">
          <p>Top sheet</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Top sheet')).toBeInTheDocument();
  });

  it('should render SheetContent with side="left"', () => {
    render(
      <Sheet open>
        <SheetContent side="left">
          <p>Left sheet</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Left sheet')).toBeInTheDocument();
  });

  it('should render SheetContent with side="bottom"', () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <p>Bottom sheet</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Bottom sheet')).toBeInTheDocument();
  });

  // Renders SheetHeader, SheetFooter, SheetTitle, SheetDescription
  it('should render SheetHeader with children', () => {
    render(
      <SheetHeader>
        <span>Header content</span>
      </SheetHeader>
    );

    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should render SheetFooter with children', () => {
    render(
      <SheetFooter>
        <span>Footer content</span>
      </SheetFooter>
    );

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should render SheetTitle', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
  });

  it('should render SheetDescription', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetDescription>Sheet description text</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Sheet description text')).toBeInTheDocument();
  });

  // Renders complete Sheet with all subcomponents
  it('should render a complete Sheet with all subcomponents', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Complete Title</SheetTitle>
            <SheetDescription>Complete description</SheetDescription>
          </SheetHeader>
          <p>Body content</p>
          <SheetFooter>
            <span>Footer</span>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Complete Title')).toBeInTheDocument();
    expect(screen.getByText('Complete description')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  // Renders close button with sr-only text
  it('should render close button with sr-only text', () => {
    render(
      <Sheet open>
        <SheetContent>
          <p>Content</p>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  // Verify displayName on forwardRef components
  it('should have displayName on SheetOverlay', () => {
    expect(SheetOverlay.displayName).toBeTruthy();
  });

  it('should have displayName on SheetContent', () => {
    expect(SheetContent.displayName).toBeTruthy();
  });

  it('should have displayName on SheetHeader', () => {
    expect(SheetHeader.displayName).toBe('SheetHeader');
  });

  it('should have displayName on SheetFooter', () => {
    expect(SheetFooter.displayName).toBe('SheetFooter');
  });

  it('should have displayName on SheetTitle', () => {
    expect(SheetTitle.displayName).toBeTruthy();
  });

  it('should have displayName on SheetDescription', () => {
    expect(SheetDescription.displayName).toBeTruthy();
  });

  // Verify exports exist
  it('should export Sheet (Root)', () => {
    expect(Sheet).toBeDefined();
  });

  it('should export SheetPortal', () => {
    expect(SheetPortal).toBeDefined();
  });

  it('should export SheetTrigger', () => {
    expect(SheetTrigger).toBeDefined();
  });

  it('should export SheetClose', () => {
    expect(SheetClose).toBeDefined();
  });

  // SheetHeader and SheetFooter accept className
  it('should apply className to SheetHeader', () => {
    const { container } = render(
      <SheetHeader className="custom-header-class">
        <span>Header</span>
      </SheetHeader>
    );

    const header = container.firstChild;
    expect(header.className).toContain('custom-header-class');
  });

  it('should apply className to SheetFooter', () => {
    const { container } = render(
      <SheetFooter className="custom-footer-class">
        <span>Footer</span>
      </SheetFooter>
    );

    const footer = container.firstChild;
    expect(footer.className).toContain('custom-footer-class');
  });

  // SheetContent with custom className
  it('should apply className to SheetContent', () => {
    const { container } = render(
      <Sheet open>
        <SheetContent className="custom-class">
          <p>Content</p>
        </SheetContent>
      </Sheet>
    );

    // Find the content element (rendered by Radix Dialog.Content)
    const contentEl = screen.getByText('Content').closest('[class]');
    expect(contentEl.className).toContain('custom-class');
  });
});
