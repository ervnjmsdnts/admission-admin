import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClipboardList, GraduationCap, Users } from 'lucide-react';
export default function DashboardPage() {
  return (
    <div className='flex flex-col h-full w-full gap-6'>
      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2 flex-row items-center gap-4'>
            <GraduationCap className='text-muted-foreground h-6 w-6' />
            <p className='font-medium text-muted-foreground'>Total Programs</p>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2 flex-row items-center gap-4'>
            <Users className='text-muted-foreground h-6 w-6' />
            <p className='font-medium text-muted-foreground'>Total Users</p>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2 flex-row items-center gap-4'>
            <ClipboardList className='text-muted-foreground h-6 w-6' />
            <p className='font-medium text-muted-foreground'>
              Total Applications
            </p>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>1</div>
          </CardContent>
        </Card>
      </div>
      <div className='flex flex-grow h-full w-full'>
        <div className='grid grid-cols-2 w-full gap-4'>
          <div className='border p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Applications</h3>
              <Button variant='link'>See more</Button>
            </div>
          </div>
          <div className='border p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Notices</h3>
              <Button variant='link'>See more</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
