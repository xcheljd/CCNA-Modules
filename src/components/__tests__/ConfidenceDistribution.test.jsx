import React from 'react';
import { render, screen } from '@testing-library/react';
import ConfidenceDistribution from '../charts/ConfidenceDistribution';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
  Legend: () => <div data-testid="recharts-legend" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children, data, label }) => (
    <div data-testid="pie" data-label={typeof label === 'function' ? 'function' : label}>
      {data?.map((item, i) => (
        <div key={i} data-testid="pie-cell">
          {item.name}
        </div>
      ))}
      {children}
    </div>
  ),
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
}));

// Use real chart components to exercise chart.jsx branches
// Only mock recharts primitives

describe('ConfidenceDistribution', () => {
  it('renders pie chart when distribution has positive values', () => {
    const distribution = {
      needsReview: 3,
      moderate: 2,
      confident: 5,
      notRated: 1,
    };
    const { container } = render(<ConfidenceDistribution distribution={distribution} />);

    // ChartContainer renders a div with data-chart attribute
    expect(container.querySelector('[data-chart]')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('shows empty state when all values are 0', () => {
    const distribution = {
      needsReview: 0,
      moderate: 0,
      confident: 0,
      notRated: 0,
    };
    render(<ConfidenceDistribution distribution={distribution} />);

    expect(screen.getByText(/no confidence ratings yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  it('shows empty state when distribution is all zeros', () => {
    const distribution = {
      needsReview: 0,
      moderate: 0,
      confident: 0,
      notRated: 0,
    };
    render(<ConfidenceDistribution distribution={distribution} />);

    expect(
      screen.getByText('No confidence ratings yet. Rate modules as you complete them!')
    ).toBeInTheDocument();
  });

  it('filters out zero-value items from chart data', () => {
    const distribution = {
      needsReview: 3,
      moderate: 0,
      confident: 5,
      notRated: 0,
    };
    render(<ConfidenceDistribution distribution={distribution} />);

    // Only needsReview and confident have values > 0
    const pieCells = screen.getAllByTestId('pie-cell');
    expect(pieCells).toHaveLength(2);
    expect(pieCells[0]).toHaveTextContent('Needs Review (1-2★)');
    expect(pieCells[1]).toHaveTextContent('Confident (4-5★)');
  });

  it('renders cells with fill colors for each data item', () => {
    const distribution = {
      needsReview: 2,
      moderate: 1,
      confident: 3,
      notRated: 4,
    };
    render(<ConfidenceDistribution distribution={distribution} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(4);
  });

  it('renders with only one positive value', () => {
    const distribution = {
      needsReview: 0,
      moderate: 0,
      confident: 0,
      notRated: 10,
    };
    render(<ConfidenceDistribution distribution={distribution} />);

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    const pieCells = screen.getAllByTestId('pie-cell');
    expect(pieCells).toHaveLength(1);
    expect(pieCells[0]).toHaveTextContent('Not Rated');
  });

  it('uses function label for percentage display', () => {
    const distribution = {
      needsReview: 5,
      moderate: 5,
      confident: 0,
      notRated: 0,
    };
    render(<ConfidenceDistribution distribution={distribution} />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-label', 'function');
  });

  it('renders ChartStyle with config colors', () => {
    const distribution = {
      needsReview: 1,
      moderate: 0,
      confident: 0,
      notRated: 0,
    };
    const { container } = render(<ConfidenceDistribution distribution={distribution} />);

    // ChartStyle should render a <style> tag with CSS variables
    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style.textContent).toContain('--color');
  });
});
