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
import { db } from '@/lib/firebase';
import { AdmissionUser, User } from '@/lib/types';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Check, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import ApproveDialog from './_components/approve';
import RejectDialog from './_components/reject';
import AdmissionContent from './_components/admission-content';

type DialogType = 'approve' | 'reject' | 'admission' | null;

export default function ApplicationsPage() {
  const [admissions, setAdmissions] = useState<AdmissionUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionUser>(
    {} as AdmissionUser,
  );

  const handleSelectedAdmission = (admission: AdmissionUser) => {
    setSelectedAdmission(admission);
  };

  const openDialog = (type: DialogType, admission: AdmissionUser) => {
    handleSelectedAdmission(admission);
    setDialogType(type);
  };

  const closeDialog = () => {
    setDialogType(null);
  };

  useEffect(() => {
    const fetchUser = async (userId: string): Promise<User | null> => {
      try {
        const userDoc = await getDoc(doc(db, 'users', `${userId}`));
        if (userDoc.exists()) {
          return userDoc.data() as User;
        } else {
          console.log('No such user!');
          return null;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    };

    const unsub = onSnapshot(collection(db, 'admissions'), async (snapshot) => {
      const admissions = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const user = await fetchUser(data.userId);
          return { ...data, id: doc.id, user } as AdmissionUser;
        }),
      );
      const sortedAdmissions = admissions.sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      setAdmissions(sortedAdmissions);
      setIsLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  const filteredAdmissions = searchName
    ? admissions.filter((admission) =>
        admission.user.name.toLowerCase().includes(searchName.toLowerCase()),
      )
    : admissions;

  const { currentItems, currentPage, paginate, totalPages } =
    usePagination(filteredAdmissions);

  return (
    <>
      <AdmissionContent
        open={dialogType === 'admission'}
        onClose={closeDialog}
        admission={selectedAdmission}
      />
      <ApproveDialog
        open={dialogType === 'approve'}
        onClose={closeDialog}
        admission={selectedAdmission}
      />
      <RejectDialog
        open={dialogType === 'reject'}
        onClose={closeDialog}
        admission={selectedAdmission}
      />
      <div className='flex flex-col h-full w-full gap-4'>
        {isLoading ? (
          <div className='flex justify-center items-center w-full h-full'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <div className='flex flex-grow w-full h-full gap-2 flex-col'>
              <div className='flex justify-between'>
                <Input
                  placeholder='Search by student name'
                  className='max-w-[340px]'
                  onChange={(e) => setSearchName(e.target.value)}
                  value={searchName}
                />
              </div>
              <div className='flex flex-col h-full'>
                <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Application</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className='text-center'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((admission) => (
                        <TableRow key={admission.id}>
                          <TableCell>
                            <Badge
                              variant={
                                admission.status === 'forReview'
                                  ? 'pending'
                                  : admission.status === 'approved'
                                  ? 'default'
                                  : 'destructive'
                              }>
                              {admission.status === 'forReview'
                                ? 'For Review'
                                : admission.status.charAt(0).toUpperCase() +
                                  admission.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => openDialog('admission', admission)}
                              variant='outline'>
                              View
                            </Button>
                          </TableCell>
                          <TableCell>{admission.user.name}</TableCell>
                          <TableCell>
                            {format(new Date(admission.createdAt), 'PPpp')}
                          </TableCell>
                          <TableCell className='flex justify-center'>
                            {admission.status === 'forReview' && (
                              <>
                                <Button
                                  onClick={() =>
                                    openDialog('approve', admission)
                                  }
                                  size='icon'
                                  variant='ghost'>
                                  <Check className='w-4 h-4 text-primary' />
                                </Button>
                                <Button
                                  onClick={() =>
                                    openDialog('reject', admission)
                                  }
                                  size='icon'
                                  variant='ghost'>
                                  <X className='w-4 h-4 text-red-400' />
                                </Button>
                              </>
                            )}
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
