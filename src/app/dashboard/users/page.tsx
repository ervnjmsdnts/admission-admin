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
import { db } from '@/lib/firebase';
import { User } from '@/lib/types';
import { collection, onSnapshot } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AddUserDialog from './_components/add-user';
import useDialog from '@/hooks/use-dialog';

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    (() => {
      const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        const users = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        }) as User[];
        setUsers(users);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const filteredUsers = searchName
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase()),
      )
    : users;

  const { currentItems, currentPage, paginate, totalPages } =
    usePagination(filteredUsers);

  const { openAdd, handleOpenAdd, handleCloseAdd } = useDialog<User>();

  return (
    <>
      <AddUserDialog open={openAdd} onClose={handleCloseAdd} />
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
                  placeholder='Search by name'
                  className='max-w-[340px]'
                  onChange={(e) => setSearchName(e.target.value)}
                  value={searchName}
                />
                <Button onClick={handleOpenAdd}>Add User</Button>
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
                        <TableHead>Type</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Avatar>
                              <AvatarFallback className='font-semibold'>
                                {user.name
                                  .split(' ')
                                  .map((name) => name.charAt(0))
                                  .join('')
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className='font-medium'>
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber}</TableCell>
                          <TableCell>
                            {user.type === 'new'
                              ? 'New Student'
                              : user.type === 'returning'
                              ? 'Returning Student'
                              : user.type === 'transferee'
                              ? 'Transferee'
                              : ''}
                          </TableCell>
                          <TableCell>
                            {user.role === 'user'
                              ? 'Student'
                              : user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
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
