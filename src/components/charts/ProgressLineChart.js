import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  overallProgress: {
    label: 'Progress',
    color: 'var(--color-progress-complete)',
  },
};

function ProgressLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No progress data yet. Complete some videos to see your progress over time!
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="my-2 mx-0 h-[250px] w-full">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          tickFormatter={date => {
            const d = new Date(date);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => {
                if (payload?.length) return payload[0].payload.date;
              }}
              formatter={value => [`${value.toFixed(1)}%`, 'Progress']}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="overallProgress"
          stroke="var(--color-progress-complete)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-progress-complete)', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default ProgressLineChart;
