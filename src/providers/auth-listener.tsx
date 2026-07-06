'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function AuthListener() {
  const queryClient = useQueryClient()
  const previousUserId = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUserId = session?.user?.id ?? null

      if (event === 'SIGNED_OUT') {
        queryClient.clear()
        previousUserId.current = null
      }

      if (event === 'SIGNED_IN' && currentUserId && currentUserId !== previousUserId.current) {
        queryClient.clear()
        previousUserId.current = currentUserId
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [queryClient])

  return null
}