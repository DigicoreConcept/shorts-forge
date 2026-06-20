import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Edit2,
  Download,
  Video as VideoIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { Video, Clip } from "@/types";
import { VideoThumbnail } from "./ClipsPage";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const [video, setVideo] = useState<Video | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewClip, setPreviewClip] = useState<Clip | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Video metadata
        const videoRes = await api.get(`/v2/videos/${id}`);
        if (videoRes.data.success && videoRes.data.data) {
          setVideo(videoRes.data.data);
        }

        // Fetch specific clips for this video
        const clipsRes = await api.get(`/v2/videos/${id}/clips`);
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

  const getFallbackColor = (id: string | number) => {
    const strId = String(id || "");
    const colors = ["#EF5350", "#C62828", "#22C55E", "#F59E0B"];
    let sum = 0;
    for (let i = 0; i < strId.length; i++) sum += strId.charCodeAt(i);
    return `${colors[sum % colors.length]}15`;
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

      {/* Hero Section */}
      <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF5350]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-[#FFEBEE] flex items-center justify-center flex-shrink-0">
            <VideoIcon size={32} className="text-[#EF5350]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
              {video.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-[#616161]">
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />
              <span className="capitalize">{video.status || "Processed"}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-[#FFF5F5] border border-[#FFCDD2] px-8 py-6 rounded-2xl text-center md:min-w-[200px]">
          <p className="text-4xl font-bebas text-[#EF5350] mb-1">
            {clips.length}
          </p>
          <p className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">
            Clips Generated
          </p>
        </div>
      </div>

      {/* Clips Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {clips.map((clip) => (
          <motion.div
            key={clip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl overflow-hidden hover:border-[#EF9090] transition-all flex flex-col h-full"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] max-h-64 bg-[#1A1A1A] overflow-hidden">
              <VideoThumbnail
                src={clip.playback_url || ""}
                fallbackColor={getFallbackColor(clip.id)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => setPreviewClip(clip)}
                  className="w-12 h-12 rounded-full bg-[#EF5350] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#EF5350]/30"
                >
                  <Play size={20} className="ml-1" />
                </button>
              </div>

              {clip.viral_score && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#1A1A1A]/80 text-[#EF5350] text-xs font-bold font-bebas tracking-wide backdrop-blur-md">
                  SCORE: {clip.viral_score}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-[#1A1A1A] text-sm mb-2 line-clamp-2">
                {`Clip #${String(clip.clip_index).padStart(3, "0")}`}
              </h3>

              <p className="text-xs text-[#616161] line-clamp-3 mb-4 flex-1">
                {clip.ai_title || "No caption generated."}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#FFEBEE]">
                <Link
                  to={`/dashboard/clips/${clip.id}`}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#FFF5F5] text-[#EF5350] text-xs font-semibold hover:bg-[#FFEBEE] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 size={14} /> Edit
                </Link>
                <button className="flex-1 px-3 py-2 rounded-lg border border-[#FFCDD2] text-[#616161] text-xs font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors flex items-center justify-center gap-1.5">
                  <Download size={14} /> Save
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {clips.length === 0 && !loading && (
        <div className="text-center py-20 bg-[#FFFFFF] border border-[#FFCDD2] rounded-3xl">
          <p className="text-[#9E9E9E]">No clips found for this project.</p>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/90 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] rounded-3xl overflow-hidden max-w-4xl w-full max-h-[95vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl">
            <div className="w-full md:w-[400px] bg-black relative flex-shrink-0">
              <video
                src={previewClip.playback_url}
                controls
                autoPlay
                className="w-full h-[400px] md:h-[600px] object-contain"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-xl text-[#1A1A1A]">
                  {previewClip.ai_title || "Untitled"}
                </h3>
                <button
                  onClick={() => setPreviewClip(null)}
                  className="text-[#9E9E9E] hover:text-[#1A1A1A] transition-colors p-2"
                >
                  Close
                </button>
              </div>

              <div className="bg-[#FFEBEE] p-4 rounded-xl mb-6">
                <p className="text-sm font-semibold text-[#EF5350] mb-2 uppercase tracking-wider font-bebas">
                  AI Caption
                </p>
                <p className="text-sm text-[#616161] leading-relaxed whitespace-pre-wrap">
                  {previewClip.ai_caption}
                </p>
              </div>

              <div className="mt-auto flex gap-3">
                <Link
                  to={`/dashboard/clips/${previewClip.id}`}
                  className="flex-1 py-3 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} /> Open in Editor
                </Link>
                <button className="flex-1 py-3 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#C62828] transition-colors flex items-center justify-center gap-2">
                  <Download size={16} /> Download MP4
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
