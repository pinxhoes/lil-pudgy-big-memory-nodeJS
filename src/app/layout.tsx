import Header from '@/components/Header'
import { Inter } from 'next/font/google'
import './globals.css'
import { PrivyProviderWrapper } from './providers/PrivyProviderWrapper'
import { ThemeProvider } from './providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Memory Game',
  description: 'Web3 Memory Game with Wallet Login',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <PrivyProviderWrapper>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}