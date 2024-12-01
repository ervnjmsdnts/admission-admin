'use client';
import DeleteDialog from '@/components/delete-dialog';
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
import useDialog from '@/hooks/use-dialog';
import usePagination from '@/hooks/use-pagination';
import { Loader2, Pencil, Trash } from 'lucide-react';
import AddNoticeDialog from './_components/add-notice';
import { useEffect, useState } from 'react';
import { Notice } from '@/lib/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    (() => {
      const noticeQuery = query(
        collection(db, 'notices'),
        where('isActive', '==', true),
      );
      const unsub = onSnapshot(noticeQuery, (snapshot) => {
        const programs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        }) as Notice[];
        const sortedNotices = programs.sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        setNotices(sortedNotices);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const filteredNotcies = searchName
    ? notices.filter((p) =>
        p.title.toLowerCase().includes(searchName.toLowerCase()),
      )
    : notices;

  const { currentItems, currentPage, paginate, totalPages } =
    usePagination(filteredNotcies);

  const {
    handleCloseDelete,
    handleOpenDelete,
    openDelete,
    handleOpenAdd,
    openAdd,
    handleCloseAdd,
    handleDelete,
  } = useDialog();

  const handleClose = () => {
    handleCloseAdd();
    setSelectedNotice(null);
  };

  return (
    <>
      <AddNoticeDialog
        notice={selectedNotice}
        onClose={handleClose}
        open={openAdd}
      />
      <DeleteDialog
        open={openDelete}
        onClose={handleCloseDelete}
        handleDelete={() => handleDelete('notices', 'notice')}
        message='Do you want to remove this notice? Removing this notice cannot be undone.'
      />
      <div className='flex flex-col h-full w-full gap-4'>
        {isLoading ? (
          <div className='flex items-center justify-center w-full h-full'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <div className='flex flex-grow w-full h-full gap-2 flex-col'>
              <div className='flex justify-between'>
                <Input
                  placeholder='Search by title'
                  className='max-w-[340px]'
                  onChange={(e) => setSearchName(e.target.value)}
                  value={searchName}
                />
                <Button onClick={handleOpenAdd}>Add Notice</Button>
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
                      {currentItems.map((notice) => (
                        <TableRow key={notice.id}>
                          <TableCell className='font-medium'>
                            {notice.title}
                          </TableCell>
                          <TableCell className='max-w-16 truncate'>
                            {notice.description}
                          </TableCell>
                          <TableCell>
                            <div className='flex gap-2 justify-center items-center'>
                              <Button
                                size='icon'
                                variant='ghost'
                                onClick={() => {
                                  handleOpenAdd();
                                  setSelectedNotice(notice);
                                }}>
                                <Pencil className='w-4 h-4 text-blue-400' />
                              </Button>
                              <Button
                                onClick={() => handleOpenDelete(notice.id)}
                                size='icon'
                                variant='ghost'>
                                <Trash className='w-4 h-4 text-red-400' />
                              </Button>
                            </div>
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
          </>
        )}
      </div>
    </>
  );
}
