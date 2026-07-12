import { Smartphone, Monitor, Square } from 'lucide-react'

export type InputMode = 'file' | 'url'
export type ClipDuration = 30 | 60 | 90 | 'custom'
export type ClipDimension = '16:9' | '9:16' | '1:1'
export type ClipEffect = 'glassmorphism' | 'fit' | 'blurred_background'

export interface TimeRange {
  id: string
  start: string
  end: string
}

export interface LayoutOption {
  id: string
  name: string
  imagePath: string
  supportedRatios: ('9:16' | '16:9' | '1:1')[]
}

export interface SubtitleStyleOption {
  id: string
  name: string
  imagePath: string
  supportsHighlight: boolean
}

export interface SubtitlePositionOption {
  id: string
  label: string
  disabled: boolean
}

export const LANGUAGES = [
  'Auto-detect',
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Arabic',
  'Chinese',
  'Japanese',
  'Hindi'
]

export const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: 'glassmorphism', name: 'Glassmorphism', imagePath: '/images/layouts/glassmorphism.png', supportedRatios: ['9:16', '16:9', '1:1'] },
  { id: 'fit', name: 'Fit Screen', imagePath: '/images/layouts/fit.png', supportedRatios: ['9:16', '16:9', '1:1'] },
  { id: 'stretched', name: 'Stretched', imagePath: '/images/layouts/stretched.png', supportedRatios: ['9:16'] },
  { id: 'elongated', name: 'Elongated', imagePath: '/images/layouts/elongated.png', supportedRatios: ['9:16'] },
  { id: 'stacked', name: 'Stacked', imagePath: '/images/layouts/stacked.png', supportedRatios: ['9:16'] }
]

export const SUBTITLE_STYLES: SubtitleStyleOption[] = [
  { id: 'standard', name: 'Standard Captions', imagePath: '/images/subtitles/standard.png', supportsHighlight: false },
  { id: 'bold_highlight', name: 'Bold Highlight', imagePath: '/images/subtitles/bold_highlight.png', supportsHighlight: true },
  { id: 'neon_glow', name: 'Neon Glow', imagePath: '/images/subtitles/neon_glow.png', supportsHighlight: true }
]

export const SUBTITLE_COLORS = [
  { name: 'Purple', value: '#8B5CF6', bg: 'bg-[#8B5CF6]' },
  { name: 'Yellow', value: '#FBBF24', bg: 'bg-[#FBBF24]' },
  { name: 'Red', value: '#EF4444', bg: 'bg-[#EF4444]' },
  { name: 'Green', value: '#22C55E', bg: 'bg-[#22C55E]' },
  { name: 'Blue', value: '#3B82F6', bg: 'bg-[#3B82F6]' }
]

export const SUBTITLE_POSITIONS: SubtitlePositionOption[] = [
  { id: 'top-left', label: 'Top Left', disabled: true },
  { id: 'top-centre', label: 'Top Centre', disabled: true },
  { id: 'top-right', label: 'Top Right', disabled: true },
  { id: 'mid-left', label: 'Mid Left', disabled: true },
  { id: 'mid-centre', label: 'Mid Centre', disabled: true },
  { id: 'mid-right', label: 'Mid Right', disabled: true },
  { id: 'bot-left', label: 'Bot Left', disabled: true },
  { id: 'bot-centre', label: 'Bot Centre', disabled: false },
  { id: 'bot-right', label: 'Bot Right', disabled: true }
]
