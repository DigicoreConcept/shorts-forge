export type Plan = 'free' | 'starter' | 'creator' | 'agency'
export type JobStatus = 'queued' | 'running' | 'completed' | 'cancelled' | 'failed'
export type JobStep = 'uploading' | 'downloading' | 'transcribing' | 'generating_clips' | 'generating_metadata' | 'completed'
export type ClipStatus = 'processing' | 'ready' | 'failed'

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: string
  is_verified: boolean
  subscription_plan: string
  
  // Optional frontend-only properties for backwards compatibility during migration
  name?: string
  avatar?: string
  plan?: Plan
  createdAt?: string
}

export interface JobSummary {
  job_id: string
  status: JobStatus | string
  overall_progress: number
  clip_count: number
  created_at: string
}

export interface Video {
  id: string
  title: string
  source_type: string
  source_url?: string | null
  original_filename?: string | null
  mime_type?: string | null
  duration_seconds?: number | null
  file_size_bytes: number
  language: string
  thumbnail_url?: string | null
  playback_url?: string | null
  total_clips: number
  total_jobs: number
  latest_job?: JobSummary | null
  created_at: string
  updated_at?: string | null
}

export interface Clip {
  id: string
  job_id: string
  video_id: string
  status: ClipStatus | string
  clip_index: number
  start_time: number
  end_time: number
  duration_seconds?: number | null
  file_size_bytes: number
  ai_title?: string | null
  ai_description?: string | null
  ai_tags?: string[] | null
  score?: number | null
  playback_url?: string | null
  thumbnail_url?: string | null
  created_at: string
}

export interface Channel {
  id: string
  userId: string
  platform: 'youtube' | 'tiktok' | 'instagram'
  channelName: string
  connected: boolean
  accessToken?: string
}

export interface Subscription {
  id: string
  userId: string
  plan: Plan
  status: 'active' | 'cancelled' | 'past_due'
  renewalDate: string
  uploadsUsed: number
  uploadsLimit: number
  clipsUsed: number
  clipsLimit: number
  storageUsed: number
  storageLimit: number
}

export const PLAN_LIMITS: Record<Plan, { uploads: number; clips: number; storage: number; price: number }> = {
  free: { uploads: 2, clips: 10, storage: 1, price: 0 },
  starter: { uploads: 10, clips: 100, storage: 10, price: 19 },
  creator: { uploads: 50, clips: 500, storage: 50, price: 49 },
  agency: { uploads: 999, clips: 9999, storage: 500, price: 149 },
}
