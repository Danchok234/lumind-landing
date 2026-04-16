'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AuthCard } from '@/components/auth';
import { Input } from '@/components/ui';
import { login } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { validateLoginForm } from '@/lib/validation/auth';
import type { FormErrors, LoginFormValues } from '@/types/auth';
import styles from '../auth-pages.module.scss';

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);

    try {
      await login({
        email: values.email,
        password: values.password,
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
      } else {
        setFormError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Sign in"
      switchText="Don\'t have an account?"
      switchCtaLabel="Sign up"
      switchHref="/register"
      submitLabel="Sign in"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      formError={formError}
    >
      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          error={errors.email}
          placeholder="you@company.com"
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={values.password}
          onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
          error={errors.password}
          placeholder="Your password"
          autoComplete="current-password"
        />

        <div className={styles.metaRow}>

          <Link href="/forgotpass" className={styles.link}>
            Forgot password?
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

