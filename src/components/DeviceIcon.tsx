import { DeviceType } from '@/types/network';
import {
  Router, Shield, Network, Server, Monitor, Laptop,
  Wifi, Cpu, HardDrive, Container, Globe,
} from 'lucide-react';

const iconMap: Record<DeviceType, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  'router': Router,
  'firewall': Shield,
  'switch': Network,
  'server': Server,
  'workstation': Monitor,
  'laptop': Laptop,
  'access-point': Wifi,
  'iot': Cpu,
  'nas': HardDrive,
  'vm-host': Container,
  'reverse-proxy': Globe,
};

export function DeviceIcon({ type, size = 16, color, className }: {
  type: DeviceType;
  size?: number;
  color?: string;
  className?: string;
}) {
  const Icon = iconMap[type];
  return <Icon className={className} style={{ width: size, height: size, color }} />;
}
