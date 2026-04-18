import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function ConfidenceDistribution({ distribution }) {
  const data = [
    {
      name: 'Needs Review (1-2★)',
      value: distribution.needsReview,
      color: 'var(--color-confidence-low)',
    },
    {
      name: 'Moderate (3★)',
      value: distribution.moderate,
      color: 'var(--color-confidence-medium)',
    },
    {
      name: 'Confident (4-5★)',
      value: distribution.confident,
      color: 'var(--color-confidence-high)',
    },
    { name: 'Not Rated', value: distribution.notRated, color: 'var(--color-confidence-none)' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <p className="m-0 mb-1 text-[13px] font-semibold">{payload[0].name}</p>
          <p className="m-0 text-sm font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} modules
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-col gap-2 text-[13px]">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: entry.color }} />
            <span className="text-foreground">
              {entry.value}: {entry.payload.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No confidence ratings yet. Rate modules as you complete them!
      </div>
    );
  }

  return (
    <div className="my-2 mx-0">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={entry =>
              `${((entry.value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<CustomLegend />}
            verticalAlign="middle"
            align="right"
            layout="vertical"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ConfidenceDistribution;
