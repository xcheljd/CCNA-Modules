import React from 'react';
import { render, screen } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Circle: () => 'Circle',
}));

describe('RadioGroup', () => {
  // Renders RadioGroup with items
  it('should render RadioGroup with items', () => {
    render(
      <RadioGroup defaultValue="option1">
        <div>
          <RadioGroupItem value="option1" id="r1" />
          <label htmlFor="r1">Option 1</label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="r2" />
          <label htmlFor="r2">Option 2</label>
        </div>
      </RadioGroup>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  // Renders RadioGroup with className
  it('should apply className to RadioGroup', () => {
    const { container } = render(
      <RadioGroup className="custom-class" defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>
    );

    const group = container.firstChild;
    expect(group.className).toContain('custom-class');
  });

  // Renders RadioGroupItem with className
  it('should apply className to RadioGroupItem', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" className="custom-item-class" />
      </RadioGroup>
    );

    const item =
      container.querySelector('[value="a"]') || container.querySelector('[role="radio"]');
    expect(item).toBeTruthy();
    expect(item.className).toContain('custom-item-class');
  });

  // Verify displayName
  it('should have displayName on RadioGroup', () => {
    expect(RadioGroup.displayName).toBeTruthy();
  });

  it('should have displayName on RadioGroupItem', () => {
    expect(RadioGroupItem.displayName).toBeTruthy();
  });

  // Renders default styles
  it('should render RadioGroup with default grid gap class', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>
    );

    const group = container.firstChild;
    expect(group.className).toContain('grid');
    expect(group.className).toContain('gap-2');
  });

  // RadioGroupItem has rounded-full class
  it('should render RadioGroupItem with rounded-full class', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>
    );

    const item = container.querySelector('[value="a"]');
    expect(item.className).toContain('rounded-full');
  });

  // Renders with default value selected
  it('should render with defaultValue', () => {
    render(
      <RadioGroup defaultValue="b">
        <RadioGroupItem value="a" id="ra" />
        <RadioGroupItem value="b" id="rb" />
      </RadioGroup>
    );

    // RadioGroup should render without errors
    expect(screen.getByText('Circle')).toBeTruthy();
  });

  // Renders multiple items
  it('should render multiple RadioGroupItems', () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
        <RadioGroupItem value="c" />
      </RadioGroup>
    );

    const items = container.querySelectorAll('[role="radio"]');
    expect(items.length).toBe(3);
  });

  // Circle indicator is rendered inside RadioGroupItem
  it('should render Circle indicator inside RadioGroupItem', () => {
    render(
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
      </RadioGroup>
    );

    expect(screen.getByText('Circle')).toBeInTheDocument();
  });
});
