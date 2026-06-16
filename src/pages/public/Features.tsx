import { motion } from 'framer-motion'
import { Type, FileText, Download, ArrowRight, UploadCloud, Mic, Scissors, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const features = [
  { 
    title: 'Animated Captions', 
    desc: 'Captions are generated with dynamic styles, auto-reformatting for vertical screens, and active word highlighting to keep viewers engaged.',
    points: ['99% transcription accuracy', 'Custom fonts & colors', 'Multi-language support'],
    icon: Type
  },
  { 
    title: 'Metadata Generation', 
    desc: 'Stop guessing what works. Our AI writes platform-optimized titles, descriptions, and hashtags tailored to each specific algorithm.',
    points: ['Viral hook generation', 'Auto-hashtagging', 'SEO optimized descriptions'],
    icon: FileText
  },
  { 
    title: 'One-Click Publishing', 
    desc: 'Connect your accounts and publish directly to YouTube Shorts, TikTok, and Instagram Reels without ever leaving the dashboard.',
    points: ['Schedule posts', 'Multi-account support', 'Analytics tracking'],
    icon: Download
  },
]

export function Features() {
  return (
    <div className="flex flex-col w-full bg-[#FFEBEE]">
      {/* Hero Strip */}
      <section className="pt-32 pb-20 px-4 text-center border-b border-[#FFCDD2] relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 24px)' 
          }} 
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-sm font-bold text-[#EF5350] tracking-widest uppercase mb-4">Features</p>
          <h1 className="text-5xl sm:text-7xl font-bebas text-[#1A1A1A] mb-6 leading-none">Built for <span className="text-[#EF5350]">viral growth</span></h1>
          <p className="text-xl text-[#616161]">Everything you need to scale your content, housed in one seamless workflow.</p>
        </div>
      </section>

      {/* Processing Pipeline Showcase */}
      <section className="py-24 px-4 bg-[#111216] text-center border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <motion.div {...fadeUp} className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-bebas text-white mb-4">The Engine Behind The Magic</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We've built a robust, scalable backend pipeline that handles the heavy lifting. You just hit upload.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {[
              { icon: UploadCloud, label: 'Upload' },
              { icon: Scissors, label: 'Generate Clips' },
              { icon: Mic, label: 'Transcribe' },
              { icon: Type, label: 'Generate Titles' },
              { icon: FileText, label: 'Generate Descriptions' },
              { icon: Send, label: 'Publish' }
            ].map((step, i, arr) => (
              <motion.div 
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="flex flex-col items-center p-6 bg-gray-900 border border-white/10 rounded-2xl w-40 h-32 justify-center group hover:border-[#EF5350]/50 transition-colors">
                  <step.icon size={28} className="text-[#EF5350] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-white text-center leading-tight">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="my-4 md:my-0 md:mx-4 text-[#EF5350] md:rotate-0 rotate-90">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating Feature Sections */}
      {features.map((feature, i) => (
        <section 
          key={feature.title} 
          className={`py-24 px-4 border-b border-[#FFCDD2] ${i % 2 === 0 ? 'bg-[#FFF5F5]' : 'bg-[#FFEBEE]'}`}
        >
          <div className={`max-w-6xl mx-auto flex flex-col gap-16 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            
            {/* Text Side */}
            <div className="w-full md:w-1/2 flex flex-col items-start">
              <div className="w-12 h-12 bg-[#EF5350]/10 flex items-center justify-center mb-6">
                <feature.icon size={24} className="text-[#EF5350]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bebas text-[#1A1A1A] mb-6">{feature.title}</h2>
              <p className="text-[#616161] text-lg leading-relaxed mb-8">{feature.desc}</p>
              
              <ul className="space-y-4 mb-8">
                {feature.points.map(point => (
                  <li key={point} className="flex items-center gap-3 font-medium text-[#1A1A1A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF5350]" />
                    {point}
                  </li>
                ))}
              </ul>
              
              <Link to="/register" className="inline-flex items-center gap-2 font-bold text-[#EF5350] hover:text-[#C62828] transition-colors border-b-2 border-[#EF5350] pb-1">
                Try it for free <ArrowRight size={16} />
              </Link>
            </div>

            {/* Visual Side */}
            <div className="w-full md:w-1/2">
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full aspect-[4/3] bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden"
              >
                {/* Placeholder UI Mockup */}
                <div className="absolute inset-x-8 top-8 bottom-0 bg-[#FFF5F5] border-t border-x border-[#FFCDD2] rounded-t-xl flex flex-col">
                  <div className="h-10 border-b border-[#FFCDD2] flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFCDD2]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFCDD2]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFCDD2]" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-4">
                    <div className="h-8 bg-[#FFCDD2]/30 rounded w-1/3" />
                    <div className="h-4 bg-[#FFCDD2]/30 rounded w-full" />
                    <div className="h-4 bg-[#FFCDD2]/30 rounded w-5/6" />
                    <div className="h-32 bg-[#EF5350]/10 rounded mt-4" />
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </section>
      ))}

      {/* Footer CTA Feed */}
      <section className="py-32 px-4 bg-[#FFFFFF] text-center">
        <h2 className="text-5xl font-bebas text-[#1A1A1A] mb-8">Ready to supercharge your content?</h2>
        <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-[#EF5350] text-white font-semibold hover:bg-[#C62828] transition-colors shadow-lg shadow-[#EF5350]/20">
          Register for Beta (Testing) <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
