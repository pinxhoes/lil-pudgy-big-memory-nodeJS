'use client';

import { useAbstractPrivyLogin } from '@abstract-foundation/agw-react/privy';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.css';

export default function LandingPage() {
  const { login } = useAbstractPrivyLogin(); // Built-in Abstract login
  const { authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/play');
    }
  }, [authenticated, router]);

  return (
    <main className={styles.landingWrapper}>
      <h1 className={styles.landingTitle}>Lil Pudgy Big Memory</h1>
      <p className={styles.landingSubtitle}>A memory card game for pudgy brains</p>
      <button className={styles.landingButton} onClick={login}>
        Play Now
      </button>
    </main>
  );
}