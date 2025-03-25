'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import ChatInterface from '@/components/ChatInterface'
import { healthcareProviders } from '@/data/providers'
import type { ProviderId } from '@/types'
import { useState } from 'react'

export default function PracticePage({ params }: { params: { id: string } }) {
  const providerId = params.id as ProviderId
  const provider = healthcareProviders[providerId]
  const [isStarted, setIsStarted] = useState(false)

  if (!provider) {
    notFound()
  }

  // Add the ID to the provider object for use in components
  const providerWithId = {
    id: providerId,
    ...provider
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Provider Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <Image
                src={`/images/${providerId === 'sarah-chen' ? 'dr-chen-avatar' :
                  providerId === 'michael-rodriguez' ? 'dr-rodriguez-avatar' :
                  providerId === 'emma-patel' ? 'dr-patel-avatar' :
                  'np-martinez-avatar'}.jpg`}
                alt={provider.name}
                fill
                className="rounded-full object-cover border-4 border-white ring-2 ring-primary-100"
              />
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">{provider.name}</h1>
                <p className="text-xl text-primary-600 font-semibold">{provider.specialty}</p>
                <p className="text-gray-600 mt-2 text-lg">{provider.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Treatment Preferences</h2>
                <p className="text-gray-700">{provider.treatmentPreferences}</p>
              </div>
            </div>
          </div>
        </div>

        {!isStarted ? (
          <div className="flex justify-center">
            <button
              onClick={() => setIsStarted(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-sm transition-colors duration-150 ease-in-out flex items-center gap-2"
            >
              <span>Start Practicing</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ) : (
          /* Chat Interface */
          <ChatInterface provider={providerWithId} />
        )}
      </div>
    </div>
  )
} 