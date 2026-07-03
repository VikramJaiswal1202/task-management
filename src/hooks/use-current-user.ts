'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async (): Promise<{ id: string; email: string; profile: Profile }> => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      return { id: user.id, email: user.email!, profile }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes, profile doesn't change often
  })
}