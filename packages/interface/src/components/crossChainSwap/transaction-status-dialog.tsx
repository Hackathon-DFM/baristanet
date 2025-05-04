'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/crossChainSwap/ui/dialog';
import { Button } from '@/components/crossChainSwap/ui/button';
import type {
  Network,
  Token,
  TransactionStatus,
} from '@/lib/crossChainSwap/types';
import { CheckCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/crossChainSwap/utils';
import { Address } from 'viem';

interface TransactionStatusDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sourceToken: Token | null;
  destinationToken: Token | null;
  sourceAmount: string;
  destinationAmount: string;
  sourceChain: Network;
  destinationChain: Token | null;
  transactionHash: Address | null;
  solverTransactionHash: string | null; // Added for the solver transaction hash
  status: TransactionStatus;
  error?: string | null;
}

export default function TransactionStatusDialog({
  sourceAmount,
  sourceToken,
  sourceChain,
  destinationAmount,
  destinationToken,
  destinationChain,
  isOpen,
  setIsOpen,
  transactionHash,
  solverTransactionHash,
  status,
  error,
}: TransactionStatusDialogProps) {
  const getStatusTitle = () => {
    switch (status) {
      case 'processing':
        return 'Processing Swap';
      case 'swapping':
        return 'Swapping Tokens';
      case 'completed':
        return 'Swap Completed!';
      case 'error':
        return 'Swap Failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'processing':
        return 'Preparing your cross-chain swap transaction...';
      case 'swapping':
        return 'Executing token exchange on destination chain...';
      case 'completed':
        return 'Your swap has been successfully completed!';
      case 'error':
        return error || 'There was an error processing your swap.';
      default:
        return 'Processing your transaction...';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />;
      case 'swapping':
        return <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-400" />;
      default:
        return <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />;
    }
  };

  const getOpenOrderExplorerUrl = (hash: string) => {
    if (!hash) return '';

    // In a real app, you would determine the correct explorer URL based on the chain
    if (sourceChain.name === 'ARB Sepolia') {
      return `https://sepolia.arbiscan.io/tx/${hash}`;
    } else if (sourceChain.name === 'Base Sepolia') {
      return `https://sepolia.basescan.org/tx/${hash}`;
    }

    return `https://etherscan.io/tx/${hash}`;
  };
  const getFilledOrderExplorerUrl = (hash: string) => {
    if (!hash) return '';

    // In a real app, you would determine the correct explorer URL based on the chain
    if (sourceChain.name === 'ARB Sepolia') {
      return `https://sepolia.basescan.org/tx/${hash}`;
    } else if (sourceChain.name === 'Base Sepolia') {
      return `https://sepolia.arbiscan.io/tx/${hash}`;
    }

    return `https://etherscan.io/tx/${hash}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            <span>{getStatusTitle()}</span>
          </DialogTitle>
          <p className="text-slate-400 mt-2">{getStatusDescription()}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status steps indicator */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                  status === 'processing'
                    ? 'bg-blue-500 text-white'
                    : status === 'swapping' ||
                      status === 'completed' ||
                      status === 'error'
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-slate-700 text-slate-400'
                )}
              >
                {status === 'processing' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  status === 'processing'
                    ? 'text-blue-400'
                    : status === 'swapping' ||
                      status === 'completed' ||
                      status === 'error'
                    ? 'text-blue-300'
                    : 'text-slate-400'
                )}
              >
                Processing
              </span>
            </div>

            <div
              className={cn(
                'flex-1 h-0.5 mx-2',
                status === 'processing' ? 'bg-slate-700' : 'bg-blue-900'
              )}
            />

            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                  status === 'swapping'
                    ? 'bg-purple-500 text-white'
                    : status === 'completed' || status === 'error'
                    ? 'bg-purple-900 text-purple-300'
                    : 'bg-slate-700 text-slate-400'
                )}
              >
                {status === 'swapping' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : status === 'completed' || status === 'error' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  status === 'swapping'
                    ? 'text-purple-400'
                    : status === 'completed' || status === 'error'
                    ? 'text-purple-300'
                    : 'text-slate-400'
                )}
              >
                Swapping
              </span>
            </div>

            <div
              className={cn(
                'flex-1 h-0.5 mx-2',
                status === 'completed' || status === 'error'
                  ? 'bg-green-900'
                  : 'bg-slate-700'
              )}
            />

            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                  status === 'completed'
                    ? 'bg-green-500 text-white'
                    : status === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                )}
              >
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : status === 'error' ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <span className="h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  status === 'completed'
                    ? 'text-green-400'
                    : status === 'error'
                    ? 'text-red-400'
                    : 'text-slate-400'
                )}
              >
                {status === 'error' ? 'Failed' : 'Complete'}
              </span>
            </div>
          </div>

          {/* Transaction details */}
          <div className="rounded-lg bg-slate-700 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">From</span>
              <div className="flex items-center gap-2">
                {sourceToken && (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img
                      src={
                        sourceToken.logoURI ||
                        '/placeholder.svg?height=20&width=20'
                      }
                      alt={sourceToken.symbol}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="font-medium">
                  {sourceAmount} {sourceToken?.symbol} ({sourceChain.name})
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">To</span>
              <div className="flex items-center gap-2">
                {destinationToken && (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img
                      src={
                        destinationToken.logoURI ||
                        '/placeholder.svg?height=20&width=20'
                      }
                      alt={destinationToken.symbol}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="font-medium">
                  {destinationAmount} {destinationToken?.symbol} (
                  {destinationChain?.network})
                </span>
              </div>
            </div>

            {/* Status with action buttons on the right */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <div className="flex flex-col gap-2 items-end">
                {/* Processing status */}

                {/* Processing button - Open Order Intent */}
                {(status === 'processing' ||
                  status === 'swapping' ||
                  status === 'completed') &&
                  transactionHash && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-slate-600 border-slate-500 hover:bg-slate-500 text-xs py-1 h-auto"
                      onClick={() =>
                        window.open(
                          getOpenOrderExplorerUrl(transactionHash),
                          '_blank'
                        )
                      }
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View Open Order Intent
                    </Button>
                  )}

                {/* Swapping button - Solver Fill Order */}
                {(status === 'swapping' || status === 'completed') &&
                  solverTransactionHash && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-slate-600 border-slate-500 hover:bg-slate-500 text-xs py-1 h-auto"
                      onClick={() =>
                        window.open(
                          getFilledOrderExplorerUrl(solverTransactionHash),
                          '_blank'
                        )
                      }
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View Filled Order
                    </Button>
                  )}

                {/* Completed text */}
                {/* {status === 'completed' && (
                  <span className="text-green-400 text-xs font-medium">
                    Swap completed
                  </span>
                )} */}

                <div className="flex items-center gap-2">
                  {status === 'processing' && (
                    <span className="text-blue-400 font-medium">
                      Processing
                    </span>
                  )}
                  {status === 'swapping' && (
                    <span className="text-purple-400 font-medium">
                      Swapping
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="text-green-400 font-medium">
                      Completed
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="text-red-400 font-medium">Failed</span>
                  )}
                </div>
              </div>
            </div>

            {/* {status === 'completed' && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Time</span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            )} */}
          </div>

          {/* Action button - Only Close button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="w-full bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
