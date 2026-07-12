import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface VideoMetadata {
  duration: number; // in seconds
  width: number;    // in pixels
  height: number;   // in pixels
  size: number;     // in bytes
}

export function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = objectUrl
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
      })
    }

    video.onerror = (err) => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load video metadata: ' + err))
    }
  })
}

