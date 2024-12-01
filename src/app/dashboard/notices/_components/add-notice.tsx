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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { Notice } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export default function AddNoticeDialog({
  open,
  onClose,
  notice,
}: {
  open: boolean;
  onClose: () => void;
  notice: Notice | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: useMemo(
      () => ({
        description: notice ? notice.description : '',
        title: notice ? notice.title : '',
      }),
      [notice],
    ),
  });

  const { toast } = useToast();

  const onHandleSubmit = async (data: Schema) => {
    try {
      setIsLoading(true);
      if (notice) {
        const docRef = doc(db, 'notices', `${notice.id}`);
        await updateDoc(docRef, {
          title: data.title,
          description: data.description,
        });
        toast({
          title: 'Successfully updated notice',
        });
      } else {
        await addDoc(collection(db, 'notices'), {
          createdAt: new Date().getTime(),
          isActive: true,
          ...data,
        });
        toast({
          title: 'Successfully added notice',
        });
      }
      form.reset();
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
          <DialogTitle>{notice ? 'Edit' : 'Add'} Notice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit(onHandleSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' disabled={isLoading} variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isLoading} type='submit'>
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
