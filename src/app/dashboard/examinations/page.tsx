'use client';

import Pagination from '@/components/pagination';
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
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import useDialog from '@/hooks/use-dialog';
import { default as AddExamDialog } from './_components/add-exam';
import { default as UpdateExamDialog } from './_components/add-exam';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Examination as ExaminationType } from '@/lib/types';
import { Pencil, Trash } from 'lucide-react';
import DeleteDialog from '@/components/delete-dialog';

export default function Examination() {
  const [isLoading, setIsLoading] = useState(true);
  const [examinations, setExaminations] = useState<ExaminationType[]>([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    (() => {
      const noticeQuery = query(
        collection(db, 'examinations'),
        where('isActive', '==', true),
      );
      const unsub = onSnapshot(noticeQuery, (snapshot) => {
        const programs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        }) as ExaminationType[];
        const sortedNotices = programs.sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        setExaminations(sortedNotices);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const filteredExaminations = searchName
    ? examinations.filter((p) =>
        p.program.toLowerCase().includes(searchName.toLowerCase()),
      )
    : examinations;

  const { currentItems, currentPage, paginate, totalPages } =
    usePagination(filteredExaminations);

  const {
    handleCloseDelete,
    handleOpenDelete,
    openDelete,
    handleOpenAdd,
    openAdd,
    entity,
    handleCloseAdd,
    handleOpenUpdate,
    openUpdate,
    handleCloseUpdate,
    handleDelete,
  } = useDialog<ExaminationType>();

  return (
    <>
      <AddExamDialog onClose={handleCloseAdd} open={openAdd} />
      <UpdateExamDialog
        onClose={handleCloseUpdate}
        open={openUpdate}
        exam={entity}
      />
      <DeleteDialog
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={() => handleDelete('examinations', 'examination')}
        message='Do you want to remove this examination? Removing this examination cannot be undone.'
      />
      <div className='flex flex-col h-full w-full gap-4'>
        <div className='flex flex-grow w-full h-full gap-2 flex-col'>
          <div className='flex justify-between'>
            <Input
              placeholder='Search by program'
              className='max-w-[340px]'
              onChange={(e) => setSearchName(e.target.value)}
              value={searchName}
            />
            <Button onClick={handleOpenAdd}>Add Examination</Button>
          </div>
          <div className='flex flex-col h-full'>
            <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.program}</TableCell>
                      <TableCell>
                        <p className='max-w-96 truncate'>{exam.link}</p>
                      </TableCell>
                      <TableCell className='flex justify-center'>
                        <Button
                          onClick={() => handleOpenUpdate({ ...exam })}
                          size='icon'
                          variant='ghost'>
                          <Pencil className='w-4 h-4 text-blue-400' />
                        </Button>
                        <Button
                          onClick={() => handleOpenDelete(exam.id)}
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

        {/* Pagination */}
        <div className='self-end'>
          <Pagination
            totalPages={totalPages}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </>
  );
}
