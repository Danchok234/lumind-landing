'use client';

import React, { useRef, MouseEvent } from 'react';
import styles from './Button.module.scss';
import { clsx } from '@/lib/clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full-width pill */
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  onMouseMove,
  ...rest
}: ButtonProps) {
  const glowRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (glowRef.current && variant === 'primary') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.setProperty('--glow-x', `${x}px`);
      glowRef.current.style.setProperty('--glow-y', `${y}px`);
    }
    onMouseMove?.(e);
  };

  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        fullWidth && styles['button--full'],
        className,
      )}
      onMouseMove={handleMouseMove}
      {...rest}
    >
      {variant === 'primary' && (
        <span ref={glowRef} className={styles.glow} aria-hidden="true" />
      )}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
