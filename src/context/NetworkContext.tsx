import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Network, Device, Connection } from '@/types/network';

interface NetworkContextType {
  networks: Network[];
  activeNetworkId: string;
  activeNetwork: Network | undefined;
  selectedDeviceId: string | null;
  selectedEdgeId: string | null;
  connectMode: boolean;
  snapGrid: boolean;
  darkMode: boolean;
  propertiesPanelOpen: boolean;

  setActiveNetworkId: (id: string) => void;
  setSelectedDeviceId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setConnectMode: (v: boolean) => void;
  setSnapGrid: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  setPropertiesPanelOpen: (v: boolean) => void;

  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  addConnection: (conn: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  addNetwork: (network: Network) => void;
  updateDevicePosition: (id: string, position: { x: number; y: number }) => void;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [activeNetworkId, setActiveNetworkId] = useState<string>('');
  const [activeNetwork, setActiveNetwork] = useState<Network | undefined>(undefined);
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [snapGrid, setSnapGrid] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(true);

  // Load basic network list
  useEffect(() => {
    fetch('/api/networks').then(r => r.json()).then(data => {
      setNetworks(data.map((n: any) => ({
        id: n.id, name: n.name, description: n.desc, vlan: n.vlan, devices: [], connections: []
      })));
      if (data.length > 0 && !activeNetworkId) {
        setActiveNetworkId(data[0].id);
      }
    }).catch(e => console.error("API error", e));
  }, []);

  // Sync active network details
  useEffect(() => {
     if (!activeNetworkId) return;
     fetch(`/api/networks/${activeNetworkId}`).then(r => r.json()).then(data => {
         const detailedNet: Network = {
             id: data.id, name: data.name, description: data.desc, vlan: data.vlan,
             devices: data.devices.map((d: any) => ({
                 id: d.id, name: d.name, type: d.type, ip: d.ip, subnet: d.subnet,
                 mac: d.mac, notes: d.notes, position: {x: d.x, y: d.y}
             })),
             connections: data.connections.map((c: any) => ({
                 id: c.id, sourceId: c.fromId, targetId: c.toId, label: c.label,
                 vlan: c.vlan, linkSpeed: c.linkSpeed, directed: c.directed
             }))
         };
         setActiveNetwork(detailedNet);
     }).catch(console.error);
  }, [activeNetworkId]);

  const addDevice = useCallback(async (device: Device) => {
    if(!activeNetworkId) return;
    const dbDevice = {
       id: device.id, name: device.name, type: device.type,
       ip: device.ip, subnet: device.subnet, mac: device.mac,
       notes: device.notes, x: device.position.x, y: device.position.y
    };
    await fetch(`/api/networks/${activeNetworkId}/devices`, {
       method: 'POST', headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(dbDevice)
    });
    setActiveNetwork(n => n ? {...n, devices: [...n.devices, device]} : undefined);
  }, [activeNetworkId]);

  const updateDevice = useCallback(async (id: string, updates: Partial<Device>) => {
    if(!activeNetworkId || !activeNetwork) return;
    const existing = activeNetwork.devices.find(d => d.id === id);
    if(!existing) return;
    const updated = { ...existing, ...updates };
    const dbDevice = {
       id: updated.id, name: updated.name, type: updated.type,
       ip: updated.ip, subnet: updated.subnet, mac: updated.mac,
       notes: updated.notes, x: updated.position.x, y: updated.position.y
    };
    fetch(`/api/networks/${activeNetworkId}/devices`, {
       method: 'POST', headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(dbDevice)
    });
    setActiveNetwork(n => n ? {...n, devices: n.devices.map(d => d.id === id ? updated : d)} : undefined);
  }, [activeNetworkId, activeNetwork]);

  const deleteDevice = useCallback(async (id: string) => {
    await fetch(`/api/devices/${id}`, { method: 'DELETE' });
    setActiveNetwork(n => n ? {
      ...n, 
      devices: n.devices.filter(d => d.id !== id),
      connections: n.connections.filter(c => c.sourceId !== id && c.targetId !== id)
    } : undefined);
    setSelectedDeviceId(null);
  }, []);

  const addConnection = useCallback(async (conn: Connection) => {
    if(!activeNetworkId) return;
    const dbConn = {
       id: conn.id, from: conn.sourceId, to: conn.targetId,
       label: conn.label || '', vlan: conn.vlan || '',
       linkSpeed: conn.linkSpeed || '', directed: conn.directed || false
    };
    await fetch(`/api/networks/${activeNetworkId}/connections`, {
       method: 'POST', headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(dbConn)
    });
    setActiveNetwork(n => n ? {...n, connections: [...n.connections, conn]} : undefined);
  }, [activeNetworkId]);

  const updateConnection = useCallback(async (id: string, updates: Partial<Connection>) => {
    if(!activeNetworkId || !activeNetwork) return;
    const existing = activeNetwork.connections.find(c => c.id === id);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    const dbConn = {
       id: updated.id, from: updated.sourceId, to: updated.targetId,
       label: updated.label || '', vlan: updated.vlan || '',
       linkSpeed: updated.linkSpeed || '', directed: updated.directed || false
    };
    fetch(`/api/networks/${activeNetworkId}/connections`, {
       method: 'POST', headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(dbConn)
    });
    setActiveNetwork(n => n ? {...n, connections: n.connections.map(c => c.id === id ? updated : c)} : undefined);
  }, [activeNetworkId, activeNetwork]);

  const deleteConnection = useCallback(async (id: string) => {
    await fetch(`/api/connections/${id}`, { method: 'DELETE' });
    setActiveNetwork(n => n ? {
      ...n, connections: n.connections.filter(c => c.id !== id)
    } : undefined);
    setSelectedEdgeId(null);
  }, []);

  const addNetwork = useCallback(async (network: Network) => {
    const dbFormat = {
       id: network.id, name: network.name, desc: network.description || '', vlan: network.vlan || ''
    };
    await fetch('/api/networks', {
       method: 'POST', headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(dbFormat)
    });
    setNetworks(prev => [...prev, network]);
    setActiveNetworkId(network.id);
  }, []);

  const updateDevicePosition = useCallback((id: string, position: { x: number; y: number }) => {
     updateDevice(id, { position });
  }, [updateDevice]);

  return (
    <NetworkContext.Provider value={{
      networks, activeNetworkId, activeNetwork: activeNetwork || networks[0], // fallback
      selectedDeviceId, selectedEdgeId, connectMode, snapGrid, darkMode, propertiesPanelOpen,
      setActiveNetworkId, setSelectedDeviceId, setSelectedEdgeId,
      setConnectMode, setSnapGrid, setDarkMode, setPropertiesPanelOpen,
      addDevice, updateDevice, deleteDevice,
      addConnection, updateConnection, deleteConnection,
      addNetwork, updateDevicePosition,
    }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}
