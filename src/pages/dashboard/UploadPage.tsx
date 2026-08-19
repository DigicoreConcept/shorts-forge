import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Link as LinkIcon, X, Plus, Trash2, Clock, Globe, Smartphone, Monitor, Square, LayoutTemplate, Maximize, Image as ImageIcon } from 'lucide-react'
import { uploadVideoChunks } from '@/lib/upload'
import { api } from '@/lib/api'
import { getVideoMetadata, type VideoMetadata } from '@/lib/utils'
import {
  type InputMode,
  type ClipDuration,
  type ClipDimension,
  type TimeRange,
  LANGUAGES,
  LAYOUT_OPTIONS,
  SUBTITLE_STYLES,
  SUBTITLE_COLORS,
  SUBTITLE_POSITIONS
} from '@/lib/constants'

const timeToSeconds = (timeStr: string) => {
  const parts = timeStr.split(':')
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
  }
  return 0
}

export function UploadPage() {
  const [mode, setMode] = useState<InputMode>('file')
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)
  const [resumableSession, setResumableSession] = useState<any | null>(null)
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null)
  const [uploadPaused, setUploadPaused] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Auto-detect')
  const [duration, setDuration] = useState<ClipDuration>(60)
  const [maxClips, setMaxClips] = useState<number | 'auto'>('auto')
  const [dimension, setDimension] = useState<ClipDimension>('9:16')
  const [selectedLayout, setSelectedLayout] = useState<string>('glassmorphism')
  const [selectedSubStyle, setSelectedSubStyle] = useState<string>('standard')
  const [subtitleColor, setSubtitleColor] = useState<string>('#8B5CF6')
  const [subtitlePosition, setSubtitlePosition] = useState<string>('bot-centre')
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ id: '1', start: '00:00', end: '01:00' }])
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      const selectedFile = accepted[0]
      setFile(selectedFile)
      if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      
      setMetadata(null)
      setResumableSession(null)
      setActiveUploadId(null)

      getVideoMetadata(selectedFile)
        .then((meta) => {
          setMetadata(meta)
        })
        .catch((err) => {
          console.error('Failed to parse video metadata:', err)
        })

      // Check for resumable session
      const fingerprint = `${selectedFile.name}_${selectedFile.size}_${selectedFile.lastModified}`
      const cached = localStorage.getItem(`excido_upload_session:${fingerprint}`)
      if (cached) {
        try {
          const session = JSON.parse(cached)
          // 20 minutes expiration check (20 * 60 * 1000 = 1,200,000 ms)
          if (session.timestamp && Date.now() - session.timestamp > 1200000) {
            localStorage.removeItem(`excido_upload_session:${fingerprint}`)
          } else {
            setResumableSession(session)
          }
        } catch (e) {
          console.error('Failed to load resumable session:', e)
        }
      }
    }
  }, [title])

  const handleAcceptResume = () => {
    if (resumableSession) {
      setTitle(resumableSession.formData.title)
      setLanguage(resumableSession.formData.language)
      setDimension(resumableSession.formData.dimension)
      setSelectedLayout(resumableSession.formData.selectedLayout)
      setSelectedSubStyle(resumableSession.formData.selectedSubStyle)
      setSubtitleColor(resumableSession.formData.subtitleColor)
      setSubtitlePosition(resumableSession.formData.subtitlePosition || 'bot-centre')
      setActiveUploadId(resumableSession.uploadId)
      setResumableSession(null)
    }
  }

  const handleDeclineResume = () => {
    if (file) {
      const fingerprint = `${file.name}_${file.size}_${file.lastModified}`
      localStorage.removeItem(`excido_upload_session:${fingerprint}`)
    }
    setResumableSession(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 1,
  })

  const addRange = () => {
    setTimeRanges((r) => [...r, { id: Date.now().toString(), start: '00:00', end: '01:00' }])
  }
  const removeRange = (id: string) => setTimeRanges((r) => r.filter((x) => x.id !== id))
  const updateRange = (id: string, key: 'start' | 'end', val: string) =>
    setTimeRanges((r) => r.map((x) => (x.id === id ? { ...x, [key]: val } : x)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Immediate synchronous UI feedback before any await
    setSubmitting(true)
    setError('')
    setUploadProgress(0)
    setUploadPaused(false)

    try {
      let video_id: string | undefined
      let source_url: string | undefined

      if (mode === 'file' && file) {
        const fingerprint = `${file.name}_${file.size}_${file.lastModified}`
        
        // Fast metadata extraction if not yet loaded
        let mediaMeta = metadata
        if (!mediaMeta) {
          try {
            mediaMeta = await getVideoMetadata(file)
            setMetadata(mediaMeta)
          } catch (mErr) {
            console.warn('Fast metadata extraction skipped:', mErr)
          }
        }
        
        const uploadRes = await uploadVideoChunks(file, (percent) => {
          setUploadProgress(percent)
        }, {
          uploadId: activeUploadId || undefined,
          concurrency: 4,
          onPause: () => setUploadPaused(true),
          onResume: () => setUploadPaused(false),
          onChunkUploaded: (index, resolvedUploadId) => {
            const totalChunks = Math.ceil(file.size / (5 * 1024 * 1024))
            const sessionData = {
              uploadId: resolvedUploadId,
              lastChunkIndex: index,
              totalChunks,
              timestamp: Date.now(),
              formData: {
                title,
                language,
                dimension,
                selectedLayout,
                selectedSubStyle,
                subtitleColor,
                subtitlePosition
              }
            }
            localStorage.setItem(`excido_upload_session:${fingerprint}`, JSON.stringify(sessionData))
          }
        })
        
        video_id = uploadRes.videoId
        localStorage.removeItem(`excido_upload_session:${fingerprint}`)
      } else if (mode === 'url') {
        source_url = url
      }

      // 2. Job Creation
      const payload = {
        title,
        language: language === 'Auto-detect' ? 'auto' : language,
        desired_duration: duration.toString(),
        dimension,
        effect: selectedLayout,
        max_clips: maxClips === 'auto' ? null : maxClips,
        ...(video_id ? { video_id } : {}),
        ...(source_url ? { source_url } : {}),
        ...(duration === 'custom' ? {
          custom_time_ranges: timeRanges.map(r => ({
            start: timeToSeconds(r.start),
            end: timeToSeconds(r.end)
          }))
        } : {}),
        media_metadata: metadata ? {
          duration: metadata.duration,
          width: metadata.width,
          height: metadata.height,
          size: metadata.size
        } : null,
        subtitle: {
          style: selectedSubStyle,
          color: subtitleColor,
          font: 'Oswald',
          size: 60,
          position: subtitlePosition
        }
      }

      const res = await api.post('/v1/jobs/create', payload)
      
      if (res.data.success && res.data.data) {
        navigate(`/dashboard/processing/${res.data.data.job_id}`)
      } else {
        throw new Error(res.data.message || 'Failed to create job')
      }

    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(err.message || 'An unexpected error occurred.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isValid = (mode === 'file' ? !!file : url.trim().length > 0) && title.trim().length > 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">New Upload</h1>
        <p className="text-sm text-[#9E9E9E]">Upload a video or paste a public URL to generate clips.</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input mode toggle */}
        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-1.5 flex gap-1">
          {(['file', 'url'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-[#EF5350] text-white shadow-lg shadow-[#EF5350]/20'
                  : 'text-[#9E9E9E] hover:text-[#616161]'
              }`}
            >
              {m === 'file' ? <Upload size={15} /> : <LinkIcon size={15} />}
              {m === 'file' ? 'Upload File' : 'Paste URL'}
            </button>
          ))}
        </div>

        {/* File / URL input */}
        <AnimatePresence mode="wait">
          {mode === 'file' ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {!file ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-6 md:p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-[#EF5350] bg-[#EF5350]/8'
                      : 'border-[#FFCDD2] bg-[#FFFFFF] hover:border-[#EF9090] hover:bg-[#FFF0F0]'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-14 h-14 rounded-2xl bg-[#EF5350]/15 flex items-center justify-center mx-auto mb-4">
                    <Upload size={24} className="text-[#EF5350]" />
                  </div>
                  <p className="text-[#1A1A1A] font-medium mb-1">
                    {isDragActive ? 'Drop it here...' : 'Drag & drop your video or audio'}
                  </p>
                  <p className="text-xs text-[#9E9E9E]">or click to browse — MP4, MOV, WebM, MP3, WAV up to 2GB</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#EF5350]/15 flex items-center justify-center flex-shrink-0">
                      <Upload size={18} className="text-[#EF5350]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A1A1A] truncate">{file.name}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FFEBEE] text-[#EF5350]">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        {metadata ? (
                          <>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-[#616161]">
                              {metadata.width} × {metadata.height} px
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-[#616161]">
                              {Math.floor(metadata.duration / 60)}:
                              {Math.round(metadata.duration % 60).toString().padStart(2, '0')} mins
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-[#9E9E9E] animate-pulse">Analyzing video headers...</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null)
                        setMetadata(null)
                        setResumableSession(null)
                      }}
                      className="text-[#9E9E9E] hover:text-[#EF4444] transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {resumableSession && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#FFF5F5] border border-[#FFCDD2] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-[#EF5350] uppercase tracking-wider">Interrupted Session Found</h4>
                        <p className="text-xs text-[#616161]">
                          We found a saved progress of {Math.round(((resumableSession.lastChunkIndex + 1) / resumableSession.totalChunks) * 100)}% for this file. Would you like to resume?
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={handleAcceptResume}
                          className="px-3 py-1.5 rounded-lg bg-[#EF5350] text-white text-[10px] font-bold hover:bg-[#B71C1C] transition-colors shadow-md shadow-[#EF5350]/15"
                        >
                          Resume
                        </button>
                        <button
                          type="button"
                          onClick={handleDeclineResume}
                          className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#FFCDD2] text-[#616161] text-[10px] font-bold hover:bg-zinc-50 transition-colors"
                        >
                          Restart
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="url"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or any public video URL"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
                />
              </div>
              <p className="text-xs text-[#9E9E9E] mt-2">Supports YouTube, Vimeo, Loom, and direct MP4 links.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title */}
        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Media Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this upload a name..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
          >
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Clip duration */}
        <div>
          <label className="block text-xs text-[#616161] mb-2 font-medium">Clip Duration</label>
          <div className="flex gap-2 flex-wrap">
            {([30, 60, 90, 'custom'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  duration === d
                    ? 'bg-[#EF5350] text-white border-[#EF5350] shadow-lg shadow-[#EF5350]/20'
                    : 'bg-[#FFFFFF] text-[#616161] border-[#FFCDD2] hover:border-[#EF9090]'
                }`}
              >
                {d === 'custom' ? 'Custom' : `${d}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Custom time ranges */}
        <AnimatePresence>
          {duration === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#1A1A1A] flex items-center gap-1.5">
                    <Clock size={14} className="text-[#EF5350]" /> Time Ranges
                  </p>
                  <button
                    type="button"
                    onClick={addRange}
                    className="flex items-center gap-1 text-xs text-[#EF5350] hover:underline"
                  >
                    <Plus size={13} /> Add Range
                  </button>
                </div>
                {timeRanges.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={r.start}
                      onChange={(e) => updateRange(r.id, 'start', e.target.value)}
                      placeholder="00:00"
                      className="w-24 px-3 py-2 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] text-center"
                    />
                    <span className="text-[#9E9E9E] text-sm">→</span>
                    <input
                      type="text"
                      value={r.end}
                      onChange={(e) => updateRange(r.id, 'end', e.target.value)}
                      placeholder="01:00"
                      className="w-24 px-3 py-2 rounded-lg bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] text-center"
                    />
                    {timeRanges.length > 1 && (
                      <button type="button" onClick={() => removeRange(r.id)} className="text-[#9E9E9E] hover:text-[#EF4444] transition-colors ml-1">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Max Clips */}
        <div>
          <label className="block text-xs text-[#616161] mb-2 font-medium">Max Clips to Generate</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setMaxClips('auto')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                maxClips === 'auto'
                  ? 'bg-[#EF5350] text-white border-[#EF5350] shadow-md shadow-[#EF5350]/20'
                  : 'bg-[#FFFFFF] text-[#616161] border-[#FFCDD2] hover:border-[#EF9090]'
              }`}
            >
              Auto (Max possible)
            </button>
            
            <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${
              typeof maxClips === 'number' ? 'border-[#EF5350] shadow-md shadow-[#EF5350]/20' : 'border-[#FFCDD2]'
            }`}>
              <button 
                type="button"
                onClick={() => setMaxClips(prev => (typeof prev === 'number' && prev > 1) ? prev - 1 : 1)}
                className={`px-3 py-2.5 bg-[#FFF5F5] hover:bg-[#FFEBEE] transition-colors ${typeof maxClips === 'number' ? 'text-[#EF5350]' : 'text-[#9E9E9E]'}`}
              >
                -
              </button>
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxClips === 'auto' ? '' : maxClips}
                onChange={(e) => {
                  const valStr = e.target.value.replace(/[^0-9]/g, '');
                  if (!valStr) {
                    setMaxClips('auto');
                    return;
                  }
                  const val = parseInt(valStr, 10);
                  if (isNaN(val) || val < 1) setMaxClips('auto');
                  else setMaxClips(val);
                }}
                placeholder="Custom..."
                className="w-20 text-center outline-none bg-[#FFFFFF] text-sm font-medium text-[#1A1A1A] py-2.5"
              />
              <button 
                type="button"
                onClick={() => setMaxClips(prev => typeof prev === 'number' ? prev + 1 : 5)}
                className={`px-3 py-2.5 bg-[#FFF5F5] hover:bg-[#FFEBEE] transition-colors ${typeof maxClips === 'number' ? 'text-[#EF5350]' : 'text-[#9E9E9E]'}`}
              >
                +
              </button>
            </div>
          </div>
          <p className="text-xs text-[#9E9E9E] mt-2">If Auto is selected, ReelCut will extract as many clips as the video permits.</p>
        </div>

        {/* Step 1: Target Aspect Ratio */}
        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-[#1A1A1A]">1. Target Aspect Ratio</label>
          <div className="flex gap-2">
            {[
              { id: '9:16', icon: Smartphone, label: '9:16', desc: 'Portrait (Mobile)' },
              { id: '16:9', icon: Monitor, label: '16:9', desc: 'Landscape (Vlog)' },
              { id: '1:1', icon: Square, label: '1:1', desc: 'Square (Feed)' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  const val = d.id as ClipDimension;
                  setDimension(val);
                  // Dynamic filter check: if selectedLayout is not supported by new ratio, reset it
                  const compatible = LAYOUT_OPTIONS.filter(o => o.supportedRatios.includes(val));
                  if (!compatible.some(o => o.id === selectedLayout)) {
                    setSelectedLayout(compatible[0]?.id || 'fit');
                  }
                }}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                  dimension === d.id
                    ? 'bg-[#EF5350] text-white border-[#EF5350] shadow-md shadow-[#EF5350]/20'
                    : 'bg-[#FFFFFF] text-[#616161] border-[#FFCDD2] hover:border-[#EF9090]'
                }`}
              >
                <d.icon size={20} />
                <span className="text-xs font-semibold">{d.label}</span>
                <span className={`text-[10px] ${dimension === d.id ? 'text-[#FFCDD2]' : 'text-[#9E9E9E]'}`}>{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Dynamic Layout Selector (Based on Aspect Ratio) */}
        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-[#1A1A1A]">2. Layout Style</label>
          <p className="text-xs text-[#9E9E9E]">Select the video framing layout for your clips.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LAYOUT_OPTIONS.filter(o => o.supportedRatios.includes(dimension)).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSelectedLayout(o.id)}
                className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center relative overflow-hidden group ${
                  selectedLayout === o.id
                    ? 'border-[#EF5350] bg-[#FFF5F5] ring-2 ring-[#EF5350]/30 shadow-md shadow-[#EF5350]/10'
                    : 'border-[#FFCDD2] bg-[#FFFFFF] hover:border-[#EF9090]'
                }`}
              >
                <div className="aspect-[9/16] w-full rounded-lg bg-[#F5F5F5] overflow-hidden mb-2 relative flex items-center justify-center border border-[#FFCDD2]/50">
                  {/* Visual placeholder using simple mock elements representing layout frames */}
                  {o.id === 'glassmorphism' && (
                    <div className="w-full h-full flex flex-col justify-between bg-zinc-200">
                      <div className="w-full h-1/4 bg-zinc-400/50 backdrop-blur-md" />
                      <div className="w-full h-2/4 bg-zinc-300 border-y border-zinc-400" />
                      <div className="w-full h-1/4 bg-zinc-400/50 backdrop-blur-md" />
                    </div>
                  )}
                  {o.id === 'fit' && (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                      <div className="w-full h-1/3 bg-zinc-300 border-y border-zinc-400" />
                    </div>
                  )}
                  {o.id === 'stretched' && (
                    <div className="w-full h-full bg-zinc-300 flex items-center justify-center">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Stretched</span>
                    </div>
                  )}
                  {o.id === 'elongated' && (
                    <div className="w-full h-full bg-zinc-300 overflow-hidden relative">
                      <div className="absolute inset-2 border border-dashed border-[#EF5350]" />
                    </div>
                  )}
                  {o.id === 'stacked' && (
                    <div className="w-full h-full flex flex-col bg-zinc-200">
                      <div className="w-full h-1/2 bg-zinc-300 border-b border-zinc-400" />
                      <div className="w-full h-1/2 bg-zinc-200" />
                    </div>
                  )}
                  {/* Label tag */}
                  {selectedLayout === o.id && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EF5350] flex items-center justify-center text-white text-[10px]">✓</div>
                  )}
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]">{o.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Subtitles Style */}
        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 space-y-4">
          <label className="block text-sm font-semibold text-[#1A1A1A]">3. Subtitle Preset</label>
          <p className="text-xs text-[#9E9E9E]">Choose how subtitles are displayed over your video.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SUBTITLE_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSubStyle(s.id)}
                className={`flex flex-col p-3 rounded-xl border transition-all text-left relative overflow-hidden ${
                  selectedSubStyle === s.id
                    ? 'border-[#EF5350] bg-[#FFF5F5] ring-2 ring-[#EF5350]/30 shadow-md'
                    : 'border-[#FFCDD2] bg-[#FFFFFF] hover:border-[#EF9090]'
                }`}
              >
                <div className="h-12 w-full rounded-lg bg-zinc-100 mb-2 border border-zinc-200/50 flex items-center justify-center p-2">
                  {/* Text previews */}
                  {s.id === 'standard' && (
                    <span className="text-xs text-zinc-800 font-medium">Here is your subtitle</span>
                  )}
                  {s.id === 'bold_highlight' && (
                    <span className="text-xs font-extrabold uppercase tracking-tight text-zinc-900">
                      HERE IS <span style={{ color: subtitleColor }}>YOUR</span> SUBTITLE
                    </span>
                  )}
                  {s.id === 'neon_glow' && (
                    <span className="text-xs font-bold tracking-tight text-white bg-zinc-950 px-2 py-0.5 rounded shadow-lg shadow-black/20" style={{ textShadow: `0 0 8px ${subtitleColor}` }}>
                      Here is your subtitle
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Subtitle Position (Grid Selector) */}
        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-[#1A1A1A]">4. Subtitle Position</label>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 tracking-wider">Beta Phase</span>
          </div>
          <p className="text-xs text-[#9E9E9E]">Choose where subtitles are overlayed on your video output. Currently, only Bottom Centre is active.</p>
          
          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
            {SUBTITLE_POSITIONS.map((pos) => (
              <button
                key={pos.id}
                type="button"
                disabled={pos.disabled}
                onClick={() => setSubtitlePosition(pos.id)}
                className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all relative ${
                  pos.disabled
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-400 opacity-60 cursor-not-allowed'
                    : subtitlePosition === pos.id
                      ? 'border-[#EF5350] bg-[#FFF5F5] text-[#EF5350] ring-2 ring-[#EF5350]/30 font-bold shadow-sm'
                      : 'border-[#FFCDD2] bg-[#FFFFFF] text-[#616161] hover:border-[#EF9090]'
                }`}
              >
                <span>{pos.label}</span>
                {pos.disabled && (
                  <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Beta</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 5: Highlight Color Picker (Conditional) */}
        <AnimatePresence>
          {SUBTITLE_STYLES.find(s => s.id === selectedSubStyle)?.supportsHighlight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 space-y-4">
                <label className="block text-sm font-semibold text-[#1A1A1A]">5. Highlight Accent Color</label>
                <p className="text-xs text-[#9E9E9E]">Select the accent color for key words in your subtitles.</p>
                <div className="flex gap-3">
                  {SUBTITLE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSubtitleColor(c.value)}
                      className={`w-9 h-9 rounded-full ${c.bg} flex items-center justify-center text-white relative shadow-sm hover:scale-105 transition-all`}
                    >
                      {subtitleColor === c.value && (
                        <span className="text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full py-3.5 rounded-xl bg-[#EF5350] text-white font-semibold text-sm hover:bg-[#B71C1C] transition-all shadow-lg shadow-[#EF5350]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {submitting && uploadProgress > 0 && uploadProgress < 100 && (
            <div 
              className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          )}
          
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10" />
              <span className="relative z-10">
                {uploadProgress > 0 && uploadProgress < 100 
                  ? `Uploading... ${uploadProgress}%` 
                  : 'Starting Job...'}
              </span>
            </>
          ) : (
            <>
              <Upload size={16} />
              Generate Clips
            </>
          )}
        </button>
      </form>

      {/* Full Screen Upload Progress Overlay */}
      <AnimatePresence>
        {submitting && uploadProgress > 0 && uploadProgress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#FFFFFF] border border-[#FFCDD2] p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center"
            >
              {uploadPaused ? (
                <>
                  <h3 className="text-xl font-bold text-[#F59E0B] mb-2">Connection Lost</h3>
                  <p className="text-sm text-[#9E9E9E] mb-8 leading-relaxed">
                    Your internet connection was interrupted. The upload is paused and will resume automatically once you are back online.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Uploading Video</h3>
                  <p className="text-sm text-[#9E9E9E] mb-8 leading-relaxed">
                    Please keep this window open while we securely transfer your file to our servers.
                  </p>
                </>
              )}
              
              <div className="relative w-40 h-40 mx-auto mb-8">
                {/* Background Track */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-[#FFEBEE] stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  {/* Progress Ring */}
                  <circle
                    className={`stroke-current transition-all duration-300 ease-out ${uploadPaused ? 'text-[#F59E0B]' : 'text-[#EF5350]'}`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - uploadProgress / 100)}`}
                  ></circle>
                </svg>
                {/* Centered Percentage or Pause */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {uploadPaused ? (
                    <span className="text-2xl font-black text-[#F59E0B] tracking-tighter animate-pulse">
                      PAUSED
                    </span>
                  ) : (
                    <span className="text-4xl font-black text-[#1A1A1A] tracking-tighter">
                      {uploadProgress}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
