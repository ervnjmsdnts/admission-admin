'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className='bg-gray-100 h-full'>
      <div className='flex items-center h-full justify-center'>
        <form className='bg-white p-4 rounded-lg max-w-md w-full'>
          <h2 className='text-center text-xl font-semibold text-primary'>
            Admin Login
          </h2>
          <div className='grid mt-4 gap-3'>
            <div className='grid gap-1.5'>
              <Label htmlFor='email'>Email Address</Label>
              <Input id='email' type='email' />
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' />
            </div>
          </div>
          <div className='mt-8'>
            <Button
              type='button'
              onClick={() => router.push('/dashboard')}
              className='w-full'>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
