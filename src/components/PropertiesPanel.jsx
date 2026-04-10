import React, { useContext, useState, useEffect } from 'react';
import { NetworksContext } from '../context';
import { Server, Cable, Network, X } from 'lucide-react';

export default function PropertiesPanel() {
  const { activeNetworkData, selection, setSelection, refreshData } = useContext(NetworksContext);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!activeNetworkData) return;
    if (selection.type === 'device') {
       const device = activeNetworkData.devices.find(d => d.id === selection.id);
       if (device) setFormData(device);
    } else if (selection.type === 'connection') {
       const connection = activeNetworkData.connections.find(c => c.id === selection.id);
       if (connection) setFormData(connection);
    }
  }, [selection, activeNetworkData]);

  if (!activeNetworkData) return null;

  const handleDeviceChange = (field, value) => {
     setFormData(prev => ({...prev, [field]: value}));
  };

  const saveDevice = async () => {
     await fetch(`/api/networks/${activeNetworkData.id}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
     });
     refreshData();
  };
  
  const deleteDevice = async () => {
    await fetch(`/api/devices/${formData.id}`, { method: 'DELETE' });
    setSelection({type: null, id: null});
    refreshData();
  };

  const deleteEdge = async () => {
    await fetch(`/api/connections/${formData.id}`, { method: 'DELETE' });
    setSelection({type: null, id: null});
    refreshData();
  };

  if (selection.type === 'device') {
      return (
         <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--color-surface-2)', borderRadius: '8px' }}><Server size={24}/></div>
                  <div>
                    <input className="input-base" style={{ fontSize: '18px', fontWeight: 'bold', padding: '4px', background: 'transparent', border: '1px solid transparent' }} value={formData.name || ''} onChange={e => handleDeviceChange('name', e.target.value)} onBlur={saveDevice} />
                  </div>
               </div>
               <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setSelection({type: null, id: null})}><X size={18}/></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-xs text-muted font-medium">Type</span>
                <select className="input-base" value={formData.type || 'server'} onChange={e => { handleDeviceChange('type', e.target.value); saveDevice(); }}>
                   <option value="server">Server</option>
                   <option value="switch">Switch</option>
                   <option value="router">Router</option>
                   <option value="firewall">Firewall</option>
                   <option value="workstation">Workstation</option>
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-xs text-muted font-medium">IP Address</span>
                <input className="input-base" value={formData.ip || ''} onChange={e => handleDeviceChange('ip', e.target.value)} onBlur={saveDevice} />
            </div>
            
            <div style={{flex: 1}}></div>
            <button className="btn btn-ghost" style={{ color: 'var(--color-error)' }} onClick={deleteDevice}>Delete Device</button>
         </div>
      );
  }

  if (selection.type === 'connection') {
     return (
         <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ padding: '8px', background: 'var(--color-surface-2)', borderRadius: '8px' }}><Cable size={24}/></div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Connection</div>
               </div>
               <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setSelection({type: null, id: null})}><X size={18}/></button>
            </div>
            <div style={{flex: 1}}></div>
            <button className="btn btn-ghost" style={{ color: 'var(--color-error)' }} onClick={deleteEdge}>Delete Connection</button>
         </div>
     )
  }

  return (
    <div style={{ padding: '16px' }}>
       <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ padding: '8px', background: 'var(--color-surface-2)', borderRadius: '8px' }}><Network size={24}/></div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{activeNetworkData.name}</div>
            <div className="text-xs text-muted">Network Details</div>
          </div>
       </div>
       <div className="text-sm text-muted">Select a device or connection on the canvas to view properties.</div>
    </div>
  );
}
