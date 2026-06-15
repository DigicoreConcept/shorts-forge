import { Bell } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router-dom";

export function Topbar() {
  const { user } = useAuthStore();
  const location = useLocation();

  // Quick hack for breadcrumb title based on path
  const path = location.pathname.split("/").pop() || "dashboard";
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <header className="h-16 fixed top-0 left-60 right-0 z-30 flex items-center justify-between px-8 border-b border-[#FFCDD2] bg-[#FFF5F5]/90 backdrop-blur-xl">
      <div className="flex items-center">
        <h1 className="font-bebas text-2xl text-[#1A1A1A] tracking-wider">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#FFCDD2] flex items-center justify-center text-[#9E9E9E] hover:text-[#616161] hover:border-[#EF9090] transition-colors">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF5350] border-2 border-[#FFFFFF]" />
        </button>

        <div className="w-9 h-9 rounded-full bg-[#EF5350]/20 flex items-center justify-center text-sm font-semibold text-[#EF5350] border border-[#EF5350]/30 cursor-pointer hover:bg-[#EF5350]/30 transition-colors">
          {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}
