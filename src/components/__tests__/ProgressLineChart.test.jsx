import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressLineChart from '../charts/ProgressLineChart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
  Legend: () => <div data-testid="recharts-legend" />,
  LineChart: ({ children, data }) => (
    <div data-testid="line-chart" data-points={data?.length}>
      {children}
    </div>
  ),
  Line: ({ dataKey, stroke }) => <div data-testid="line" data-key={dataKey} data-stroke={stroke} />,
  XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: ({ domain }) => <div data-testid="y-axis" data-domain={JSON.stringify(domain)} />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

// Use real chart components to exercise chart.jsx branches
// Only mock recharts primitives

describe('ProgressLineChart', () => {
  const mockData = [
    { date: '2024-01-01', overallProgress: 10 },
    { date: '2024-01-02', overallProgress: 25 },
    { date: '2024-01-03', overallProgress: 50 },
  ];

  it('renders line chart when data is provided', () => {
    const { container } = render(<ProgressLineChart data={mockData} />);

    expect(container.querySelector('[data-chart]')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('shows empty state when data is null', () => {
    render(<ProgressLineChart data={null} />);

    expect(screen.getByText(/no progress data yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('shows empty state when data is empty array', () => {
    render(<ProgressLineChart data={[]} />);

    expect(
      screen.getByText('No progress data yet. Complete some videos to see your progress over time!')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('passes data to LineChart', () => {
    render(<ProgressLineChart data={mockData} />);

    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart).toHaveAttribute('data-points', '3');
  });

  it('renders line with correct dataKey', () => {
    render(<ProgressLineChart data={mockData} />);

    const line = screen.getByTestId('line');
    expect(line).toHaveAttribute('data-key', 'overallProgress');
  });

  it('renders x-axis with date dataKey', () => {
    render(<ProgressLineChart data={mockData} />);

    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('data-key', 'date');
  });

  it('renders y-axis with domain [0, 100]', () => {
    render(<ProgressLineChart data={mockData} />);

    const yAxis = screen.getByTestId('y-axis');
    expect(yAxis).toHaveAttribute('data-domain', JSON.stringify([0, 100]));
  });

  it('renders ChartStyle with config colors', () => {
    const { container } = render(<ProgressLineChart data={mockData} />);

    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style.textContent).toContain('--color-overallProgress');
  });

  it('renders with single data point', () => {
    render(<ProgressLineChart data={[{ date: '2024-01-01', overallProgress: 15 }]} />);

    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart).toHaveAttribute('data-points', '1');
  });
});
