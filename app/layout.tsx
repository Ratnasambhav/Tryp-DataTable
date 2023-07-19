import type { Metadata } from 'next'

import { inter } from '@/app/fonts'
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Tryp Data Table'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
