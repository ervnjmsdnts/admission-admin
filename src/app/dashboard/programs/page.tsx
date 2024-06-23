'use client';
import Pagination from '@/components/pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';
import { Trash } from 'lucide-react';

export default function ProgramsPage() {
  const { currentItems, currentPage, paginate, totalPages } = usePagination([
    '',
  ]);
  return (
    <div className='flex flex-col h-full w-full gap-4'>
      <div className='flex flex-grow w-full h-full gap-2 flex-col'>
        <div className='flex justify-between'>
          <Input placeholder='Search by name' className='max-w-[340px]' />
          <Button>Add Program</Button>
        </div>
        <div className='flex flex-col h-full'>
          <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='font-medium'>
                    Master in Business Administration
                  </TableCell>
                  <TableCell className='flex justify-center'>
                    <Button size='icon' variant='ghost'>
                      <Trash className='w-4 h-4 text-red-400' />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className='self-end'>
        <Pagination
          totalPages={totalPages}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
