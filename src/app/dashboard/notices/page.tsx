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
import { SquarePen, Trash } from 'lucide-react';

export default function NoticesPage() {
  const { currentItems, currentPage, paginate, totalPages } = usePagination([
    '',
  ]);
  return (
    <div className='flex flex-col h-full w-full gap-4'>
      <div className='flex flex-grow w-full h-full gap-2 flex-col'>
        <div className='flex justify-between'>
          <Input placeholder='Search by title' className='max-w-[340px]' />
          <Button>Add Notice</Button>
        </div>
        <div className='flex flex-col h-full'>
          <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='font-medium'>Sample notice</TableCell>
                  <TableCell className='max-w-16 truncate'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aspernatur, nulla.
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center items-center'>
                      <Button size='icon' variant='ghost'>
                        <SquarePen className='w-4 h-4 text-blue-400' />
                      </Button>
                      <Button size='icon' variant='ghost'>
                        <Trash className='w-4 h-4 text-red-400' />
                      </Button>
                    </div>
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
