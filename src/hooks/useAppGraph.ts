import { useQuery } from '@tanstack/react-query'
import type { GraphData } from '@/types'

export function useAppGraph(appId: string | null) {
  return useQuery({
    queryKey: ['graph', appId],
    queryFn: async () => {
      const res = await fetch(`/api/apps/${appId}/graph`)
      if (!res.ok) throw new Error('Failed to fetch graph')
      const json = await res.json()
      return json.data as GraphData
    },
    enabled: !!appId,
    staleTime: 30 * 1000,
    retry: 1,
  })
}
