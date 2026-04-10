import { useNetwork } from '@/context/NetworkContext';
import { DeviceIcon } from './DeviceIcon';
import { DEVICE_ICON_COLORS, DEVICE_TYPE_LABELS } from '@/types/network';
import { X, ArrowRight, Trash2 } from 'lucide-react';

export function PropertiesPanel() {
  const {
    activeNetwork, selectedDeviceId, selectedEdgeId,
    setSelectedDeviceId, setSelectedEdgeId,
    updateDevice, deleteDevice, updateConnection, deleteConnection,
    propertiesPanelOpen, setPropertiesPanelOpen,
  } = useNetwork();

  const device = activeNetwork.devices.find(d => d.id === selectedDeviceId);
  const edge = activeNetwork.connections.find(c => c.id === selectedEdgeId);

  if (!propertiesPanelOpen) return null;

  // Nothing selected
  if (!device && !edge) {
    return (
      <aside className="w-[260px] bg-surface border-l border-border-subtle flex flex-col shrink-0 p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">{activeNetwork.name}</h2>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-elevated rounded-lg p-3">
            <div className="text-2xl font-semibold tabular-nums text-teal">{activeNetwork.devices.length}</div>
            <div className="text-[11px] text-muted-foreground">Devices</div>
          </div>
          <div className="flex-1 bg-surface-elevated rounded-lg p-3">
            <div className="text-2xl font-semibold tabular-nums text-teal">{activeNetwork.connections.length}</div>
            <div className="text-[11px] text-muted-foreground">Connections</div>
          </div>
        </div>
      </aside>
    );
  }

  // Device selected
  if (device) {
    const connections = activeNetwork.connections.filter(
      c => c.sourceId === device.id || c.targetId === device.id
    );
    const connectedDevices = connections.map(c => {
      const otherId = c.sourceId === device.id ? c.targetId : c.sourceId;
      return activeNetwork.devices.find(d => d.id === otherId);
    }).filter(Boolean);

    return (
      <aside className="w-[260px] bg-surface border-l border-border-subtle flex flex-col shrink-0 overflow-y-auto">
        <div className="h-12 px-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <DeviceIcon type={device.type} size={20} color={DEVICE_ICON_COLORS[device.type]} />
            <span className="text-[15px] font-semibold text-foreground truncate">{device.name}</span>
          </div>
          <button
            onClick={() => { setSelectedDeviceId(null); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-elevated"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <Field label="Device Name" value={device.name} onChange={v => updateDevice(device.id, { name: v })} />
          <Field label="IP Address" value={device.ip} onChange={v => updateDevice(device.id, { ip: v })} mono />
          <Field label="Subnet" value={device.subnet || ''} onChange={v => updateDevice(device.id, { subnet: v })} mono />
          <Field label="MAC Address" value={device.mac || ''} onChange={v => updateDevice(device.id, { mac: v })} mono />
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Notes</label>
            <textarea
              value={device.notes || ''}
              onChange={e => updateDevice(device.id, { notes: e.target.value })}
              className="w-full h-16 px-2 py-1.5 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>

          <div className="h-px bg-border-subtle" />

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Connections</div>
            {connectedDevices.map(cd => cd && (
              <div key={cd.id} className="h-8 flex items-center gap-2 px-1 rounded hover:bg-surface-elevated cursor-pointer" onClick={() => { setSelectedDeviceId(cd.id); }}>
                <ArrowRight size={12} className="text-muted-foreground" />
                <span className="text-[13px] text-foreground truncate flex-1">{cd.name}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">{cd.ip}</span>
              </div>
            ))}
            {connectedDevices.length === 0 && <div className="text-[11px] text-muted-foreground">No connections</div>}
          </div>

          <div className="h-px bg-border-subtle" />

          <button
            onClick={() => deleteDevice(device.id)}
            className="w-full h-8 flex items-center justify-center gap-1.5 rounded-md border border-border text-error text-[13px] hover:bg-error/[0.08] transition-all duration-150"
          >
            <Trash2 size={14} />
            Delete Device
          </button>
        </div>
      </aside>
    );
  }

  // Edge selected
  if (edge) {
    const source = activeNetwork.devices.find(d => d.id === edge.sourceId);
    const target = activeNetwork.devices.find(d => d.id === edge.targetId);

    return (
      <aside className="w-[260px] bg-surface border-l border-border-subtle flex flex-col shrink-0 overflow-y-auto">
        <div className="h-12 px-4 flex items-center justify-between border-b border-border-subtle">
          <span className="text-[15px] font-semibold text-foreground">Connection</span>
          <button
            onClick={() => setSelectedEdgeId(null)}
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-elevated"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            {source && (
              <div className="flex items-center gap-1 bg-surface-elevated rounded-md px-2 py-1 border border-border-subtle">
                <DeviceIcon type={source.type} size={14} color={DEVICE_ICON_COLORS[source.type]} />
                <span className="text-[12px] text-foreground">{source.name}</span>
              </div>
            )}
            <ArrowRight size={14} className="text-muted-foreground shrink-0" />
            {target && (
              <div className="flex items-center gap-1 bg-surface-elevated rounded-md px-2 py-1 border border-border-subtle">
                <DeviceIcon type={target.type} size={14} color={DEVICE_ICON_COLORS[target.type]} />
                <span className="text-[12px] text-foreground">{target.name}</span>
              </div>
            )}
          </div>

          <Field label="Label" value={edge.label || ''} onChange={v => updateConnection(edge.id, { label: v })} />
          <Field label="VLAN ID" value={edge.vlanId || ''} onChange={v => updateConnection(edge.id, { vlanId: v })} />

          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Link Speed</label>
            <select
              value={edge.linkSpeed || ''}
              onChange={e => updateConnection(edge.id, { linkSpeed: e.target.value })}
              className="w-full h-8 px-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="">—</option>
              <option value="10M">10M</option>
              <option value="100M">100M</option>
              <option value="1G">1G</option>
              <option value="10G">10G</option>
              <option value="10G+">10G+</option>
            </select>
          </div>

          <div className="h-px bg-border-subtle" />

          <button
            onClick={() => deleteConnection(edge.id)}
            className="w-full h-8 flex items-center justify-center gap-1.5 rounded-md border border-border text-error text-[13px] hover:bg-error/[0.08] transition-all duration-150"
          >
            <Trash2 size={14} />
            Delete Connection
          </button>
        </div>
      </aside>
    );
  }

  return null;
}

function Field({ label, value, onChange, mono }: {
  label: string; value: string; onChange: (v: string) => void; mono?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full h-8 px-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-teal ${mono ? 'tabular-nums' : ''}`}
      />
    </div>
  );
}
