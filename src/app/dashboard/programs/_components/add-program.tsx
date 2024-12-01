'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { Program } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1) });

type Schema = z.infer<typeof schema>;

export default function AddProgramDialog({
  open,
  onClose,
  program,
}: {
  open: boolean;
  onClose: () => void;
  program: Program | null;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: useMemo(
      () => ({
        name: program ? program.name : '',
      }),
      [program],
    ),
  });
  const { toast } = useToast();

  const onHandleSubmit = async (data: Schema) => {
    try {
      setIsLoading(true);
      if (program) {
        const docRef = doc(db, 'programs', `${program.id}`);
        await updateDoc(docRef, { name: data.name });
        toast({ title: 'Successfully updated program' });
      } else {
        await addDoc(collection(db, 'programs'), {
          createdAt: new Date().getTime(),
          name: data.name,
          isActive: true,
        });
        toast({
          title: 'Successfully added program',
        });
      }
      form.reset({ name: '' });
      onClose();
    } catch (error) {
      toast({ variant: 'destructive', title: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{program ? 'Edit' : 'Add'} Program</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit(onHandleSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Program name...' />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='secondary' disabled={isLoading}>
                  Close
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
