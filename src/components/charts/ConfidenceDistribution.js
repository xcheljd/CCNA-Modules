import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function ConfidenceDistribution({ distribution }) {
  const data = [
    { name: 'Needs Review (1-2★)', value: distribution.needsReview, color: 'var(--color-confidence-low)' },
    { name: 'Moderate (3★)', value: distribution.moderate, color: 'var(--color-confidence-medium)' },
    { name: 'Confident (4-5★)', value: distribution.confident, color: 'var(--color-confidence-high)' },
    { name: 'Not Rated', value: distribution.notRated, color: 'var(--color-confidence-none)' },
  ].filter(item => item.value > 0); // Only show non-zero values

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600' }}>
            {payload[0].name}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: payload[0].payload.color,
              fontWeight: 'bold',
            }}
          >
            {payload[0].value} modules
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '13px',
        }}
      >
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: entry.color,
                borderRadius: '4px',
              }}
            />
            <span style={{ color: 'hsl(var(--foreground))' }}>
              {entry.value}: {entry.payload.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div
        style={{
          height: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(var(--muted-foreground))',
        }}
      >
        No confidence ratings yet. Rate modules as you complete them!
      </div>
    );
  }

  return (
    <div className="chart-container">
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
          <Legend content={<CustomLegend />} verticalAlign="middle" align="right" layout="vertical" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ConfidenceDistribution;
