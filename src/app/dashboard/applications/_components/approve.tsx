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
import { doc, updateDoc } from 'firebase/firestore';

export default function ApproveDialog({
  open,
  onClose,
  admissionId,
}: {
  open: boolean;
  onClose: () => void;
  admissionId: string;
}) {
  const { toast } = useToast();
  const onApproveAdmission = async () => {
    const docRef = doc(db, 'admissions', `${admissionId}`);
    try {
      await updateDoc(docRef, { status: 'approved' });
      toast({ title: 'Admission approved' });
      onClose();
    } catch (error) {
      toast({ title: `Approving admission failed`, variant: 'destructive' });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Admission</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
          <Button onClick={onApproveAdmission}>Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
