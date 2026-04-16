'use client';

import Link from 'next/link';
import React from 'react';
import { Button, Card, Typography } from '@/components/ui';
import { clsx } from '@/lib/clsx';
import styles from './AuthCard.module.scss';

export interface AuthCardProps {
  title: string;
  switchText: string;
  switchCtaLabel: string;
  switchHref: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  formError?: string;
  successMessage?: string;
  footerText?: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  switchText,
  switchCtaLabel,
  switchHref,
  submitLabel,
  isSubmitting,
  onSubmit,
  formError,
  successMessage,
  footerText,
  children,
}: AuthCardProps) {
  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <Typography variant="h3" as="h1">
          {title}
        </Typography>
      </header>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {children}

        {formError && (
          <p role="alert" className={clsx(styles.message, styles.error)}>
            {formError}
          </p>
        )}

        {successMessage && <p className={clsx(styles.message, styles.success)}>{successMessage}</p>}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : submitLabel}
        </Button>
      </form>

      <footer className={styles.footer}>
        {footerText && <p className={styles.footerText}>{footerText}</p>}
        <p className={styles.switchText}>
          {switchText}{' '}
          <Link href={switchHref} className={styles.link}>
            {switchCtaLabel}
          </Link>
        </p>
      </footer>
    </Card>
  );
}
