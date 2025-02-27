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
import { Check, Download, Loader2, Newspaper, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import ApproveDialog from './_components/approve';
import RejectDialog from './_components/reject';
import AdmissionContent from './_components/admission-content';
import ExaminationDialog from './_components/examination';
import ApproveExamDialog from './_components/approve-exam';
import RejectExamDialog from './_components/reject-exam';

type DialogType =
  | 'approve'
  | 'reject'
  | 'admission'
  | 'exam'
  | 'approveExam'
  | 'rejectExam'
  | null;

export default function ApplicationsPage() {
  const [admissions, setAdmissions] = useState<AdmissionUser[]>([]);
  const [admissionLoading, setAdmissionLoading] = useState(true);
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
      setAdmissionLoading(false);
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

  const isLoading = useMemo(() => admissionLoading, [admissionLoading]);

  return (
    <>
      <RejectExamDialog
        open={dialogType === 'rejectExam'}
        onClose={closeDialog}
        admission={selectedAdmission}
      />
      <ApproveExamDialog
        open={dialogType === 'approveExam'}
        onClose={closeDialog}
        admission={selectedAdmission}
      />
      <AdmissionContent
        open={dialogType === 'admission'}
        onClose={closeDialog}
        admission={selectedAdmission}
      />
      <ExaminationDialog
        open={dialogType === 'exam'}
        onClose={closeDialog}
        admission={selectedAdmission}
        isUpdate={!!selectedAdmission.examination}
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
      <div className='flex flex-col h-full w-full gap-4 overflow-x-auto'>
        {isLoading ? (
          <div className='flex justify-center items-center w-full h-full'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <div className='flex flex-grow w-full h-full gap-2 flex-col overflow-x-scroll'>
              <div className='flex justify-between'>
                <Input
                  placeholder='Search by student name'
                  className='max-w-[340px]'
                  onChange={(e) => setSearchName(e.target.value)}
                  value={searchName}
                />
              </div>
              <div className='flex flex-col h-full w-full overflow-x-auto'>
                <div className='border rounded-lg w-full h-0 flex-grow overflow-y-auto'>
                  <div className='overflow-x-auto'>
                    <Table className='min-w-[1200px] overflow-x-auto'>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-[200px]'>Status</TableHead>
                          <TableHead>Application</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Student Type</TableHead>
                          <TableHead>Examination Schedule</TableHead>
                          <TableHead>Exam Proof</TableHead>
                          <TableHead>Exam Receipt</TableHead>
                          <TableHead>Examination Completion Date</TableHead>
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
                                    : admission.status === 'onGoingExamination'
                                    ? 'onGoing'
                                    : admission.status === 'approved'
                                    ? 'default'
                                    : admission.status === 'completeExamination'
                                    ? 'default'
                                    : admission.status === 'approvedExamination'
                                    ? 'complete'
                                    : 'destructive'
                                }>
                                {admission.status === 'forReview'
                                  ? 'For Review'
                                  : admission.status === 'onGoingExamination'
                                  ? 'Schedule of Exam'
                                  : admission.status === 'approvedExamination'
                                  ? 'Exam Passed'
                                  : admission.status === 'completeExamination'
                                  ? 'Exam Complete'
                                  : admission.status === 'rejectedExamination'
                                  ? 'Exam Unsuccessful'
                                  : admission.status.charAt(0).toUpperCase() +
                                    admission.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() =>
                                  openDialog('admission', admission)
                                }
                                variant='outline'>
                                View
                              </Button>
                            </TableCell>
                            <TableCell>{admission.user.name}</TableCell>
                            <TableCell>
                              {admission.user.type === 'new'
                                ? 'New Student'
                                : admission.user.type === 'returning'
                                ? 'Returning Student'
                                : 'Transferee'}
                            </TableCell>
                            <TableCell>
                              {admission.examination &&
                              admission.examination.scheduleDate ? (
                                <Button
                                  className='p-0'
                                  onClick={() => openDialog('exam', admission)}
                                  variant='link'>
                                  {format(
                                    new Date(
                                      admission.examination.scheduleDate,
                                    ),
                                    'PPp',
                                  )}
                                </Button>
                              ) : (
                                ''
                              )}
                            </TableCell>
                            <TableCell>
                              {admission.examination &&
                              admission.examination?.ssProof ? (
                                <Button asChild variant='link'>
                                  <a
                                    target='_blank'
                                    href={admission.examination.ssProof}>
                                    View
                                  </a>
                                </Button>
                              ) : (
                                ''
                              )}
                            </TableCell>
                            <TableCell>
                              {admission.examination &&
                              admission.examination?.ssReceipt ? (
                                <Button asChild variant='link'>
                                  <a
                                    target='_blank'
                                    href={admission.examination.ssReceipt}>
                                    View
                                  </a>
                                </Button>
                              ) : (
                                ''
                              )}
                            </TableCell>
                            <TableCell>
                              {admission.examination &&
                              admission.examination.completeExamDate
                                ? format(
                                    new Date(
                                      admission.examination.completeExamDate,
                                    ),
                                    'PPp',
                                  )
                                : ''}
                            </TableCell>
                            <TableCell>
                              {format(new Date(admission.createdAt), 'PPpp')}
                            </TableCell>
                            <TableCell className='flex justify-center'>
                              {admission.status === 'forReview' ? (
                                <>
                                  <Button
                                    onClick={() =>
                                      openDialog('exam', admission)
                                    }
                                    size='icon'
                                    variant='ghost'>
                                    <Newspaper className='w-4 h-4 text-primary' />
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
                              ) : admission.status === 'approvedExamination' ? (
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
                              ) : admission.status === 'completeExamination' ? (
                                <>
                                  <Button
                                    onClick={() =>
                                      openDialog('approveExam', admission)
                                    }
                                    size='icon'
                                    variant='ghost'>
                                    <Check className='w-4 h-4 text-primary' />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      openDialog('rejectExam', admission)
                                    }
                                    size='icon'
                                    variant='ghost'>
                                    <X className='w-4 h-4 text-red-400' />
                                  </Button>
                                </>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
