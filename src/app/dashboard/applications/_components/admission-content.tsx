import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdmissionUser } from '@/lib/types';
import { format } from 'date-fns';

const capitalFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export default function AdmissionContent({
  open,
  onClose,
  admission,
}: {
  admission: AdmissionUser;
  open: boolean;
  onClose: () => void;
}) {
  if (Object.keys(admission).length === 0) return;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Admission ({admission.user.name})</DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-[600px] p-4'>
          <div className='grid gap-3 text-sm [&>div]:border-b'>
            <h2 className='text-base font-semibold text-primary'>Profile</h2>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Name</h3>
              <div className='flex gap-1'>
                <p>{admission.form.name.family},</p>
                <p>{admission.form.name.first}</p>
                <p>{admission.form.name.middle}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Permanent Address</h3>
              <div className='flex gap-1'>
                <p>{admission.form.permanentAddress.town},</p>
                <p>{admission.form.permanentAddress.province}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Civil Status</h3>
              <div className='flex gap-1'>
                <p>{capitalFirstLetter(admission.form.civilStatus)}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Date of Birth</h3>
              <div className='flex gap-1'>
                <p>
                  {format(
                    new Date(admission.form.dateOfBirth),
                    'MMMM dd, yyyy',
                  )}
                </p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Place of Birth</h3>
              <div className='flex gap-1'>
                <p>{admission.form.placeOfBirth}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Religion</h3>
              <div className='flex gap-1'>
                <p>{admission.form.religion.name}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Baptized?</h3>
              <div className='flex gap-1'>
                <p>{capitalFirstLetter(admission.form.religion.baptized)}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Confirmed?</h3>
              <div className='flex gap-1'>
                <p>{capitalFirstLetter(admission.form.religion.baptized)}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Married?</h3>
              <div className='flex gap-1'>
                <p>{capitalFirstLetter(admission.form.married.isMarried)}</p>
              </div>
            </div>
            {admission.form.married.isMarried === 'yes' && (
              <div className='flex justify-between items-center'>
                <h3 className='font-medium'>Ceremony Held</h3>
                <div className='flex gap-1'>
                  <p>
                    {admission.form.married.ceremony
                      .map((cr) => capitalFirstLetter(cr))
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className='grid gap-3 text-sm [&>div]:border-b'>
            <h2 className='text-base font-semibold text-primary'>Education</h2>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Elementary</h3>
              <div className='flex gap-1'>
                <p>{admission.form.previousEducation.elementary.name},</p>
                <p>{admission.form.previousEducation.elementary.town},</p>
                <p>{admission.form.previousEducation.elementary.province},</p>
                <p>{admission.form.previousEducation.elementary.year}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Secondary</h3>
              <div className='flex gap-1'>
                <p>{admission.form.previousEducation.secondary.name},</p>
                <p>{admission.form.previousEducation.secondary.town},</p>
                <p>{admission.form.previousEducation.secondary.province},</p>
                <p>{admission.form.previousEducation.secondary.year}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Collegiate</h3>
              <div className='flex gap-1'>
                <p>{admission.form.previousEducation.collegiate.name},</p>
                <p>{admission.form.previousEducation.collegiate.town},</p>
                <p>{admission.form.previousEducation.collegiate.province},</p>
                <p>{admission.form.previousEducation.collegiate.year}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Graduate</h3>
              <div className='flex gap-1'>
                <p>{admission.form.previousEducation.graduate.name},</p>
                <p>{admission.form.previousEducation.graduate.town},</p>
                <p>{admission.form.previousEducation.graduate.province},</p>
                <p>{admission.form.previousEducation.graduate.year}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Academic Honors</h3>
              <div className='flex gap-1'>
                <p>{admission.form.academicHonors || 'N/A'}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Extra-Curricular Activities</h3>
              <div className='flex gap-1'>
                <p>{admission.form.extraCurricularActivities || 'N/A'}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>
                Membership in Professional Organization
              </h3>
              <div className='flex gap-1'>
                <p>
                  {admission.form.memberInProfessionalOrg
                    ? capitalFirstLetter(admission.form.memberInProfessionalOrg)
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>
                Over-All Undergraduate Average Grade
              </h3>
              <div className='flex gap-1'>
                <p>{admission.form.underGraduateGrade}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Over-All Grade in Major Subjects</h3>
              <div className='flex gap-1'>
                <p>{admission.form.gradeInMajorSubjects}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Graduate Status Desired</h3>
              <div className='flex gap-1'>
                <p>
                  {capitalFirstLetter(
                    admission.form.degree.status === 'nonDegree'
                      ? 'Non-degree'
                      : admission.form.degree.status,
                  )}
                </p>
              </div>
            </div>
            {admission.form.degree.status === 'degree' && (
              <div className='flex justify-between items-center'>
                <h3 className='font-medium'>Major Degree</h3>
                <div className='flex gap-1'>
                  <p>
                    {capitalFirstLetter(admission.form.degree.desiredDegree)}
                  </p>
                </div>
              </div>
            )}
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Major Field Units</h3>
              <div className='flex gap-1'>
                <p>{admission.form.majorFieldUnits}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Minor Field Units</h3>
              <div className='flex gap-1'>
                <p>{admission.form.minorFieldUnits}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Minor Field Units</h3>
              <div className='flex gap-1'>
                <p>{admission.form.minorFieldUnits}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Full-time Student?</h3>
              <div className='flex gap-1'>
                <p>{capitalFirstLetter(admission.form.isFullTimeStudent)}</p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Present Employed Position</h3>
              <div className='flex gap-1'>
                <p>
                  {admission.form.presentPosition
                    ? capitalFirstLetter(admission.form.presentPosition)
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Subject Taught</h3>
              <div className='flex gap-1'>
                <p>
                  {admission.form.subjectTaught
                    ? capitalFirstLetter(admission.form.subjectTaught)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {admission.form.references.length > 0 && (
            <div className='grid gap-3 text-sm [&>div]:border-b'>
              <h2 className='text-base font-semibold text-primary'>
                References
              </h2>
              {new Array(10).fill('').map((_, index) => (
                <div key={index}>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium'>Name</p>
                    <p>Test Name</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium'>Address</p>
                    <p>Test Address</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='grid gap-3 text-sm [&>div]:border-b'>
            <h2 className='text-base font-semibold text-primary'>Documents</h2>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Honorable Dismissal</h3>
              <div className='flex gap-1'>
                <Button className='p-0' asChild variant='link'>
                  <a
                    target='_blank'
                    href={admission.form.documents.honorableDismissal}>
                    View
                  </a>
                </Button>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>TOR (Transcript of Record)</h3>
              <div className='flex gap-1'>
                <Button className='p-0' asChild variant='link'>
                  <a target='_blank' href={admission.form.documents.tor}>
                    View
                  </a>
                </Button>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>General Weighted Average</h3>
              <div className='flex gap-1'>
                <Button className='p-0' asChild variant='link'>
                  <a
                    target='_blank'
                    href={admission.form.documents.generalWeightedAverage}>
                    View
                  </a>
                </Button>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Birth Certificate</h3>
              <div className='flex gap-1'>
                <Button className='p-0' asChild variant='link'>
                  <a
                    target='_blank'
                    href={admission.form.documents.birthCertificate}>
                    View
                  </a>
                </Button>
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>Marriage Certificate</h3>
              <div className='flex gap-1'>
                {admission.form.documents.marriageCertificate ? (
                  <Button className='p-0' asChild variant='link'>
                    <a
                      target='_blank'
                      href={admission.form.documents.marriageCertificate}>
                      View
                    </a>
                  </Button>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <h3 className='font-medium'>2x2 ID Picture</h3>
              <div className='flex gap-1'>
                <Button className='p-0' asChild variant='link'>
                  <a target='_blank' href={admission.form.documents.idPicture}>
                    View
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
