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

export default function RejectExamEmail({ name }: { name: string }) {
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
              Thank you for taking the examination and for your interest in
              Divine Word College of San Jose. After careful consideration of
              your results, we regret to inform you that you have not passed
              this time.
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              We understand this news may be disappointing, but we encourage you
              to continue striving for your goals and exploring opportunities
              for growth and learning. Our admissions team is available to
              provide guidance and answer any questions you may have about
              potential next steps.
            </Text>
            <Text>
              Please feel free to reach out to us for support. We wish you the
              very best in your future endeavors and hope to see your continued
              success.
            </Text>
            <Text>We wish you all the best in your future endeavors.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
