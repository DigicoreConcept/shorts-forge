import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center mx-auto mb-4">
          <Mail size={22} className="text-[#22C55E]" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Check your inbox</h2>
        <p className="text-sm text-[#9E9E9E] mb-6">We sent a password reset link to <span className="text-[#1A1A1A]">{email}</span>.</p>
        <Link to="/login" className="text-sm text-[#EF5350] hover:underline flex items-center justify-center gap-1">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login" className="flex items-center gap-1 text-xs text-[#9E9E9E] hover:text-[#616161] mb-6 transition-colors">
        <ArrowLeft size={13} /> Back to login
      </Link>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Forgot your password?</h1>
      <p className="text-sm text-[#9E9E9E] mb-6">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#EF5350] text-white font-semibold text-sm hover:bg-[#B71C1C] transition-colors disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}
