import { useQuery } from '@tanstack/react-query'
import type { App } from '@/types'

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const res = await fetch('/api/apps')
      if (!res.ok) throw new Error('Failed to fetch apps')
      const json = await res.json()
      return json.data as App[]
    },
    staleTime: 5 * 60 * 1000,
  })
}
