import { http, HttpResponse, delay } from 'msw'
import { apps, graphData } from './data'

export const handlers = [
  http.get('/api/apps', async () => {
    await delay(400)
    return HttpResponse.json({ data: apps })
  }),

  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(600)
    const appId = params.appId as string

    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 })
    }

    const graph = graphData[appId]
    if (!graph) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ data: graph })
  }),
]
