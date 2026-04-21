import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartContainer, ChartTooltipContent, ChartLegendContent, ChartStyle } from '../ui/chart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
  Legend: () => <div data-testid="recharts-legend" />,
}));

const baseConfig = {
  progress: { label: 'Progress', color: '#22c55e' },
  velocity: { label: 'Velocity', color: '#3b82f6' },
};

describe('ChartContainer', () => {
  it('renders children inside a div with data-chart attribute', () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <div data-testid="child" />
      </ChartContainer>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    const chartDiv = container.querySelector('[data-chart]');
    expect(chartDiv).toBeInTheDocument();
    expect(chartDiv.getAttribute('data-chart')).toMatch(/^chart-/);
  });

  it('uses provided id when given', () => {
    const { container } = render(
      <ChartContainer id="my-chart" config={baseConfig}>
        <div />
      </ChartContainer>
    );

    const chartDiv = container.querySelector('[data-chart]');
    expect(chartDiv.getAttribute('data-chart')).toBe('chart-my-chart');
  });

  it('generates unique id when no id provided', () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <div />
      </ChartContainer>
    );

    const chartDiv = container.querySelector('[data-chart]');
    expect(chartDiv.getAttribute('data-chart')).toMatch(/^chart-/);
    expect(chartDiv.getAttribute('data-chart')).not.toBe('chart-');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChartContainer config={baseConfig} className="my-class">
        <div />
      </ChartContainer>
    );

    const chartDiv = container.querySelector('[data-chart]');
    expect(chartDiv.classList.contains('my-class')).toBe(true);
  });

  it('renders ChartStyle and ResponsiveContainer', () => {
    render(
      <ChartContainer config={baseConfig}>
        <div data-testid="child" />
      </ChartContainer>
    );

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('provides config via context', () => {
    const ConfigReader = () => {
      // ChartTooltipContent uses useChart internally, testing indirectly
      return <ChartTooltipContent active payload={[]} />;
    };

    render(
      <ChartContainer config={baseConfig}>
        <ConfigReader />
      </ChartContainer>
    );
    // Should not throw
  });
});

describe('ChartStyle', () => {
  it('returns null when config has no theme or color entries', () => {
    const { container } = render(<ChartStyle id="test" config={{}} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders a style tag when config has color entries', () => {
    const { container } = render(<ChartStyle id="test" config={{ foo: { color: '#ff0000' } }} />);

    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style.textContent).toContain('--color-foo: #ff0000');
  });

  it('renders a style tag when config has theme entries', () => {
    const { container } = render(
      <ChartStyle id="test" config={{ bar: { theme: { light: '#00ff00', dark: '#00aa00' } } }} />
    );

    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style.textContent).toContain('--color-bar: #00ff00');
    expect(style.textContent).toContain('--color-bar: #00aa00');
  });

  it('handles config items with no matching color or theme', () => {
    const { container } = render(<ChartStyle id="test" config={{ baz: { label: 'Baz' } }} />);

    // Has label but no color/theme, so no style tag
    expect(container.querySelector('style')).toBeNull();
  });
});

