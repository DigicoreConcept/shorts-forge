import { api, ApiResponse } from './api'

interface UploadInitResponse {
  upload_id: string
  total_chunks: number
}

interface UploadCompleteResponse {
  video_id: string
  filename: string
  file_size: number
}

export async function uploadVideoChunks(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  
  // 1. Init Upload
  const initRes = await api.post<ApiResponse<UploadInitResponse>>('/v2/media/upload/init', {
    filename: file.name,
    file_size: file.size,
    total_chunks: totalChunks,
    mime_type: file.type || 'video/mp4'
  })
  
  if (!initRes.data.success || !initRes.data.data) {
    throw new Error(initRes.data.message || 'Failed to initialize upload')
  }
  
  const uploadId = initRes.data.data.upload_id

  // 2. Upload Chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)
    
    const formData = new FormData()
    formData.append('upload_id', uploadId)
    formData.append('chunk_index', i.toString())
    // FormData needs a Blob, which file.slice returns
    formData.append('chunk', chunk, file.name)

    const chunkRes = await api.post<ApiResponse>('/v2/media/upload/chunk', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    })

    if (!chunkRes.data.success) {
      throw new Error(`Failed to upload chunk ${i}`)
    }

    // Update progress
    const percent = Math.round(((i + 1) / totalChunks) * 100)
    onProgress(percent)
  }

  // 3. Complete Upload
  const completeForm = new FormData()
  completeForm.append('upload_id', uploadId)
  
  const completeRes = await api.post<ApiResponse<UploadCompleteResponse>>('/v2/media/upload/complete', completeForm)

  if (!completeRes.data.success || !completeRes.data.data) {
    throw new Error('Failed to complete upload')
  }

  return completeRes.data.data.video_id
}
