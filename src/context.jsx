import { createContext } from 'react';

export const NetworksContext = createContext({
  networks: [],
  activeNetworkId: null,
  setActiveNetworkId: () => {},
  activeNetworkData: null,
  refreshData: () => {},
  selection: { type: null, id: null },
  setSelection: () => {},
  connectMode: false,
  setConnectMode: () => {}
});
