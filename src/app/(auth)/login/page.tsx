'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { AuthCard } from '@/components/auth';
import { Button, Input } from '@/components/ui';
import {
  getGoogleOAuthStartUrl,
  getMe,
  login,
  requestVerifyToken,
} from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { saveAccessToken, saveCurrentUser } from '@/lib/auth/sign-out';
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
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [resendMessage, setResendMessage] = useState<string | undefined>(undefined);
  const [showResend, setShowResend] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLoginForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormError(undefined);
    setResendMessage(undefined);
    setShowResend(false);

    try {
      const session = await login({
        email: values.email,
        password: values.password,
      });

      const token = session.access_token ?? session.accessToken;
      if (token) {
        saveAccessToken(token);
      }

      try {
        console.info('fetch_me_start');
        const currentUser = await getMe();
        saveCurrentUser(currentUser);
        console.info('fetch_me_success');
      } catch (fetchMeError) {
        console.error('fetch_me_fail', { error: fetchMeError });
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
        if (extractErrorCode(error.details) === 'LOGIN_USER_NOT_VERIFIED') {
          setShowResend(true);
        }
      } else {
        setFormError('Unable to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
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

  const handleResendVerify = async () => {
    setIsResending(true);
    setFormError(undefined);
    setResendMessage(undefined);

    try {
      await requestVerifyToken({ email: values.email });
      setResendMessage('Verification email sent. Please check your inbox.');
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
      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={isGoogleRedirecting || isSubmitting}
      >
        {isGoogleRedirecting ? 'Redirecting to Google...' : 'Continue with Google'}
      </Button>

      <div className={styles.divider} aria-hidden="true">
        <span>or</span>
      </div>

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

        {showResend && (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleResendVerify}
            disabled={isResending || isSubmitting}
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </Button>
        )}

        {resendMessage && <p className={styles.noticeSuccess}>{resendMessage}</p>}
      </div>
    </AuthCard>
  );
}

function extractErrorCode(details: unknown): string | undefined {
  if (!details || typeof details !== 'object') {
    return undefined;
  }

  const detail = (details as { detail?: unknown }).detail;
  if (!detail || typeof detail !== 'object') {
    return undefined;
  }

  const code = (detail as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

