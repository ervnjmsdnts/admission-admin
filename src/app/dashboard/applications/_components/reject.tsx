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

export default function RejectDialog({
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
  const onRejectAdmission = async () => {
    const docRef = doc(db, 'admissions', `${admission.id}`);
    try {
      setIsLoading(true);
      await fetch('/api/send-rejected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: admission.user.email,
          name: admission.user.name,
        }),
      });
      await updateDoc(docRef, { status: 'rejected' });
      toast({ title: 'Admission rejected' });
      onClose();
    } catch (error) {
      toast({ title: `Rejecting admission failed`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Admission</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary' disabled={isLoading}>
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={onRejectAdmission}
            disabled={isLoading}
            variant='destructive'>
            {isLoading && <Loader2 className='mr-2 w-4 h-4 animate-spin' />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