describe('ChartTooltipContent', () => {
  it('returns null when not active', () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={false} payload={[]} />
      </ChartContainer>
    );

    // The ChartTooltipContent returns null, only the container div should be present
    // Check no shadow-xl class (from tooltip container) exists
    expect(container.querySelectorAll('[class*="shadow-xl"]')).toHaveLength(0);
  });

  it('returns null when payload is empty', () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={[]} />
      </ChartContainer>
    );

    expect(container.querySelectorAll('[class*="shadow-xl"]')).toHaveLength(0);
  });

  it('renders tooltip with active payload using dot indicator', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} />
      </ChartContainer>
    );

    // Should render the tooltip container
    expect(container.textContent).toContain('50');
    expect(container.textContent).toContain('Progress');
  });

  it('renders tooltip with custom formatter', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 75,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent
          active={true}
          payload={payload}
          formatter={(value, name) => <span data-testid="formatted">{`${value}%`}</span>}
        />
      </ChartContainer>
    );

    expect(screen.getByTestId('formatted')).toBeInTheDocument();
    expect(screen.getByTestId('formatted').textContent).toBe('75%');
  });

  it('hides indicator when hideIndicator is true', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} hideIndicator={true} />
      </ChartContainer>
    );

    // Should render but without indicator div
    expect(container.textContent).toContain('Progress');
    expect(container.textContent).toContain('50');
    // The indicator div with --color-bg style should not be present
    const indicatorDivs = container.querySelectorAll('[style*="--color-bg"]');
    expect(indicatorDivs.length).toBe(0);
  });

  it('renders with icon from config', () => {
    const Icon = () => <svg data-testid="custom-icon" />;
    const configWithIcon = {
      progress: { label: 'Progress', icon: Icon },
    };

    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    render(
      <ChartContainer config={configWithIcon}>
        <ChartTooltipContent active={true} payload={payload} />
      </ChartContainer>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders line indicator when indicator is "line"', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} indicator="line" />
      </ChartContainer>
    );

    // Line indicator should render with w-1 class
    const indicator = container.querySelector('[style*="--color-bg"]');
    expect(indicator).toBeInTheDocument();
  });

  it('renders dashed indicator when indicator is "dashed"', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} indicator="dashed" />
      </ChartContainer>
    );

    const indicator = container.querySelector('[style*="--color-bg"]');
    expect(indicator).toBeInTheDocument();
  });

  it('filters out items with type "none"', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
      {
        dataKey: 'hidden',
        name: 'hidden',
        value: 10,
        color: '#ccc',
        type: 'none',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} />
      </ChartContainer>
    );

    expect(container.textContent).toContain('50');
    expect(container.textContent).not.toContain('10');
  });

  it('uses labelFormatter when provided', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent
          active={true}
          payload={payload}
          label="test-label"
          labelFormatter={value => `Formatted: ${value}`}
        />
      </ChartContainer>
    );

    expect(screen.getByText('Formatted: test-label')).toBeInTheDocument();
  });

  it('hides label when hideLabel is true', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent
          active={true}
          payload={payload}
          hideLabel={true}
          label="should-not-appear"
        />
      </ChartContainer>
    );

    expect(screen.queryByText('should-not-appear')).not.toBeInTheDocument();
  });

  it('nests label when single payload item with non-dot indicator', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} indicator="line" label="test-label" />
      </ChartContainer>
    );

    // With single item and non-dot indicator, label should be nested inside item
    expect(container.textContent).toContain('test-label');
  });

  it('uses color prop for indicator color', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: { fill: '#aaaaaa' },
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} color="#custom-color" />
      </ChartContainer>
    );

    const indicator = container.querySelector('[style*="--color-bg"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator.style.getPropertyValue('--color-bg')).toBe('#custom-color');
  });

  it('uses payload.fill for indicator color when no color prop', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: { fill: '#fill-color' },
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} />
      </ChartContainer>
    );

    const indicator = container.querySelector('[style*="--color-bg"]');
    expect(indicator.style.getPropertyValue('--color-bg')).toBe('#fill-color');
  });

  it('uses nameKey for item config lookup', () => {
    const payload = [
      {
        dataKey: 'data-progress',
        name: 'data-progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} nameKey="progress" />
      </ChartContainer>
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('handles falsy item.value', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 0,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} />
      </ChartContainer>
    );

    // Should still render the label
    expect(container.textContent).toContain('Progress');
  });
});

