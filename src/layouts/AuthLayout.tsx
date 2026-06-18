import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left 55% - Branding */}
      <div className="hidden lg:flex w-[55%] bg-[#FFEBEE] relative overflow-hidden flex-col justify-center px-16 xl:px-24">
        {/* Concentric Circles Motif */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04] pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 32px)' 
          }} 
        />
        
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 group mb-12">
            <div className="w-10 h-10 rounded-xl bg-[#EF5350] flex items-center justify-center shadow-lg shadow-[#EF5350]/30">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="font-bold text-2xl text-[#1A1A1A] tracking-tight">ReelCut</span>
          </Link>

          <h1 className="text-5xl xl:text-7xl font-bebas text-[#1A1A1A] leading-none tracking-tight mb-6 uppercase">
            Create Viral <br/><span className="text-[#EF5350]">Clips in Seconds</span>
          </h1>
          <p className="text-lg text-[#616161] leading-relaxed">
            Upload your long-form video and let our AI handle the rest. Automatic captions, smart highlights, and one-click publishing.
          </p>
        </div>
      </div>

      {/* Right 45% - Form */}
      <div className="w-full lg:w-[45%] bg-[#FFF5F5] flex flex-col justify-center px-4 sm:px-8 lg:px-16 xl:px-24 relative">
        <Link to="/" className="lg:hidden inline-flex items-center gap-2 group absolute top-8 left-6">
          <div className="w-8 h-8 rounded-xl bg-[#EF5350] flex items-center justify-center shadow-md">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-xl text-[#1A1A1A]">ReelCut</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-8 sm:p-10 shadow-xl shadow-[#EF5350]/5">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
