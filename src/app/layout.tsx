import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Image from 'next/image'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'myHCP.ai - Practice Sales Calls with AI Healthcare Providers',
  description: 'Practice pharmaceutical sales calls with AI-powered healthcare providers specializing in CLL treatment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-primary-600 text-white border-b border-primary-700">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2">
              <Image
                src="/images/myhcp-logo.svg"
                alt="myHCP.ai Logo"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-white hover:text-primary-200 font-medium transition-colors">
                Home
              </a>
              <a href="#" className="text-white hover:text-primary-200 font-medium transition-colors">
                About
              </a>
              <button className="bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors font-medium">
                Get Started
              </button>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <footer className="bg-primary-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Image
                src="/images/myhcp-logo.svg"
                alt="myHCP.ai Logo"
                width={100}
                height={25}
                className="h-6 w-auto"
              />
              <div className="text-sm text-primary-200">
                © 2024 myHCP.ai. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 