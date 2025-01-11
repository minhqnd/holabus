import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HolaBus - Về nhà ăn Tết',
  description: 'Đặt vé xe về quê ăn Tết cùng HolaBus',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-C38EHFVL5H" />
    </html>
  )
}

