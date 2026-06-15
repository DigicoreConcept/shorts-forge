import { motion } from 'framer-motion'
import { ExternalLink, Check } from 'lucide-react'

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const platforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: YoutubeIcon,
    color: '#FF0000',
    connected: false,
    desc: 'Publish Shorts directly to your YouTube channel.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
    ),
    color: '#010101',
    connected: false,
    comingSoon: true,
    desc: 'Post directly to TikTok. Coming soon.',
  },
  {
    id: 'instagram',
    name: 'Instagram Reels',
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    ),
    color: '#E1306C',
    connected: false,
    comingSoon: true,
    desc: 'Publish Reels to Instagram. Coming soon.',
  },
]

export function ChannelsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Channel Integrations</h1>
        <p className="text-sm text-[#9E9E9E] mt-1">Connect your social accounts to publish clips directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {platforms.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={`bg-[#FFFFFF] border rounded-2xl p-6 ${p.comingSoon ? 'border-[#FFCDD2] opacity-60' : 'border-[#FFCDD2] hover:border-[#EF9090]'} transition-colors`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${p.color}15`, color: p.color }}>
                <p.icon />
              </div>
              {p.connected && (
                <span className="flex items-center gap-1 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2 py-0.5 rounded-full">
                  <Check size={10} /> Connected
                </span>
              )}
              {p.comingSoon && (
                <span className="text-xs text-[#9E9E9E] bg-[#FFCDD2] px-2 py-0.5 rounded-full">Coming Soon</span>
              )}
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">{p.name}</h3>
            <p className="text-xs text-[#9E9E9E] mb-5 leading-relaxed">{p.desc}</p>
            <button
              disabled={p.comingSoon}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                p.comingSoon
                  ? 'border border-[#FFCDD2] text-[#9E9E9E] cursor-not-allowed'
                  : p.connected
                  ? 'border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/5'
                  : 'border border-[#EF5350]/40 text-[#EF5350] hover:bg-[#EF5350]/10'
              }`}
            >
              {p.comingSoon ? 'Coming Soon' : p.connected ? 'Disconnect' : (
                <span className="flex items-center justify-center gap-1.5">
                  <ExternalLink size={13} /> Connect {p.name}
                </span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6">
        <h2 className="font-semibold text-[#1A1A1A] mb-2">Connected Channels</h2>
        <p className="text-sm text-[#9E9E9E]">No channels connected yet. Connect a platform above to start publishing.</p>
      </div>
    </div>
  )
}
