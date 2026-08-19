import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Download, Save, RefreshCw, Copy, Check, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { Clip } from '@/types'
import { api } from '@/lib/api'
import { VideoPlayer } from './VideoPlayer'

interface ClipDetailsModalProps {
  clip: Clip | null
  onClose: () => void
  onUpdate?: (updatedClip: Clip) => void
}

export function ClipDetailsModal({ clip, onClose, onUpdate }: ClipDetailsModalProps) {
  const [aspectRatioClass, setAspectRatioClass] = useState<'aspect-[9/16]' | 'aspect-[1/1]' | 'aspect-[16/9]'>('aspect-[9/16]')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  const handleDownload = async () => {
    if (!clip) return
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

  // Sync inputs with active clip
  useEffect(() => {
    if (clip) {
      setTitle(clip.ai_title || '')
      setDescription(clip.ai_description || '')
      setTags(clip.ai_tags || [])
      setSaved(false)
      setIsMobileSheetOpen(false)
    }
  }, [clip])

  if (!clip) return null

  const initialTitle = clip.ai_title || ''
  const initialDescription = clip.ai_description || ''
  const initialTags = clip.ai_tags || []

  // Track if any field was actually modified
  const hasChanges = 
    title.trim() !== initialTitle.trim() ||
    description.trim() !== initialDescription.trim() ||
    JSON.stringify(tags) !== JSON.stringify(initialTags)

  // Calculate natural aspect ratio to maintain exact format layout
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    const ratio = video.videoWidth / video.videoHeight
    if (ratio < 0.8) {
      setAspectRatioClass('aspect-[9/16]')
    } else if (ratio >= 0.8 && ratio <= 1.2) {
      setAspectRatioClass('aspect-[1/1]')
    } else {
      setAspectRatioClass('aspect-[16/9]')
    }
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = async () => {
    if (!hasChanges || saving) return
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      
      const updatedClip: Clip = {
        ...clip,
        ai_title: title,
        ai_description: description,
        ai_tags: tags
      }
      
      if (onUpdate) {
        onUpdate(updatedClip)
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save clip metadata:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = () => {
    const clean = newTag.trim().replace(/^#/, '')
    if (clean && !tags.includes(clean)) {
      setTags((prev) => [...prev, clean])
    }
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  const scoreVal = clip.score ?? 0

  const renderFormContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-4 sm:mb-6 pr-6">
        <span className="text-[10px] sm:text-xs font-bold text-[#EF5350] uppercase tracking-wider font-bebas">
          Clip Highlights
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] truncate mt-0.5">
          {`Clip #${String(clip.clip_index).padStart(3, '0')}`}
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4 flex-1">
        {/* Title Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[#616161] font-semibold">Title</label>
            <button
              onClick={() => handleCopy(title, 'title')}
              className="flex items-center gap-1 text-[10px] text-[#9E9E9E] hover:text-[#EF5350] transition-colors"
            >
              {copied === 'title' ? (
                <Check size={10} className="text-[#22C55E]" />
              ) : (
                <Copy size={10} />
              )}
              {copied === 'title' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
          />
        </div>

        {/* Description Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[#616161] font-semibold">Description</label>
            <button
              onClick={() => handleCopy(description, 'desc')}
              className="flex items-center gap-1 text-[10px] text-[#9E9E9E] hover:text-[#EF5350] transition-colors"
            >
              {copied === 'desc' ? (
                <Check size={10} className="text-[#22C55E]" />
              ) : (
                <Copy size={10} />
              )}
              {copied === 'desc' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-white border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors resize-none"
          />
        </div>

        {/* Tags Field */}
        <div>
          <label className="block text-xs text-[#616161] font-semibold mb-1">Tags / Hashtags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EF5350]/10 border border-[#EF5350]/20 text-xs text-[#EF5350] font-medium"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-[#9E9E9E] hover:text-[#EF4444] ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-[#9E9E9E] italic">No tags selected.</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#FFCDD2] text-[#1A1A1A] text-xs outline-none focus:border-[#EF5350] transition-colors"
            />
            <button
              onClick={handleAddTag}
              className="p-1.5 rounded-lg bg-[#EF5350] text-white hover:bg-[#B71C1C] transition-colors flex-shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-[#FFCDD2] mt-4 sm:mt-6 sticky bottom-0 bg-[#FFF5F5] pb-1 z-10">
        {hasChanges && (
          <motion.button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[42px]"
          >
            {saving ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : saved ? (
              <Check size={15} />
            ) : (
              <Save size={15} />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </motion.button>
        )}
        
        <button
          onClick={handleDownload}
          disabled={downloading || !clip.playback_url}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors disabled:opacity-50 min-h-[42px] ${hasChanges ? '' : 'w-full'}`}
        >
          <Download size={15} /> {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl md:rounded-3xl overflow-hidden max-w-4xl w-full h-[90vh] md:h-auto max-h-[90vh] md:max-h-[85vh] shadow-2xl flex flex-col md:flex-row relative my-auto sm:my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors shadow-md"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Left Side: Video Player Container */}
          <div className="w-full h-full md:h-auto md:w-auto bg-[#0A0A0A] relative flex-1 md:flex-initial flex items-center justify-center p-3 sm:p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#FFCDD2]">
            <div className={`relative rounded-xl md:rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-lg w-full h-full md:max-h-[600px] sm:max-w-[320px] md:max-w-[340px] ${aspectRatioClass}`}>
              {clip.playback_url ? (
                <VideoPlayer
                  src={clip.playback_url}
                  poster={clip.thumbnail_url || undefined}
                  autoPlay
                  objectFit="cover"
                  onLoadedMetadata={handleLoadedMetadata}
                />
              ) : (
                <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center p-4 text-center min-h-[200px]">
                  <Play size={32} className="text-[#9E9E9E] mb-2" />
                  <p className="text-xs text-[#9E9E9E]">Playback unavailable</p>
                </div>
              )}

              {/* Dynamic Badges Overlay */}
              {clip.duration_seconds && (
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-2 py-0.5 md:py-1 bg-black/70 backdrop-blur-sm rounded-lg text-[10px] md:text-xs text-white font-bold pointer-events-none z-10">
                  {Math.round(clip.duration_seconds)}s
                </div>
              )}
              {scoreVal > 0 && (
                <div
                  className="absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[10px] md:text-xs font-bold backdrop-blur-sm uppercase font-bebas shadow-sm pointer-events-none z-10"
                  style={{
                    background: scoreVal >= 90 ? '#22C55EDD' : scoreVal >= 70 ? '#F59E0BDD' : '#EF5350DD',
                    color: '#FFF',
                  }}
                >
                  SCORE: {Math.round(scoreVal)}
                </div>
              )}
            </div>

            {/* Mobile Pull-up Tab Button */}
            <button
              onClick={() => setIsMobileSheetOpen(true)}
              className="md:hidden absolute bottom-2 min-w-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-[#FFCDD2] rounded-full text-xs font-bold text-[#EF5350] shadow-xl hover:bg-white transition-all active:scale-95"
            >
              {/* <span>Edit Metadata</span>

              <ChevronUp size={14} /> */}
            </button>
          </div>

          {/* Desktop Right Side: Metadata Editor Form */}
          <div className="hidden md:flex p-6 md:p-8 flex-1 flex-col min-w-0 bg-[#FFF5F5] overflow-y-auto">
            {renderFormContent()}
          </div>

          {/* Mobile Pull-Up Drawer Sheet Overlay */}
          <AnimatePresence>
            {isMobileSheetOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="md:hidden absolute inset-x-0 bottom-0 top-10 z-40 bg-[#FFF5F5] border-t border-[#FFCDD2] rounded-t-3xl shadow-2xl flex flex-col p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag Handle & Close */}
                <div className="flex items-center justify-between mb-3 border-b border-[#FFCDD2] pb-2">
                  <div className="w-10 h-1 rounded-full bg-[#FFCDD2] mx-auto" />
                  <button
                    onClick={() => setIsMobileSheetOpen(false)}
                    className="p-1 rounded-full text-[#9E9E9E] hover:text-[#1A1A1A] flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Close</span>
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className="flex-1">
                  {renderFormContent()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
