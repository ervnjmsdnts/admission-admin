'use client';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Presentation,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className='h-full py-4 pr-2 pl-4 min-w-64 flex flex-col'>
      <div className='flex-grow'>
        <div className='flex justify-center'>
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
          {/* <p className='text-xs pl-1 py-3 font-medium text-gray-400 uppercase'>
            Vehicles
          </p> */}
        </div>
      </div>
      {/* Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='bg-white p-4 hover:bg-gray-50 cursor-pointer border rounded-md'>
            <div className='flex gap-2'>
              <div className='flex justify-center items-center'>
                <User className='w-5 h-5' />
              </div>
              <div>
                <p className='text-xs font-medium'>Name</p>
                <p className='text-xs truncate'>email@gmail.com</p>
              </div>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuItem>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
