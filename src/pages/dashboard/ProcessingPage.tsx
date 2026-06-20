import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Mic2, Scissors, FileText, CheckCircle2,
  XCircle, Zap, Clock, AlertTriangle, DownloadCloud, ArrowLeft
} from 'lucide-react'
import { api } from '@/lib/api'

interface Step {
  id: number
  icon: typeof Upload
  label: string
  sublabel: string
  duration: number // seconds this step takes in mock
}

const STEPS: Step[] = [
  { id: 0, icon: Upload,        label: 'Uploading',           sublabel: 'Transferring your video securely...', duration: 3 },
  { id: 1, icon: Scissors,      label: 'Generating Clips',    sublabel: 'Extracting clips based on duration...', duration: 6 },
  { id: 2, icon: FileText,      label: 'Generating Metadata', sublabel: 'Writing titles, descriptions & tags...', duration: 4 },
  { id: 3, icon: CheckCircle2,  label: 'Completed',           sublabel: 'Your clips are ready to publish!', duration: 1 },
]

type StepState = 'pending' | 'active' | 'done' | 'error'

function WaveformAnimation() {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full bg-[#EF5350]"
          animate={{ height: [4, Math.random() * 20 + 8, 4] }}
          transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
    </div>
  )
}

function ClipMaterializeAnimation() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-12 h-16 rounded-lg bg-[#FFFFFF] border border-[#EF5350]/30 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.3, duration: 0.4 }}
        >
          <div className="w-full h-10 bg-gradient-to-br from-[#EF5350]/20 to-[#C62828]/20" />
          <div className="p-1 space-y-0.5">
            <div className="h-1 bg-[#FFCDD2] rounded-full" />
            <div className="h-1 bg-[#FFCDD2] rounded-full w-3/4" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function TypingAnimation({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(iv)
    }, 30)
    return () => clearInterval(iv)
  }, [text])
  return <span className="font-mono text-xs text-[#22C55E]">{displayed}<span className="animate-pulse">|</span></span>
}

function SuccessBurst() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-[#22C55E]/10"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-20 h-20 rounded-full bg-[#22C55E]/20"
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}>
        <CheckCircle2 size={48} className="text-[#22C55E]" />
      </motion.div>
    </div>
  )
}

