import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toggle, toggleVariants } from '../ui/toggle';

describe('Toggle', () => {
  // Renders Toggle with children
  it('should render Toggle with children', () => {
    render(<Toggle>Toggle Me</Toggle>);

    expect(screen.getByText('Toggle Me')).toBeInTheDocument();
  });

  // Renders Toggle with default variant
  it('should render Toggle with default variant class', () => {
    const { container } = render(<Toggle>Default</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle).toBeTruthy();
    expect(toggle.className).toContain('bg-transparent');
  });

  // Renders Toggle with outline variant
  it('should render Toggle with outline variant class', () => {
    const { container } = render(<Toggle variant="outline">Outline</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle.className).toContain('border');
    expect(toggle.className).toContain('border-input');
  });

  // Renders Toggle with size variants
  it('should render Toggle with size="sm"', () => {
    const { container } = render(<Toggle size="sm">Small</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle.className).toContain('h-9');
  });

  it('should render Toggle with size="lg"', () => {
    const { container } = render(<Toggle size="lg">Large</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle.className).toContain('h-11');
  });

  it('should render Toggle with size="default"', () => {
    const { container } = render(<Toggle size="default">Default Size</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle.className).toContain('h-10');
  });

  // Applies custom className
  it('should apply custom className', () => {
    const { container } = render(<Toggle className="custom-class">Custom</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle.className).toContain('custom-class');
  });

  // Renders as pressed state
  it('should render with defaultPressed', () => {
    const { container } = render(<Toggle defaultPressed>Pressed</Toggle>);

    const toggle = container.querySelector('button');
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  // Verify displayName
  it('should have displayName on Toggle', () => {
    expect(Toggle.displayName).toBeTruthy();
  });

  // Verify toggleVariants function
  describe('toggleVariants', () => {
    it('should return a string with base classes', () => {
      const result = toggleVariants();
      expect(typeof result).toBe('string');
      expect(result).toContain('inline-flex');
    });

    it('should return default variant classes', () => {
      const result = toggleVariants();
      expect(result).toContain('bg-transparent');
    });

    it('should return outline variant classes', () => {
      const result = toggleVariants({ variant: 'outline' });
      expect(result).toContain('border');
      expect(result).toContain('border-input');
    });

    it('should return size="sm" classes', () => {
      const result = toggleVariants({ size: 'sm' });
      expect(result).toContain('h-9');
    });

    it('should return size="lg" classes', () => {
      const result = toggleVariants({ size: 'lg' });
      expect(result).toContain('h-11');
    });

    it('should combine variant and size', () => {
      const result = toggleVariants({ variant: 'outline', size: 'sm' });
      expect(result).toContain('border');
      expect(result).toContain('h-9');
    });
  });
});
