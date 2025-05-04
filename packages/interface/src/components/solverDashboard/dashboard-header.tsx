'use client';

// import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/solverDashboard/ui/button';
import { toast } from 'sonner';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';

const explorerUrls: Record<number, string> = {
  11155111: 'https://sepolia.etherscan.io',
  84532: 'https://sepolia.basescan.org',
  11155420: 'https://sepolia-optimism.etherscan.io',
  50002: 'https://pharosscan.xyz',
  421614: 'https://sepolia.arbiscan.io',
  // Add other chain IDs and URLs as needed
};

export function ExplorerButton({ address }: { address: string | undefined }) {
  const chainId = useChainId();
  const baseUrl = explorerUrls[chainId] ?? 'https://pharosscan.xyz';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1e2b45]"
      asChild
    >
      <a
        href={`${baseUrl}/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="sr-only">View on Explorer</span>
      </a>
    </Button>
  );
}

export function DashboardHeader() {
  const { address } = useAccount();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address || '');
    toast.success('Address copied', {
      description: 'Solver address copied to clipboard',
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 rounded-lg bg-[#0a1021] border border-[#1e2b45]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Solver Dashboard
        </h1>
        <div className="flex items-center mt-2 text-sm text-gray-300">
          <span className="font-medium">Solver Address:</span>
          <span className="ml-2 font-mono truncate max-w-[200px] md:max-w-md">
            {address}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-1 text-gray-300 hover:text-white hover:bg-[#1e2b45]"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy address</span>
          </Button>
          {/* <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-gray-300 hover:text-white hover:bg-[#1e2b45]'
            asChild
          >
            <a
              href={`https://etherscan.io/address/${address}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ExternalLink className='h-4 w-4' />
              <span className='sr-only'>View on Etherscan</span>
            </a>
          </Button> */}
          <ExplorerButton address={address} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ConnectButton />
        {/* <Button className="h-9 bg-[#10b981] hover:bg-[#0d9668] text-white font-medium">Manage Solver</Button> */}
      </div>
    </div>
  );
}
