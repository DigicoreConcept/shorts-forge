import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.slug === slug)

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Excido Blog`
    }
  }, [post])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="flex flex-col w-full bg-[#FFEBEE] min-h-screen">
      {/* Article Header strip - full width */}
      <section className="pt-32 pb-16 px-4 border-b border-[#FFCDD2] relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 24px)' 
          }} 
        />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#EF5350] hover:text-[#C62828] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Resources
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFEBEE] text-[#EF5350] border border-[#FFCDD2]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bebas text-[#1A1A1A] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#616161]">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#EF5350]" />
              <span>{post.publishedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#EF5350]" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FFEBEE] flex items-center justify-center font-bold text-[10px] text-[#EF5350] border border-[#FFCDD2]">
                {post.author.avatar}
              </div>
              <span className="font-bold text-[#1A1A1A]">{post.author.name}</span>
              <span className="text-[10px] text-[#9E9E9E]">({post.author.role})</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content - centered layout block */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white border border-[#FFCDD2] rounded-3xl p-8 sm:p-12 shadow-sm">
          <article 
            className="prose prose-red text-[#1A1A1A] max-w-none 
              prose-headings:font-bebas prose-headings:tracking-wide prose-headings:text-[#1A1A1A]
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-base prose-p:text-[#616161] prose-p:leading-relaxed prose-p:mb-6
              prose-ul:list-disc prose-ul:list-inside prose-ul:text-base prose-ul:text-[#616161] prose-ul:space-y-2 prose-ul:mb-6
              prose-strong:font-bold prose-strong:text-[#1A1A1A]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>
    </div>
  )
}
