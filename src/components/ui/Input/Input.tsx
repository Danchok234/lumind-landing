'use client';

import React, { useId } from 'react';
import styles from './Input.module.scss';
import { clsx } from '@/lib/clsx';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id: idProp,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div
      className={clsx(
        styles.wrapper,
        error && styles['wrapper--error'],
        rest.disabled && styles['wrapper--disabled'],
      )}
    >
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(styles.input, className)}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${id}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}
