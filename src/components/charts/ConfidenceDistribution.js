import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartConfig = {
  needsReview: {
    label: 'Needs Review (1-2★)',
    color: 'var(--color-confidence-low)',
  },
  moderate: {
    label: 'Moderate (3★)',
    color: 'var(--color-confidence-medium)',
  },
  confident: {
    label: 'Confident (4-5★)',
    color: 'var(--color-confidence-high)',
  },
  notRated: {
    label: 'Not Rated',
    color: 'var(--color-confidence-none)',
  },
};

function ConfidenceDistribution({ distribution }) {
  const data = [
    {
      name: 'Needs Review (1-2★)',
      value: distribution.needsReview,
      key: 'needsReview',
      fill: 'var(--color-confidence-low)',
    },
    {
      name: 'Moderate (3★)',
      value: distribution.moderate,
      key: 'moderate',
      fill: 'var(--color-confidence-medium)',
    },
    {
      name: 'Confident (4-5★)',
      value: distribution.confident,
      key: 'confident',
      fill: 'var(--color-confidence-high)',
    },
    {
      name: 'Not Rated',
      value: distribution.notRated,
      key: 'notRated',
      fill: 'var(--color-confidence-none)',
    },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No confidence ratings yet. Rate modules as you complete them!
      </div>
    );
  }

  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <ChartContainer config={chartConfig} className="my-2 mx-0 h-[250px] w-full">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={entry => `${((entry.value / total) * 100).toFixed(0)}%`}
          outerRadius={80}
          dataKey="value"
          nameKey="key"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip
          content={<ChartTooltipContent formatter={(value, _name) => [`${value} modules`]} />}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="key" />}
          verticalAlign="middle"
          align="right"
          layout="vertical"
        />
      </PieChart>
    </ChartContainer>
  );
}

export default ConfidenceDistribution;
