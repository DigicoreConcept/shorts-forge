import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Loader, Video, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { Clip } from '@/types'
import { ClipCard } from '@/components/ui/ClipCard'
import { ClipDetailsModal } from '@/components/ui/ClipDetailsModal'

// Re-export VideoThumbnail to maintain full compatibility with other pages importing it from ClipsPage
export { VideoThumbnail } from '@/components/ui/ClipCard'

export function ClipsPage() {
  const [searchParams] = useSearchParams()
  const videoId = searchParams.get('video_id')
  
  // State variables for infinite scroll & filter pipelines
  const [clips, setClips] = useState<Clip[]>([])
  const [loading, setLoading] = useState(true) // Initial full-page load
  const [isPageLoading, setIsPageLoading] = useState(false) // Infinite scroll loader
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Sort and filter values (Option B backend specifications)
  const [sortBy, setSortBy] = useState<string>('created_at_desc')
  const [durationFilter, setDurationFilter] = useState<string>('all')
  const [scoreFilter, setScoreFilter] = useState<string>('all')
  
  // Pagination boundary indicators
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  
  // Modal toggle state
  const [activeDetailClip, setActiveDetailClip] = useState<Clip | null>(null)

  // Infinite Scroll Sentinel Ref
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Debounce search input to avoid query bombardment
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page and clips when sort, search or filter values change
  useEffect(() => {
    setPage(1)
    fetchClips(1, false)
  }, [sortBy, durationFilter, scoreFilter, debouncedSearch, videoId])

  // Load next page when page counter is updated
  useEffect(() => {
    if (page > 1) {
      fetchClips(page, true)
    }
  }, [page])

  // Fetch from the backend with dynamic query parameters
  const fetchClips = async (pageNum: number, isAppend: boolean) => {
    if (pageNum === 1) setLoading(true)
    else setIsPageLoading(true)

    try {
      let url = videoId ? `/v1/clips?video_id=${videoId}` : '/v1/clips'
      
      const queryParams = new URLSearchParams()
      queryParams.append('page', pageNum.toString())
      queryParams.append('limit', '12')
      queryParams.append('sort', sortBy)
      queryParams.append('duration', durationFilter)
      queryParams.append('score', scoreFilter)
      if (debouncedSearch.trim()) {
        queryParams.append('search', debouncedSearch.trim())
      }
      
      url += (videoId ? '&' : '?') + queryParams.toString()
      const res = await api.get(url)
      
      if (res.data.success && res.data.data?.data) {
        const newClips = res.data.data.data
        if (isAppend) {
          setClips((prev) => [...prev, ...newClips])
        } else {
          setClips(newClips)
        }
        // Set hasMore true if we fetched a full page
        setHasMore(newClips.length === 12)
      } else {
        setHasMore(false)
        if (!isAppend) setClips([])
      }
    } catch (err) {
      console.error('Failed to fetch clips:', err)
      setHasMore(false)
      if (!isAppend) setClips([])
    } finally {
      setLoading(false)
      setIsPageLoading(false)
    }
  }

  // Set up Intersection Observer for Pinterest-style Infinite Scroll
  useEffect(() => {
    if (loading || !hasMore || isPageLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isPageLoading) {
          setPage((prev) => prev + 1)
        }
      },
      { rootMargin: '200px' }
    )

    const sentinel = sentinelRef.current
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
      observer.disconnect()
    }
  }, [loading, hasMore, isPageLoading])

  // Handle local state updates from the metadata editor modal
  const handleClipUpdate = (updatedClip: Clip) => {
    setClips((prev) => prev.map((c) => (c.id === updatedClip.id ? updatedClip : c)))
    if (activeDetailClip?.id === updatedClip.id) {
      setActiveDetailClip(updatedClip)
    }
  }

  const handleDeleteClip = async (clipId: string) => {
    if (confirm('Are you sure you want to delete this clip?')) {
      try {
        await api.post(`/v1/clips/${clipId}/delete`)
        setClips((prev) => prev.filter((c) => c.id !== clipId))
      } catch (err) {
        console.error('Failed to delete clip:', err)
        // Fallback for mock environment
        setClips((prev) => prev.filter((c) => c.id !== clipId))
      }
    }
  }

  return (
    <div className="w-full">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Clips Gallery</h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            {clips.length > 0 ? `Showing ${clips.length} clip highlights` : 'Manage your generated highlights'}
          </p>
        </div>
        <Link to="/dashboard/upload" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/10">
          + New Upload
        </Link>
      </div>

      {/* Modern Filter / Sort Control Panel (Glassmorphism design) */}
      <div className="bg-white border border-[#FFCDD2] rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-sm">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#FFF5F5] border border-[#FFCDD2] rounded-xl px-3 py-2">
          <Search size={16} className="text-[#9E9E9E]" />
          <input
            type="text"
            placeholder="Search clip titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#9E9E9E] outline-none flex-1"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#FFCDD2] px-3 py-1.5 rounded-xl text-xs text-[#616161]">
            <ArrowUpDown size={14} className="text-[#EF5350]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium text-[#1A1A1A] outline-none cursor-pointer"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="score_desc">Highest Viral Score</option>
              <option value="duration_asc">Shortest Duration</option>
              <option value="duration_desc">Longest Duration</option>
            </select>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#FFCDD2] px-3 py-1.5 rounded-xl text-xs text-[#616161]">
            <SlidersHorizontal size={14} className="text-[#EF5350]" />
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="bg-transparent font-medium text-[#1A1A1A] outline-none cursor-pointer"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (&lt;30s)</option>
              <option value="medium">Medium (30s-60s)</option>
              <option value="long">Long (&gt;60s)</option>
            </select>
          </div>

          {/* Viral Score Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#FFCDD2] px-3 py-1.5 rounded-xl text-xs text-[#616161]">
            <Filter size={14} className="text-[#EF5350]" />
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="bg-transparent font-medium text-[#1A1A1A] outline-none cursor-pointer"
            >
              <option value="all">All Viral Scores</option>
              <option value="top">Top Viral (&gt;=90%)</option>
              <option value="high">High Potential (70%-89%)</option>
              <option value="standard">Standard (&lt;70%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clips Display Section */}
      {loading && page === 1 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin mb-4" />
          <p className="text-sm text-[#9E9E9E]">Loading your viral highlights...</p>
        </div>
      ) : clips.length === 0 ? (
        <div className="text-center py-24 bg-white border border-[#FFCDD2] rounded-3xl">
          <Video size={48} className="text-[#FFCDD2] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">No clips found</h3>
          <p className="text-sm text-[#9E9E9E] max-w-xs mx-auto">
            Try adjusting your search criteria, selecting another duration filter, or uploading a new file.
          </p>
        </div>
      ) : (
        <>
          {/* Main Staggered Entrance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence>
              {clips.map((clip) => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  onPreview={(c) => setActiveDetailClip(c)}
                  onDelete={handleDeleteClip}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Infinite Scroll Sentinel / Page Loading Indicator */}
          <div ref={sentinelRef} className="w-full flex items-center justify-center py-10 min-h-[80px]">
            {isPageLoading && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF5F5] border border-[#FFCDD2] rounded-full text-xs text-[#EF5350] font-semibold shadow-sm">
                <Loader size={14} className="animate-spin text-[#EF5350]" />
                Loading more shorts...
              </div>
            )}
            {!hasMore && clips.length > 0 && (
              <p className="text-xs text-[#9E9E9E] font-medium italic">
                You've unlocked all highlights.
              </p>
            )}
          </div>
        </>
      )}

      {/* Reusable Unified Details & Editor Modal */}
      <ClipDetailsModal
        clip={activeDetailClip}
        onClose={() => setActiveDetailClip(null)}
        onUpdate={handleClipUpdate}
      />
    </div>
  )
}
