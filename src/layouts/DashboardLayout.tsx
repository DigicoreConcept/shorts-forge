import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/ui/Sidebar";
import { Topbar } from "@/components/ui/Topbar";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex overflow-x-hidden w-full relative">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-60 flex flex-col min-h-screen transition-all min-w-0 w-full overflow-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 pt-16 p-4 md:p-8 mt-6 md:mt-12 w-full min-w-0 overflow-y-auto overflow-x-hidden"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
