import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MoreVertical,
  ChevronRight,
  Check,
  PictureInPicture,
  Gauge
} from 'lucide-react'

export interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  objectFit?: 'contain' | 'cover'
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void
  onEnded?: () => void
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = false,
  objectFit = 'contain',
  onLoadedMetadata,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuView, setMenuView] = useState<'main' | 'speed'>('main')

  // Auto-hide controls timeout
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isMenuOpen) {
        setShowControls(false)
      }
    }, 2500)
  }, [isPlaying, isMenuOpen])

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [])

  // Sync Video Duration and Time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMeta = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    setDuration(video.duration)
    if (onLoadedMetadata) {
      onLoadedMetadata(e)
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
    setShowControls(true)
    if (onEnded) onEnded()
  }

  // Play / Pause Toggle
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
      setShowControls(true)
    } else {
      video.play()
      setIsPlaying(true)
      setHasStarted(true)
    }
  }

  // Seek Handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }

  // Volume & Mute Handlers
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (videoRef.current) {
      videoRef.current.volume = val
      videoRef.current.muted = val === 0
    }
    setIsMuted(val === 0)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    if (isMuted) {
      videoRef.current.muted = false
      videoRef.current.volume = volume || 1
      setIsMuted(false)
    } else {
      videoRef.current.muted = true
      setIsMuted(true)
    }
  }

  // Speed Handler
  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
    setIsMenuOpen(false)
    setMenuView('main')
  }

  // Fullscreen Handler
  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Picture in Picture Handler
  const togglePiP = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture()
      }
    } catch (err) {
      console.error('Failed to toggle Picture-in-Picture:', err)
    } finally {
      setIsMenuOpen(false)
    }
  }

  // Close options menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
        setMenuView('main')
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !isMenuOpen && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()} // Disable Right-Click Context Menu
      className={`w-full h-full relative overflow-hidden bg-black flex items-center justify-center group select-none ${className}`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMeta}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        className={`w-full h-full cursor-pointer ${
          objectFit === 'cover' ? 'object-cover' : 'object-contain'
        }`}
      />

      {/* Poster Overlay before Playback Starts */}
      {!hasStarted && poster && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer z-10 transition-opacity group-hover:bg-black/20"
        >
          <img
            src={poster}
            alt="Video Poster"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EF5350] text-white flex items-center justify-center shadow-xl z-20"
          >
            <Play size={28} className="ml-1 fill-white" />
          </motion.div>
        </div>
      )}

      {/* Big Center Play/Pause Indicator Overlay (When paused after start) */}
      {hasStarted && !isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 shadow-2xl"
          >
            <Play size={28} className="ml-1 fill-white" />
          </motion.div>
        </div>
      )}

      {/* Three-Dots Menu Options Popup */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-4 bottom-14 z-40 bg-[#1A1A1A]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-1.5 min-w-[170px] text-xs text-white"
          >
            {menuView === 'main' ? (
              <div className="space-y-1">
                <button
                  onClick={() => setMenuView('speed')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Gauge size={14} className="text-[#EF5350]" />
                    <span>Playback Speed</span>
                  </div>
                  <div className="pl-2 flex items-center text-[#9E9E9E]">
                    <span>{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                    <ChevronRight size={12} />
                  </div>
                </button>

                <button
                  onClick={togglePiP}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left font-medium"
                >
                  <PictureInPicture size={14} className="text-[#EF5350]" />
                  <span>Picture-in-Picture</span>
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setMenuView('main')}
                  className="w-full text-left px-3 py-1.5 font-bold text-[10px] uppercase text-[#9E9E9E] border-b border-white/10 mb-1"
                >
                  &larr; Speed Options
                </button>
                {SPEED_OPTIONS.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changeSpeed(rate)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <span>{rate === 1 ? '1x (Normal)' : `${rate}x`}</span>
                    {playbackRate === rate && <Check size={12} className="text-[#22C55E]" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Custom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 sm:p-4 transition-opacity duration-300 ${
          showControls || !isPlaying || isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Progress Bar */}
        <div className="relative w-full flex items-center mb-2 group/seek cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 accent-[#EF5350] bg-white/20 rounded-lg cursor-pointer outline-none transition-all group-hover/seek:h-2"
          />
        </div>

        {/* Control Action Buttons */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-white" />}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-16 transition-all duration-300 h-1.5 accent-[#EF5350] bg-white/30 rounded-lg cursor-pointer outline-none opacity-0 group-hover/vol:opacity-100"
              />
            </div>

            {/* Formatted Time Display */}
            <div className="text-[11px] sm:text-xs font-medium text-white/90 font-mono tracking-tight ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Three-Dots Menu Toggle */}
            <button
              onClick={() => {
                setIsMenuOpen((prev) => !prev)
                setMenuView('main')
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isMenuOpen ? 'bg-white/20 text-[#EF5350]' : 'hover:bg-white/20 text-white'
              }`}
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
