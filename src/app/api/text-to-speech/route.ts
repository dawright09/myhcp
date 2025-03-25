import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

// Voice mapping for each provider
// OpenAI voices characteristics:
// - alloy: Neutral and balanced
// - echo: More senior/mature, authoritative
// - fable: Warmer, younger, friendly
// - onyx: Deep and authoritative
// - nova: Soft, warm, professional
// - shimmer: Clear, energetic, direct

interface VoiceSettings {
  voice: OpenAIVoice
  speed: number
}

const providerVoices: { [key: string]: VoiceSettings } = {
  'sarah-chen': {
    voice: 'nova',     // Warm, professional female voice that conveys expertise
    speed: 1.0
  },
  'michael-rodriguez': {
    voice: 'echo',     // Mature, experienced male voice for community setting
    speed: 0.95        // Slightly slower to convey thoughtfulness
  },
  'emma-patel': {
    voice: 'shimmer',  // Clear, energetic voice that can sound rushed/direct
    speed: 1.15        // Faster to sound more rushed
  },
  'jennifer-martinez': {
    voice: 'fable',    // Warm, approachable female voice
    speed: 1.0
  }
}

// Simple in-memory cache for audio responses
const audioCache = new Map<string, ArrayBuffer>()

export async function POST(request: Request) {
  try {
    const { text, providerId } = await request.json()

    if (!text || typeof text !== 'string' || !providerId || typeof providerId !== 'string') {
      return NextResponse.json(
        { error: 'Missing required parameters or invalid input types' },
        { status: 400 }
      )
    }

    const settings = providerVoices[providerId as keyof typeof providerVoices] || { voice: 'alloy', speed: 1.0 }

    // Create a cache key based on the text and voice settings
    const cacheKey = `${text}-${settings.voice}-${settings.speed}`
    
    // Check if we have this audio in cache
    let audioData = audioCache.get(cacheKey)
    
    if (!audioData) {
      console.log(`Generating speech for ${providerId} using voice: ${settings.voice} at speed: ${settings.speed}`)
      
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: settings.voice,
        input: text,
        speed: settings.speed,
        response_format: "mp3",
      })

      // Get the binary audio data
      audioData = await mp3.arrayBuffer()
      
      // Store in cache (limit cache size to prevent memory issues)
      if (audioCache.size > 100) {
        // Clear old entries if cache gets too large
        const oldestKey = audioCache.keys().next().value
        if (oldestKey) {
          audioCache.delete(oldestKey)
        }
      }
      audioCache.set(cacheKey, audioData)
    } else {
      console.log(`Using cached audio for ${providerId}`)
    }
    
    // Return the audio as a stream with appropriate headers
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'X-Content-Type-Options': 'nosniff',
        'Accept-Ranges': 'bytes'
      },
    })
  } catch (error) {
    console.error('Error in text-to-speech:', error)
    audioCache.clear() // Clear cache on error to prevent serving corrupted audio
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
} 