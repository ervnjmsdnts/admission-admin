'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { User } from '@/lib/types';
import Image from 'next/image';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Schema = z.infer<typeof schema>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Schema>({ resolver: zodResolver(schema) });
  const { toast } = useToast();

  const onHandleSubmit = async (data: Schema) => {
    try {
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const userDoc = doc(db, 'users', user.uid);

      const userDb = await getDoc(userDoc);

      const userData = userDb.data() as User;

      if (userData.role !== 'admin') {
        throw new Error('User is not authorized');
      }

      const idToken = await user.getIdToken();

      await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      localStorage.setItem('user_id', user.uid);

      window.location.reload();
    } catch (error) {
      toast({ variant: 'destructive', title: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gray-100 h-full bg-[url("/background-school.jpg")] bg-cover bg-no-repeat'>
      <div className='fixed w-full h-full'>
        <div className='h-full w-full bg-white absolute opacity-70' />
      </div>

      <div className='flex flex-col items-center relative z-10 h-full justify-center'>
        <div className='grid place-items-center gap-2'>
          <Image
            src='/mindoro-school-logo.png'
            width={100}
            height={100}
            alt='logo'
          />
          <h2 className='text-center text-2xl font-bold text-primary'>
            Divine Word College of San Jose
          </h2>
          <h2 className='text-center text-2xl font-bold text-primary'>
            Online Admission System
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className='max-w-md w-full mt-8 bg-white rounded-lg p-4 '>
            <h3 className='text-center text-lg font-semibold'>Admin Login</h3>
            <div className='grid gap-3'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type='password' />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className='mt-8'>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Login
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
