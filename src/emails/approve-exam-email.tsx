import {
  Body,
  Container,
  Head,
  Html,
  Tailwind,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function ApproveExamEmail({ name }: { name: string }) {
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
              Congratulations! We are delighted to inform you that you have
              successfully passed the examination. Your dedication and hard work
              have paid off, and we are proud of your achievement.
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              We are excited to welcome you to Divine Word College of San Jose
              and look forward to supporting you in this new chapter of your
              academic journey.
            </Text>
            <Text>
              Should you have any questions or need assistance, feel free to
              reach out to us. Once again, congratulations on your success, and
              welcome to Divine Word College of San Jose!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
