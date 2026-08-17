import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export function Blog() {
  useEffect(() => {
    document.title = 'Resources & Articles — Excido'
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
          <p className="text-sm font-bold text-[#EF5350] tracking-widest uppercase mb-4 font-mono">Blog</p>
          <h1 className="text-5xl sm:text-7xl font-bebas text-[#1A1A1A] mb-6 leading-none">Creator <span className="text-[#EF5350]">Resources</span></h1>
          <p className="text-xl text-[#616161]">Strategies, tools, and updates to scale your short-form content output as a solo creator.</p>
        </div>
      </section>

      {/* Grid List Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article 
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-[#FFCDD2] rounded-2xl overflow-hidden hover:border-[#EF5350] transition-colors shadow-sm flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFEBEE] text-[#EF5350]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold text-[#1A1A1A] mb-3 line-clamp-2 hover:text-[#EF5350] transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-[#616161] line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="px-6 pb-6 border-t border-[#FFEBEE] pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBEE] flex items-center justify-center font-bold text-xs text-[#EF5350]">
                      {post.author.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A]">{post.author.name}</p>
                      <p className="text-[10px] text-[#9E9E9E]">{post.author.role}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="flex items-center gap-1 text-xs font-bold text-[#EF5350] hover:text-[#C62828] transition-colors"
                  >
                    Read <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
