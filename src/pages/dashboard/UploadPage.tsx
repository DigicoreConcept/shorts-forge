import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Link as LinkIcon, X, Plus, Trash2, Clock, Globe, Smartphone, Monitor, Square, LayoutTemplate, Maximize, Image as ImageIcon } from 'lucide-react'
import { uploadVideoChunks } from '@/lib/upload'
import { api } from '@/lib/api'

type InputMode = 'file' | 'url'
type ClipDuration = 30 | 60 | 90 | 'custom'
type ClipDimension = '16:9' | '9:16' | '1:1'
type ClipEffect = 'glassmorphism' | 'fit' | 'blurred_background'

interface TimeRange {
  id: string
  start: string
  end: string
}

const LANGUAGES = ['Auto-detect', 'English', 'Spanish', 'French', 'German', 'Portuguese', 'Arabic', 'Chinese', 'Japanese', 'Hindi']

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
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('Auto-detect')
  const [duration, setDuration] = useState<ClipDuration>(60)
  const [maxClips, setMaxClips] = useState<number | 'auto'>('auto')
  const [dimension, setDimension] = useState<ClipDimension>('9:16')
  const [effect, setEffect] = useState<ClipEffect>('glassmorphism')
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([{ id: '1', start: '00:00', end: '01:00' }])
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      if (!title) setTitle(accepted[0].name.replace(/\.[^/.]+$/, ''))
    }
  }, [title])

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
    setSubmitting(true)
    setError('')
    setUploadProgress(0)

    try {
      let video_id: string | undefined
      let source_url: string | undefined

      if (mode === 'file' && file) {
        // 1. Chunked Upload
        video_id = await uploadVideoChunks(file, (percent) => {
          setUploadProgress(percent)
        })
      } else if (mode === 'url') {
        source_url = url
      }

      // 2. Job Creation
      const payload = {
        title,
        language: language === 'Auto-detect' ? 'auto' : language,
        desired_duration: duration.toString(),
        dimension,
        effect,
        max_clips: maxClips === 'auto' ? 0 : maxClips,
        ...(video_id ? { video_id } : {}),
        ...(source_url ? { source_url } : {}),
        ...(duration === 'custom' ? {
          custom_time_ranges: timeRanges.map(r => ({
            start: timeToSeconds(r.start),
            end: timeToSeconds(r.end)
          }))
        } : {})
      }

      const res = await api.post('/v2/jobs/create', payload)
      
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
                <div className="flex items-center gap-4 p-4 bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#EF5350]/15 flex items-center justify-center flex-shrink-0">
                    <Upload size={18} className="text-[#EF5350]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{file.name}</p>
                    <p className="text-xs text-[#9E9E9E]">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="text-[#9E9E9E] hover:text-[#EF4444] transition-colors">
                    <X size={16} />
                  </button>
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

        {/* Dimension */}
        <div className="hidden">
          <label className="block text-xs text-[#616161] mb-2 font-medium">Clip Dimension</label>
          <div className="flex gap-2">
            {[
              { id: '16:9', icon: Monitor, label: '16:9', desc: 'Landscape' },
              { id: '9:16', icon: Smartphone, label: '9:16', desc: 'Portrait' },
              { id: '1:1', icon: Square, label: '1:1', desc: 'Square' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDimension(d.id as ClipDimension)}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                  dimension === d.id
                    ? 'bg-[#EF5350] text-white border-[#EF5350] shadow-md shadow-[#EF5350]/20'
                    : 'bg-[#FFFFFF] text-[#616161] border-[#FFCDD2] hover:border-[#EF9090]'
                }`}
              >
                <d.icon size={20} />
                <span className="text-xs font-medium">{d.label}</span>
                <span className={`text-[10px] ${dimension === d.id ? 'text-[#FFCDD2]' : 'text-[#9E9E9E]'}`}>{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Effect */}
        <div className="hidden">
          <label className="block text-xs text-[#616161] mb-2 font-medium">Background Effect</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'glassmorphism', icon: LayoutTemplate, label: 'Glassmorphism', desc: 'Frosted blur background' },
              { id: 'fit', icon: Maximize, label: 'Fit to Screen', desc: 'Stretched or zoomed to fit' },
              { id: 'blurred_background', icon: ImageIcon, label: 'Blurred Thumbnail', desc: 'Original size with blurred poster' }
            ].map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEffect(e.id as ClipEffect)}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                  effect === e.id
                    ? 'bg-[#EF5350] text-white border-[#EF5350] shadow-md shadow-[#EF5350]/20'
                    : 'bg-[#FFFFFF] text-[#616161] border-[#FFCDD2] hover:border-[#EF9090]'
                }`}
              >
                <e.icon size={16} className={`mb-2 ${effect === e.id ? 'text-white' : 'text-[#EF5350]'}`} />
                <span className="text-sm font-medium mb-0.5">{e.label}</span>
                <span className={`text-[10px] leading-tight ${effect === e.id ? 'text-[#FFCDD2]' : 'text-[#9E9E9E]'}`}>{e.desc}</span>
              </button>
            ))}
          </div>
        </div>

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
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Uploading Video</h3>
              <p className="text-sm text-[#9E9E9E] mb-8 leading-relaxed">
                Please keep this window open while we securely transfer your file to our servers.
              </p>
              
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
                    className="text-[#EF5350] stroke-current transition-all duration-300 ease-out"
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
                {/* Centered Percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1A1A1A] tracking-tighter">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
