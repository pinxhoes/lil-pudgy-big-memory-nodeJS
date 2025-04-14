'use client';

import { AbstractPrivyProvider } from '@abstract-foundation/agw-react/privy';
import { QueryClient } from '@tanstack/react-query';
import { abstract } from 'viem/chains';

const queryClient = new QueryClient();

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <AbstractPrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            chain={abstract}
            queryClient={queryClient}
        >
            {children}
        </AbstractPrivyProvider>
    );
}