'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartType } from '@/lib/types';
const chartConfig = {
  value: {
    label: 'Value',
  },
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-1))',
  },
  approvedExamination: {
    label: 'Approved Examination',
    color: 'hsl(var(--chart-2))',
  },
  completeExamination: {
    label: 'Complete Examination',
    color: 'hsl(var(--chart-3))',
  },
  forReview: {
    label: 'For Review',
    color: 'hsl(var(--chart-4))',
  },
  onGoingExamination: {
    label: 'Schedule for Examination',
    color: 'hsl(var(--chart-5))',
  },
  rejected: {
    label: 'Rejected',
    color: 'hsl(var(--chart-6))',
  },
  rejectedExamination: {
    label: 'Rejected Examination',
    color: 'hsl(var(--chart-7))',
  },
} satisfies ChartConfig;

export default function MainChart({ data }: { data: ChartType[] }) {
  console.log(data);
  return (
    <Card className='flex flex-col h-full'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Admission Status</CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square'>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey='value' nameKey='name' />
            <ChartLegend
              content={<ChartLegendContent nameKey='name' />}
              className='-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
