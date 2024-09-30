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

export default function ApproveEmail({ name }: { name: string }) {
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
              Congratulations! We are thrilled to inform you that your
              application for admission to Divine Word College of San Jose has
              been approved. We are excited to welcome you to our community and
              look forward to supporting you on this new academic journey.
            </Text>
            <Text>
              Should you have any questions or need assistance, feel free to
              reach out to us. Once again, congratulations, and welcome to
              Divine Word College of San Jose!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
