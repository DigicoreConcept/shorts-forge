import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service — Excido'
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
          <h1 className="text-5xl sm:text-7xl font-bebas text-[#1A1A1A] mb-6 leading-none">Terms of <span className="text-[#EF5350]">Service</span></h1>
          <p className="text-xl text-[#616161]">Last updated: August 17, 2026</p>
        </div>
      </section>

      {/* Core Terms Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Rules Strip */}
          <div className="bg-white border border-[#FFCDD2] rounded-2xl p-6 shadow-sm mb-16 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#EF5350] mt-0.5 shrink-0" />
              <p className="text-sm text-[#1A1A1A]"><span className="font-semibold">Acceptance of Terms:</span> By registering an account or accessing the Excido platform, you agree to be bound by these Terms of Service.</p>
            </div>
            <div className="flex items-start gap-3 border-t border-[#FFCDD2] pt-4">
              <AlertCircle size={20} className="text-[#EF5350] mt-0.5 shrink-0" />
              <p className="text-sm text-[#1A1A1A]"><span className="font-semibold">Credits & Payments:</span> Video clipping processing consumes account credits. Credits are granted on subscription plans and expire under plan limits.</p>
            </div>
          </div>

          <motion.div {...fadeUp} className="prose prose-red text-[#1A1A1A] space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">1. Description of Service</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                Excido is an AI-powered SaaS tool owned by Digicoreconcept Limited. The platform provides automated video transcribing, highlights selection, mobile aspect ratio resizing, subtitle rendering, and social posting services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">2. User Accounts</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                You are responsible for maintaining the confidentiality of your credentials. You must provide true, accurate, and complete registration details. You must immediately notify our support team if you detect any unauthorized access or compromise of your credentials.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">3. Credits & Subscription Billing</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                Some features require paid subscription access or credit purchases managed by Stripe. You agree to pay all charges incurred under your account settings. Subscriptions renew automatically monthly or annually, according to your plan selection, until canceled.
              </p>
              <ul className="list-disc list-inside text-base text-[#616161] space-y-2 mt-2">
                <li>Processing credits are consumed based on video file minutes submitted.</li>
                <li>Unused promotional credits do not carry over to the subsequent billing cycles unless explicitly specified.</li>
                <li>Refunds are handled case-by-case at our sole discretion.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">4. Permissible Use</h2>
              <p className="text-base text-[#616161] leading-relaxed">
                You may not use Excido to process copyrighted videos, adult material, hate speech, or content violating any local copyright laws. You retain intellectual property ownership of all videos and transcripts processed on our server hooks.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 font-bebas tracking-wide">5. Disclaimer of Warranties</h2>
              <p className="text-base text-[#616161] leading-relaxed font-italic">
                The service is provided "as is" and "as available". Digicoreconcept Limited makes no warranties regarding the accuracy, completeness, or reliability of the AI highlights scoring, transcripts, or automated cropping outputs.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
