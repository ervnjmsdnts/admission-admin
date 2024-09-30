import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function RejectEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]'>
            <Section className='mt-[32px]'>
              <Img
                src={`${baseUrl}/static/mindoro-school-logo.png`}
                width={100}
                height={100}
                className='m-auto'
              />
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              Dear <strong>{name}</strong>,
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              Thank you for your application. After careful consideration, we
              regret to inform you that your application for admission has not
              been approved.
            </Text>
            <Text>
              We appreciate the time and effort you put into your application.
              If you have any questions or would like further clarification,
              please don&apos;t hesitate to contact us.
            </Text>
            <Text>We wish you all the best in your future endeavors.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
