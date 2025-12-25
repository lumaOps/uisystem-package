'use client';

import { LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/chart/chart';
import { multipleChartProps } from '@/modules/inventory/types/inventory';

export default function MultipleLineChart({
  data,
  hasPrevious = false,
  chartConfig,
  fromLabel = '25 Dec',
  toLabel = 'Today',
}: multipleChartProps) {
  return (
    <div className="flex flex-col px-3 sm:px-5 pb-3 sm:pb-5 pt-2 h-full">
      <div className="relative w-full h-32 sm:h-40 md:h-48 min-h-30">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            width={481}
            height={192}
            data={data}
            margin={{ top: 5, right: 8, left: 8, bottom: 5 }}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartConfig.value.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3 }}
              animationDuration={300}
            />
            {hasPrevious && (
              <Line
                type="monotone"
                dataKey="previousValue"
                stroke={chartConfig.previousValue.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                animationDuration={300}
              />
            )}
          </LineChart>
        </ChartContainer>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
        <span>{fromLabel}</span>
        <span>{toLabel}</span>
      </div>
    </div>
  );
}
