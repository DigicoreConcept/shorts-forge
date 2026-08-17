import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, Lock, RefreshCw } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Excido'
  }, [])

  return (
    <div className="flex flex-col w-full bg-[#FFEBEE]">
      {/* Hero Strip - full width background */}
      <section className="pt-32 pb-20 px-4 text-center border-b border-[#FFCDD2] relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 24px)' 
          }} 
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-sm font-bold text-[#EF5350] tracking-widest uppercase mb-4">Legal</p>
          <h1 className="text-5xl sm:text-7xl font-bebas text-[#1A1A1A] mb-6 leading-none">Privacy <span className="text-[#EF5350]">Policy</span></h1>
          <p className="text-xl text-[#616161]">Last updated: August 17, 2026</p>
        </div>
      </section>

      {/* Core Privacy Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 shadow-sm">
              <Shield size={24} className="text-[#EF5350] mb-3" />
              <h3 className="font-bold text-[#1A1A1A] mb-1">Your Data</h3>
              <p className="text-xs text-[#616161]">We do not sell your personal data or email addresses to third parties.</p>
            </div>
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 shadow-sm">
              <Eye size={24} className="text-[#EF5350] mb-3" />
              <h3 className="font-bold text-[#1A1A1A] mb-1">Whisper Processing</h3>
              <p className="text-xs text-[#616161]">Transcripts generated from your video files are used exclusively for highlights detection.</p>
            </div>
            <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 shadow-sm">
              <Lock size={24} className="text-[#EF5350] mb-3" />
              <h3 className="font-bold text-[#1A1A1A] mb-1">Secure Auth</h3>
              <p className="text-xs text-[#616161]">Your account information is protected by industry-standard encryption protocols.</p>
            </div>
          </div>

          <motion.div {...fadeUp} className="prose prose-red text-[#1A1A1A] space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">1. Information We Collect</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                We collect personal information that you provide directly to us when registering for an account. This includes your name, email address, password, and any billing details. We also collect the video files, audio files, or third-party links (YouTube, Google Drive) that you upload for clipping.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">2. How We Process Video Content</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                When you upload a video to Excido, the audio stream is extracted and processed using OpenAI Whisper to generate text transcripts. These transcripts are analyzed by language models (Mistral AI and Gemini AI) to identify key narrative hooks. ffmpeg is used locally on our backend servers to slice your video. We do not store your original long-form video files longer than necessary to complete the processing pipeline.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">3. Third-Party Integrations</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                If you connect your social media channels (YouTube, TikTok, Instagram) to Excido via OAuth:
              </p>
              <ul className="list-disc list-inside text-base text-[#616161] space-y-2 mt-2">
                <li>We request permission to upload, schedule, and publish video assets on your behalf.</li>
                <li>We do not download or store your personal user feed, private messages, or contacts.</li>
                <li>You can disconnect these authorizations at any time directly through your dashboard settings or third-party account portals.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">4. Security</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                We take security seriously. Your session cookies, passwords, and API tokens are secured with salt hashes and transport encryption (HTTPS). While no system is 100% secure, we apply standard administrative controls to protect your data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">5. Contact Us</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                If you have questions about this Privacy Policy, please reach out to us at <span className="text-[#EF5350] font-semibold">support@excido.app</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
