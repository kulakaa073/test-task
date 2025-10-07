'use client';

import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';

interface ProvidersProps {
  children: React.ReactNode;
}
export const Providers = ({ children }: ProvidersProps) => {
  return (
    <HeroUIProvider className="min-h-screen flex flex-col">
      <ToastProvider placement="top-right" toastOffset={60} />
      {children}
    </HeroUIProvider>
  );
};
