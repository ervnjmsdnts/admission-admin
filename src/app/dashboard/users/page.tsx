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

export default function UsersPage() {
  const { currentItems, currentPage, paginate, totalPages } = usePagination([
    '',
  ]);
  return (
    <div className='flex flex-col h-full w-full gap-4'>
      <div className='flex flex-grow w-full h-full gap-2 flex-col'>
        <div className='flex justify-between'>
          <Input placeholder='Search by name' className='max-w-[340px]' />
          <Button>Add User</Button>
        </div>
        <div className='flex flex-col h-full'>
          <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-12'></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead className='text-center'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className=''>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className=''>
                    <Button variant='link' className='p-0'>
                      John Doe
                    </Button>
                  </TableCell>
                  <TableCell>someemail@gmail.com</TableCell>
                  <TableCell>+639123456789</TableCell>
                  <TableCell>
                    <p className='max-w-24 truncate'>Some address</p>
                  </TableCell>
                  <TableCell>Male</TableCell>
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
