import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AtSign } from 'lucide-react'
import { api, ApiResponse } from '@/lib/api'
import { AxiosError } from 'axios'
import type { User as UserType } from '@/types'

const Field = ({ label, value, onChange, type = 'text', icon: Icon, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; icon: typeof User; placeholder: string
}) => (
  <div>
    <label className="block text-xs text-[#616161] mb-1.5 font-medium">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
      />
    </div>
  </div>
)

export function Register() {
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    
    try {
      const response = await api.post<ApiResponse<UserType>>('/v1/users/register', {
        email: form.email,
        password: form.password,
        username: form.username,
        full_name: form.full_name
      })
      
      navigate('/verify-account', { state: { email: form.email } })
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('An unexpected error occurred during registration.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Create your account</h1>
      <p className="text-sm text-[#9E9E9E] mb-6">Start your 14-day free trial. No credit card required.</p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444]">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name" value={form.full_name} onChange={(v) => update('full_name', v)} icon={User} placeholder="Jane Doe" />
        <Field label="Username" value={form.username} onChange={(v) => update('username', v)} icon={AtSign} placeholder="janedoe" />
        <Field label="Email" value={form.email} onChange={(v) => update('email', v)} type="email" icon={Mail} placeholder="you@example.com" />

        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <Field label="Confirm Password" value={form.confirm} onChange={(v) => update('confirm', v)} type="password" icon={Lock} placeholder="••••••••" />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#EF5350] text-white font-semibold text-sm hover:bg-[#B71C1C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-xs text-[#9E9E9E]">
          By creating an account you agree to our{' '}
          <a href="#" className="text-[#EF5350] hover:underline">Terms</a> and{' '}
          <a href="#" className="text-[#EF5350] hover:underline">Privacy Policy</a>.
        </p>
      </form>

      <p className="text-center text-sm text-[#9E9E9E] mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#EF5350] hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
