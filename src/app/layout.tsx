import Header from '@/components/Header';
import { wedges } from './fonts';
import './globals.css';

export const metadata = {
  title: 'Memory Game',
  description: 'Web3 Memory Game with Wallet Login',
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
      </head>
      <body className="bg-[#f5fdff] font-wedges ">
        <Header />
        {children}
      </body>
    </html>
  );
}