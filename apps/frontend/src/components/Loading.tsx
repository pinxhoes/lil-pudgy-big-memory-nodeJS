'use client';

import Image from 'next/image';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            {/* Blur background */}
            <div className="absolute top-[4rem] left-0 right-0 bottom-0 backdrop-blur-sm" />

            {/* Spinner */}
            <div className="relative z-10 animate-bounce">
                <Image
                    src="/img/pinguLogo.svg"
                    alt="Loading..."
                    width={150}
                    height={150}
                    className="drop-shadow-lg"
                />
            </div>
        </div>
    );
}