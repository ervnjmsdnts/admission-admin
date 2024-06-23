'use client';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import usePagination from '@/hooks/use-pagination';

export default function ApplicationsPage() {
  const { currentItems, currentPage, paginate, totalPages } = usePagination([
    '',
  ]);
  return (
    <div className='flex flex-col h-full w-full gap-4'>
      <div className='flex flex-grow w-full h-full gap-2 flex-col'>
        <div className='flex flex-col h-full'>
          <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge variant='pending'>Pending</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant='link' className='p-0'>
                      fed49e01-1849-42e3-94f4-a7cf5175f678
                    </Button>
                  </TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Button variant='outline'>View Documents</Button>
                  </TableCell>
                  <TableCell>June 24, 2024</TableCell>
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
