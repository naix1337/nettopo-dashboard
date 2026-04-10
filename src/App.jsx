import React, { useState, useEffect } from 'react';
import CanvasEngine from './components/CanvasEngine';
import Sidebar from './components/Sidebar';
import PropertiesPanel from './components/PropertiesPanel';
import Header from './components/Header';
import { NetworksContext } from './context';
import { Network, Server, Settings } from 'lucide-react';

function App() {
  const [networks, setNetworks] = useState([]);
  const [activeNetworkId, setActiveNetworkId] = useState(null);
  const [activeNetworkData, setActiveNetworkData] = useState(null);
  const [selection, setSelection] = useState({ type: null, id: null });
  const [connectMode, setConnectMode] = useState(false);

  // Fetch networks list
  useEffect(() => {
    fetch('/api/networks')
      .then(r => r.json())
      .then(data => {
        setNetworks(data);
        if (data.length > 0 && !activeNetworkId) {
          setActiveNetworkId(data[0].id);
        }
      });
  }, []);

  // Fetch active network data
  useEffect(() => {
    if (!activeNetworkId) return;
    fetch(`/api/networks/${activeNetworkId}`)
      .then(r => r.json())
      .then(data => setActiveNetworkData(data));
  }, [activeNetworkId]);

  const refreshData = () => {
     if (activeNetworkId) {
        fetch(`/api/networks/${activeNetworkId}`)
          .then(r => r.json())
          .then(data => setActiveNetworkData(data));
     }
  };

  const contextValue = {
    networks,
    activeNetworkId,
    setActiveNetworkId,
    activeNetworkData,
    refreshData,
    selection,
    setSelection,
    connectMode,
    setConnectMode
  };

  return (
    <NetworksContext.Provider value={contextValue}>
      <div className="app-container">
        <Header />
        
        <aside className="sidebar glass-panel">
          <Sidebar />
        </aside>

        <main className="canvas-area">
          {activeNetworkData ? (
             <CanvasEngine />
          ) : (
             <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--color-text-muted)'}}>
               Loading network or create a new one...
             </div>
          )}
        </main>

        <aside className="properties glass-panel">
          <PropertiesPanel />
        </aside>

        <footer className="statusbar glass-panel">
           {activeNetworkData && (
              <>
                 <span style={{color: 'var(--color-text)', fontWeight: 500}}>{activeNetworkData.name}</span>
                 <span style={{margin: '0 12px'}}>|</span>
                 <span>{activeNetworkData.devices?.length || 0} Devices</span>
                 <span style={{margin: '0 12px'}}>|</span>
                 <span>{activeNetworkData.connections?.length || 0} Connections</span>
                 <div style={{flex: 1}}></div>
                 <span>{connectMode ? 'Connect Mode: Select target node' : 'Selection Mode'}</span>
              </>
           )}
        </footer>
      </div>
    </NetworksContext.Provider>
  );
}

export default App;
