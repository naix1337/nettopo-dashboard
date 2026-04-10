import { Network } from '@/types/network';

export const sampleNetworks: Network[] = [
  {
    id: 'net-1',
    name: 'Home LAN',
    description: 'Primary home network',
    devices: [
      { id: 'd1', name: 'Fritz!Box 7590', type: 'router', ip: '192.168.1.1', position: { x: 400, y: 80 } },
      { id: 'd2', name: 'Unifi Switch 24', type: 'switch', ip: '192.168.1.3', position: { x: 400, y: 220 } },
      { id: 'd3', name: 'Proxmox Node', type: 'vm-host', ip: '192.168.1.10', position: { x: 200, y: 360 } },
      { id: 'd4', name: 'Synology NAS DS923+', type: 'nas', ip: '192.168.1.20', position: { x: 400, y: 360 } },
      { id: 'd5', name: 'Desktop-PC', type: 'workstation', ip: '192.168.1.50', position: { x: 600, y: 360 } },
      { id: 'd6', name: 'Home Assistant', type: 'server', ip: '192.168.1.100', position: { x: 200, y: 500 } },
      { id: 'd7', name: 'Unifi AP AC Pro', type: 'access-point', ip: '192.168.1.5', position: { x: 600, y: 220 } },
    ],
    connections: [
      { id: 'c1', sourceId: 'd1', targetId: 'd2' },
      { id: 'c2', sourceId: 'd2', targetId: 'd3' },
      { id: 'c3', sourceId: 'd2', targetId: 'd4' },
      { id: 'c4', sourceId: 'd2', targetId: 'd5' },
      { id: 'c5', sourceId: 'd2', targetId: 'd7' },
      { id: 'c6', sourceId: 'd3', targetId: 'd6' },
    ],
  },
  {
    id: 'net-2',
    name: 'Server DMZ',
    description: 'Demilitarized zone for public services',
    vlanId: '10',
    devices: [
      { id: 'd8', name: 'OPNsense VM', type: 'firewall', ip: '192.168.10.1', position: { x: 300, y: 100 } },
      { id: 'd9', name: 'Nginx Proxy Manager', type: 'reverse-proxy', ip: '192.168.10.5', position: { x: 300, y: 260 } },
      { id: 'd10', name: 'Gitea', type: 'server', ip: '192.168.10.10', position: { x: 150, y: 400 } },
      { id: 'd11', name: 'Grafana + InfluxDB', type: 'server', ip: '192.168.10.15', position: { x: 450, y: 400 } },
    ],
    connections: [
      { id: 'c7', sourceId: 'd8', targetId: 'd9' },
      { id: 'c8', sourceId: 'd9', targetId: 'd10' },
      { id: 'c9', sourceId: 'd9', targetId: 'd11' },
    ],
  },
  {
    id: 'net-3',
    name: 'Management VLAN',
    description: 'Infrastructure management network',
    vlanId: '99',
    devices: [
      { id: 'd12', name: 'Unifi Controller', type: 'server', ip: '192.168.99.1', position: { x: 200, y: 150 } },
      { id: 'd13', name: 'Check_MK', type: 'server', ip: '192.168.99.2', position: { x: 400, y: 150 } },
      { id: 'd14', name: 'Core Switch', type: 'switch', ip: '192.168.99.3', position: { x: 300, y: 300 } },
    ],
    connections: [
      { id: 'c10', sourceId: 'd14', targetId: 'd12' },
      { id: 'c11', sourceId: 'd14', targetId: 'd13' },
    ],
  },
];
