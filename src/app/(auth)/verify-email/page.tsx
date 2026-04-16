'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Card, Typography } from '@/components/ui';
import { ApiClientError } from '@/lib/api/client';
import { verifyEmail } from '@/lib/api/auth';
import styles from '../auth-pages.module.scss';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const tokenFromQuery = new URLSearchParams(window.location.search).get('token') ?? '';
    setToken(tokenFromQuery);

    if (!tokenFromQuery) {
      setIsVerifying(false);
      setMessage('Verification token is missing. Please request a new email.');
      return;
    }

    const runVerify = async () => {
      try {
        await verifyEmail({ token: tokenFromQuery });
        setIsVerified(true);
        setMessage('Email verified successfully. You can now sign in.');
      } catch (error) {
        if (error instanceof ApiClientError) {
          setMessage(error.message);
        } else {
          setMessage('Unable to verify email right now. Please try again later.');
        }
      } finally {
        setIsVerifying(false);
      }
    };

    void runVerify();
  }, []);

  return (
    <Card className={styles.noticeCard}>
      <Typography variant="h3" as="h1">
        Email verification
      </Typography>

      <Typography variant="p" className={styles.noticeText}>
        {message}
      </Typography>

      {!isVerifying && isVerified && (
        <Button type="button" onClick={() => router.push('/login')}>
          Go to sign in
        </Button>
      )}

      {!isVerifying && !isVerified && token && (
        <Button
          type="button"
          onClick={() => window.location.reload()}
          variant="secondary"
        >
          Try again
        </Button>
      )}

      <Link href="/login" className={styles.link}>
        Back to sign in
      </Link>
    </Card>
  );
}

