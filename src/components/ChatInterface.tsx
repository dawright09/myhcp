'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { Provider } from '@/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  provider: Provider & { id: string }
}

// Create a client-side only timestamp component
function TimeStamp({ time }: { time: Date }) {
  const [formattedTime, setFormattedTime] = useState<string>('')

  useEffect(() => {
    setFormattedTime(time.toLocaleTimeString())
  }, [time])

  if (!formattedTime) return null
  return <span>{formattedTime}</span>
}

export default function ChatInterface({ provider }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, timestamp: Date }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isAutoMode, setIsAutoMode] = useState(true)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioPlaybackPromiseRef = useRef<Promise<void> | null>(null)
  const router = useRouter()

  // Cleanup function for audio elements
  const cleanupAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.src = ''
      URL.revokeObjectURL(currentAudioRef.current.src)
      currentAudioRef.current.remove()
      currentAudioRef.current = null
    }
    setIsPlayingAudio(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [])

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant' as const,
      content: `Hi, I'm ${provider.name}. ${
        provider.id === 'emma-patel' 
          ? "*checking watch* I've got a few minutes between patients. I keep hearing about new CLL treatments, but I need to understand why I should consider changing what I'm doing. What can you tell me?"
          : provider.id === 'sarah-chen'
          ? "I'm interested in learning about the latest CLL treatment data. I'd like to see the evidence for any new approaches you're suggesting. What clinical trial results can you share?"
          : provider.id === 'michael-rodriguez'
          ? "Thanks for coming by! I've been trying to keep up with all these new CLL treatments, but honestly, I get them mixed up sometimes. Could you help me understand what's new? I'm particularly interested in... wait, is it the BTK inhibitors or the BCL2 inhibitors that need the ramp-up period?"
          : "Hi there! I'm looking for some practical information about CLL treatments - particularly around patient management and monitoring requirements. What resources do you have available?"
      }`,
      timestamp: new Date()
    }
    
    // Set the welcome message without playing audio - it will be played by the messages useEffect
    setMessages([welcomeMessage])
  }, [provider.name, provider.id])

  // Handle audio playback for new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant') {
      playAudioResponse(lastMessage.content)
    }
  }, [messages])

  useEffect(() => {
    // Request microphone permissions when component mounts
    async function setupAudio() {
      try {
        console.log('Requesting microphone access...')
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000, // Optimize for speech
            channelCount: 1, // Mono audio to reduce echo
          } 
        })
        console.log('Microphone access granted')
        
        // Check supported MIME types
        const supportedTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus'
        ]
        
        let selectedMimeType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type))
        if (!selectedMimeType) {
          throw new Error('No supported MIME type found for audio recording')
        }
        
        console.log('Using MIME type:', selectedMimeType)
        
        const recorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType,
          audioBitsPerSecond: 32000 // Optimize for speech quality
        })
        
        // Get data more frequently to reduce processing time
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data)
          }
        }

        recorder.onstop = async () => {
          if (audioChunksRef.current.length === 0) return

          const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType })
          console.log('Final audio blob created:', audioBlob.size, 'bytes')
          audioChunksRef.current = []
          
          if (audioBlob.size > 8000) { // Only process if we have meaningful audio
            await processAudioChunk(audioBlob)
          }
        }

        setMediaRecorder(recorder)
      } catch (error) {
        console.error('Error setting up audio:', error)
        alert('Failed to access microphone. Please ensure you have granted microphone permissions.')
      }
    }

    setupAudio()
  }, [isAutoMode])

  // Separate audio processing logic
  const processAudioChunk = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.webm')

      console.log('Sending audio chunk to speech-to-text API...')
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API error: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      console.log('Received transcription:', data)
      
      if (data.text?.trim()) {
        if (isAutoMode) {
          const userMessage = {
            role: 'user' as const,
            content: data.text.trim(),
            timestamp: new Date()
          }

          setMessages(prev => [...prev, userMessage])
          await handleChatRequest(userMessage)
        } else {
          setInput(data.text)
        }
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      if (!isAutoMode) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I had trouble understanding that. Could you please try again?',
          timestamp: new Date()
        }])
      }
    }
  }

  // Separate the chat request logic for reuse
  const handleChatRequest = async (userMessage: { role: 'user', content: string, timestamp: Date }) => {
    setIsLoading(true)
    try {
      console.log('Sending chat request...')
      
      // Get all messages except the welcome message
      const chatMessages = messages
        .slice(1) // Skip the welcome message
        .filter(msg => msg.role === 'user')
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          providerId: provider.id
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        let errorMessage = 'An error occurred. Please try again.'
        
        if (response.status === 429) {
          errorMessage = 'The service is currently busy. Please wait a moment and try again.'
        } else if (response.status === 401) {
          errorMessage = 'There was an authentication error. Please refresh the page and try again.'
        }
        
        throw new Error(data.error || errorMessage)
      }

      console.log('Received chat response:', data)

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.message.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      // Remove direct audio playback here since it's handled by the messages useEffect

    } catch (error) {
      console.error('Error in chat:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }])
      // If in auto mode, start recording again after error
      if (isAutoMode) {
        setTimeout(startRecording, 2000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    await handleChatRequest(userMessage)
  }

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive' && !isPlayingAudio) {
      console.log('Starting recording...')
      audioChunksRef.current = [] // Clear any previous chunks
      mediaRecorder.start(1000) // Get data every second
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping recording...')
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const playAudioResponse = async (text: string) => {
    try {
      // If there's an ongoing playback, wait for it to finish
      if (audioPlaybackPromiseRef.current) {
        await audioPlaybackPromiseRef.current
      }

      // Clean up any existing audio
      cleanupAudio()

      // Stop recording if it's active before playing audio
      if (mediaRecorder?.state === 'recording') {
        stopRecording()
      }
      
      console.log('Requesting text-to-speech for:', text.substring(0, 50) + '...')
      setIsPlayingAudio(true)

      // Create a new promise for this playback
      audioPlaybackPromiseRef.current = (async () => {
        const response = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            providerId: provider.id
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to get audio response: ${response.statusText}`)
        }

        const audioBlob = await response.blob()
        console.log('Received audio response:', audioBlob.size, 'bytes')
        
        if (audioBlob.size === 0) {
          throw new Error('Received empty audio response')
        }
        
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio()
        currentAudioRef.current = audio
        
        // Wait a short moment before playing to ensure recording is fully stopped
        await new Promise(resolve => setTimeout(resolve, 100))
        
        return new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            console.log('Audio playback completed')
            cleanupAudio()
            // If in auto mode, wait a moment before starting recording again
            if (isAutoMode) {
              setTimeout(startRecording, 500)
            }
            resolve()
          }

          audio.onerror = (error) => {
            console.error('Audio playback error:', error)
            cleanupAudio()
            reject(new Error('Failed to play audio response'))
          }

          audio.src = audioUrl
          audio.play().catch(reject)
          console.log('Started audio playback')
        })
      })()

      await audioPlaybackPromiseRef.current
    } catch (error) {
      console.error('Error in text-to-speech:', error)
      cleanupAudio()
      // If in auto mode, start recording even if audio fails
      if (isAutoMode) {
        setTimeout(startRecording, 1000)
      }
    } finally {
      audioPlaybackPromiseRef.current = null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-[600px] flex flex-col">
        {/* Status bar */}
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isPlayingAudio ? 'bg-blue-500' : isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {isPlayingAudio ? `${provider.name} is speaking...` : 
               isRecording ? 'Recording your message...' : 
               'Ready for conversation'}
            </span>
          </div>
          <button
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={`text-sm px-3 py-1 rounded ${
              isAutoMode 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Voice Mode: {isAutoMode ? 'On' : 'Off'}
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'assistant'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-primary-600 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  <TimeStamp time={message.timestamp} />
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isAutoMode ? "Voice mode active - Click Record or type to switch to text" : "Type your message..."}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading || isRecording || isPlayingAudio}
            />
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-lg px-4 py-2 font-medium ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${(isLoading || isPlayingAudio) && 'opacity-50 cursor-not-allowed'}`}
              disabled={isLoading || isPlayingAudio}
            >
              {isRecording ? 'Stop' : 'Record'}
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading || isRecording || isPlayingAudio}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 