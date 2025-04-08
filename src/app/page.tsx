'use client'

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';

export default function LandingPage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If already authenticated, go to /play immediately
  // useEffect(() => {
  //   if (authenticated) {
  //     router.push('/play')
  //   }
  // }, [authenticated, router])

  const handlePlayNow = async () => {
    setLoading(true)
    if (authenticated) {
      router.push('/play')
    } else {
      await login()
    }
    setLoading(false)
  }

  return (
    <main className={styles.landingWrapper}>
      <h1 className={styles.landingTitle}>Lil Pudgy Big Memory</h1>
      <p className={styles.landingSubtitle}>A memory card game for pudgy brains</p>
      <button className={styles.landingButton} onClick={handlePlayNow} disabled={loading}>
        {loading ? 'Loading...' : 'Play Now'}
      </button>
    </main>
  )
}