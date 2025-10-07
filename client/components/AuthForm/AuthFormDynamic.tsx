'use client';

import dynamic from 'next/dynamic';

export const AuthFormDynamic = dynamic(
  () => import('@/components/AuthForm/AuthForm').then((mod) => mod.AuthForm),
  { ssr: false, loading: () => <div>Loading form...</div> },
);
