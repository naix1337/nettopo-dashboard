import { useNetwork } from '@/context/NetworkContext';

export function StatusBar() {
  const { activeNetwork, connectMode } = useNetwork();

  return (
    <div className="h-7 bg-surface border-t border-border-subtle flex items-center px-4 text-[11px] text-muted-foreground shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-teal" />
        <span>{activeNetwork.name}</span>
      </div>
      <div className="mx-auto tabular-nums">
        {activeNetwork.devices.length} devices · {activeNetwork.connections.length} connections
      </div>
      {connectMode && (
        <div className="flex items-center gap-1.5">
          <span>Connect Mode</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
        </div>
      )}
    </div>
  );
}
