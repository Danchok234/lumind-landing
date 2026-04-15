import React from 'react';
import styles from './Card.module.scss';
import { clsx } from '@/lib/clsx';

export type CardVariant = 'default' | 'glow';

export interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Card({
  variant = 'default',
  className,
  children,
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag className={clsx(styles.card, styles[`card--${variant}`], className)}>
      {children}
    </Tag>
  );
}
