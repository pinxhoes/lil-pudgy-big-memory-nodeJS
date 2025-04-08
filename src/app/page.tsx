'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LandingPage() {
  const { login, authenticated } = usePrivy()
  const router = useRouter()

  // If already authenticated, go to /play immediately
  // useEffect(() => {
  //   if (authenticated) {
  //     router.push('/play')
  //   }
  // }, [authenticated, router])

  const handlePlayNow = () => {
    if (authenticated) {
      router.push('/play')
    } else {
      login()
    }
  }

  return (
    <main className={styles.landingWrapper}>
      <h1 className={styles.landingTitle}>Lil Pudgy Big Memory</h1>
      <p className={styles.landingSubtitle}>A memory card game for pudgy brains</p>
      <button className={styles.landingButton} onClick={handlePlayNow}>
        Play Now
      </button>
    </main>
  )
}