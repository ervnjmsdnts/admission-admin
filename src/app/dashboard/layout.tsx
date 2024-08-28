import { PropsWithChildren } from 'react';
import Sidebar from '@/components/sidebar';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { clientConfig, serverConfig } from '@/lib/firebase/config';
import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types';

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    return notFound();
  }

  const userDoc = doc(db, 'users', tokens.decodedToken.uid);

  const user = await getDoc(userDoc);

  const data = { ...user.data(), id: user.id } as User;

  return (
    <div className='h-full bg-gray-100 w-full flex'>
      <Sidebar user={data} />
      <main className='my-4 mr-4 p-4 border rounded-md w-full bg-white'>
        {children}
      </main>
    </div>
  );
}
