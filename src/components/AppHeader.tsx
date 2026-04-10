import { useNetwork } from '@/context/NetworkContext';
import { Cable, Grid3x3, Download, Sun, Moon, Plus } from 'lucide-react';
import { useState } from 'react';
import { NewNetworkModal } from './NewNetworkModal';

export function AppHeader() {
  const {
    networks, activeNetworkId, setActiveNetworkId,
    connectMode, setConnectMode, snapGrid, setSnapGrid,
    darkMode, setDarkMode,
  } = useNetwork();
  const [showNewNetwork, setShowNewNetwork] = useState(false);

  return (
    <>
      <header className="h-14 flex items-center px-4 bg-surface border-b border-border-subtle shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="8" cy="14" r="3.5" fill="currentColor" className="text-teal" />
            <circle cx="20" cy="14" r="3.5" fill="currentColor" className="text-teal" />
            <line x1="11.5" y1="14" x2="16.5" y2="14" stroke="currentColor" strokeWidth="2" className="text-teal" />
          </svg>
          <span className="text-base font-semibold text-foreground">NetMap</span>
        </div>

        {/* Center: Network Selector */}
        <div className="flex items-center gap-1 mx-auto">
          <select
            value={activeNetworkId}
            onChange={e => setActiveNetworkId(e.target.value)}
            className="h-8 w-40 rounded-md bg-surface-elevated border border-border text-sm font-medium text-foreground px-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {networks.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowNewNetwork(true)}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface-elevated hover:text-teal transition-all duration-150"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setConnectMode(!connectMode)}
            className={`h-8 px-2 flex items-center gap-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              connectMode
                ? 'text-teal border border-teal bg-surface-elevated'
                : 'text-muted-foreground border border-transparent hover:bg-surface-elevated'
            }`}
          >
            <Cable size={16} />
            <span>Connect</span>
          </button>
          <button
            onClick={() => setSnapGrid(!snapGrid)}
            className={`h-8 w-8 flex items-center justify-center rounded-md transition-all duration-150 ${
              snapGrid
                ? 'text-teal border border-teal bg-surface-elevated'
                : 'text-muted-foreground hover:bg-surface-elevated'
            }`}
          >
            <Grid3x3 size={16} />
          </button>
          <button className="h-8 px-2 flex items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-surface-elevated transition-all duration-150">
            <Download size={16} />
            <span>Export</span>
          </button>

          <div className="w-px h-5 bg-border-subtle mx-1" />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-elevated transition-all duration-150"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>
      <NewNetworkModal open={showNewNetwork} onClose={() => setShowNewNetwork(false)} />
    </>
  );
}
