import { Inter } from 'next/font/google';
import Head from 'next/head';
import { wedges } from './fonts';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className={`${wedges.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}