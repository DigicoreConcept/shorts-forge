import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScrollToTop } from '@/components/ScrollToTop'

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

// Public pages
import { Homepage } from '@/pages/public/Homepage'
import { Features } from '@/pages/public/Features'
import { Pricing } from '@/pages/public/Pricing'
import { About } from '@/pages/public/About'

// Auth pages
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { ForgotPassword } from '@/pages/auth/ForgotPassword'
import { VerifyAccount } from '@/pages/auth/VerifyAccount'

// Dashboard pages
import { DashboardHome } from '@/pages/dashboard/DashboardHome'
import { UploadPage } from '@/pages/dashboard/UploadPage'
import { ProcessingPage } from '@/pages/dashboard/ProcessingPage'
import { ClipsPage } from '@/pages/dashboard/ClipsPage'
import { ClipDetail } from '@/pages/dashboard/ClipDetail'
import { ProjectsPage } from '@/pages/dashboard/ProjectsPage'
import { ChannelsPage } from '@/pages/dashboard/ChannelsPage'
import { BillingPage } from '@/pages/dashboard/BillingPage'
import { SettingsPage } from '@/pages/dashboard/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
          </Route>

          {/* Processing — full screen, no layout chrome */}
          <Route path="/dashboard/processing/:jobId" element={<ProcessingPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="clips" element={<ClipsPage />} />
            <Route path="clips/:id" element={<ClipDetail />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="channels" element={<ChannelsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
