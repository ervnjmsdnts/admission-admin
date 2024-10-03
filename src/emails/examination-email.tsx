import {
  Body,
  Container,
  Head,
  Html,
  Tailwind,
  Text,
  Img,
} from '@react-email/components';
import { format } from 'date-fns';
import * as React from 'react';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function ExaminationEmail({
  name,
  scheduleDate,
}: {
  name: string;
  scheduleDate: number;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]'>
            <Img
              src={`${baseUrl}/static/mindoro-school-logo.png`}
              width={100}
              height={100}
              className='m-auto'
            />
            <Text className='text-black text-[14px] leading-[24px]'>
              Dear <strong>{name}</strong>,
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              We are pleased to inform you that your examination schedule for
              admission to Divine Word College of San Jose has been set.
            </Text>
            <Text className='font-bold'>
              The exam is scheduled for {format(scheduleDate, 'PPp')}
            </Text>
            <Text>
              Should you have any questions regarding the schedule or need any
              assistance, do not hesitate to contact us. We wish you the best of
              luck and look forward to seeing you excel. Thank you for choosing
              Divine Word College of San Jose!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
