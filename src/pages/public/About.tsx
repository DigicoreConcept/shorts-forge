import { motion } from 'framer-motion'
import { Zap, Target, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const team = [
  { name: 'Sarah Jenkins', role: 'Founder & CEO' },
  { name: 'David Chen', role: 'Head of Engineering' },
  { name: 'Marcus Torres', role: 'Lead Designer' },
  { name: 'Elena Rostova', role: 'AI Researcher' },
]

const timeline = [
  { year: 'May (Wk 1)', text: 'First line of code written' },
  { year: 'May (Wk 3)', text: 'Core AI extraction engine built' },
  { year: 'June (Wk 2)', text: 'Launched Private Beta (Current)' },
]

export function About() {
  return (
    <div className="flex flex-col w-full bg-[#FFEBEE]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-[#FFCDD2]">
        <div 
          className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-32 w-[600px] h-[600px] opacity-[0.04] pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 24px)' 
          }} 
        />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="w-full md:w-2/3 mb-16">
            <motion.h1 
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bebas text-[#1A1A1A] leading-[0.95] tracking-tight mb-6 uppercase"
            >
              Built for creators, <br/><span className="text-[#EF5350]">by creators</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-[#616161] max-w-lg leading-relaxed"
            >
              ReelCut exists because great content shouldn't be locked behind a video editing degree.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-10 border-t border-[#FFCDD2]"
          >
            <p className="text-xl text-[#1A1A1A] max-w-2xl font-medium leading-relaxed italic border-l-4 border-[#EF5350] pl-6">
              "We built ReelCut because manually clipping content was taking hours every week. We wanted a tool that didn't just add captions, but actually found the best moments and prepared them for publishing instantly."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-[#FFF5F5]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bebas text-[#1A1A1A] mb-4">Our Core Values</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Speed over perfection', desc: 'Fast processing, fast iterations, fast shipping. We don\'t believe in making creators wait.' },
              { icon: Target, title: 'Publish-ready quality', desc: 'The AI output should be ready to post immediately, not a rough draft that needs heavy editing.' },
              { icon: Users, title: 'Creator-first', desc: 'Every feature is designed from the creator\'s perspective, not the algorithm\'s.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#FFFFFF] border border-[#FFCDD2] p-8"
              >
                <div className="w-12 h-12 bg-[#EF5350]/10 flex items-center justify-center mb-6">
                  <v.icon size={24} className="text-[#EF5350]" />
                </div>
                <h3 className="font-bold text-xl text-[#1A1A1A] mb-3">{v.title}</h3>
                <p className="text-[#616161] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 bg-[#FFEBEE] relative">
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <span className="px-6 py-3 bg-[#1A1A1A] text-white font-bebas text-2xl rounded shadow-2xl border border-[#333]">TEAM EXPANDING POST-BETA</span>
        </div>
        
        <div className="max-w-6xl mx-auto blur-md opacity-40 pointer-events-none select-none">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bebas text-[#1A1A1A] mb-4">Meet the team</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group"
              >
                <div className="w-full aspect-[4/5] bg-[#FFFFFF] border border-[#FFCDD2] mb-4 flex items-center justify-center group-hover:border-[#EF9090] transition-colors">
                  <Users size={32} className="text-[#FFCDD2]" />
                </div>
                <h3 className="font-bold text-lg text-[#1A1A1A]">{member.name}</h3>
                <p className="font-semibold text-[#EF5350] text-sm uppercase tracking-wider">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-[#FFF5F5] border-y border-[#FFCDD2]">
        <div className="max-w-6xl mx-auto overflow-hidden">
          <motion.div {...fadeUp} className="text-center mb-24">
            <h2 className="text-4xl font-bebas text-[#1A1A1A] mb-4">The Journey So Far</h2>
          </motion.div>

          <div className="relative pt-12 pb-24">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-[#FFCDD2] -translate-y-1/2" />
            
            <div className="relative z-10 flex justify-between items-center px-4">
              {timeline.map((point, i) => (
                <div key={point.year} className="relative flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#EF5350] outline outline-4 outline-[#FFF5F5]" />
                  <div className={`absolute w-40 text-center ${i % 2 === 0 ? 'bottom-8' : 'top-8'}`}>
                    <p className="font-bebas text-2xl text-[#1A1A1A] mb-1">{point.year}</p>
                    <p className="text-sm text-[#616161]">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Small CTA */}
      <section className="py-20 px-4 bg-[#FFEBEE] text-center relative">
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <span className="px-6 py-3 bg-[#1A1A1A] text-white font-bebas text-2xl rounded shadow-2xl border border-[#333]">HIRING OPENING SOON</span>
        </div>
        <div className="max-w-2xl mx-auto blur-md opacity-40 pointer-events-none select-none">
          <h2 className="text-3xl font-bebas text-[#1A1A1A] mb-6">Want to join us?</h2>
          <div className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white font-semibold hover:bg-[#333] transition-colors">
            View Open Positions <ArrowRight size={16} />
          </div>
        </div>
      </section>
    </div>
  )
}
