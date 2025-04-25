'use client';

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
        <>
            <Header ref={headerRef} />
            <div style={{ paddingTop: `${headerHeight}px` }}>{children}</div>
        </>
    );
}