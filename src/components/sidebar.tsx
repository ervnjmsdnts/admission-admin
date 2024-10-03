'use client';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Presentation,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { User as UserType } from '@/lib/types';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

export default function Sidebar({ user }: { user: UserType }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);

    await fetch('/api/logout');

    localStorage.removeItem('user_id');

    router.replace('/');
  };

  return (
    <nav className='h-full py-4 pr-2 pl-4 min-w-64 flex flex-col'>
      <div className='flex-grow'>
        <div className='flex items-center w-full flex-col'>
          <Image
            src='/mindoro-school-logo.png'
            width={64}
            height={64}
            alt='logo'
          />
          <p className='font-semibold text-lg'>
            Welcome <span className='text-primary'>Admin</span>
          </p>
        </div>
        <div className='flex flex-col gap-2 pt-4'>
          <Button
            className='justify-start'
            asChild
            variant={pathname === '/dashboard' ? 'outline' : 'ghost'}>
            <Link href='/dashboard'>
              <LayoutDashboard className='mr-2 h-4 w-4' /> Dashboard
            </Link>
          </Button>
          <Button
            className='justify-start'
            asChild
            variant={pathname === '/dashboard/users' ? 'outline' : 'ghost'}>
            <Link href='/dashboard/users'>
              <Users className='mr-2 h-4 w-4' /> Users
            </Link>
          </Button>
          <Button
            className='justify-start'
            asChild
            variant={
              pathname === '/dashboard/applications' ? 'outline' : 'ghost'
            }>
            <Link href='/dashboard/applications'>
              <ClipboardList className='mr-2 h-4 w-4' /> Applications
            </Link>
          </Button>
          <Button
            className='justify-start'
            asChild
            variant={pathname === '/dashboard/programs' ? 'outline' : 'ghost'}>
            <Link href='/dashboard/programs'>
              <GraduationCap className='mr-2 h-4 w-4' /> Programs
            </Link>
          </Button>
          <Button
            className='justify-start'
            asChild
            variant={pathname === '/dashboard/notices' ? 'outline' : 'ghost'}>
            <Link href='/dashboard/notices'>
              <Presentation className='mr-2 h-4 w-4' /> Public Notices
            </Link>
          </Button>
          <Button
            className='justify-start'
            asChild
            variant={
              pathname === '/dashboard/examinations' ? 'outline' : 'ghost'
            }>
            <Link href='/dashboard/examinations'>
              <Newspaper className='mr-2 h-4 w-4' /> Examinations
            </Link>
          </Button>
          {/* <p className='text-xs pl-1 py-3 font-medium text-gray-400 uppercase'>
            Vehicles
          </p> */}
        </div>
      </div>
      {/* Avatar */}
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='bg-white p-4 hover:bg-gray-50 cursor-pointer border rounded-md'>
              <div className='flex gap-2'>
                <div className='flex justify-center items-center'>
                  <User className='w-5 h-5' />
                </div>
                <div>
                  <p className='text-xs font-medium'>{user.name}</p>
                  <p className='text-xs truncate'>{user.email}</p>
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
