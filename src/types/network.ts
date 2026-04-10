export type DeviceType =
  | 'router' | 'firewall' | 'switch' | 'server' | 'workstation'
  | 'laptop' | 'access-point' | 'iot' | 'nas' | 'vm-host' | 'reverse-proxy';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ip: string;
  subnet?: string;
  mac?: string;
  notes?: string;
  position: { x: number; y: number };
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  vlanId?: string;
  linkSpeed?: string;
  directed?: boolean;
}

export interface Network {
  id: string;
  name: string;
  description?: string;
  vlanId?: string;
  devices: Device[];
  connections: Connection[];
}

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  'router': 'Router',
  'firewall': 'Firewall',
  'switch': 'Switch',
  'server': 'Server',
  'workstation': 'Workstation',
  'laptop': 'Laptop',
  'access-point': 'Access Point',
  'iot': 'IoT Device',
  'nas': 'NAS',
  'vm-host': 'VM Host',
  'reverse-proxy': 'Reverse Proxy',
};

export const DEVICE_CATEGORIES: { label: string; types: DeviceType[] }[] = [
  { label: 'Core Network', types: ['router', 'firewall', 'switch'] },
  { label: 'Servers', types: ['server', 'vm-host', 'reverse-proxy', 'nas'] },
  { label: 'Clients', types: ['workstation', 'laptop'] },
  { label: 'Wireless & IoT', types: ['access-point', 'iot'] },
];

export const DEVICE_ICON_COLORS: Record<DeviceType, string> = {
  'router': '#2dd4bf',
  'firewall': '#f87171',
  'switch': '#60a5fa',
  'server': '#a78bfa',
  'workstation': '#e5e5e5',
  'laptop': '#e5e5e5',
  'access-point': '#4ade80',
  'iot': '#fb923c',
  'nas': '#fbbf24',
  'vm-host': '#2dd4bf',
  'reverse-proxy': '#60a5fa',
};

export const LINK_SPEEDS = ['10M', '100M', '1G', '10G', '10G+'] as const;
