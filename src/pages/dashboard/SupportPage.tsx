import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How do I upload a video for processing?",
    answer: "You can upload a video by navigating to the 'Uploads' page from the sidebar. We support MP4, MOV, and AVI formats up to 2GB in size. Alternatively, you can drop a YouTube or Google Drive link."
  },
  {
    question: "How long does it take to generate clips?",
    answer: "Processing time depends on the length of your source video. Typically, a 10-minute video takes about 2-3 minutes to process, transcribe, and extract viral highlights."
  },
  {
    question: "Can I customize the generated clips?",
    answer: "Yes! Once clips are generated, you can open them in the Clip Detail view to trim durations, adjust captions, select templates, and export in different aspect ratios (9:16, 1:1, 16:9)."
  },
  {
    question: "How does the billing cycle work?",
    answer: "We bill on a monthly basis. Your usage resets at the beginning of each billing cycle. You can upgrade or downgrade your plan at any time from the Billing page, and any prorated charges will be applied automatically."
  },
  {
    question: "Where can I find my processed videos?",
    answer: "All your processed videos and their associated clips are safely stored in the 'Projects' tab. You can re-visit past projects at any time as long as you're within your storage limits."
  }
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Support Center</h1>
        <p className="text-sm text-[#9E9E9E] mt-1">How can we help you today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 hover:border-[#EF5350] transition-colors group cursor-pointer shadow-sm">
          <div className="w-12 h-12 bg-[#FFEBEE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#EF5350] transition-colors">
            <Mail size={24} className="text-[#EF5350] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-bold text-[#1A1A1A] mb-2">Email Support</h3>
          <p className="text-sm text-[#616161] mb-4">Get help from our technical team within 24 hours.</p>
          <span className="text-sm font-semibold text-[#EF5350]">support@reelcut.io</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 hover:border-[#EF5350] transition-colors group cursor-pointer shadow-sm">
          <div className="w-12 h-12 bg-[#FFEBEE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#EF5350] transition-colors">
            <MessageCircle size={24} className="text-[#EF5350] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-bold text-[#1A1A1A] mb-2">Live Chat</h3>
          <p className="text-sm text-[#616161] mb-4">Chat with our support agents in real-time.</p>
          <span className="text-sm font-semibold text-[#EF5350]">Start a conversation</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 hover:border-[#EF5350] transition-colors group cursor-pointer shadow-sm">
          <div className="w-12 h-12 bg-[#FFEBEE] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#EF5350] transition-colors">
            <FileText size={24} className="text-[#EF5350] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-bold text-[#1A1A1A] mb-2">Documentation</h3>
          <p className="text-sm text-[#616161] mb-4">Read our comprehensive guides and API docs.</p>
          <span className="text-sm font-semibold text-[#EF5350]">Browse docs</span>
        </div>
      </div>

      <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-xl overflow-hidden transition-colors ${openFaq === idx ? 'border-[#EF5350]' : 'border-[#FFCDD2] hover:border-[#EF9090]'}`}
            >
              <button 
                className="w-full flex items-center justify-between p-4 text-left bg-white focus:outline-none"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="font-semibold text-[#1A1A1A] text-sm md:text-base pr-4">{faq.question}</span>
                {openFaq === idx ? (
                  <ChevronUp size={18} className="text-[#EF5350] shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-[#9E9E9E] shrink-0" />
                )}
              </button>
              
              <motion.div 
                initial={false}
                animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 text-sm text-[#616161] leading-relaxed border-t border-[#FFEBEE]">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
