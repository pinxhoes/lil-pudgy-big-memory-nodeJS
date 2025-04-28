'use client';

import { AuthProvider } from '@/app/providers/AuthProvider';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const headerRef = useRef<HTMLElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, []);


    return (
        <AuthProvider>
            <div className="relative min-h-[100dvh]">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <Header ref={headerRef} />
                </div>

                <div
                    className="relative z-10"
                    style={{ paddingTop: `${headerHeight}px` }}
                >
                    {children}
                </div>
            </div>
        </AuthProvider>
    );
}