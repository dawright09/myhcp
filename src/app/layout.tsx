import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
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
        <header className="bg-white border-b border-gray-200">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-primary-500 font-display font-bold text-2xl">
                my<span className="text-accent">HCP</span>.ai
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-neutral-850 hover:text-primary-500 font-medium transition-colors">
                Home
              </a>
              <a href="#" className="text-neutral-850 hover:text-primary-500 font-medium transition-colors">
                About
              </a>
              <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors font-medium">
                Get Started
              </button>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <footer className="bg-neutral-850 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="font-display font-bold text-xl">
                my<span className="text-accent">HCP</span>.ai
              </div>
              <div className="text-sm text-gray-400">
                © 2024 myHCP.ai. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 