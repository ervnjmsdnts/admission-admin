import ApproveEmail from '@/emails/approve-email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { to: string; name: string };
    const { data, error } = await resend.emails.send({
      from: 'noreply@admission-dwc.xyz',
      to: body.to,
      subject: 'Admission Result',
      react: ApproveEmail({ name: body.name }),
    });

    if (error) {
      console.log(error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
