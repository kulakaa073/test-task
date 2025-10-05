'use client';

import { HeroUIProvider } from '@heroui/react';

interface ProvidersProps {
  children: React.ReactNode;
}
export const Providers = ({ children }: ProvidersProps) => {
  return <HeroUIProvider>{children} </HeroUIProvider>;
};
