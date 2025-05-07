"use client";

import { AuthProvider } from '../providers/AuthProvider';

export default function PlayLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div>
                <main>{children}</main>
            </div>
        </AuthProvider>
    )
}