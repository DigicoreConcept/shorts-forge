import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { api } from '@/lib/api'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/v1/blogs/${slug}`)
        const data = res.data
        if (data.success && data.data) {
          setPost(data.data)
        } else if (data && !data.success && data.title) {
          setPost(data)
        } else {
          // Fallback search in list
          const listRes = await api.get('/v1/blogs/')
          const list = listRes.data.success ? listRes.data.data : listRes.data
          if (Array.isArray(list)) {
            const matched = list.find((p: any) => p.slug === slug)
            if (matched) {
              setPost(matched)
              return
            }
          }
          throw new Error('Not found in list')
        }
      } catch (err) {
        console.warn(`API /v1/blogs/${slug} failed, attempting fallbacks`, err)
        try {
          const res = await api.get(`/blogs/${slug}`)
          const data = res.data
          if (data.success && data.data) {
            setPost(data.data)
          } else if (data) {
            setPost(data)
          } else {
            throw new Error('Fallback failed')
          }
        } catch (fallbackErr) {
          console.error('All blog post API endpoints failed. Falling back to local static posts.', fallbackErr)
          const staticPost = blogPosts.find(p => p.slug === slug)
          setPost(staticPost || null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Excido Blog`
    }
  }, [post])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFEBEE] gap-3">
        <Loader2 size={36} className="text-[#EF5350] animate-spin" />
        <p className="text-sm text-[#616161]">Loading article...</p>
      </div>
    )
  }

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const imgUrl = post.image_url || post.imageUrl
  const videoUrl = post.video_url || post.videoUrl

  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-[#FFEBEE] via-[#FFEBEE]/30 to-white min-h-screen">
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

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFEBEE] text-[#EF5350] border border-[#FFCDD2]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-bebas text-[#1A1A1A] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#616161]">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#EF5350]" />
              <span>{post.publishedAt || post.created_at}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#EF5350]" />
                <span>{post.readTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FFEBEE] flex items-center justify-center font-bold text-[10px] text-[#EF5350] border border-[#FFCDD2]">
                {post.author?.avatar || 'A'}
              </div>
              <span className="font-bold text-[#1A1A1A]">{post.author?.name || 'Admin'}</span>
              {post.author?.role && (
                <span className="text-[10px] text-[#9E9E9E]">({post.author.role})</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content - centered layout block */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 space-y-8">
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

          {/* Bottom Media block (Video if exists, otherwise Image) */}
          {(videoUrl || imgUrl) && (
            <div className="mt-12 pt-8 border-t border-[#FFEBEE]">
              {videoUrl ? (
                <div className="w-full aspect-video overflow-hidden rounded-2xl border border-[#FFCDD2] bg-black shadow-sm">
                  <video 
                    src={videoUrl} 
                    controls 
                    className="w-full h-full object-contain"
                    poster={imgUrl}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video overflow-hidden rounded-2xl border border-[#FFCDD2] bg-gray-50 shadow-sm">
                  <img 
                    src={imgUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
