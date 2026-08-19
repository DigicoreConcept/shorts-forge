import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Save,
  Copy,
  Check,
  Plus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Clip } from "@/types";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

export function ClipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clip, setClip] = useState<Clip | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [newTag, setNewTag] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!clip) return;
    setDownloading(true);
    try {
      const res = await api.get(`/v1/clips/${clip.id}/download`);
      if (res.data?.success && (res.data?.data?.download_url || res.data?.data?.url)) {
        window.open(res.data.data.download_url || res.data.data.url, "_blank");
        return;
      }
    } catch (err) {
      console.error("Failed to fetch clip download URL:", err);
    } finally {
      setDownloading(false);
    }
    if (clip.playback_url) {
      window.open(clip.playback_url, "_blank");
    }
  };

  useEffect(() => {
    const fetchClip = async () => {
      try {
        const res = await api.get(`/v1/clips/${id}`);
        if (res.data.success && res.data.data) {
          const c = res.data.data;
          setClip(c);
          setTitle(c.ai_title || "");
          setDescription(c.ai_description || "");
          setTags(c.ai_tags || []);
        }
      } catch (err) {
        console.error("Failed to fetch clip:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClip();
  }, [id]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async () => {
    // Endpoints for saving are pending. Mock it for now.
    setSaved(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaved(false);
    alert("Saving functionality is pending backend API implementation.");
  };

  const addTag = () => {
    const t = newTag.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setNewTag("");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin" />
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="text-center py-20">
        <p className="text-[#9E9E9E]">Clip not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[#EF5350] hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#9E9E9E] hover:text-[#616161] transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back to Clips
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="lg:col-span-1">
          <div className="aspect-[9/16] w-full max-h-[50vh] lg:max-h-[80vh] bg-black border border-[#FFCDD2] rounded-2xl overflow-hidden sticky top-24 shadow-sm flex items-center justify-center">
            {clip.playback_url ? (
              <VideoPlayer
                src={clip.playback_url}
                poster={clip.thumbnail_url || undefined}
                objectFit="contain"
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-xs text-[#9E9E9E] mb-2">
                  Video playback unavailable
                </p>
              </div>
            )}

            <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white">
              {Math.round(clip.duration_seconds || 0)}s
            </div>
            {clip.score !== null && clip.score !== undefined && (
              <div
                className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
                style={{
                  background: clip.score >= 90 ? "#22C55E90" : "#EF535090",
                  color: "#FFF",
                }}
              >
                {Math.round(clip.score)}% Score
              </div>
            )}
          </div>
        </div>

        {/* Metadata editor */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#FFFFFF] border border-[#FFCDD2] rounded-2xl p-4 sm:p-6 w-full shadow-sm">
            <h1 className="text-lg font-bold text-[#1A1A1A] mb-5">
              Edit Metadata
            </h1>

            {/* Title */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#616161] font-medium">
                  Title
                </label>
                <button
                  onClick={() => copy(title, "title")}
                  className="flex items-center gap-1 text-[10px] text-[#9E9E9E] hover:text-[#EF5350] transition-colors"
                >
                  {copied === "title" ? (
                    <Check size={10} className="text-[#22C55E]" />
                  ) : (
                    <Copy size={10} />
                  )}
                  {copied === "title" ? "Copied!" : "Copy"}
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#616161] font-medium">
                  Description
                </label>
                <button
                  onClick={() => copy(description, "desc")}
                  className="flex items-center gap-1 text-[10px] text-[#9E9E9E] hover:text-[#EF5350] transition-colors"
                >
                  {copied === "desc" ? (
                    <Check size={10} className="text-[#22C55E]" />
                  ) : (
                    <Copy size={10} />
                  )}
                  {copied === "desc" ? "Copied!" : "Copy"}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2] text-[#1A1A1A] text-sm outline-none focus:border-[#EF5350] transition-colors resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-xs text-[#616161] font-medium mb-1.5">
                Tags / Hashtags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EF5350]/15 border border-[#EF5350]/30 text-xs text-[#EF5350] font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => setTags((t) => t.filter((x) => x !== tag))}
                      className="text-[#9E9E9E] hover:text-[#EF4444] ml-0.5"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#FFF5F5] border border-[#FFCDD2] text-[#1A1A1A] text-xs outline-none focus:border-[#EF5350] transition-colors"
                />
                <button
                  onClick={addTag}
                  className="p-1.5 rounded-lg bg-[#EF5350] text-white hover:bg-[#B71C1C] transition-colors flex-shrink-0"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                onClick={handleSave}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-colors disabled:opacity-50 min-h-[42px]"
              >
                {saved ? <Check size={15} /> : <Save size={15} />}
                {saved ? "Saved!" : "Save Changes"}
              </motion.button>
              <button
                disabled
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#FFCDD2] text-sm text-[#9E9E9E] hover:text-[#616161] hover:border-[#EF9090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px]"
                title="Not available yet"
              >
                <RefreshCw size={14} /> Regenerate
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E] hover:bg-[#22C55E]/20 transition-colors disabled:opacity-50 min-h-[42px]"
                disabled={downloading || !clip.playback_url}
              >
                <Download size={14} /> {downloading ? "Downloading..." : "Download"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
