import { useEffect, useRef, useState } from 'react'
import { GitBranch } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ConfigTab } from './ConfigTab'
import { RuntimeTab } from './RuntimeTab'
import { useStore } from '@/store/useStore'
import { useFlow } from '@/context/FlowContext'
export function NodeInspector() {
  const selectedNodeId = useStore((s) => s.selectedNodeId)
  const activeTab = useStore((s) => s.activeInspectorTab)
  const setActiveTab = useStore((s) => s.setActiveTab)
  const { nodes, updateNodeData } = useFlow()
  const inspectorRef = useRef<HTMLDivElement>(null)

  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  useEffect(() => {
    if (selectedNodeId && inspectorRef.current) {
      inspectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedNodeId])

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditingName])

  const saveName = () => {
    if (selectedNodeId && nameValue.trim()) {
      updateNodeData(selectedNodeId, { label: nameValue.trim() })
    }
    setIsEditingName(false)
  }

  if (!selectedNode) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4">
        <GitBranch className="h-8 w-8 text-[var(--text-muted)] opacity-40" />
        <p className="text-[13px] text-[var(--text-muted)]">Select a node to inspect</p>
      </div>
    )
  }

  const statusVariant =
    selectedNode.data.status === 'healthy'
      ? 'healthy'
      : selectedNode.data.status === 'degraded'
        ? 'degraded'
        : 'down'

  return (
    <div
      key={selectedNode.id}
      ref={inspectorRef}
      className="inspector-enter flex flex-1 flex-col overflow-y-auto p-4"
    >
      <div className="mb-4 flex items-center gap-2">
        {isEditingName ? (
          <input
            ref={nameInputRef}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveName()
              if (e.key === 'Escape') {
                setNameValue(selectedNode.data.label)
                setIsEditingName(false)
              }
            }}
            className="flex-1 border-b border-[var(--accent-blue)] bg-transparent text-[16px] font-semibold text-[var(--text-primary)] outline-none"
          />
        ) : (
          <h3
            className="flex-1 cursor-text text-[16px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]"
            onClick={() => {
              setNameValue(selectedNode.data.label)
              setIsEditingName(true)
            }}
          >
            {selectedNode.data.label}
          </h3>
        )}
        <Badge variant={statusVariant} className="capitalize">
          {selectedNode.data.status === 'down' ? 'Error' : selectedNode.data.status}
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'config' | 'runtime')}
      >
        <TabsList>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
        </TabsList>
        <TabsContent value="config">
          <ConfigTab
            key={selectedNode.id}
            nodeId={selectedNode.id}
            data={selectedNode.data}
          />
        </TabsContent>
        <TabsContent value="runtime">
          <RuntimeTab data={selectedNode.data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
