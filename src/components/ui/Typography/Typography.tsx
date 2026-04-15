import React from 'react';
import styles from './Typography.module.scss';
import { clsx } from '@/lib/clsx';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'p-small';

const variantTagMap: Record<TypographyVariant, keyof React.JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  'p-small': 'p',
};

export interface TypographyProps {
  variant?: TypographyVariant;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

export function Typography({
  variant = 'p',
  as,
  className,
  children,
}: TypographyProps) {
  const Tag = as ?? variantTagMap[variant];

  return (
    <Tag className={clsx(styles[`text-${variant}`], className)}>
      {children}
    </Tag>
  );
}
