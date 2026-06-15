import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/ui/Sidebar";
import { Topbar } from "@/components/ui/Topbar";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Topbar />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 pt-16 p-8 overflow-auto mt-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
