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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { Examination, Program } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  program: z.string().min(1),
  link: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export default function AddExamDialog({
  open,
  onClose,
  exam,
}: {
  open: boolean;
  onClose: () => void;
  exam?: Examination;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: exam ? { link: exam.link, program: exam.program } : undefined,
  });
  const [programs, setPrograms] = useState<Program[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    (() => {
      const programsQuery = query(
        collection(db, 'programs'),
        where('isActive', '==', true),
      );
      const unsub = onSnapshot(programsQuery, (snapshot) => {
        const programs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        }) as Program[];
        const sortedPrograms = programs.sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        setPrograms(sortedPrograms);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const onHandleSubmit = async (data: Schema) => {
    if (exam) {
      try {
        setIsLoading(true);
        await updateDoc(doc(db, 'examinations', exam.id), {
          ...data,
        });
        toast({
          title: 'Successfully updated examination',
        });
        form.reset();
        onClose();
      } catch (error) {
        toast({ variant: 'destructive', title: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        await addDoc(collection(db, 'examinations'), {
          createdAt: new Date().getTime(),
          isActive: true,
          ...data,
        });
        toast({
          title: 'Successfully added examination',
        });
        form.reset();
        onClose();
      } catch (error) {
        toast({ variant: 'destructive', title: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Examination</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit(onHandleSubmit)}>
            <FormField
              control={form.control}
              name='program'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoading} ref={field.ref}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.name}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
