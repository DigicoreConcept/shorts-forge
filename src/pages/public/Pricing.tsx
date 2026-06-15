import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, Minus, ChevronDown, ChevronRight, X } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const plans = [
  {
    name: 'Starter',
    price: 19,
    desc: 'Perfect for independent creators getting started.',
    features: [
      '10 video uploads/month',
      '100 AI-generated clips',
      'Standard AI captions',
      'Metadata generation',
      'Email support',
    ],
  },
  {
    name: 'Creator',
    price: 49,
    desc: 'For serious creators scaling their content machine.',
    popular: true,
    features: [
      '50 video uploads/month',
      '500 AI-generated clips',
      'Custom caption styles',
      'YouTube direct publish',
      'Priority processing queue',
    ],
  },
  {
    name: 'Agency',
    price: 149,
    desc: 'For agencies managing multiple brands and channels.',
    features: [
      'Unlimited uploads & clips',
      'Multiple connected channels',
      'Team member seats',
      'API access',
      'Dedicated support',
    ],
  },
]

const comparisonFeatures = [
  { name: 'Video Uploads', starter: '10 / mo', creator: '50 / mo', agency: 'Unlimited' },
  { name: 'Generated Clips', starter: '100 / mo', creator: '500 / mo', agency: 'Unlimited' },
  { name: 'Max Video Length', starter: '60 mins', creator: '120 mins', agency: 'Unlimited' },
  { name: 'AI Captions', starter: true, creator: true, agency: true },
  { name: 'Custom Caption Styles', starter: false, creator: true, agency: true },
  { name: 'Metadata Generation', starter: true, creator: true, agency: true },
  { name: 'Direct Publishing', starter: false, creator: true, agency: true },
  { name: 'Multi-Channel Support', starter: false, creator: false, agency: true },
  { name: 'Team Seats', starter: false, creator: false, agency: true },
  { name: 'Processing Priority', starter: 'Standard', creator: 'High', agency: 'Highest' },
  { name: 'Support', starter: 'Email', creator: 'Priority', agency: 'Dedicated 24/7' },
]

const faqs = [
  { q: 'Can I cancel my subscription at any time?', a: 'Yes, you can cancel your subscription at any time from your account settings. You will retain access to your plan until the end of your current billing cycle.' },
  { q: 'What happens if I exceed my monthly upload limit?', a: 'If you exceed your limit, you can either upgrade to the next tier or wait until your billing cycle resets. We also offer pay-as-you-go top-ups for one-off needs.' },
  { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee for all new subscriptions. If you\'re not satisfied, just let us know within the first 14 days and we\'ll refund your payment.' },
  { q: 'Can I switch plans later?', a: 'Absolutely. You can upgrade or downgrade your plan at any time. Prorated charges or credits will be applied to your account automatically.' },
]

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col w-full bg-[#FFEBEE]">
      {/* Header */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl sm:text-7xl font-bebas text-[#1A1A1A] mb-6 leading-none"
          >
            Simple, transparent <span className="text-[#EF5350]">pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-[#616161]"
          >
            Start free, scale when you're ready.
          </motion.p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-24 px-4 border-b border-[#FFCDD2]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-16">
            <div className="flex items-center bg-[#FFFFFF] border border-[#FFCDD2] rounded-full p-1 shadow-sm">
              <button 
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billing === 'monthly' ? 'bg-[#EF5350] text-white' : 'text-[#616161] hover:text-[#1A1A1A]'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBilling('annual')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billing === 'annual' ? 'bg-[#EF5350] text-white' : 'text-[#616161] hover:text-[#1A1A1A]'}`}
              >
                Annually
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex flex-col bg-[#FFFFFF] ${
                  plan.popular
                    ? 'border-[1.5px] border-[#EF5350] md:-my-4 md:py-12 py-10 px-8 z-10'
                    : 'border border-[#FFCDD2] py-10 px-8 z-0'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#EF5350] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-2xl text-[#1A1A1A] mb-2 text-center">{plan.name}</h3>
                <p className="text-sm text-[#616161] text-center mb-6">{plan.desc}</p>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={billing}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-center items-end gap-1 mb-10"
                  >
                    <span className="text-6xl font-bebas text-[#1A1A1A] leading-none">
                      ${billing === 'monthly' ? plan.price : Math.floor(plan.price * 0.8)}
                    </span>
                    <span className="text-[#616161] text-sm mb-2">/mo</span>
                  </motion.div>
                </AnimatePresence>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[#616161]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF5350] mt-1.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-4 font-semibold transition-all ${
                    plan.popular
                      ? 'bg-[#EF5350] text-white hover:bg-[#C62828] shadow-md'
                      : 'border border-[#FFCDD2] text-[#616161] hover:border-[#EF9090] hover:text-[#1A1A1A] bg-transparent'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4 bg-[#FFF5F5] border-b border-[#FFCDD2]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bebas text-[#1A1A1A]">Compare Features</h2>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="py-6 px-6 font-semibold text-[#1A1A1A] w-1/4"></th>
                  <th className="py-6 px-6 font-bold text-[#1A1A1A] text-lg w-1/4 text-center">Starter</th>
                  <th className="py-6 px-6 font-bold text-[#EF5350] text-lg w-1/4 text-center border-b-2 border-[#EF5350]">Creator</th>
                  <th className="py-6 px-6 font-bold text-[#1A1A1A] text-lg w-1/4 text-center">Agency</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f, i) => (
                  <tr key={f.name} className={`${i % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FFF5F5]'} border-b border-[#FFCDD2]`}>
                    <td className="py-5 px-6 font-medium text-[#1A1A1A]">{f.name}</td>
                    
                    {/* Starter */}
                    <td className="py-5 px-6 text-center text-[#616161]">
                      {typeof f.starter === 'boolean' 
                        ? (f.starter ? <Check size={20} className="mx-auto text-[#EF5350]" /> : <Minus size={20} className="mx-auto text-[#FFCDD2]" />)
                        : f.starter}
                    </td>
                    
                    {/* Creator */}
                    <td className="py-5 px-6 text-center text-[#616161] bg-[#FFEBEE]/30">
                      {typeof f.creator === 'boolean' 
                        ? (f.creator ? <Check size={20} className="mx-auto text-[#EF5350]" /> : <Minus size={20} className="mx-auto text-[#FFCDD2]" />)
                        : f.creator}
                    </td>
                    
                    {/* Agency */}
                    <td className="py-5 px-6 text-center text-[#616161]">
                      {typeof f.agency === 'boolean' 
                        ? (f.agency ? <Check size={20} className="mx-auto text-[#EF5350]" /> : <Minus size={20} className="mx-auto text-[#FFCDD2]" />)
                        : f.agency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-4 bg-[#FFEBEE]">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bebas text-[#1A1A1A] mb-4">Pricing FAQs</h2>
          </motion.div>
          
          <div className="space-y-0 border-t border-[#FFCDD2]">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#FFFFFF] border-b border-[#FFCDD2] overflow-hidden"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 px-6 text-left"
                >
                  <h3 className={`font-semibold text-lg transition-colors ${activeFaq === i ? 'text-[#EF5350]' : 'text-[#1A1A1A]'}`}>
                    {faq.q}
                  </h3>
                  <div className="text-[#EF5350] flex-shrink-0 ml-4">
                    {activeFaq === i ? <ChevronDown size={20} className="text-[#EF5350]" /> : <ChevronRight size={20} className="text-[#EF5350]" />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 overflow-hidden"
                    >
                      <p className="text-[#616161] leading-relaxed pb-6">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
