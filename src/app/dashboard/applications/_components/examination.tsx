import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/datetimepicker';
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
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { AdmissionUser, Examination } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  dateOfExam: z.date(),
  examForm: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export default function ExaminationDialog({
  open,
  onClose,
  admission,
  isUpdate = false,
}: {
  open: boolean;
  onClose: () => void;
  admission: AdmissionUser;
  isUpdate?: boolean;
}) {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: useMemo(
      () => ({
        dateOfExam: isUpdate
          ? new Date(admission.examination!.scheduleDate)
          : new Date(),
        examForm: isUpdate ? admission.examination!.examForm : '',
      }),
      [isUpdate, admission.examination],
    ),
  });

  useEffect(() => {
    (() => {
      const examsQuery = query(
        collection(db, 'examinations'),
        where('isActive', '==', true),
      );
      const unsub = onSnapshot(examsQuery, (snapshot) => {
        const programs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        }) as Examination[];
        const sortedExaminations = programs.sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        setExaminations(sortedExaminations);
        setIsLoading(false);
      });

      return () => {
        unsub();
      };
    })();
  }, []);

  const onHandleSubmit = async (data: Schema) => {
    const docRef = doc(db, 'admissions', `${admission.id}`);
    try {
      setIsLoading(true);

      await updateDoc(docRef, {
        status: 'onGoingExamination',
        examination: {
          ...admission.examination,
          scheduleDate: data.dateOfExam.getTime(),
          examForm: data.examForm,
        },
      });

      await fetch('/api/send-examination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: admission.user.email,
          name: admission.user.name,
          scheduleDate: data.dateOfExam.getTime(),
        }),
      });

      toast({ title: 'Examination schedule sent' });
      onClose();
    } catch (error) {
      toast({
        title: `Schedule for examination failed`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Update Examination Schedule' : 'Examination Schedule'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onHandleSubmit)}
            className='flex flex-col gap-2'>
            <FormField
              control={form.control}
              name='dateOfExam'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel htmlFor='dateOfExam'>
                    Date of Examination
                  </FormLabel>
                  <FormControl>
                    <DateTimePicker
                      disabled={isLoading}
                      value={field.value}
                      onChange={field.onChange}
                      hourCycle={12}
                      granularity='minute'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='examForm'
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
                      {examinations.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.program}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' disabled={isLoading} variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isLoading}>
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
