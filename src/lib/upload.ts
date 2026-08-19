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

// A chunk-level retry helper with exponential backoff
async function uploadChunkWithRetry(
  formData: FormData,
  retries = 3,
  delay = 1000
): Promise<any> {
  try {
    const res = await api.post<ApiResponse>('/v1/media/upload/chunk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (!res.data.success) {
      throw new Error(res.data.message || 'Chunk upload returned failure')
    }
    return res
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return uploadChunkWithRetry(formData, retries - 1, delay * 2)
    }
    throw error
  }
}

export async function uploadVideoChunks(
  file: File,
  onProgress: (percent: number) => void,
  options?: {
    uploadId?: string
    concurrency?: number
    onPause?: () => void
    onResume?: () => void
    onChunkUploaded?: (chunkIndex: number, uploadId: string) => void
  }
): Promise<{ videoId: string; uploadId: string }> {
  const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB fixed
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const concurrency = options?.concurrency ?? 4
  let uploadId = options?.uploadId
  const uploadedSet = new Set<number>()

  // 1. Verify status with server if we have a session cached
  if (uploadId) {
    try {
      const statusRes = await api.get<ApiResponse<{
        upload_id: string
        completed: boolean
        video_id?: string
        uploaded_chunks: number[]
      }>>(`/v1/media/upload/status?upload_id=${uploadId}`)

      if (statusRes.data.success && statusRes.data.data) {
        const statusData = statusRes.data.data
        if (statusData.completed && statusData.video_id) {
          // Already fully completed. Bypass upload entirely.
          onProgress(100)
          return {
            videoId: statusData.video_id,
            uploadId: uploadId,
          }
        }

        const uploaded = statusData.uploaded_chunks || []
        uploaded.forEach((idx) => uploadedSet.add(idx))
      } else {
        // success is false -> force new session init
        uploadId = undefined
      }
    } catch (error) {
      // Request failed or expired -> force new session init
      uploadId = undefined
    }
  }

  // 2. Initialize upload session if not resuming or status check reset it
  if (!uploadId) {
    const initRes = await api.post<ApiResponse<UploadInitResponse>>('/v1/media/upload/init', {
      filename: file.name,
      file_size: file.size,
      total_chunks: totalChunks,
      mime_type: file.type || 'video/mp4',
    })

    if (!initRes.data.success || !initRes.data.data) {
      throw new Error(initRes.data.message || 'Failed to initialize upload')
    }
    uploadId = initRes.data.data.upload_id
    uploadedSet.clear()
  }

  // 3. Queue-based Concurrent Worker Pool Upload (Concurrency = 4)
  let nextIndex = 0
  let completedCount = uploadedSet.size

  if (completedCount > 0) {
    onProgress(Math.round((completedCount / totalChunks) * 100))
  }

  async function uploadOneChunk(index: number) {
    // Check if network is offline in real-time
    if (!window.navigator.onLine) {
      if (options?.onPause) options.onPause()
      while (!window.navigator.onLine) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      if (options?.onResume) options.onResume()
    }

    const start = index * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunkBlob = file.slice(start, end) // Lazy slice right when worker needs it

    const formData = new FormData()
    formData.append('upload_id', uploadId!)
    formData.append('chunk_index', index.toString())
    formData.append('chunk', chunkBlob, file.name)

    // Execute chunk upload using retry helper
    await uploadChunkWithRetry(formData)

    // Callback on chunk completion (for caching session state)
    if (options?.onChunkUploaded) {
      options.onChunkUploaded(index, uploadId!)
    }

    completedCount++
    const percent = Math.round((completedCount / totalChunks) * 100)
    onProgress(percent)
  }

  async function worker() {
    while (nextIndex < totalChunks) {
      const currentIndex = nextIndex++
      if (uploadedSet.has(currentIndex)) {
        continue
      }
      await uploadOneChunk(currentIndex)
    }
  }

  // Launch worker pool with concurrency cap
  const workerCount = Math.min(concurrency, Math.max(1, totalChunks - uploadedSet.size))
  const workers = Array.from({ length: workerCount }, () => worker())
  await Promise.all(workers)

  // 4. Complete Upload
  const completeForm = new FormData()
  completeForm.append('upload_id', uploadId!)

  const completeRes = await api.post<ApiResponse<UploadCompleteResponse>>('/v1/media/upload/complete', completeForm)

  if (!completeRes.data.success || !completeRes.data.data) {
    throw new Error('Failed to complete upload')
  }

  return {
    videoId: completeRes.data.data.video_id,
    uploadId: uploadId!,
  }
}
