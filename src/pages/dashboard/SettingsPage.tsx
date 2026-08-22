import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Shield,
  Camera,
  Check,
  AlertCircle,
  Clock,
  Trash2,
  Sliders,
  Key,
  Copy,
  Layers,
  Film,
  Globe,
  Lock,
  Sparkles,
  Info,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'

type Tab = 'profile' | 'retention' | 'security' | 'processing'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'retention', label: 'Video Retention', icon: Clock },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'processing', label: 'Processing & API', icon: Sliders },
]

export function SettingsPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState<Tab>('profile')

  // Profile States
  const [name] = useState(user?.full_name ?? user?.name ?? '')
  const [email] = useState(user?.email ?? '')
  const [username] = useState(user?.username ?? '')

  // Video Retention Policy States
  // Options: '15_days' (default), 'immediate', 'custom'
  const [retentionMode, setRetentionMode] = useState<'15_days' | 'immediate' | 'custom'>('15_days')
  const [customDays, setCustomDays] = useState<number>(30)
  const [retentionSaved, setRetentionSaved] = useState(false)
  const [retentionSaving, setRetentionSaving] = useState(false)

  // Security States
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState(false)

  // Processing & API States
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16')
  const [autoCaptions, setAutoCaptions] = useState(true)
  const [defaultLanguage, setDefaultLanguage] = useState('en')
  const [apiKey] = useState('exc_live_9f82a17b4c3e8019a2b6d7')
  const [copiedKey, setCopiedKey] = useState(false)
  const [processingSaved, setProcessingSaved] = useState(false)

  const handleRequestPasswordReset = async () => {
    setPassError('')
    setPassSuccess(false)
    setPassLoading(true)

    try {
      const res = await api.post('/v1/users/forgot-password', { email: user?.email })

      if (res.data?.success) {
        setPassSuccess(true)
        setTimeout(() => setPassSuccess(false), 5000)
      } else {
        setPassError(res.data?.message || 'Failed to send reset link.')
      }
    } catch (err: any) {
      setPassError(err.response?.data?.message || 'An error occurred while requesting reset link.')
    } finally {
      setPassLoading(false)
    }
  }

  const handleSaveRetention = async () => {
    setRetentionSaving(true)
    // Simulate saving preference
    await new Promise((r) => setTimeout(r, 600))
    setRetentionSaving(false)
    setRetentionSaved(true)
    setTimeout(() => setRetentionSaved(false), 4000)
  }

  const handleSaveProcessing = async () => {
    setProcessingSaved(true)
    setTimeout(() => setProcessingSaved(false), 3000)
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 3000)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Account Settings</h1>
          <p className="text-xs sm:text-sm text-[#9E9E9E] mt-1">
            Manage your personal profile, video retention rules, security preferences, and API keys.
          </p>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-white border border-[#FFCDD2] rounded-2xl shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[130px] sm:min-w-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-[#EF5350] text-white shadow-md shadow-[#EF5350]/20'
                : 'text-[#9E9E9E] hover:text-[#616161] hover:bg-[#FFF5F5]'
            }`}
          >
            <t.icon size={15} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {/* ================= PROFILE TAB ================= */}
        {tab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#FFCDD2]/60 pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#EF5350] flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg shadow-[#EF5350]/20">
                      {(username || email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#FFCDD2] flex items-center justify-center text-[#616161] hover:text-[#EF5350] shadow-sm transition-colors">
                      <Camera size={13} />
                    </button>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl text-[#1A1A1A]">
                      {name || username || 'Excido User'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#9E9E9E]">{email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#EF5350] bg-[#FFEBEE] border border-[#FFCDD2] px-2.5 py-0.5 rounded-full capitalize">
                        {user?.subscription_plan || user?.plan || 'Free'} Plan
                      </span>
                      <span className="text-[11px] text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2.5 py-0.5 rounded-full font-medium">
                        Active Account
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#616161] mb-2">Full Name</label>
                  <input
                    value={name}
                    disabled
                    placeholder="User Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFEBEE]/60 border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none cursor-not-allowed opacity-90"
                  />
                  <p className="text-[11px] text-[#9E9E9E] mt-1.5">Managed by account authentication profile.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#616161] mb-2">Username</label>
                  <input
                    value={username}
                    disabled
                    placeholder="username"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFEBEE]/60 border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none cursor-not-allowed opacity-90"
                  />
                  <p className="text-[11px] text-[#9E9E9E] mt-1.5">Your unique identifier across Excido workspace.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#616161] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-[#FFEBEE]/60 border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none cursor-not-allowed opacity-90"
                  />
                  <p className="text-[11px] text-[#9E9E9E] mt-1.5">
                    Primary contact address used for notifications and security recovery.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= VIDEO RETENTION TAB ================= */}
        {tab === 'retention' && (
          <motion.div
            key="retention"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Informational Callout Banner */}
            <div className="bg-[#FFF5F5] border border-[#FFCDD2] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#EF5350]/10 text-[#EF5350] shrink-0 mt-0.5">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[#1A1A1A] text-sm sm:text-base">
                  Why keep your original long-form video files?
                </h3>
                <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">
                  Retaining original source videos allows you to execute <strong className="text-[#1A1A1A]">multiple processing jobs</strong> on the same video (e.g. extracting additional short clips, regenerating narrative hooks with different AI options) without uploading large files again.
                </p>
              </div>
            </div>

            {/* Retention Mode Selection Card */}
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="font-bold text-lg text-[#1A1A1A] mb-1">Original Video Storage Retention</h2>
                <p className="text-xs sm:text-sm text-[#9E9E9E]">
                  Choose how long Excido holds onto your uploaded raw video files before automated cleanup.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 15 Days Default */}
                <div
                  onClick={() => setRetentionMode('15_days')}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    retentionMode === '15_days'
                      ? 'border-[#EF5350] bg-[#FFEBEE]/50 shadow-md shadow-[#EF5350]/10 ring-2 ring-[#EF5350]/20'
                      : 'border-[#FFCDD2] bg-white hover:border-[#EF9090]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-[#EF5350]/10 text-[#EF5350]">
                        <Clock size={20} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#EF5350] bg-[#EF5350]/10 border border-[#EF5350]/20 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-base">15 Days Retention</h3>
                      <p className="text-xs text-[#616161] mt-1 leading-relaxed">
                        Default setting. Gives ample time to run additional clipping jobs without re-uploading.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#FFCDD2]/50 flex items-center gap-2">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionMode === '15_days'}
                      onChange={() => setRetentionMode('15_days')}
                      className="accent-[#EF5350]"
                    />
                    <span className="text-xs font-semibold text-[#1A1A1A]">Default 15 Days</span>
                  </div>
                </div>

                {/* Immediate Delete */}
                <div
                  onClick={() => setRetentionMode('immediate')}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    retentionMode === 'immediate'
                      ? 'border-[#EF5350] bg-[#FFEBEE]/50 shadow-md shadow-[#EF5350]/10 ring-2 ring-[#EF5350]/20'
                      : 'border-[#FFCDD2] bg-white hover:border-[#EF9090]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-[#EF4444]/10 text-[#EF4444]">
                        <Trash2 size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-base">Delete Immediately</h3>
                      <p className="text-xs text-[#616161] mt-1 leading-relaxed">
                        Original source videos are deleted right after initial clip generation finishes.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#FFCDD2]/50 flex items-center gap-2">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionMode === 'immediate'}
                      onChange={() => setRetentionMode('immediate')}
                      className="accent-[#EF5350]"
                    />
                    <span className="text-xs font-semibold text-[#1A1A1A]">Purge Immediately</span>
                  </div>
                </div>

                {/* Custom Days */}
                <div
                  onClick={() => setRetentionMode('custom')}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    retentionMode === 'custom'
                      ? 'border-[#EF5350] bg-[#FFEBEE]/50 shadow-md shadow-[#EF5350]/10 ring-2 ring-[#EF5350]/20'
                      : 'border-[#FFCDD2] bg-white hover:border-[#EF9090]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-[#EF5350]/10 text-[#EF5350]">
                        <Layers size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-base">Custom Duration</h3>
                      <p className="text-xs text-[#616161] mt-1 leading-relaxed">
                        Specify exact number of days to keep original videos before purge.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#FFCDD2]/50 flex items-center gap-2">
                    <input
                      type="radio"
                      name="retention"
                      checked={retentionMode === 'custom'}
                      onChange={() => setRetentionMode('custom')}
                      className="accent-[#EF5350]"
                    />
                    <span className="text-xs font-semibold text-[#1A1A1A]">Custom Days</span>
                  </div>
                </div>
              </div>

              {/* Custom Days Input Box */}
              {retentionMode === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-[#FFF5F5] border border-[#FFCDD2] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Enter Number of Retention Days
                    </label>
                    <p className="text-xs text-[#9E9E9E]">Specify how many days source files should be stored (1 to 90 days).</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={customDays}
                      onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-3 py-2 rounded-lg bg-white border border-[#FFCDD2] text-[#1A1A1A] text-sm text-center font-bold outline-none focus:border-[#EF5350]"
                    />
                    <span className="text-xs font-semibold text-[#616161]">Days</span>
                  </div>
                </motion.div>
              )}

              {/* Save Retention Settings Action */}
              <div className="flex items-center justify-between pt-4 border-t border-[#FFCDD2]/60">
                {retentionSaved ? (
                  <div className="flex items-center gap-2 text-[#22C55E] text-xs font-semibold">
                    <Check size={16} /> Retention rule updated successfully!
                  </div>
                ) : (
                  <span className="text-xs text-[#9E9E9E]">
                    Current rule:{' '}
                    <strong className="text-[#1A1A1A]">
                      {retentionMode === '15_days'
                        ? '15 Days (Default)'
                        : retentionMode === 'immediate'
                        ? 'Delete Immediately'
                        : `${customDays} Days Custom`}
                    </strong>
                  </span>
                )}

                <button
                  onClick={handleSaveRetention}
                  disabled={retentionSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-xs sm:text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/10 disabled:opacity-60"
                >
                  {retentionSaving ? 'Saving...' : 'Save Preference'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= SECURITY TAB ================= */}
        {tab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Password Reset */}
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <h2 className="font-bold text-lg text-[#1A1A1A] mb-1">Password & Authentication</h2>
                <p className="text-xs sm:text-sm text-[#9E9E9E]">
                  Update your security password or request a password reset link.
                </p>
              </div>

              {passError && (
                <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2 text-[#EF4444] text-xs sm:text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{passError}</p>
                </div>
              )}

              {passSuccess && (
                <div className="p-3.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-start gap-2 text-[#22C55E] text-xs sm:text-sm">
                  <Check size={16} className="mt-0.5 shrink-0" />
                  <p>Reset link dispatched! Check your email inbox to proceed.</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Send Password Reset Email</p>
                  <p className="text-xs text-[#9E9E9E]">Link will be delivered to <span className="text-[#616161] font-medium">{email}</span></p>
                </div>
                <button
                  onClick={handleRequestPasswordReset}
                  disabled={passLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-xs sm:text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/10 disabled:opacity-60"
                >
                  {passLoading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </div>
            </div>

            {/* Two Factor Authentication */}
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFEBEE] text-[#EF5350]">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base text-[#1A1A1A]">Two-Factor Authentication (2FA)</h2>
                    <p className="text-xs text-[#9E9E9E]">Protect your account with authenticator apps (TOTP).</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#9E9E9E] bg-[#FFCDD2]/60 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= PROCESSING & API TAB ================= */}
        {tab === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Clipping Defaults */}
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="font-bold text-lg text-[#1A1A1A] mb-1">Processing Defaults</h2>
                <p className="text-xs sm:text-sm text-[#9E9E9E]">
                  Default parameters applied when creating new video clipping projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#616161] mb-2 flex items-center gap-1.5">
                    <Film size={14} className="text-[#EF5350]" /> Default Aspect Ratio
                  </label>
                  <select
                    value={defaultAspectRatio}
                    onChange={(e) => setDefaultAspectRatio(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350]"
                  >
                    <option value="9:16">9:16 (Shorts, Reels, TikTok)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#616161] mb-2 flex items-center gap-1.5">
                    <Globe size={14} className="text-[#EF5350]" /> Default Language
                  </label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350]"
                  >
                    <option value="en">English (US/UK)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="auto">Auto Detect</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#FFEBEE] text-[#EF5350]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">Auto-Generate Subtitles & Captions</p>
                    <p className="text-xs text-[#9E9E9E]">Automatically burnt-in captions on extracted clip videos.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoCaptions}
                  onChange={(e) => setAutoCaptions(e.target.checked)}
                  className="w-5 h-5 accent-[#EF5350] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#FFCDD2]/60">
                {processingSaved ? (
                  <span className="text-xs text-[#22C55E] font-semibold flex items-center gap-1">
                    <Check size={14} /> Defaults saved!
                  </span>
                ) : (
                  <span className="text-xs text-[#9E9E9E]">Saved settings apply to future uploads.</span>
                )}
                <button
                  onClick={handleSaveProcessing}
                  className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-xs sm:text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/10"
                >
                  Save Defaults
                </button>
              </div>
            </div>

            {/* Developer API Keys */}
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-[#1A1A1A] mb-1 flex items-center gap-2">
                    <Key size={18} className="text-[#EF5350]" /> Developer API Key
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9E9E9E]">
                    Use your secret API key to integrate Excido clip processing programmatically.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FFCDD2] rounded-xl p-2.5">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="bg-transparent text-xs sm:text-sm text-[#1A1A1A] font-mono flex-1 outline-none px-2"
                />
                <button
                  onClick={copyApiKey}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#FFCDD2] text-xs font-semibold text-[#1A1A1A] hover:border-[#EF9090] transition-colors shrink-0 shadow-sm"
                >
                  {copiedKey ? (
                    <>
                      <Check size={13} className="text-[#22C55E]" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy Key
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
