import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { motion } from 'framer-motion'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#FFEBEE] flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 pt-0"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
