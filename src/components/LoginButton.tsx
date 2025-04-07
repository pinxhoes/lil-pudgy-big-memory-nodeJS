'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect } from 'react'

export default function LoginButton() {
    const { login, logout, ready, authenticated, user } = usePrivy()

    useEffect(() => {
        if (authenticated && user?.wallet?.address && user?.id) {
            const wallet = user.wallet.address
            const privyId = user.id
            const username = user.email?.address?.split('@')[0] ?? 'anon'

            console.log('[Privy Auth] Sending login request:', { wallet, privyId, username })

            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet, privyId, username }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('✅ Login success:', data)
                })
                .catch((err) => console.error('[Privy Auth] Error:', err))
        } else {
            console.log('[Privy Auth] Not authenticated yet...')
        }
    }, [authenticated, user])



    if (!ready) return <p>Loading...</p>

    return authenticated ? (
        <div>
            <p>Welcome, {user?.wallet?.address}</p>
            <button onClick={logout}>Logout</button>
        </div>
    ) : (
        <button
            onClick={() => {
                console.log('[Privy] Login button clicked')
                login()
            }}
        >
            Connect Wallet
        </button>
    )
}