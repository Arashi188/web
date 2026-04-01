// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopHub - WhatsApp E-commerce',
  description: 'Shop quality products and order directly via WhatsApp',
  keywords: 'ecommerce, whatsapp shopping, online store',
  authors: [{ name: 'ShopHub' }],
  openGraph: {
    title: 'ShopHub - WhatsApp E-commerce',
    description: 'Shop quality products and order directly via WhatsApp',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}