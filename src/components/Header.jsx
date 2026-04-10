import React, { useContext } from 'react';
import { NetworksContext } from '../context';
import { Network, Plus, Cable, Map, Download, Moon, Sun, Settings } from 'lucide-react';

export default function Header() {
  const { networks, activeNetworkId, setActiveNetworkId, connectMode, setConnectMode } = useContext(NetworksContext);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') === 'dark') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
    }
  };

  const handleCreateNetwork = async () => {
    const name = prompt("Network Name:");
    if (!name) return;
    try {
       await fetch('/api/networks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
       });
       // Normally we'd fetch networks again, for simplicity just reload app or use context
       window.location.reload();
    } catch(e) { console.error(e); }
  };

  return (
    <header className="header glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontFamily: 'General Sans' }}>
        <Network style={{ color: 'var(--color-primary)' }} />
        <span>NetMap</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <select 
          className="input-base" 
          style={{ width: '200px', fontWeight: 500 }}
          value={activeNetworkId || ''}
          onChange={e => setActiveNetworkId(e.target.value)}
        >
          {networks.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
        <button className="btn btn-ghost" style={{ padding: '8px' }} onClick={handleCreateNetwork} title="New Network">
          <Plus size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button 
           className="btn btn-ghost" 
           style={{ padding: '8px', color: connectMode ? 'var(--color-primary)' : 'inherit', background: connectMode ? 'var(--color-primary-highlight)' : 'transparent' }} 
           onClick={() => setConnectMode(!connectMode)}
           title="Connect Mode"
        >
          <Cable size={18} />
        </button>
        <button className="btn btn-ghost" style={{ padding: '8px' }} onClick={toggleTheme} title="Toggle Theme">
          <Moon size={18} />
        </button>
      </div>
    </header>
  );
}
