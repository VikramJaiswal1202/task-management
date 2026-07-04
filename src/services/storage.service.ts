import { createClient } from '@/lib/supabase/client'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/validations/report'

export const storageService = {
  validateFile(file: File): string | null {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'File type not allowed. Please upload PDF, DOCX, or image files.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be under 10MB.'
    }
    return null
  },

  async uploadFile(file: File, userId: string): Promise<{ path: string; publicUrl: string | null }> {
    const supabase = createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error } = await supabase.storage.from('task-attachments').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw error

    // Bucket is private, so we don't get a real public URL — signed URLs are generated on demand when viewing
    return { path: filePath, publicUrl: null }
  },

  async getSignedUrl(path: string): Promise<string> {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('task-attachments')
      .createSignedUrl(path, 60 * 60) // 1 hour expiry

    if (error) throw error
    return data.signedUrl
  },

  async deleteFile(path: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.storage.from('task-attachments').remove([path])
    if (error) throw error
  },
  async uploadAvatar(file: File, userId: string): Promise<string> {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/avatar.${fileExt}`

    const { error } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // overwrite previous avatar
    })

    if (error) throw error

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    return data.publicUrl
  },
}