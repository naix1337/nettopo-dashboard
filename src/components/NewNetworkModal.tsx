import { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { X, Network, Server, Shield } from 'lucide-react';

const templates = [
  { id: 'blank', label: 'Blank', icon: Network },
  { id: 'server', label: 'Server', icon: Server },
  { id: 'firewall', label: 'Firewall', icon: Shield },
];

export function NewNetworkModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addNetwork } = useNetwork();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [vlanId, setVlanId] = useState('');
  const [template, setTemplate] = useState('blank');

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    addNetwork({
      id: `net-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      vlanId: vlanId.trim() || undefined,
      devices: [],
      connections: [],
    });
    setName(''); setDescription(''); setVlanId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-xl shadow-modal max-w-[480px] w-full mx-4 p-6 animate-modal-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-foreground">New Network</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-elevated">
            <X size={16} />
          </button>
        </div>
        <div className="h-px bg-border-subtle mb-4" />

        <div className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Network Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-9 px-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full h-14 px-2 py-1.5 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">VLAN ID (optional)</label>
            <input
              value={vlanId}
              onChange={e => setVlanId(e.target.value)}
              type="number"
              min={0}
              max={4094}
              className="w-full h-9 px-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Template</label>
            <div className="flex gap-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex-1 h-20 flex flex-col items-center justify-center gap-1.5 rounded-lg border transition-all duration-150 ${
                    template === t.id
                      ? 'border-teal text-teal'
                      : 'border-border text-muted-foreground bg-surface-elevated hover:border-border'
                  }`}
                >
                  <t.icon size={20} />
                  <span className="text-[12px]">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="h-9 px-4 rounded-md border border-border text-[13px] text-foreground hover:bg-surface-elevated transition-all duration-150">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="h-9 px-4 rounded-md bg-teal text-primary-foreground text-[13px] font-medium hover:bg-teal-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Create Network
          </button>
        </div>
      </div>
    </div>
  );
}
