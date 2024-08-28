'use client';

import Pagination from '@/components/pagination';
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
import { Loader2, Trash } from 'lucide-react';
import AddProgramDialog from './_components/add-program';
import useDialog from '@/hooks/use-dialog';
import DeleteDialog from '@/components/delete-dialog';
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Program } from '@/lib/types';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    (() => {
      const programsQuery = query(
        collection(db, 'programs'),
        where('isActive', '==', true),
      );
      const unsub = onSnapshot(programsQuery, (snapshot) => {
        const programs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        }) as Program[];
        const sortedActivities = programs.sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        setPrograms(sortedActivities);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const filteredPrograms = searchName
    ? programs.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase()),
      )
    : programs;

  const { currentItems, currentPage, paginate, totalPages } =
    usePagination(filteredPrograms);

  const {
    openAdd,
    handleOpenAdd,
    handleCloseAdd,
    openDelete,
    handleOpenDelete,
    handleCloseDelete,
    handleDelete,
  } = useDialog<Program>();

  return (
    <>
      <AddProgramDialog open={openAdd} onClose={handleCloseAdd} />
      <DeleteDialog
        handleDelete={() => handleDelete('programs', 'program')}
        onClose={handleCloseDelete}
        open={openDelete}
        message='Do you want to remove this program? Removing this program cannot be undone.'
      />
      <div className='flex flex-col h-full w-full gap-4'>
        {isLoading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <div className='flex flex-grow w-full h-full gap-2 flex-col'>
              <div className='flex justify-between'>
                <Input
                  placeholder='Search by name'
                  className='max-w-[340px]'
                  onChange={(e) => setSearchName(e.target.value)}
                  value={searchName}
                />
                <Button onClick={handleOpenAdd}>Add Program</Button>
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
                      {currentItems.map((program) => (
                        <TableRow key={program.id}>
                          <TableCell className='font-medium'>
                            {program.name}
                          </TableCell>
                          <TableCell className='flex justify-center'>
                            <Button
                              onClick={() => handleOpenDelete(program.id)}
                              size='icon'
                              variant='ghost'>
                              <Trash className='w-4 h-4 text-red-400' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className='self-end'>
              <Pagination
                totalPages={totalPages}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
