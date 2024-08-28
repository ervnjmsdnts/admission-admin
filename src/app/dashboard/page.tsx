'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { AdmissionUser, User } from '@/lib/types';
import { format } from 'date-fns';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { ClipboardList, GraduationCap, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [programsCount, setProgramsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [admissions, setAdmissions] = useState<AdmissionUser[]>([]);

  const [isLoading, setIsLoading] = useState({
    programs: true,
    users: true,
    admissions: true,
  });

  useEffect(() => {
    const fetchPrograms = () => {
      const programsQuery = query(
        collection(db, 'programs'),
        where('isActive', '==', true),
      );

      const unsubscribe = onSnapshot(
        programsQuery,
        (snapshot) => {
          const count = snapshot.size; // Directly get the count of active programs
          setProgramsCount(count);
          setIsLoading((prev) => ({ ...prev, programs: false }));
        },
        (error) => {
          console.error('Error fetching programs:', error);
          setIsLoading((prev) => ({ ...prev, programs: false }));
        },
      );

      return unsubscribe;
    };

    const fetchUsers = () => {
      const usersQuery = query(collection(db, 'users')); // Add filters if necessary

      const unsubscribe = onSnapshot(
        usersQuery,
        (snapshot) => {
          const count = snapshot.size; // Directly get the count of users
          setUsersCount(count);
          setIsLoading((prev) => ({ ...prev, users: false }));
        },
        (error) => {
          console.error('Error fetching users:', error);
          setIsLoading((prev) => ({ ...prev, users: false }));
        },
      );

      return unsubscribe;
    };

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

    const fetchAdmissions = () => {
      const admissionsQuery = query(
        collection(db, 'admissions'),
        orderBy('createdAt', 'desc'),
        limit(10),
      ); // Add filters if necessary

      const unsubscribe = onSnapshot(
        admissionsQuery,
        async (snapshot) => {
          const admissionsData = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const user = await fetchUser(data.userId);
              return {
                ...data,
                id: doc.id,
                user,
              } as AdmissionUser;
            }),
          );
          setAdmissions(admissionsData);
          setIsLoading((prev) => ({ ...prev, admissions: false }));
        },
        (error) => {
          console.error('Error fetching admissions:', error);
          setIsLoading((prev) => ({ ...prev, admissions: false }));
        },
      );

      return unsubscribe;
    };

    // Initialize all listeners
    const unsubscribePrograms = fetchPrograms();
    const unsubscribeUsers = fetchUsers();
    const unsubscribeAdmissions = fetchAdmissions();

    // Cleanup listeners on unmount
    return () => {
      unsubscribePrograms();
      unsubscribeUsers();
      unsubscribeAdmissions();
    };
  }, []);

  return (
    <div className='flex flex-col h-full w-full gap-6'>
      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2 flex-row items-center gap-4'>
            <GraduationCap className='text-muted-foreground h-6 w-6' />
            <p className='font-medium text-muted-foreground'>Total Programs</p>
          </CardHeader>
          <CardContent>
            {isLoading.programs ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <p className='text-2xl font-bold text-primary'>{programsCount}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2 flex-row items-center gap-4'>
            <Users className='text-muted-foreground h-6 w-6' />
            <p className='font-medium text-muted-foreground'>Total Users</p>
          </CardHeader>
          <CardContent>
            {isLoading.users ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <p className='text-2xl font-bold text-primary'>{usersCount}</p>
            )}
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
            {isLoading.admissions ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <p className='text-2xl font-bold text-primary'>
                {admissions.length}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='flex flex-grow h-full w-full'>
        <div className='grid grid-cols-2 w-full gap-4'>
          <div className='border p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Applications</h3>
              <Button variant='link' asChild>
                <Link href='/dashboard/applications'>See more</Link>
              </Button>
            </div>
            {isLoading.admissions ? (
              <div className='flex items-center w-full h-full justify-center'>
                <Loader2 className='w-6 h-6 animate-spin' />
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                {admissions.map((admission) => (
                  <div
                    key={admission.id}
                    className='border p-4 rounded-md flex items-center justify-between'>
                    <p>
                      By{' '}
                      <span className='font-semibold'>
                        {admission.user.name}
                      </span>
                    </p>
                    <div>
                      <p className='text-sm'>
                        {format(new Date(admission.createdAt), 'PP')}
                      </p>
                      <p className='text-xs text-right'>
                        {format(new Date(admission.createdAt), 'pp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='border p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold'>Notices</h3>
              <Button variant='link' asChild>
                <Link href='/dashboard/notices'>See more</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