describe('ChartLegendContent', () => {
  it('returns null when payload is empty', () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent payload={[]} />
      </ChartContainer>
    );

    // Only the chart container div should be rendered, not the legend
    const legendDivs = container.querySelectorAll('.flex.items-center.justify-center');
    expect(legendDivs.length).toBe(0);
  });

  it('returns null when payload is undefined', () => {
    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent />
      </ChartContainer>
    );

    const legendDivs = container.querySelectorAll('.flex.items-center.justify-center');
    expect(legendDivs.length).toBe(0);
  });

  it('renders legend items with labels', () => {
    const payload = [
      { value: 'progress', dataKey: 'progress', color: '#22c55e', type: 'line' },
      { value: 'velocity', dataKey: 'velocity', color: '#3b82f6', type: 'line' },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent payload={payload} />
      </ChartContainer>
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Velocity')).toBeInTheDocument();
  });

  it('renders colored dots when no icon in config', () => {
    const payload = [{ value: 'progress', dataKey: 'progress', color: '#22c55e', type: 'line' }];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent payload={payload} />
      </ChartContainer>
    );

    const dot = container.querySelector('[style*="background-color"]');
    expect(dot).toBeInTheDocument();
    expect(dot.style.backgroundColor).toBe('rgb(34, 197, 94)'); // #22c55e
  });

  it('renders icons when config has icon and hideIcon is false', () => {
    const Icon = () => <svg data-testid="legend-icon" />;
    const configWithIcon = {
      progress: { label: 'Progress', icon: Icon },
    };

    const payload = [{ value: 'progress', dataKey: 'progress', color: '#22c55e', type: 'line' }];

    render(
      <ChartContainer config={configWithIcon}>
        <ChartLegendContent payload={payload} hideIcon={false} />
      </ChartContainer>
    );

    expect(screen.getByTestId('legend-icon')).toBeInTheDocument();
  });

  it('hides icons when hideIcon is true', () => {
    const Icon = () => <svg data-testid="legend-icon" />;
    const configWithIcon = {
      progress: { label: 'Progress', icon: Icon },
    };

    const payload = [{ value: 'progress', dataKey: 'progress', color: '#22c55e', type: 'line' }];

    const { container } = render(
      <ChartContainer config={configWithIcon}>
        <ChartLegendContent payload={payload} hideIcon={true} />
      </ChartContainer>
    );

    expect(screen.queryByTestId('legend-icon')).not.toBeInTheDocument();
    // Should show dot instead
    const dot = container.querySelector('[style*="background-color"]');
    expect(dot).toBeInTheDocument();
  });

  it('filters out items with type "none"', () => {
    const payload = [
      { value: 'progress', dataKey: 'progress', color: '#22c55e', type: 'line' },
      { value: 'hidden', dataKey: 'hidden', color: '#ccc', type: 'none' },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent payload={payload} />
      </ChartContainer>
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('uses nameKey for config lookup', () => {
    const payload = [
      { value: 'some-value', dataKey: 'some-dataKey', color: '#22c55e', type: 'line' },
    ];

    render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent payload={payload} nameKey="progress" />
      </ChartContainer>
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('applies verticalAlign top class', () => {
    const payload = [{ value: 'progress', dataKey: 'progress', color: '#22c55e', type: 'line' }];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartLegendContent payload={payload} verticalAlign="top" />
      </ChartContainer>
    );

    const legendDiv = container.querySelector('.pb-3');
    expect(legendDiv).toBeInTheDocument();
  });
});

describe('getPayloadConfigFromPayload (indirect tests)', () => {
  it('handles non-object payload', () => {
    // Tested indirectly via ChartTooltipContent with bad payload
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: 'not-an-object',
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} />
      </ChartContainer>
    );

    // Should not crash
    expect(container.textContent).toContain('50');
  });

  it('handles null item payload', () => {
    const payload = [
      {
        dataKey: 'progress',
        name: 'progress',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: null,
      },
    ];

    // chart.jsx accesses item.payload.fill, so null payload will throw
    // This tests the getPayloadConfigFromPayload helper with null payload
    expect(() => {
      render(
        <ChartContainer config={baseConfig}>
          <ChartTooltipContent active={true} payload={payload} />
        </ChartContainer>
      );
    }).toThrow();
  });

  it('looks up config from payload key string', () => {
    const payload = [
      {
        dataKey: 'myKey',
        name: 'myKey',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: { myKey: 'progress' },
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} nameKey="myKey" />
      </ChartContainer>
    );

    expect(container.textContent).toContain('Progress');
  });

  it('falls back to direct key lookup when key not in payload', () => {
    const payload = [
      {
        dataKey: 'unknown',
        name: 'unknown',
        value: 50,
        color: '#22c55e',
        type: 'line',
        payload: {},
      },
    ];

    const { container } = render(
      <ChartContainer config={baseConfig}>
        <ChartTooltipContent active={true} payload={payload} nameKey="progress" />
      </ChartContainer>
    );

    // Should find config by the nameKey "progress"
    expect(container.textContent).toContain('Progress');
  });
});
