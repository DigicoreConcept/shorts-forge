import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Film,
  HardDrive,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle,
  Loader,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Clip } from "@/types";
import { VideoThumbnail } from "./ClipsPage";

interface DashboardStats {
  storage_used_bytes: number;
  storage_quota_bytes: number;
  storage_used_percent: number;
  total_videos: number;
  total_clips: number;
  active_jobs: number;
}

export function DashboardHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await api.get('/v1/users/dashboard/overview');
        
        if (!mounted) return;

        if (res.data.success && res.data.data) {
          setStatsData(res.data.data.stats);
          setJobs(res.data.data.recent_jobs || []);
          setClips(res.data.data.recent_clips || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard overview:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    
    // Poll every 20 minutes (20 * 60 * 1000 ms) as specified
    const iv = setInterval(fetchData, 1200000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  const formatStorage = (bytes: number) => {
    if (!bytes) return "0 GB";
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const stats = [
    {
      icon: Upload,
      label: "Total Uploads",
      value: loading || !statsData ? "-" : statsData.total_videos.toString(),
      sub: "Across all projects",
      color: "#EF5350",
    },
    {
      icon: Film,
      label: "Generated Clips",
      value: loading || !statsData ? "-" : statsData.total_clips.toString(),
      sub: "Ready to publish",
      color: "#C62828",
    },
    {
      icon: Zap,
      label: "Active Jobs",
      value: loading || !statsData ? "-" : statsData.active_jobs.toString(),
      sub: "Currently processing",
      color: "#22C55E",
    },
    {
      icon: HardDrive,
      label: "Storage Used",
      value: loading || !statsData ? "-" : formatStorage(statsData.storage_used_bytes),
      sub: loading || !statsData ? "..." : `of ${formatStorage(statsData.storage_quota_bytes)} (${Math.round(statsData.storage_used_percent)}%)`,
      color: "#F59E0B",
    },
  ];

  const getStatusConfig = (job: any) => {
    const status = job.status;
    if (status === 'completed') return { icon: CheckCircle, label: "Completed", color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" };
    if (status === 'failed' || status === 'cancelled') return { icon: AlertCircle, label: status.charAt(0).toUpperCase() + status.slice(1), color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" };
    
    let label = "Processing";
    if (job.current_step) {
      const stepName = job.current_step.replace('_', ' ');
      label = `${stepName.charAt(0).toUpperCase() + stepName.slice(1)} ${job.overall_progress ? `(${job.overall_progress}%)` : ''}`;
    }

    return { icon: Loader, label, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", animate: true };
  };

  const handleJobClick = (job: any) => {
    if (job.status === 'completed') {
      navigate(`/dashboard/clips?job_id=${job.job_id || job.id}`);
    } else {
      navigate(`/dashboard/processing/${job.job_id || job.id}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Good morning, {user?.username?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Here's what's happening with your content today.
          </p>
        </div>
        <Link
          to="/dashboard/upload"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EF5350] text-white text-sm font-semibold hover:bg-[#B71C1C] transition-all shadow-lg shadow-[#EF5350]/20"
        >
          <Upload size={15} /> New Upload
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-[#FFFFFF] border border-[#FFCDD2] border-t-2 border-t-[#EF5350] rounded-lg p-5 hover:border-[#EF9090] hover:border-t-[#EF5350] transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 flex items-center justify-center">
                <s.icon size={18} className="text-[#616161]" />
              </div>
            </div>
            <p className="text-3xl font-bebas text-[#1A1A1A] mb-1 leading-none">
              {s.value}
            </p>
            <p className="text-sm font-semibold text-[#616161]">{s.label}</p>
            <p className="text-xs text-[#9E9E9E] mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Clips */}
      {clips.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1A1A1A]">Recent Clips</h2>
            <Link to="/dashboard/clips" className="flex items-center gap-1 text-xs text-[#EF5350] hover:underline font-medium">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clips.slice(0, 4).map((clip, i) => (
              <motion.div
                key={clip.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#FFCDD2] shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/dashboard/clips/${clip.id}`)}
              >
                <div className="absolute inset-0 z-0">
                  <VideoThumbnail src={clip.playback_url || ''} fallbackColor="#222" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
                    {clip.ai_title || "Generated Clip"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent jobs */}
      <div className="bg-[#FFFFFF] border border-[#FFCDD2] border-t-2 border-t-[#EF5350] rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FFCDD2]">
          <h2 className="font-semibold text-[#1A1A1A]">Recent Jobs</h2>
          <Link
            to="/dashboard/projects"
            className="flex items-center gap-1 text-xs text-[#EF5350] hover:underline"
          >
            View all uploads <ArrowRight size={12} />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#EF5350]/30 border-t-[#EF5350] rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Film size={32} className="text-[#FFCDD2] mx-auto mb-3" />
            <p className="text-[#9E9E9E] text-sm">No recent jobs found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFCDD2]">
                  {["Job ID", "Status", "Clips", "Created", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-[#9E9E9E] font-medium px-6 py-3"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => {
                  const s = getStatusConfig(job);
                  const titleDisplay = `Job ${job.job_id?.slice(0, 8) || job.id?.slice(0, 8)}`;
                  
                  return (
                    <motion.tr
                      key={job.job_id || job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[#FFCDD2]/50 hover:bg-[#FFF0F0] transition-colors cursor-pointer group"
                      onClick={() => handleJobClick(job)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EF5350]/15 flex items-center justify-center flex-shrink-0">
                            <Film size={14} className="text-[#EF5350]" />
                          </div>
                          <span className="text-sm text-[#1A1A1A] truncate max-w-[200px] group-hover:text-[#EF5350] transition-colors font-medium">
                            {titleDisplay}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}
                        >
                          <s.icon
                            size={11}
                            className={s.animate ? "animate-spin" : ""}
                          />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#616161]">
                        {job.clip_count ? `${job.clip_count} clips` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-xs text-[#9E9E9E]">
                          <Clock size={11} /> {new Date(job.created_at || new Date()).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-[#EF5350] font-medium group-hover:underline">
                          {job.status === 'completed' ? "View Clips" : "View Progress"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