export function ProcessingPage() {
  const { jobId } = useParams()
  let videoId = null;
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStates, setStepStates] = useState<StepState[]>(['active', 'pending', 'pending', 'pending', 'pending'])
  const [stepProgress, setStepProgress] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [cancelled, setCancelled] = useState(false)
  const [completed, setCompleted] = useState(false)

  // Elapsed timer
  useEffect(() => {
    if (completed || cancelled) return
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(iv)
  }, [completed, cancelled])

  // Live API Polling
  useEffect(() => {
    if (cancelled || completed || !jobId) return

    const pollStatus = async () => {
      try {
        const res = await api.get(`/v2/jobs/${jobId}/status`)
        if (res.data.success && res.data.data) {
          const data = res.data.data
          
          // Check terminal states
          if (data.status === 'cancelled') {
            setCancelled(true)
            return
          }
          if (data.status === 'failed') {
            setCancelled(true)
            return
          }

          // Map string steps to UI indices
          const stepMap: Record<string, number> = {
            'uploading': 0,
            'generating_clips': 1,
            'generating_metadata': 2,
            'completed': 3
          }

          const activeIndex = data.current_step && stepMap[data.current_step] !== undefined
            ? stepMap[data.current_step]
            : 0

          setCurrentStep(activeIndex)
          setStepProgress(data.step_progress || 0)
          setOverallProgress(data.overall_progress || 0)

          // Update step visual states
          setStepStates((prev) => {
            const next: StepState[] = [...prev]
            for (let i = 0; i < STEPS.length; i++) {
              if (i < activeIndex) next[i] = 'done'
              else if (i === activeIndex) next[i] = 'active'
              else next[i] = 'pending'
            }
            // If completed
            if (data.status === 'completed' || activeIndex >= 4) {
              next[4] = 'done'
            }
            return next
          })

          if (data.status === 'completed' || activeIndex >= 4) {
            setCompleted(true)
            setOverallProgress(100)
            setTimeout(() => navigate(`/dashboard/projects/${data.video_id}`), 2500)
          }
        }
      } catch (err) {
        console.error('Failed to poll job status:', err)
      }
    }

    // Initial fetch immediately
    pollStatus()
    
    // Then every 5s
    const iv = setInterval(pollStatus, 5000)
    return () => clearInterval(iv)
  }, [jobId, cancelled, completed, navigate])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  if (cancelled) {
    return (
      <div className="fixed inset-0 bg-[#FFEBEE] flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Job Cancelled</h2>
          <p className="text-[#9E9E9E] mb-6">The processing job was cancelled.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 rounded-xl border border-[#FFCDD2] bg-white text-[#1A1A1A] text-sm font-semibold hover:border-[#EF9090] hover:text-[#EF5350] transition-all">
              Back to Dashboard
            </button>
            <button onClick={() => navigate('/dashboard/upload')} className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors">
              Start New Upload
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#FFF5F5] flex items-center justify-center overflow-hidden">
      {/* Back to Dashboard Navigation */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-[#FFCDD2] rounded-xl text-sm font-semibold text-[#1A1A1A] hover:bg-white hover:border-[#EF9090] hover:text-[#EF5350] transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#EF5350]/6 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C62828]/5 rounded-full blur-3xl" />
        {!completed && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#EF5350]/40"
                style={{ left: `${10 + i * 12}%`, top: '80%' }}
                animate={{ y: [0, -(200 + i * 30), 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Header */}
        <div className="text-center mb-10">
          {/* <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#EF5350] flex items-center justify-center shadow-lg shadow-[#EF5350]/30">
              <Zap size={14} className="text-white fill-white" />
            </div>
            <span className="font-bold text-[#1A1A1A]">ReelCut</span>
          </div> */}

          {/* Logo */}
          <div className="mx-auto mb-4 h-auto w-32">
              <img
                src="/reel-logo-black.png"
                className="h-full w-full object-contain"
                alt="ReelCut Logo"
              />
          </div>

          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Clips Ready! 🎉</h1>
                <p className="text-sm text-[#9E9E9E]">Redirecting you to your clips...</p>
              </motion.div>
            ) : (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Processing Your Video</h1>
                <div className="flex flex-col items-center justify-center gap-2 mt-2">
                  <p className="text-xs text-[#9E9E9E] flex items-center justify-center gap-1.5">
                    <Clock size={11} /> {formatTime(elapsed)} elapsed · Job {jobId?.slice(0, 12)}
                  </p>
                  <span className="text-[11px] text-[#616161] bg-white/50 px-3 py-1.5 rounded-lg border border-[#FFCDD2]/50">
                    You can safely leave this page. We'll continue in the background.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Overall progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[#9E9E9E] mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#FFFFFF] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#EF5350] to-[#C62828]"
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((step, i) => {
            const state = stepStates[i]
            const isActive = state === 'active'
            const isDone = state === 'done'

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: state === 'pending' ? 0.35 : 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-[#EF5350]/50 bg-[#EF5350]/8'
                    : isDone
                    ? 'border-[#22C55E]/20 bg-[#22C55E]/5'
                    : 'border-[#FFCDD2] bg-[#FFFFFF]'
                }`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-[#EF5350]/20' : isDone ? 'bg-[#22C55E]/15' : 'bg-[#FFCDD2]'
                }`}>
                  {isDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                      <CheckCircle2 size={16} className="text-[#22C55E]" />
                    </motion.div>
                  ) : (
                    <step.icon size={16} className={isActive ? 'text-[#EF5350]' : 'text-[#9E9E9E]'} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm font-semibold ${isDone ? 'text-[#22C55E]' : isActive ? 'text-[#1A1A1A]' : 'text-[#9E9E9E]'}`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <span className="text-xs text-[#EF5350]">{Math.round(stepProgress)}%</span>
                    )}
                  </div>

                  {/* Sub-label / animation */}
                  {isActive && (
                    <div className="mt-1">
                      {i === 1 ? (
                        <ClipMaterializeAnimation />
                      ) : i === 2 ? (
                        <WaveformAnimation />
                      ) : i === 3 ? (
                        <TypingAnimation text="Generating: '5 AI Trends Changing Content Creation in 2024...'" />
                      ) : i === 4 ? (
                        <SuccessBurst />
                      ) : (
                        <p className="text-xs text-[#9E9E9E]">{step.sublabel}</p>
                      )}

                      {/* Step progress bar */}
                      {i !== 4 && (
                        <div className="mt-2 h-0.5 rounded-full bg-[#FFCDD2] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-[#EF5350]"
                            animate={{ width: `${stepProgress}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!isActive && !isDone && (
                    <p className="text-xs text-[#9E9E9E]">{step.sublabel}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Completed CTA */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <SuccessBurst />
              <p className="text-sm text-[#616161] mt-4">Taking you to your clips now...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel */}
        {!completed && (
          <div className="text-center mt-4">
            <button
              onClick={async () => {
                if (confirm('Cancel this job? Progress will be lost.')) {
                  try {
                    await api.post(`/v2/jobs/${jobId}/cancel`)
                    setCancelled(true)
                  } catch (err) {
                    console.error('Failed to cancel job:', err)
                    alert('Failed to cancel job.')
                  }
                }
              }}
              className="flex items-center gap-1.5 text-xs text-[#9E9E9E] hover:text-[#EF4444] transition-colors mx-auto"
            >
              <AlertTriangle size={12} /> Cancel Job
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
