'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AuthCard } from '@/components/auth';
import { Input } from '@/components/ui';
import { register } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { validateRegisterForm } from '@/lib/validation/auth';
import type { FormErrors, RegisterFormValues } from '@/types/auth';
import styles from '../auth-pages.module.scss';

const INITIAL_VALUES: RegisterFormValues = {
  first_name: '',
  second_name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors<RegisterFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateRegisterForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);

    try {
      await register({
        first_name: values.first_name,
        second_name: values.second_name,
        email: values.email,
        password: values.password,
      });

      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
      } else {
        setFormError('Unable to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Sign up"
      switchText="Already have an account?"
      switchCtaLabel="Sign in"
      switchHref="/login"
      submitLabel="Create account"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      formError={formError}
    >
      <div className={styles.fields}>
        <Input
          label="First name"
          value={values.first_name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, first_name: event.target.value }))
          }
          error={errors.first_name}
          placeholder="John"
          autoComplete="given-name"
        />

        <Input
          label="Second name"
          value={values.second_name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, second_name: event.target.value }))
          }
          error={errors.second_name}
          placeholder="Doe"
          autoComplete="family-name"
        />

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
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
