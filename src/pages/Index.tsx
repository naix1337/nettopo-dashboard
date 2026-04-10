import { NetworkProvider, useNetwork } from '@/context/NetworkContext';
import { AppHeader } from '@/components/AppHeader';
import { AppSidebarPanel } from '@/components/AppSidebarPanel';
import { TopologyCanvas } from '@/components/TopologyCanvas';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { StatusBar } from '@/components/StatusBar';
import { useEffect } from 'react';

function NetMapLayout() {
  const { darkMode } = useNetwork();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <AppHeader />
      <div className="flex-1 flex overflow-hidden">
        <AppSidebarPanel />
        <TopologyCanvas />
        <PropertiesPanel />
      </div>
      <StatusBar />
    </div>
  );
}

export default function Index() {
  return (
    <NetworkProvider>
      <NetMapLayout />
    </NetworkProvider>
  );
}
