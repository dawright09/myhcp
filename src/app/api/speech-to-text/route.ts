import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

// Verify API key is configured
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  let tempFilePath: string | null = null

  try {
    console.log('Receiving speech-to-text request...')
    const formData = await request.formData()
    const audioFile = formData.get('file') as File

    if (!audioFile) {
      console.error('No audio file provided in request')
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    console.log('Received audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    })

    // Verify audio file type
    if (!audioFile.type.startsWith('audio/')) {
      console.error('Invalid file type:', audioFile.type)
      return NextResponse.json(
        { error: 'Invalid file type. Must be an audio file.' },
        { status: 400 }
      )
    }

    // Create a temporary file
    tempFilePath = join(tmpdir(), `recording-${Date.now()}.webm`)
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    fs.writeFileSync(tempFilePath, audioBuffer)
    console.log('Saved audio to temporary file:', tempFilePath)

    try {
      console.log('Sending to OpenAI for transcription...')
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
      })

      console.log('Received transcription:', transcription.text)
      return NextResponse.json({ text: transcription.text })
    } catch (transcriptionError) {
      console.error('OpenAI transcription error:', transcriptionError)
      return NextResponse.json(
        { error: 'Failed to transcribe audio with OpenAI' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('General error in speech-to-text:', error)
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    )
  } finally {
    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
        console.log('Cleaned up temporary file:', tempFilePath)
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError)
      }
    }
  }
} 