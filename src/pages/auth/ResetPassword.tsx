import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/v1/users/reset-password', {
        token,
        new_password: password
      })

      if (res.data?.success) {
        setSuccess(true)
      } else {
        setError(res.data?.message || 'Failed to reset password. Please try again.')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while resetting your password.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-[#EF5350]/15 border border-[#EF5350]/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={22} className="text-[#EF5350]" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Password Reset Successful</h2>
        <p className="text-sm text-[#9E9E9E] mb-6">Your password has been successfully updated. You can now log in with your new password.</p>
        <Link to="/login" className="inline-block px-6 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/20">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login" className="flex items-center gap-1 text-xs text-[#9E9E9E] hover:text-[#616161] mb-6 transition-colors">
        <ArrowLeft size={13} /> Back to login
      </Link>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Reset your password</h1>
      <p className="text-sm text-[#9E9E9E] mb-6">Please enter your new password below.</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2 text-[#EF4444] text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!token && !error && (
         <div className="mb-4 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start gap-2 text-[#F59E0B] text-sm">
         <AlertCircle size={16} className="mt-0.5 shrink-0" />
         <p>No reset token found in URL. This link may be invalid.</p>
       </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">New Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full py-2.5 rounded-xl bg-[#EF5350] text-white font-semibold text-sm hover:bg-[#B71C1C] transition-colors disabled:opacity-60 mt-2 shadow-lg shadow-[#EF5350]/20"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
