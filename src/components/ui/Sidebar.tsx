import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FolderOpen, Film, Upload, Radio,
  CreditCard, Settings, HelpCircle, Zap, LogOut, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', to: '/dashboard/projects' },
  { icon: Film, label: 'Clips', to: '/dashboard/clips' },
  { icon: Upload, label: 'Uploads', to: '/dashboard/upload' },
]

const bottomItems = [
  { icon: CreditCard, label: 'Billing', to: '/dashboard/billing' },
  { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Support', to: '#' },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 h-screen flex flex-col bg-[#1A1A1A] border-r border-[#1A1A1A] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#EF5350] flex items-center justify-center shadow-lg shadow-[#EF5350]/20">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <span className="font-bebas text-xl text-white tracking-widest mt-1">ReelCut</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 overflow-y-auto space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-6 py-2.5 text-sm transition-all group border-l-2',
                isActive
                  ? 'border-[#EF5350] bg-[#222222] text-white font-medium'
                  : 'border-transparent text-[#9E9E9E] hover:text-white hover:bg-[#222222]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? 'text-[#EF5350]' : 'text-[#616161] group-hover:text-white transition-colors'} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="py-4 border-t border-[#333333] space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-6 py-2.5 text-sm transition-all border-l-2',
                isActive 
                  ? 'border-[#EF5350] bg-[#222222] text-white font-medium' 
                  : 'border-transparent text-[#9E9E9E] hover:text-white hover:bg-[#222222]'
              )
            }
          >
            <item.icon size={18} className="text-[#616161]" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* User */}
        <div className="mt-4 pt-4 px-4 border-t border-[#333333]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#222222] transition-colors cursor-pointer" onClick={() => navigate('/dashboard/settings')}>
            <div className="w-8 h-8 rounded bg-[#EF5350]/20 flex items-center justify-center text-xs font-semibold text-[#EF5350] flex-shrink-0">
              {user?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name ?? 'User'}</p>
              <p className="text-xs text-[#9E9E9E] capitalize">{user?.subscription_plan ?? 'FREE'} plan</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Logout" className="text-[#616161] hover:text-[#EF5350] transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
