import React from 'react';
import { Container } from '@/components/ui';
import styles from './AuthLayout.module.scss';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className={styles.page}>
      <Container className={styles.container}>
        <div className={styles.content}>{children}</div>
      </Container>
    </section>
  );
}
