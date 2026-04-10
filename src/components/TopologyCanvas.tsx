import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNetwork } from '@/context/NetworkContext';
import { DeviceIcon } from './DeviceIcon';
import { DEVICE_ICON_COLORS, DEVICE_TYPE_LABELS } from '@/types/network';
import { useEffect } from 'react';
import { Network as NetworkIcon } from 'lucide-react';

function DeviceNode({ data, selected }: NodeProps) {
  const d = data as any;
  return (
    <div
      className={`w-[120px] h-[80px] flex flex-col items-center justify-center gap-1 rounded-xl border bg-surface-elevated transition-shadow duration-150 ${
        selected ? 'border-teal shadow-node-selected border-2' : 'border-foreground/[0.08]'
      }`}
      style={{ boxShadow: selected ? undefined : '0 1px 3px rgba(0,0,0,0.4)' }}
    >
      <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2 !border-0" />
      <DeviceIcon type={d.deviceType} size={20} color={DEVICE_ICON_COLORS[d.deviceType]} />
      <span className="text-[12px] font-medium text-foreground text-center leading-tight px-1 truncate max-w-[110px]">{d.label}</span>
      <span className="text-[11px] tabular-nums text-muted-foreground">{d.ip}</span>
    </div>
  );
}

const nodeTypes = { device: DeviceNode };

export function TopologyCanvas() {
  const {
    activeNetwork, selectedDeviceId, selectedEdgeId,
    setSelectedDeviceId, setSelectedEdgeId,
    updateDevicePosition, addConnection, connectMode, snapGrid, setPropertiesPanelOpen,
  } = useNetwork();

  const initialNodes: Node[] = useMemo(() =>
    activeNetwork.devices.map(d => ({
      id: d.id,
      type: 'device',
      position: d.position,
      data: { label: d.name, ip: d.ip, deviceType: d.type },
      selected: d.id === selectedDeviceId,
    })),
    [activeNetwork.id] // eslint-disable-line
  );

  const initialEdges: Edge[] = useMemo(() =>
    activeNetwork.connections.map(c => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
      label: c.label,
      style: { stroke: c.id === selectedEdgeId ? '#2dd4bf' : '#303030', strokeWidth: c.id === selectedEdgeId ? 2 : 1.5 },
      selected: c.id === selectedEdgeId,
    })),
    [activeNetwork.id] // eslint-disable-line
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when network changes
  useEffect(() => {
    setNodes(activeNetwork.devices.map(d => ({
      id: d.id,
      type: 'device',
      position: d.position,
      data: { label: d.name, ip: d.ip, deviceType: d.type },
    })));
    setEdges(activeNetwork.connections.map(c => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
      label: c.label,
      style: { stroke: '#303030', strokeWidth: 1.5 },
    })));
  }, [activeNetwork.id, activeNetwork.devices.length, activeNetwork.connections.length]); // eslint-disable-line

  const handleNodesChange: OnNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    changes.forEach(change => {
      if (change.type === 'position' && change.position && change.dragging === false) {
        updateDevicePosition(change.id, change.position);
      }
    });
  }, [onNodesChange, updateDevicePosition]);

  const handleEdgesChange: OnEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    const newEdge: Edge = {
      id: `c-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      style: { stroke: '#303030', strokeWidth: 1.5 },
    };
    setEdges(eds => addEdge(newEdge, eds));
    addConnection({
      id: newEdge.id,
      sourceId: connection.source,
      targetId: connection.target,
    });
  }, [setEdges, addConnection]);

  const handleNodeClick = useCallback((_: any, node: Node) => {
    setSelectedDeviceId(node.id);
    setSelectedEdgeId(null);
    setPropertiesPanelOpen(true);
  }, [setSelectedDeviceId, setSelectedEdgeId, setPropertiesPanelOpen]);

  const handleEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdgeId(edge.id);
    setSelectedDeviceId(null);
    setPropertiesPanelOpen(true);
  }, [setSelectedEdgeId, setSelectedDeviceId, setPropertiesPanelOpen]);

  const handlePaneClick = useCallback(() => {
    setSelectedDeviceId(null);
    setSelectedEdgeId(null);
  }, [setSelectedDeviceId, setSelectedEdgeId]);

  const isEmpty = activeNetwork.devices.length === 0;

  return (
    <div className="flex-1 relative bg-background overflow-hidden">
      {isEmpty ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-60 h-40 border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center gap-2">
            <NetworkIcon size={32} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">Add your first device</span>
            <span className="text-[11px] text-muted-foreground/60">or press A to start</span>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          snapToGrid={snapGrid}
          snapGrid={[24, 24]}
          connectOnClick={connectMode}
          fitView
          proOptions={{ hideAttribution: true }}
          className="[&_.react-flow__edge-path]:transition-colors"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="rgba(255,255,255,0.05)" />
          <Controls
            showInteractive={false}
            className="!bg-surface-elevated !border-border !rounded-full !shadow-elevated [&>button]:!bg-transparent [&>button]:!border-0 [&>button]:!text-muted-foreground [&>button:hover]:!text-foreground"
          />
        </ReactFlow>
      )}
    </div>
  );
}
