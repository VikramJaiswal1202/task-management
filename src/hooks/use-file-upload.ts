'use client'

import { useMutation } from '@tanstack/react-query'
import { storageService } from '@/services/storage.service'
import { toast } from 'sonner'

export function useFileUpload() {
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: string }) => {
      const validationError = storageService.validateFile(file)
      if (validationError) throw new Error(validationError)
      return storageService.uploadFile(file, userId)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload file')
    },
  })
}