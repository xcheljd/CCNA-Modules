import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function VelocityBarChart({ data }) {
  if (!data || data.length === 0) {
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
        No velocity data yet. Complete modules to track your weekly progress!
      </div>
    );
  }

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
            Week of {payload[0].payload.week}
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: 'hsl(var(--foreground))', fontWeight: 'bold' }}>
            {payload[0].value} modules completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="modulesCompleted"
            fill="var(--color-progress-complete)"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VelocityBarChart;
