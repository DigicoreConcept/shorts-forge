import { motion } from 'framer-motion'
import { Check, Zap, AlertTriangle, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { PLAN_LIMITS } from '@/types'
import { Link } from 'react-router-dom'

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = Math.min((used / limit) * 100, 100)
  const color = pct > 85 ? '#EF4444' : pct > 60 ? '#F59E0B' : '#22C55E'
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[#9E9E9E] mb-1.5">
        <span>{label}</span>
        <span style={{ color }}>{used}/{limit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#FFEBEE] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

export function BillingPage() {
  const { user } = useAuthStore()
  const plan = user?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]

  const mockUsage = { uploads: 8, clips: 94, storage: 4.3 }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Billing</h1>
        <p className="text-sm text-[#9E9E9E] mt-1">Manage your subscription and usage.</p>
      </div>

      {/* Current plan */}
      <div className="bg-[#FFFFFF] border border-[#EF5350]/30 rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#EF5350] flex items-center justify-center">
                <Zap size={12} className="text-white fill-white" />
              </div>
              <h2 className="font-bold text-lg text-[#1A1A1A] capitalize">{plan} Plan</h2>
            </div>
            <p className="text-sm text-[#9E9E9E]">
              ${limits.price}/month · Renews <span className="text-[#616161]">Feb 15, 2024</span>
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2.5 py-1 rounded-full">
            <Check size={10} /> Active
          </span>
        </div>

        {/* Usage */}
        <div className="space-y-4">
          <UsageBar used={mockUsage.uploads} limit={limits.uploads} label="Uploads" />
          <UsageBar used={mockUsage.clips} limit={limits.clips} label="Clips" />
          <UsageBar used={mockUsage.storage} limit={limits.storage} label={`Storage (GB)`} />
        </div>

        {mockUsage.uploads / limits.uploads > 0.8 && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs text-[#F59E0B]">
            <AlertTriangle size={13} /> You're approaching your upload limit. Consider upgrading.
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 mb-5">
        <h2 className="font-semibold text-[#1A1A1A] mb-4">Payment Method</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded bg-[#FFCDD2] flex items-center justify-center">
            <CreditCard size={14} className="text-[#9E9E9E]" />
          </div>
          <div>
            <p className="text-sm text-[#1A1A1A]">•••• •••• •••• 4242</p>
            <p className="text-xs text-[#9E9E9E]">Expires 12/26</p>
          </div>
          <button className="ml-auto text-xs text-[#EF5350] hover:underline">Update</button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/pricing"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/20"
        >
          <Zap size={15} /> Upgrade Plan
        </Link>
        <button className="flex-1 py-3 rounded-xl border border-[#EF4444]/30 text-sm text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors">
          Cancel Subscription
        </button>
      </div>
    </div>
  )
}
