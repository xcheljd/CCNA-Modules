import React from 'react';
import { render, screen } from '@testing-library/react';
import VelocityBarChart from '../charts/VelocityBarChart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
  Legend: () => <div data-testid="recharts-legend" />,
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart" data-points={data?.length}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

// Use real chart components to exercise chart.jsx branches
// Only mock recharts primitives

describe('VelocityBarChart', () => {
  const mockData = [
    { week: '2024-W01', modulesCompleted: 3 },
    { week: '2024-W02', modulesCompleted: 5 },
    { week: '2024-W03', modulesCompleted: 2 },
  ];

  it('renders bar chart when data is provided', () => {
    const { container } = render(<VelocityBarChart data={mockData} />);

    expect(container.querySelector('[data-chart]')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('shows empty state when data is null', () => {
    render(<VelocityBarChart data={null} />);

    expect(screen.getByText(/no velocity data yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('shows empty state when data is empty array', () => {
    render(<VelocityBarChart data={[]} />);

    expect(
      screen.getByText('No velocity data yet. Complete modules to track your weekly progress!')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
  });

  it('passes data to BarChart', () => {
    render(<VelocityBarChart data={mockData} />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('data-points', '3');
  });

  it('renders bar with correct dataKey', () => {
    render(<VelocityBarChart data={mockData} />);

    const bar = screen.getByTestId('bar');
    expect(bar).toHaveAttribute('data-key', 'modulesCompleted');
  });

  it('renders x-axis with week dataKey', () => {
    render(<VelocityBarChart data={mockData} />);

    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('data-key', 'week');
  });

  it('renders ChartStyle with config colors', () => {
    const { container } = render(<VelocityBarChart data={mockData} />);

    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style.textContent).toContain('--color-modulesCompleted');
  });

  it('renders with single data point', () => {
    render(<VelocityBarChart data={[{ week: '2024-W01', modulesCompleted: 7 }]} />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('data-points', '1');
  });
});
