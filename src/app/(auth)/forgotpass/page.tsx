'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { AuthCard } from '@/components/auth';
import { Input } from '@/components/ui';
import { forgotPassword } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { validateForgotPasswordForm } from '@/lib/validation/auth';
import type { ForgotPasswordFormValues, FormErrors } from '@/types/auth';
import styles from '../auth-pages.module.scss';

const INITIAL_VALUES: ForgotPasswordFormValues = {
  email: '',
};

const SUCCESS_MESSAGE =
  'If an account exists for this email, we sent password reset instructions.';

export default function ForgotPasswordPage() {
  const [values, setValues] = useState<ForgotPasswordFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors<ForgotPasswordFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForgotPasswordForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);
    setSuccessMessage(undefined);

    try {
      await forgotPassword({ email: values.email });
      setSuccessMessage(SUCCESS_MESSAGE);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
      } else {
        setFormError('Unable to submit request right now. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Reset password"
      switchText="Remember your credentials?"
      switchCtaLabel="Back to sign in"
      switchHref="/login"
      submitLabel="Send reset link"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      formError={formError}
      successMessage={successMessage}
      footerText="Check your email for password reset instructions."
    >
      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
          error={errors.email}
          placeholder="you@company.com"
          autoComplete="email"
        />
      </div>
    </AuthCard>
  );
}
