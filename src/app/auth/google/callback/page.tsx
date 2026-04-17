'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Card, Typography } from '@/components/ui';
import { googleCallback } from '@/lib/api/auth';
import { ApiClientError } from '@/lib/api/client';
import { saveAccessToken } from '@/lib/auth/sign-out';
import styles from '../../../(auth)/auth-pages.module.scss';

const INITIAL_MESSAGE = 'Completing Google sign in...';

export default function GoogleCallbackPage() {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState(INITIAL_MESSAGE);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code') ?? '';

    if (!code) {
      setIsProcessing(false);
      setMessage('Google code is missing. Please start sign in again.');
      return;
    }

    const run = async () => {
      try {
        const response = await googleCallback({ code });
        saveAccessToken(response.access_token);
        setIsSuccess(true);
        setMessage('Signed in with Google successfully. Redirecting...');
        router.push('/');
        router.refresh();
      } catch (error) {
        if (error instanceof ApiClientError) {
          setMessage(error.message);
        } else {
          setMessage('Unable to sign in with Google right now. Please try again.');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    void run();
  }, [router]);

  return (
    <Card className={styles.noticeCard}>
      <Typography variant="h3" as="h1">
        Google sign in
      </Typography>

      <Typography variant="p" className={styles.noticeText}>
        {message}
      </Typography>

      {!isProcessing && !isSuccess && (
        <Button type="button" onClick={() => router.push('/login')}>
          Back to sign in
        </Button>
      )}

      <Link href="/login" className={styles.link}>
        Sign in with email
      </Link>
    </Card>
  );
}


