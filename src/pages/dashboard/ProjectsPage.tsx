import { useEffect, useState, useRef } from 'react'
import { FolderOpen, Video, ChevronRight, Search, Filter, ArrowUpDown, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Video as VideoType } from '@/types'

export function ProjectsPage() {
  // Option B states for query parameters and pagination
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true) // Initial full page loader
  const [isPageLoading, setIsPageLoading] = useState(false) // Infinite scroll page loader
  
  // Search parameters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Filtering & sorting parameters
  const [sortBy, setSortBy] = useState('created_at_desc')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Pagination counters
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Infinite Scroll Sentinel Ref
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Debounce search query to prevent excessive backend load
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Reset pagination state when filtering or sorting options change
  useEffect(() => {
    setPage(1)
    fetchVideos(1, false)
  }, [sortBy, statusFilter, debouncedSearch])

  // Fetch next page of uploads
  useEffect(() => {
    if (page > 1) {
      fetchVideos(page, true)
    }
  }, [page])

  const fetchVideos = async (pageNum: number, isAppend: boolean) => {
    if (pageNum === 1) setLoading(true)
    else setIsPageLoading(true)

    try {
      const queryParams = new URLSearchParams()
      queryParams.append('page', pageNum.toString())
      queryParams.append('limit', '12')
      queryParams.append('sort', sortBy)
      queryParams.append('status', statusFilter)
      if (debouncedSearch.trim()) {
        queryParams.append('search', debouncedSearch.trim())
      }

      const res = await api.get(`/v1/videos?${queryParams.toString()}`)
      
      if (res.data.success && res.data.data?.data) {
        const newVideos = res.data.data.data
        if (isAppend) {
          setVideos((prev) => [...prev, ...newVideos])
        } else {
          setVideos(newVideos)
        }
        setHasMore(newVideos.length === 12)
      } else {
        setHasMore(false)
        if (!isAppend) setVideos([])
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err)
      setHasMore(false)
      if (!isAppend) setVideos([])
    } finally {
      setLoading(false)
      setIsPageLoading(false)
    }
  }

  // Set up Intersection Observer for progressive infinite scrolling
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

  return (
    <div>
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Uploads</h1>
          <p className="text-sm text-[#9E9E9E] mt-1">Manage your source videos and generated clips.</p>
        </div>
        <Link to="/dashboard/upload" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow-lg shadow-[#EF5350]/10">
          + New Upload
        </Link>
      </div>

      {/* Control Filters (Glassmorphic look) */}
      <div className="bg-white border border-[#FFCDD2] rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-sm">
        
        {/* Search Field */}
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-[#FFF5F5] border border-[#FFCDD2] rounded-xl px-3 py-2">
          <Search size={16} className="text-[#9E9E9E]" />
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#9E9E9E] outline-none flex-1"
          />
        </div>

        {/* Sort & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-white border border-[#FFCDD2] px-3 py-1.5 rounded-xl text-xs text-[#616161]">
            <ArrowUpDown size={14} className="text-[#EF5350]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium text-[#1A1A1A] outline-none cursor-pointer"
            >
              <option value="created_at_desc">Newest Upload</option>
              <option value="created_at_asc">Oldest Upload</option>
              <option value="clips_count_desc">Most Clips</option>
              <option value="duration_desc">Longest Video</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-[#FFCDD2] px-3 py-1.5 rounded-xl text-xs text-[#616161]">
            <Filter size={14} className="text-[#EF5350]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-[#1A1A1A] outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="no_jobs">No Jobs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading && page === 1 ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#FFCDD2] rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-[#EF5350]/10 flex items-center justify-center mb-4 border border-[#FFCDD2]">
            <FolderOpen size={28} className="text-[#EF5350]" />
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">No uploads match search</h2>
          <p className="text-sm text-[#9E9E9E] mb-6 max-w-xs">
            Try adjusting your search keywords, active status filter, or drop a new video upload.
          </p>
          <Link to="/dashboard/upload" className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors shadow">
            New Upload
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/dashboard/projects/${video.id}`}
                className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 hover:border-[#EF9090] hover:shadow-md transition-all group block relative overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFEBEE] flex items-center justify-center flex-shrink-0 border border-[#FFCDD2]">
                    <Video size={20} className="text-[#EF5350]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#1A1A1A] truncate group-hover:text-[#EF5350] transition-colors">{video.title}</h3>
                    <p className="text-xs text-[#9E9E9E] mt-1">{new Date(video.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#FFEBEE]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {video.latest_job?.status === 'completed' ? (
                      <span className="px-2.5 py-0.5 bg-[#22C55E]/10 text-[#22C55E] rounded-md">Completed</span>
                    ) : video.latest_job?.status === 'failed' ? (
                      <span className="px-2.5 py-0.5 bg-[#EF4444]/10 text-[#EF4444] rounded-md">Failed</span>
                    ) : video.latest_job?.status ? (
                      <span className="px-2.5 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-md flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                        Processing
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-[#9E9E9E]/10 text-[#616161] rounded-md">No Jobs</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#616161]">
                    <span>{video.total_clips} clips</span>
                    <ChevronRight size={14} className="text-[#FFCDD2] group-hover:text-[#EF5350] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sentinel Element for Infinite Scroll */}
          <div ref={sentinelRef} className="w-full flex items-center justify-center py-10 min-h-[80px]">
            {isPageLoading && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF5F5] border border-[#FFCDD2] rounded-full text-xs text-[#EF5350] font-semibold shadow-sm">
                <Loader size={14} className="animate-spin text-[#EF5350]" />
                Loading more videos...
              </div>
            )}
            {!hasMore && videos.length > 0 && (
              <p className="text-xs text-[#9E9E9E] font-medium italic">
                You've unlocked all upload projects.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
