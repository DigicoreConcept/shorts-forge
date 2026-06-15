import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { api, ApiResponse } from '@/lib/api'
import { AxiosError } from 'axios'
import type { User as UserType } from '@/types'
import { useAuthStore } from '@/store/authStore'

export function VerifyAccount() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  
  // The email should be passed from the Register or Login screen via React Router state
  const email = location.state?.email

  if (!email) {
    // If accessed directly without an email in state, redirect to register
    navigate('/register')
    return null
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const response = await api.post<ApiResponse<UserType>>('/v1/users/verify-account', {
        email,
        otp_code: Number(otp) // Ensure it's a number per payload spec
      })
      
      if (response.data.success && response.data.data) {
        setUser(response.data.data)
        // Note: verify-account returns the User object. If it doesn't return a token, 
        // they might need to login again. But assuming they are verified, we send them to login or dashboard.
        // Let's send to login to get their token.
        setSuccessMsg('Account verified successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('An unexpected error occurred during verification.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setSuccessMsg('')
    setResending(true)

    try {
      const response = await api.post<ApiResponse>('/v1/users/resend-otp', { email })
      if (response.data.success) {
        setSuccessMsg(response.data.message)
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to resend OTP.')
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Verify your account</h1>
      <p className="text-sm text-[#9E9E9E] mb-6">
        We've sent a 6-digit code to <span className="font-semibold text-[#1A1A1A]">{email}</span>
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-sm text-[#22C55E]">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Authentication Code</label>
          <div className="relative">
            <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123456"
              maxLength={6}
              required
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-center text-xl tracking-[0.5em] font-mono placeholder:text-[#9E9E9E]/50 outline-none focus:border-[#EF5350] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full py-2.5 rounded-xl bg-[#EF5350] text-white font-semibold text-sm hover:bg-[#B71C1C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Verifying...' : 'Verify Account'}
        </button>
      </form>

      <p className="text-center text-sm text-[#9E9E9E] mt-6">
        Didn't receive the code?{' '}
        <button 
          onClick={handleResend}
          disabled={resending}
          className="text-[#EF5350] hover:underline font-medium disabled:opacity-60"
        >
          {resending ? 'Sending...' : 'Resend OTP'}
        </button>
      </p>
    </div>
  )
}
