'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/crossChainSwap/utils';
import type { SwapTransaction } from '@/lib/crossChainSwap/types';

interface TransactionStatusBadgeProps {
  transaction: SwapTransaction;
  onClick: () => void;
  onClose: () => void;
}

export default function TransactionStatusBadge({
  transaction,
  onClick,
  onClose,
}: TransactionStatusBadgeProps) {
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'swapping':
        return <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (transaction.status) {
      case 'processing':
        return 'Processing';
      case 'swapping':
        return 'Swapping';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'processing':
        return 'text-blue-400';
      case 'swapping':
        return 'text-purple-400';
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-lg transition-all duration-300 w-auto">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={cn('text-sm font-medium', getStatusColor())}>
            {getStatusText()}
          </span>
          <span className="text-xs text-slate-400">
            {transaction.sourceToken.symbol}
            {` (${transaction.sourceChain.name})`} →{' '}
            {transaction.destinationToken.symbol}{' '}
            {` (${transaction.destinationToken.network})`}
          </span>
        </div>

        <button
          className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 ml-2"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
