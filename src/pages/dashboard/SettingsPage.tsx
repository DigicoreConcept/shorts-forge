import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, Camera, Check, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'

type Tab = 'profile' | 'security'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
]

export function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [tab, setTab] = useState<Tab>('profile')
  const [name, setName] = useState(user?.full_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState(false)

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

  const saveProfile = async () => {
    updateUser({ name, email })
    setSaved(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaved(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-sm text-[#9E9E9E] mt-1">Manage your account preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-[#FFFFFF] border border-[#FFCDD2] rounded-xl mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-[#EF5350] text-white shadow' : 'text-[#9E9E9E] hover:text-[#616161]'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Profile tab */}
        {tab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#EF5350] flex items-center justify-center text-2xl font-bold text-white">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFCDD2] border border-[#FFEBEE] flex items-center justify-center text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors">
                    <Camera size={11} />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A]">{user?.full_name}</p>
                  <p className="text-xs text-[#9E9E9E] capitalize">{user?.plan} plan</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#616161] font-medium mb-1.5">Full Name</label>
                <input
                  value={name}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#616161] font-medium mb-1.5">Username</label>
                <input
                  value={user?.username}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#616161] font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
                />
              </div>
              {/* <button
                onClick={saveProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors"
              >
                {saved ? <><Check size={14} /> Saved!</> : 'Save Profile'}
              </button> */}
            </div>
          </motion.div>
        )}

        {/* Security tab */}
        {tab === 'security' && (
          <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 space-y-5 mb-4">
              <div className="mb-4">
                <h2 className="font-semibold text-[#1A1A1A] mb-1">Reset Password</h2>
                <p className="text-xs text-[#9E9E9E]">We will send a secure password reset link to your registered email address.</p>
              </div>
              
              {passError && (
                <div className="p-3 mb-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2 text-[#EF4444] text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{passError}</p>
                </div>
              )}

              {passSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-start gap-2 text-[#22C55E] text-sm">
                  <Check size={16} className="mt-0.5 shrink-0" />
                  <p>Reset link sent! Please check your inbox.</p>
                </div>
              )}

              <button 
                onClick={handleRequestPasswordReset}
                disabled={passLoading}
                className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-60"
              >
                {passLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#1A1A1A] mb-1">Two-Factor Authentication</h2>
                  <p className="text-xs text-[#9E9E9E]">Add an extra layer of security to your account.</p>
                </div>
                <span className="text-xs text-[#9E9E9E] bg-[#FFCDD2] px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
