'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { AuthCard } from '@/components/auth';
import { Button, Card, Input, Typography } from '@/components/ui';
import { getGoogleOAuthStartUrl, register, requestVerifyToken } from '@/lib/api/auth';
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
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors<RegisterFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [verificationEmail, setVerificationEmail] = useState<string | undefined>(undefined);
  const [resendMessage, setResendMessage] = useState<string | undefined>(undefined);
  const [isResending, setIsResending] = useState(false);

  const mailboxUrl = useMemo(() => {
    if (!verificationEmail) {
      return 'https://mail.google.com';
    }

    const domain = verificationEmail.split('@')[1]?.toLowerCase();
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
      return 'https://mail.google.com';
    }
    if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
      return 'https://outlook.live.com/mail';
    }
    if (domain === 'yahoo.com') {
      return 'https://mail.yahoo.com';
    }

    return 'https://mail.google.com';
  }, [verificationEmail]);

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
        email: values.email,
        password: values.password,
        display_first_name: values.first_name.trim() || undefined,
        display_last_name: values.second_name.trim() || undefined,
      });

      setVerificationEmail(values.email);
      setResendMessage('We sent a verification email. Please check your inbox.');
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

  const handleResend = async () => {
    if (!verificationEmail) {
      return;
    }

    setIsResending(true);
    setResendMessage(undefined);
    setFormError(undefined);

    try {
      await requestVerifyToken({ email: verificationEmail });
      setResendMessage('Verification email sent again.');
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
      } else {
        setFormError('Unable to resend verification email now.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleSignUp = () => {
    try {
      setFormError(undefined);
      setIsGoogleRedirecting(true);

      console.info('start_google_oauth');
      const googleUrl = getGoogleOAuthStartUrl();
      window.location.assign(googleUrl);
    } catch (error) {
      console.error('start_google_oauth_fail', { error });
      setFormError('Google OAuth is not configured. Please contact support.');
      setIsGoogleRedirecting(false);
    }
  };

  if (verificationEmail) {
    return (
      <Card className={styles.noticeCard}>
        <Typography variant="h3" as="h1">
          Check your inbox
        </Typography>
        <Typography variant="p" className={styles.noticeText}>
          We sent a verification email to <strong>{verificationEmail}</strong>.
        </Typography>

        {resendMessage && <p className={styles.noticeSuccess}>{resendMessage}</p>}
        {formError && <p className={styles.noticeError}>{formError}</p>}

        <div className={styles.noticeActions}>
          <Button
            type="button"
            onClick={() => window.open(mailboxUrl, '_blank', 'noopener,noreferrer')}
          >
            Open mail
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend email'}
          </Button>
        </div>

        <Link
          href={`/verify-email?email=${encodeURIComponent(verificationEmail)}`}
          className={styles.link}
        >
          I already have a token
        </Link>
        <Link href="/login" className={styles.link}>
          Back to sign in
        </Link>
      </Card>
    );
  }

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
      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleGoogleSignUp}
        disabled={isGoogleRedirecting || isSubmitting}
      >
        {isGoogleRedirecting ? 'Redirecting to Google...' : 'Continue with Google'}
      </Button>

      <div className={styles.divider} aria-hidden="true">
        <span>or</span>
      </div>

      <div className={styles.fields}>
        <Input
          label="First name (optional)"
          value={values.first_name}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, first_name: event.target.value }))
          }
          error={errors.first_name}
          placeholder="John"
          autoComplete="given-name"
        />

        <Input
          label="Last name (optional)"
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
