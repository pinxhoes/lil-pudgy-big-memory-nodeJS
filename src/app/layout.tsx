import { Inter } from 'next/font/google';
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
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}