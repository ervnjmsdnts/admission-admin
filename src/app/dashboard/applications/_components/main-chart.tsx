'use client';

import { Pie, PieChart } from 'recharts';

import { CSVLink } from 'react-csv';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartType, Program, UserType } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Hash, Percent } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/utils';
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

const userTypeItems: UserType[] = ['new', 'returning', 'transferee'];

export default function MainChart({
  data,
  programs,
  selectedProgram,
  setSelectedProgram,
  selectedUserType,
  setSelectedUserType,
  isPercent,
  toggleValue,
  csvData,
}: {
  data: ChartType[];
  programs: Program[];
  selectedProgram: string;
  setSelectedProgram: (value: string) => void;
  selectedUserType: string;
  setSelectedUserType: (value: string) => void;
  isPercent: boolean;
  toggleValue: () => void;
  csvData: any;
}) {
  return (
    <Card className='flex flex-col h-full'>
      <CardHeader className='items-center pb-0'>
        <div className='flex gap-2 items-center'>
          <CardTitle>Admission Status</CardTitle>
          <Button size='icon' onClick={toggleValue}>
            {isPercent ? <Hash /> : <Percent />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='flex items-center gap-2 pt-4 w-full justify-center'>
          <Select
            onValueChange={(value) => setSelectedUserType(value)}
            value={selectedUserType}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='User Type' />
            </SelectTrigger>
            <SelectContent>
              {userTypeItems.map((type) => (
                <SelectItem key={type} value={type}>
                  {capitalizeFirstLetter(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setSelectedProgram(value)}
            value={selectedProgram}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Program' />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.name}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <CSVLink data={csvData ?? []} filename='report'>
              <Download className='w-4 h-4 mr-2' />
              Download Report
            </CSVLink>
          </Button>
        </div>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square'>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel isPercent={isPercent} />}
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
