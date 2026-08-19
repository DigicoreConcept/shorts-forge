import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Download, Trash2 } from 'lucide-react'
import { Clip } from '@/types'
import { api } from '@/lib/api'

// Reusable Dynamic Canvas-based Lazy-loaded Thumbnail Generator
export function VideoThumbnail({ src, fallbackColor }: { src: string; fallbackColor: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [thumb, setThumb] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || !src) return
    const video = videoRef.current
    if (!video) return
    
    video.crossOrigin = 'anonymous'
    
    const handleLoadedData = () => {
      video.currentTime = Math.min(1, video.duration || 0) // Capture at 1 second
    }

    const handleSeeked = () => {
      const canvas = canvasRef.current
      if (canvas && video) {
        try {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
          setThumb(canvas.toDataURL('image/jpeg'))
        } catch (e) {
          console.warn('CORS error extracting thumbnail, falling back to color block', e)
        }
      }
    }
    
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('seeked', handleSeeked)
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('seeked', handleSeeked)
    }
  }, [isVisible, src])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {thumb ? (
        <img src={thumb} alt="Thumbnail" className="w-full h-full object-cover" />
      ) : (
        <>
          {isVisible && <video ref={videoRef} src={src} crossOrigin="anonymous" preload="metadata" className="hidden" muted playsInline />}
          <canvas ref={canvasRef} className="hidden" />
          <div className="w-full h-full" style={{ background: fallbackColor }} />
        </>
      )}
    </div>
  )
}

interface ClipCardProps {
  clip: Clip
  onPreview: (clip: Clip) => void
  onDelete?: (id: string) => void
}

export function ClipCard({ clip, onPreview, onDelete }: ClipCardProps) {
  const getFallbackColor = (id: string | number) => {
    const strId = String(id || '')
    const colors = ['#EF5350', '#C62828', '#22C55E', '#F59E0B']
    let sum = 0
    for (let i = 0; i < strId.length; i++) sum += strId.charCodeAt(i)
    return `${colors[sum % colors.length]}15`
  }

  const scoreVal = clip.score ?? 0
  const isHighViral = scoreVal >= 90
  const isMidViral = scoreVal >= 70 && scoreVal < 90

  const [downloading, setDownloading] = useState(false)

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDownloading(true)
    try {
      const res = await api.get(`/v1/clips/${clip.id}/download`)
      if (res.data?.success && (res.data?.data?.download_url || res.data?.data?.url)) {
        window.open(res.data.data.download_url || res.data.data.url, '_blank')
        return
      }
    } catch (err) {
      console.error('Failed to fetch clip download URL:', err)
    } finally {
      setDownloading(false)
    }
    if (clip.playback_url) {
      window.open(clip.playback_url, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3 }}
      className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl overflow-hidden hover:border-[#EF9090] hover:shadow-lg transition-all group flex flex-col h-full cursor-pointer"
      onClick={() => onPreview(clip)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[9/16] w-full max-h-72 overflow-hidden bg-black/5 flex-shrink-0">
        {clip.thumbnail_url ? (
          <img src={clip.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : clip.playback_url ? (
          <VideoThumbnail src={clip.playback_url} fallbackColor={getFallbackColor(clip.id)} />
        ) : (
          <div className="w-full h-full" style={{ background: getFallbackColor(clip.id) }} />
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EF5350] text-white flex items-center justify-center shadow-lg shadow-[#EF5350]/30"
          >
            <Play size={18} className="text-white fill-white ml-0.5" />
          </motion.div>
        </div>

        {/* Duration Badge */}
        {clip.duration_seconds !== undefined && clip.duration_seconds !== null && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm tracking-wider">
            {Math.round(clip.duration_seconds)}s
          </div>
        )}
        
        {/* Viral Score Badge */}
        {scoreVal > 0 && (
          <div 
            className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] font-bold backdrop-blur-sm tracking-wider shadow-sm uppercase font-bebas"
            style={{ 
              background: isHighViral ? '#22C55EDD' : isMidViral ? '#F59E0BDD' : '#EF5350DD', 
              color: '#FFF' 
            }}
          >
            SCORE: {Math.round(scoreVal)}
          </div>
        )}
      </div>

      {/* Clip Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-xs mb-1 uppercase tracking-wider font-bebas text-[#EF5350]">
          {`Clip #${String(clip.clip_index).padStart(3, '0')}`}
        </h3>
        
        <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] leading-snug line-clamp-2 mb-2.5 flex-1">
          {clip.ai_title || 'Untitled Highlight'}
        </p>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pt-2.5 border-t border-[#FFEBEE]">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(clip); }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 rounded-lg text-xs font-semibold text-[#EF5350] bg-[#FFF5F5] hover:bg-[#FFEBEE] transition-colors border border-transparent min-h-[36px]"
          >
            <Play size={11} className="fill-current" /> Preview
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!clip.playback_url}
            className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#1A1A1A] border border-[#FFCDD2] hover:border-[#EF9090] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Download Clip"
          >
            <Download size={12} />
          </button>

          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(clip.id); }}
              className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#EF4444] border border-[#FFCDD2] hover:border-[#EF4444]/30 transition-colors flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Delete Clip"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
