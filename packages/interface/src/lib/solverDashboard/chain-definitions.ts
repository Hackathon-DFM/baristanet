import { defineChain } from 'viem';

export const pharosDevnet = defineChain({
  id: 50002,
  name: 'Pharos Devnet',
  network: 'pharos',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://devnet.dplabs-internal.com/'] },
    public: { http: ['https://devnet.dplabs-internal.com/'] },
  },
  blockExplorers: {
    default: { name: 'PharosScan', url: 'https://pharosscan.xyz/' },
  },
});
