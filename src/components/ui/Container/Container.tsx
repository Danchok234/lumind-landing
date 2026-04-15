import React from 'react';
import styles from './Container.module.scss';
import { clsx } from '@/lib/clsx';

export interface ContainerProps {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

export function Container({
  as: Tag = 'div',
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={clsx(styles.container, className)}>
      {children}
    </Tag>
  );
}
