import React, { useContext, useState } from 'react';
import { NetworksContext } from '../context';
import { Router, Shield, Network, Plug, Server, Monitor, Laptop, Wifi, Cpu, Database, Layers, ArrowLeftRight, HelpCircle, Plus } from 'lucide-react';

const ICONS = {
  router: Router, firewall: Shield, switch: Network, hub: Plug,
  server: Server, workstation: Monitor, laptop: Laptop, ap: Wifi,
  iot: Cpu, nas: Database, vmhost: Layers, proxy: ArrowLeftRight, unknown: HelpCircle
};

export default function Sidebar() {
  const { activeNetworkData, selection, setSelection, refreshData } = useContext(NetworksContext);
  const [filter, setFilter] = useState('');

  const devices = activeNetworkData?.devices || [];
  const filtered = devices.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()) || (d.ip && d.ip.includes(filter)));

  const handleAddDevice = async () => {
    if (!activeNetworkData) return;
    const name = prompt("Device Name:");
    if (!name) return;
    const newDevice = {
       id: Math.random().toString(36).substr(2, 9),
       name,
       type: 'server',
       ip: '192.168.1.100',
       x: 200, y: 200
    };
    await fetch(`/api/networks/${activeNetworkData.id}/devices`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(newDevice)
    });
    refreshData();
  };

  return (
    <>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
        <input 
          type="text" 
          className="input-base" 
          placeholder="Filter devices..." 
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleAddDevice}>
          <Plus size={16} /> Add Device
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
         {filtered.map(d => {
            const Icon = ICONS[d.type] || ICONS.unknown;
            const isActive = selection.type === 'device' && selection.id === d.id;
            return (
              <div 
                key={d.id}
                onClick={() => setSelection({ type: 'device', id: d.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px',
                  cursor: 'pointer',
                  background: isActive ? 'var(--color-surface-offset)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`
                }}
              >
                  <Icon size={18} style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div style={{ overflow: 'hidden' }}>
                     <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{d.name}</div>
                     <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{d.ip}</div>
                  </div>
              </div>
            );
         })}
      </div>
    </>
  );
}
