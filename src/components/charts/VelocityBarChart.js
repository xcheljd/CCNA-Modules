import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  modulesCompleted: {
    label: 'Modules Completed',
    color: 'var(--color-progress-complete)',
  },
};

function VelocityBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No velocity data yet. Complete modules to track your weekly progress!
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="my-2 mx-0 h-[250px] w-full">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          allowDecimals={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                if (payload?.length) return `Week of ${payload[0].payload.week}`;
              }}
              formatter={value => [`${value} modules completed`]}
            />
          }
        />
        <Bar
          dataKey="modulesCompleted"
          fill="var(--color-progress-complete)"
          radius={[8, 8, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ChartContainer>
  );
}

export default VelocityBarChart;
