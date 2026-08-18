import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Video as VideoIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Video, Clip } from "@/types";
import { ClipCard } from "@/components/ui/ClipCard";
import { ClipDetailsModal } from "@/components/ui/ClipDetailsModal";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const [video, setVideo] = useState<Video | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDetailClip, setActiveDetailClip] = useState<Clip | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Video metadata
        const videoRes = await api.get(`/v1/videos/${id}`);
        if (videoRes.data.success && videoRes.data.data) {
          setVideo(videoRes.data.data);
        }

        // Fetch specific clips for this video
        const clipsRes = await api.get(`/v1/videos/${id}/clips`);
        if (clipsRes.data.success && clipsRes.data.data?.data) {
          setClips(clipsRes.data.data.data);
        } else if (clipsRes.data.success && clipsRes.data.data) {
          // Fallback in case the response structure is direct array
          setClips(Array.isArray(clipsRes.data.data) ? clipsRes.data.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  // Handle local state updates from the metadata editor modal
  const handleClipUpdate = (updatedClip: Clip) => {
    setClips((prev) => prev.map((c) => (c.id === updatedClip.id ? updatedClip : c)));
    if (activeDetailClip?.id === updatedClip.id) {
      setActiveDetailClip(updatedClip);
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    if (confirm('Are you sure you want to delete this clip?')) {
      try {
        await api.post(`/v1/clips/${clipId}/delete`);
        setClips((prev) => prev.filter((c) => c.id !== clipId));
      } catch (err) {
        console.error('Failed to delete clip:', err);
        // Fallback for mock environments
        setClips((prev) => prev.filter((c) => c.id !== clipId));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Project not found</h2>
        <Link
          to="/dashboard/projects"
          className="text-[#EF5350] hover:underline mt-2 inline-block"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Navigation */}
      <Link
        to="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to uploads
      </Link>

      {/* Hero Header Section (Glassmorphism layout) */}
      <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden shadow-sm">
        {/* Background Pattern Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF5350]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 relative z-10 w-full min-w-0 flex-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-[#FFEBEE] flex items-center justify-center flex-shrink-0 border border-[#FFCDD2]">
            <VideoIcon size={28} className="text-[#EF5350] sm:size-[32px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 
              className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1 leading-tight break-all" 
              title={video.title}
            >
              {(() => {
                const words = video.title.trim().split(/\s+/)
                return words.length > 100 ? words.slice(0, 100).join(' ') + '...' : video.title
              })()}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-[#616161]">
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />
              <span className="capitalize px-2 py-0.5 rounded-md bg-[#EF5350]/10 text-[#EF5350]">
                {video.latest_job?.status || "Processed"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-[#FFF5F5] border border-[#FFCDD2] px-5 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl text-left sm:text-center w-full sm:w-auto md:min-w-[200px] flex sm:flex-col items-center justify-between sm:justify-center gap-2 sm:gap-0">
          <p className="text-2xl sm:text-4xl font-bebas text-[#EF5350] leading-none">
            {clips.length}
          </p>
          <p className="text-[10px] sm:text-xs font-bold text-[#616161] uppercase tracking-wider">
            Clips Generated
          </p>
        </div>
      </div>

      {/* Clips Display Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        {clips.map((clip) => (
          <ClipCard
            key={clip.id}
            clip={clip}
            onPreview={(c) => setActiveDetailClip(c)}
            onDelete={handleDeleteClip}
          />
        ))}
      </div>

      {clips.length === 0 && !loading && (
        <div className="text-center py-20 bg-[#FFFFFF] border border-[#FFCDD2] rounded-3xl">
          <p className="text-[#9E9E9E] font-medium italic">No clips found for this video.</p>
        </div>
      )}

      {/* Reusable Unified Details & Editor Modal */}
      <ClipDetailsModal
        clip={activeDetailClip}
        onClose={() => setActiveDetailClip(null)}
        onUpdate={handleClipUpdate}
      />
    </div>
  );
}
