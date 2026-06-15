import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Edit2, Trash2, Play, Film, Filter } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { Clip } from '@/types'

// Dynamic thumbnail generator
export function VideoThumbnail({ src, fallbackColor }: { src: string; fallbackColor: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [thumb, setThumb] = useState<string | null>(null)

  useEffect(() => {
    if (!src) return
    const video = videoRef.current
    if (!video) return
    
    video.crossOrigin = 'anonymous'
    
    const handleLoadedData = () => {
      video.currentTime = Math.min(1, video.duration || 0) // Capture at 1s
    }

    const handleSeeked = () => {
      const canvas = canvasRef.current
      if (canvas && video) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        setThumb(canvas.toDataURL('image/jpeg'))
      }
    }
    
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('seeked', handleSeeked)
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('seeked', handleSeeked)
    }
  }, [src])

  if (thumb) {
    return <img src={thumb} alt="Thumbnail" className="w-full h-full object-cover" />
  }

  return (
    <>
      <video ref={videoRef} src={src} preload="metadata" className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="hidden" />
      <div className="w-full h-full" style={{ background: fallbackColor }} />
    </>
  )
}

export function ClipsPage() {
  const [searchParams] = useSearchParams()
  const videoId = searchParams.get('video_id')
  
  const [clips, setClips] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [previewClip, setPreviewClip] = useState<Clip | null>(null)

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const url = videoId ? `/v2/clips?video_id=${videoId}` : '/v2/clips'
        const res = await api.get(url)
        if (res.data.success && res.data.data?.data) {
          setClips(res.data.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch clips:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClips()
  }, [videoId])

  const filtered = clips.filter((c) => (c.ai_title || '').toLowerCase().includes(search.toLowerCase()))

  const getFallbackColor = (id: string) => {
    const colors = ['#EF5350', '#C62828', '#22C55E', '#F59E0B']
    let sum = 0
    for(let i=0; i<id.length; i++) sum += id.charCodeAt(i)
    return `${colors[sum % colors.length]}15`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Clips</h1>
          <p className="text-sm text-[#9E9E9E] mt-1">{clips.length} clips generated</p>
        </div>
        <Link to="/dashboard/upload" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors">
          + New Upload
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-[#FFFFFF] border border-[#FFCDD2] rounded-xl px-3 py-2">
          <Search size={14} className="text-[#9E9E9E]" />
          <input
            type="text"
            placeholder="Search clips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#9E9E9E] outline-none flex-1"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#FFCDD2] bg-[#FFFFFF] text-sm text-[#9E9E9E] hover:text-[#616161] transition-colors">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Film size={40} className="text-[#FFCDD2] mx-auto mb-4" />
          <p className="text-[#9E9E9E]">{search ? 'No clips match your search' : 'No clips found'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((clip, i) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl overflow-hidden hover:border-[#EF9090] transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] max-h-48 overflow-hidden bg-black/5">
                {clip.thumbnail_url ? (
                  <img src={clip.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : clip.playback_url ? (
                  <VideoThumbnail src={clip.playback_url} fallbackColor={getFallbackColor(clip.id)} />
                ) : (
                  <div className="w-full h-full" style={{ background: getFallbackColor(clip.id) }} />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setPreviewClip(clip)} className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition-colors">
                    <Play size={16} className="text-white fill-white ml-0.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                  {Math.round(clip.duration_seconds || 0)}s
                </div>
                
                {clip.score !== null && clip.score !== undefined && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm"
                    style={{ background: clip.score >= 90 ? '#22C55E90' : '#EF535090', color: '#FFF' }}>
                    {Math.round(clip.score)}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-[#1A1A1A] leading-tight line-clamp-2 mb-3 h-10">
                  {clip.ai_title || `Clip ${clip.clip_index + 1}`}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewClip(clip)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-[#9E9E9E] hover:text-[#1A1A1A] border border-[#FFCDD2] hover:border-[#EF9090] transition-colors"
                  >
                    <Play size={11} /> Preview
                  </button>
                  <Link
                    to={`/dashboard/clips/${clip.id}`}
                    className="p-1.5 rounded-lg text-[#9E9E9E] hover:text-[#1A1A1A] border border-[#FFCDD2] hover:border-[#EF9090] transition-colors"
                  >
                    <Edit2 size={12} />
                  </Link>
                  <button className="p-1.5 rounded-lg text-[#9E9E9E] hover:text-[#22C55E] border border-[#FFCDD2] hover:border-[#22C55E]/30 transition-colors">
                    <Download size={12} />
                  </button>
                  <button className="p-1.5 rounded-lg text-[#9E9E9E] hover:text-[#EF4444] border border-[#FFCDD2] hover:border-[#EF4444]/30 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {previewClip && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewClip(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-4 max-w-sm w-full mx-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[9/16] rounded-xl bg-black overflow-hidden flex items-center justify-center mb-4 relative">
                {previewClip.playback_url ? (
                  <video 
                    src={previewClip.playback_url} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-xs text-[#9E9E9E]">No video URL available</p>
                )}
              </div>
              <p className="text-sm font-medium text-[#1A1A1A] line-clamp-2">{previewClip.ai_title || `Clip ${previewClip.clip_index + 1}`}</p>
              <button 
                onClick={() => setPreviewClip(null)} 
                className="mt-4 w-full py-2.5 rounded-xl bg-[#FFEBEE] text-sm text-[#EF5350] font-medium hover:bg-[#FFCDD2] transition-colors"
              >
                Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
