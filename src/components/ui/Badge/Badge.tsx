import React from 'react';
import styles from './Badge.module.scss';
import { clsx } from '@/lib/clsx';

export type BadgeVariant = 'purple' | 'light' | 'dark';

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = 'light',
  className,
  children,
}: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[`badge--${variant}`], className)}>
      {children}
    </span>
  );
}
