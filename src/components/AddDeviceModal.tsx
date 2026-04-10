import { useState } from 'react';
import { useNetwork } from '@/context/NetworkContext';
import { DeviceType, DEVICE_TYPE_LABELS } from '@/types/network';
import { X } from 'lucide-react';

const deviceTypes: DeviceType[] = [
  'router', 'firewall', 'switch', 'server', 'workstation',
  'laptop', 'access-point', 'iot', 'nas', 'vm-host', 'reverse-proxy',
];

export function AddDeviceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addDevice } = useNetwork();
  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('server');
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [mac, setMac] = useState('');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const isValid = name.trim() && ip.trim();

  const handleAdd = () => {
    if (!isValid) return;
    addDevice({
      id: `d-${Date.now()}`,
      name: name.trim(),
      type,
      ip: ip.trim(),
      subnet: subnet.trim() || undefined,
      mac: mac.trim() || undefined,
      notes: notes.trim() || undefined,
      position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
    });
    setName(''); setIp(''); setSubnet(''); setMac(''); setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-xl shadow-modal max-w-[480px] w-full mx-4 p-6 animate-modal-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-foreground">Add Device</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-surface-elevated">
            <X size={16} />
          </button>
        </div>
        <div className="h-px bg-border-subtle mb-4" />

        <div className="space-y-4">
          <ModalField label="Device Name" value={name} onChange={setName} />
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Device Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as DeviceType)}
              className="w-full h-9 px-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
            >
              {deviceTypes.map(t => <option key={t} value={t}>{DEVICE_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <ModalField label="IP Address" value={ip} onChange={setIp} mono />
          <ModalField label="Subnet Mask" value={subnet} onChange={setSubnet} mono />
          <ModalField label="MAC Address (optional)" value={mac} onChange={setMac} mono />
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full h-[72px] px-2 py-1.5 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="h-9 px-4 rounded-md border border-border text-[13px] text-foreground hover:bg-surface-elevated transition-all duration-150">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="h-9 px-4 rounded-md bg-teal text-primary-foreground text-[13px] font-medium hover:bg-teal-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Add Device
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalField({ label, value, onChange, mono }: {
  label: string; value: string; onChange: (v: string) => void; mono?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1 block">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full h-9 px-2 rounded-md bg-surface-elevated border border-border text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-teal ${mono ? 'tabular-nums' : ''}`}
      />
    </div>
  );
}
