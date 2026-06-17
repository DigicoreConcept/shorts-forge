import { useEffect, useState } from 'react'
import { FolderOpen, Video, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { Video as VideoType } from '@/types'

export function ProjectsPage() {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/v2/videos')
        if (res.data.success && res.data.data?.data) {
          setVideos(res.data.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch videos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Uploads</h1>
          <p className="text-sm text-[#9E9E9E] mt-1">Manage your source videos and generated clips.</p>
        </div>
        <Link to="/dashboard/upload" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors">
          + New Upload
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EF5350]/10 flex items-center justify-center mb-4">
            <FolderOpen size={28} className="text-[#EF5350]" />
          </div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">No uploads yet</h2>
          <p className="text-sm text-[#9E9E9E] mb-6 max-w-xs">Upload a video to generate your first batch of clips.</p>
          <Link to="/dashboard/upload" className="px-5 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors">
            Start with an Upload
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/dashboard/projects/${video.id}`}
              className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-5 hover:border-[#EF9090] transition-all group block"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFEBEE] flex items-center justify-center flex-shrink-0">
                  <Video size={20} className="text-[#EF5350]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#1A1A1A] truncate">{video.title}</h3>
                  <p className="text-xs text-[#9E9E9E] mt-1">{new Date(video.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#FFEBEE]">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {video.latest_job?.status === 'completed' ? (
                    <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-md">Completed</span>
                  ) : video.latest_job?.status === 'failed' ? (
                    <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] rounded-md">Failed</span>
                  ) : video.latest_job?.status ? (
                    <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] rounded-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                      Processing
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-[#9E9E9E]/10 text-[#616161] rounded-md">No Jobs</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#616161]">
                  <span>{video.total_clips} clips</span>
                  <ChevronRight size={14} className="text-[#FFCDD2] group-hover:text-[#EF5350] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
