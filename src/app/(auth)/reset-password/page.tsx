'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { AuthCard } from '@/components/auth';
import { Input } from '@/components/ui';
import { ApiClientError } from '@/lib/api/client';
import { resetPassword } from '@/lib/api/auth';
import { validateResetPasswordForm } from '@/lib/validation/auth';
import type { FormErrors, ResetPasswordFormValues } from '@/types/auth';
import styles from '../auth-pages.module.scss';

const INITIAL_VALUES: ResetPasswordFormValues = {
  token: '',
  password: '',
  confirmPassword: '',
};

export default function ResetPasswordPage() {
  const [values, setValues] = useState<ResetPasswordFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors<ResetPasswordFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token') ?? '';
    setValues((prev) => ({ ...prev, token }));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateResetPasswordForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);
    setSuccessMessage(undefined);

    try {
      await resetPassword({ token: values.token, password: values.password });
      setSuccessMessage('Password updated successfully. You can now sign in.');
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
      } else {
        setFormError('Unable to reset password right now. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Set new password"
      switchText="Remember your credentials?"
      switchCtaLabel="Back to sign in"
      switchHref="/login"
      submitLabel="Update password"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      formError={formError}
      successMessage={successMessage}
    >
      <div className={styles.fields}>
        <Input
          label="New password"
          type="password"
          value={values.password}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, password: event.target.value }))
          }
          error={errors.password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />

        <Input
          label="Confirm new password"
          type="password"
          value={values.confirmPassword}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, confirmPassword: event.target.value }))
          }
          error={errors.confirmPassword}
          placeholder="Confirm password"
          autoComplete="new-password"
        />
      </div>
    </AuthCard>
  );
}
