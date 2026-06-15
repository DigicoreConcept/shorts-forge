import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bell, Shield, Camera, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

type Tab = 'profile' | 'notifications' | 'security'

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#EF5350]' : 'bg-[#FFCDD2]'}`}
      style={{ height: 22 }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

export function SettingsPage() {
  const { user, updateUser } = useAuthStore()
  const [tab, setTab] = useState<Tab>('profile')
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    processingComplete: true,
    billingAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
  })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  const saveProfile = async () => {
    updateUser({ name, email })
    setSaved(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaved(false)
  }

  const updateNotif = (key: keyof typeof notifications, val: boolean) =>
    setNotifications((n) => ({ ...n, [key]: val }))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-sm text-[#9E9E9E] mt-1">Manage your account preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#FFFFFF] border border-[#FFCDD2] rounded-xl mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
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
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFCDD2] border border-[#FFEBEE] flex items-center justify-center text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors">
                    <Camera size={11} />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-[#1A1A1A]">{user?.name}</p>
                  <p className="text-xs text-[#9E9E9E] capitalize">{user?.plan} plan</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#616161] font-medium mb-1.5">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#616161] font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
                />
              </div>
              <button
                onClick={saveProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors"
              >
                {saved ? <><Check size={14} /> Saved!</> : 'Save Profile'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Notifications tab */}
        {tab === 'notifications' && (
          <motion.div key="notif" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 space-y-5">
              {[
                { key: 'processingComplete', label: 'Processing Complete', desc: 'Get notified when your clips are ready.' },
                { key: 'billingAlerts', label: 'Billing Alerts', desc: 'Renewal reminders and payment notifications.' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A summary of your content performance.' },
                { key: 'marketingEmails', label: 'Product Updates', desc: 'New features and announcements.' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between gap-4 pb-5 border-b border-[#FFCDD2] last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{n.label}</p>
                    <p className="text-xs text-[#9E9E9E] mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle
                    checked={notifications[n.key as keyof typeof notifications]}
                    onChange={(v) => updateNotif(n.key as keyof typeof notifications, v)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Security tab */}
        {tab === 'security' && (
          <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 space-y-5 mb-4">
              <h2 className="font-semibold text-[#1A1A1A]">Change Password</h2>
              {[
                { key: 'current', label: 'Current Password', placeholder: '••••••••' },
                { key: 'next', label: 'New Password', placeholder: 'Min. 8 characters' },
                { key: 'confirm', label: 'Confirm New Password', placeholder: '••••••••' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-[#616161] font-medium mb-1.5">{f.label}</label>
                  <input
                    type="password"
                    value={passwords[f.key as keyof typeof passwords]}
                    onChange={(e) => setPasswords((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
                  />
                </div>
              ))}
              <button className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors">
                Update Password
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
