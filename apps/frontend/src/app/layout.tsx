import { Toaster } from 'react-hot-toast';
import ClientLayout from '../components/ClientLayout';
import { wedges } from './fonts';
import './globals.css';
import { AuthProvider } from './providers/AuthProvider';

export const metadata = {
  title: 'Lil Pudgy Big Memory',
  description: 'Welcome to Stoopid World. A digital playground for curious minds and chaotic fun.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={wedges.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="preload"
          href="/fonts/Wedges.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link rel="icon" type="image/svg+xml" href="/img/pinguLogo.svg" />
      </head>
      <body className="bg-[#80abff] font-wedges ">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}