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
import { Video } from "@/types";

export function DashboardHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // We fetch videos to populate stats and potentially map video names to jobs if possible
  const [videos, setVideos] = useState<Video[]>([]);
  // We fetch jobs to populate the recent jobs table
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [videosRes, jobsRes] = await Promise.all([
          api.get('/v2/videos'),
          api.get('/v2/jobs')
        ]);
        
        if (!mounted) return;

        if (videosRes.data.success && videosRes.data.data?.data) {
          setVideos(videosRes.data.data.data);
        }
        
        if (jobsRes.data.success && jobsRes.data.data?.data) {
          setJobs(jobsRes.data.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    
    // Poll every 5s to keep dashboard jobs table live
    const iv = setInterval(fetchData, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  // Calculate some temporary dynamic stats until /v2/users/stats exists
  const totalUploads = videos.length;
  const totalClips = videos.reduce((acc, v) => acc + (v.total_clips || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'running' || j.status === 'queued' || j.status === 'uploading' || j.status === 'downloading' || j.status === 'transcribing' || j.status === 'generating_clips' || j.status === 'generating_metadata').length;

  const stats = [
    {
      icon: Upload,
      label: "Total Uploads",
      value: loading ? "-" : totalUploads.toString(),
      sub: "Across all projects",
      color: "#EF5350",
    },
    {
      icon: Film,
      label: "Generated Clips",
      value: loading ? "-" : totalClips.toString(),
      sub: "Ready to publish",
      color: "#C62828",
    },
    {
      icon: Zap,
      label: "Active Jobs",
      value: loading ? "-" : activeJobs.toString(),
      sub: "Currently processing",
      color: "#22C55E",
    },
    {
      icon: HardDrive,
      label: "Storage Used",
      value: "N/A",
      sub: "Pending API",
      color: "#F59E0B",
    },
  ];

  const getStatusConfig = (status: string) => {
    if (status === 'completed') return { icon: CheckCircle, label: "Completed", color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" };
    if (status === 'failed' || status === 'cancelled') return { icon: AlertCircle, label: status.charAt(0).toUpperCase() + status.slice(1), color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" };
    return { icon: Loader, label: "Processing", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", animate: true };
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
                  {["Job ID / Video", "Status", "Clips", "Created", "Action"].map(
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
                {jobs.slice(0, 8).map((job, i) => {
                  const s = getStatusConfig(job.status);
                  // Find the corresponding video title if possible
                  const parentVideo = videos.find(v => v.id === job.video_id);
                  const titleDisplay = parentVideo ? parentVideo.title : `Job ${job.job_id?.slice(0, 8) || job.id?.slice(0, 8)}`;
                  
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
                          <span className="text-sm text-[#1A1A1A] truncate max-w-[200px] group-hover:text-[#EF5350] transition-colors">
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
                          {job.status === "completed" ? "View Clips" : "View Progress"}
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
