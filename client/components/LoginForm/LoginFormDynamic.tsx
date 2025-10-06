import dynamic from 'next/dynamic';

export const LoginFormDynamic = dynamic(
  () => import('@/components/LoginForm/LoginForm').then((mod) => mod.LoginForm),
  { ssr: false },
);
