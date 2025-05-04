import { http, createConfig } from '@wagmi/core';
import { arbitrumSepolia, baseSepolia } from '@wagmi/core/chains';

export const config = createConfig({
  chains: [arbitrumSepolia, baseSepolia],
  transports: {
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
  },
});
