'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function DropdownMenu({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed top-[1rem] left-0 right-0 bottom-0 z-20">
            {/* Blur background */}
            <div className="absolute inset-0 bg-transparent backdrop-blur-sm pointer-events-none" />
            {children}
        </div>,
        document.body
    );
}