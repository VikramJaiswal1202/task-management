'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or head back to safety.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
          Go to Dashboard
        </Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}