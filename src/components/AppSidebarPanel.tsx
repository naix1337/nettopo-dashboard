import { useNetwork } from '@/context/NetworkContext';
import { DeviceIcon } from './DeviceIcon';
import { DEVICE_CATEGORIES, DEVICE_ICON_COLORS } from '@/types/network';
import { Search, Plus, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { AddDeviceModal } from './AddDeviceModal';

export function AppSidebarPanel() {
  const { activeNetwork, selectedDeviceId, setSelectedDeviceId, setSelectedEdgeId, setPropertiesPanelOpen } = useNetwork();
  const [filter, setFilter] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showAddDevice, setShowAddDevice] = useState(false);

  const devices = activeNetwork.devices.filter(d =>
    d.name.toLowerCase().includes(filter.toLowerCase()) ||
    d.ip.includes(filter)
  );

  const toggleCategory = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const selectDevice = (id: string) => {
    setSelectedDeviceId(id);
    setSelectedEdgeId(null);
    setPropertiesPanelOpen(true);
  };

  return (
    <>
      <aside className="w-60 bg-surface border-r border-border-subtle flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Filter devices…"
              className="w-full h-8 pl-7 pr-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <button
            onClick={() => setShowAddDevice(true)}
            className="w-full h-9 flex items-center justify-center gap-1.5 rounded-md bg-teal text-primary-foreground text-sm font-medium hover:bg-teal-hover active:bg-teal-active transition-all duration-150"
          >
            <Plus size={16} />
            Add Device
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-1">
          {DEVICE_CATEGORIES.map(cat => {
            const catDevices = devices.filter(d => cat.types.includes(d.type));
            if (catDevices.length === 0) return null;
            const isCollapsed = collapsed[cat.label];

            return (
              <div key={cat.label} className="mb-1">
                <button
                  onClick={() => toggleCategory(cat.label)}
                  className="w-full h-7 px-3 flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{cat.label}</span>
                  <ChevronRight
                    size={12}
                    className={`transition-transform duration-150 ${isCollapsed ? '' : 'rotate-90'}`}
                  />
                </button>
                {!isCollapsed && catDevices.map(device => (
                  <button
                    key={device.id}
                    onClick={() => selectDevice(device.id)}
                    className={`w-full h-9 px-3 flex items-center gap-2 text-left transition-all duration-150 rounded-sm ${
                      selectedDeviceId === device.id
                        ? 'bg-surface-elevated border-l-2 border-l-teal'
                        : 'hover:bg-surface-hover border-l-2 border-l-transparent'
                    }`}
                  >
                    <DeviceIcon
                      type={device.type}
                      size={16}
                      color={selectedDeviceId === device.id ? '#2dd4bf' : DEVICE_ICON_COLORS[device.type]}
                    />
                    <span className={`text-[13px] font-medium truncate flex-1 ${
                      selectedDeviceId === device.id ? 'text-teal' : 'text-foreground'
                    }`}>
                      {device.name}
                    </span>
                    <span className="text-[11px] tabular-nums text-muted-foreground bg-surface-elevated border border-border-subtle rounded-sm px-1.5 py-0.5 shrink-0">
                      {device.ip}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </aside>
      <AddDeviceModal open={showAddDevice} onClose={() => setShowAddDevice(false)} />
    </>
  );
}
