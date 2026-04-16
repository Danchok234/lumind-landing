import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthLayout } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Auth | Lumind',
  description: 'Authentication pages for Lumind',
};

export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

