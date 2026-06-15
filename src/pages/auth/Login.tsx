import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { api, ApiResponse } from '@/lib/api'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Authenticate and get token
      const res = await api.post<ApiResponse<{ access_token: string }>>('/v1/users/login', {
        email,
        password
      })
      
      const token = res.data.data?.access_token
      if (!token) throw new Error('Token not received')
      
      // Save token to Zustand store (which caches it)
      useAuthStore.getState().setToken(token)

      // 2. Fetch User Details
      const meRes = await api.get<ApiResponse<any>>('/v1/users/me')
      const user = meRes.data.data
      
      useAuthStore.getState().setUser(user)

      // 3. Redirect based on verification status
      if (!user.is_verified) {
        navigate('/verify-account', { state: { email: user.email } })
      } else {
        navigate('/dashboard')
      }

    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">Welcome back</h1>
      <p className="text-sm text-[#9E9E9E] mb-6">Sign in to your ShortForge account</p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#616161] mb-1.5 font-medium">Email</label>
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-[#616161] font-medium">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#EF5350] hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#1A1A1A] text-sm placeholder:text-[#9E9E9E] outline-none focus:border-[#EF5350] transition-colors"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#616161]">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="w-4 h-4 accent-[#EF5350]" />
          <label htmlFor="remember" className="text-sm text-[#9E9E9E]">Remember me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#EF5350] text-white font-semibold text-sm hover:bg-[#B71C1C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="relative flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#FFCDD2]" />
          <span className="text-xs text-[#9E9E9E]">or</span>
          <div className="flex-1 h-px bg-[#FFCDD2]" />
        </div>

        <button
          type="button"
          disabled
          title="Google login coming soon"
          className="w-full py-2.5 rounded-xl border border-[#FFCDD2] text-[#9E9E9E] text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google (Coming Soon)
        </button>
      </form>

      <p className="text-center text-sm text-[#9E9E9E] mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#EF5350] hover:underline font-medium">Sign up free</Link>
      </p>
    </div>
  )
}
