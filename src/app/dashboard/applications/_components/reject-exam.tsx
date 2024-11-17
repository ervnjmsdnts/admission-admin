import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { AdmissionUser } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function RejectExamDialog({
  open,
  onClose,
  admission,
}: {
  open: boolean;
  onClose: () => void;
  admission: AdmissionUser;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const onApproveAdmission = async () => {
    const docRef = doc(db, 'admissions', `${admission.id}`);
    try {
      setIsLoading(true);
      await fetch('/api/send-rejected-examination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: admission.user.email,
          name: admission.user.name,
        }),
      });

      await updateDoc(docRef, { status: 'rejectedExamination' });
      toast({ title: 'Examination rejected' });
      onClose();
    } catch (error) {
      toast({ title: `Rejecting examination failed`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Examination</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' disabled={isLoading} variant='secondary'>
              Close
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={onApproveAdmission}
            disabled={isLoading}>
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
