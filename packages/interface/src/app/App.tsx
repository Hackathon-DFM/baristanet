'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { http, WagmiProvider } from 'wagmi';
import { getClient, getPublicClient } from '@wagmi/core';
import { arbitrumSepolia, baseSepolia, optimismSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/solverDashboard/theme-provider';
import { pharosDevnet } from '@/lib/solverDashboard/chain-definitions';
import { DataProvider } from '@/lib/solverDashboard/data-context';
import { usePathname } from 'next/navigation';
import PharosHealthChecker from '@/lib/solverDashboard/pharos-checker';

const swapConfig = getDefaultConfig({
  appName: 'LearnDoSwap',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arbitrumSepolia, baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
  },
});

const solverConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [pharosDevnet, arbitrumSepolia, baseSepolia, optimismSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [pharosDevnet.id]: http(process.env.NEXT_PUBLIC_PHAROS_DEVNET_RPC_URL),
  },
});

export const viemClient = getPublicClient(solverConfig);

const queryClient = new QueryClient();

const App = ({ children }: { children: ReactNode }) => {
  // Getting current path
  const pathname = usePathname();

  const isSolverPage = pathname.includes('solver');
  const config = isSolverPage ? solverConfig : swapConfig;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {isSolverPage ? (
              <DataProvider>
                {children}
                <Toaster
                  position="top-right"
                  theme="dark"
                  toastOptions={{
                    style: {
                      background: '#121a30',
                      border: '1px solid #2d3f5e',
                      color: 'white',
                    },
                    // success: {
                    //   style: {
                    //     borderLeft: '4px solid #10b981',
                    //   },
                    // },
                    // error: {
                    //   style: {
                    //     borderLeft: '4px solid #ef4444',
                    //   },
                    // },
                  }}
                />
                <PharosHealthChecker />
              </DataProvider>
            ) : (
              children
            )}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};

export default App;
