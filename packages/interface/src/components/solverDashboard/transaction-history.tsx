'use client';

import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/solverDashboard/ui/card';
import { Badge } from '@/components/solverDashboard/ui/badge';
// import { Button } from '@/components/solverDashboard/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/solverDashboard/ui/select';

// import datacontext
import { useDataContext } from '@/lib/solverDashboard/data-context';
// import { UserData, ChainDebt, Debt, Transaction } from '@/lib/types';
import { formatEther } from 'viem';

export function TransactionHistory() {
  const [transactionType, setTransactionType] = useState<string>('all');

  const { userData, isLoading } = useDataContext();

  function calculateTimeAgo(timestamp: number): string {
    const now = Date.now(); // in milliseconds
    const timeStampMs = timestamp * 1000; // convert seconds to ms
    const diffMs = now - timeStampMs;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours} hours ${remainingMinutes} minutes ago`
        : `${hours} hours ago`;
    } else {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return (
          <Badge
            variant='outline'
            className='bg-[#0f3a2c] text-[#34d399] border-[#10b981] font-medium'
          >
            Deposit
          </Badge>
        );
      case 'borrow':
        return (
          <Badge
            variant='outline'
            className='bg-[#3a2a0f] text-[#fbbf24] border-[#f59e0b] font-medium'
          >
            Borrow
          </Badge>
        );
      case 'repay':
        return (
          <Badge
            variant='outline'
            className='bg-[#2e0f3a] text-[#a78bfa] border-[#8b5cf6] font-medium'
          >
            Repay
          </Badge>
        );
      case 'withdraw':
        return (
          <Badge
            variant='outline'
            className='bg-[#420000] text-[#ff0000] border-[#ff0000] font-medium'
          >
            Withdraw
          </Badge>
        );
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className='h-4 w-4 text-[#34d399]' />;
      case 'borrow':
        return <ArrowUpFromLine className='h-4 w-4 text-[#fbbf24]' />;
      case 'withdraw':
        return <ArrowUpFromLine className='h-4 w-4 text-[#ff2c2c]' />;
      case 'repay':
        return <RefreshCw className='h-4 w-4 text-[#a78bfa]' />;
    }
  };

  // const filteredTransactions =
  //   transactionType === 'all'
  //     ? transactions
  //     : transactions.filter((tx) => tx.type === transactionType);

  const classifiedTransactions = userData.transactions
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .map((tx) => {
      const type = tx.deposit
        ? 'deposit'
        : tx.withdraw
        ? 'withdraw'
        : tx.borrow
        ? 'borrow'
        : tx.repay
        ? 'repay'
        : 'unknown';

      return {
        ...tx,
        type,
      };
    });

  const filteredTrx =
    transactionType === 'all'
      ? classifiedTransactions
      : classifiedTransactions.filter((tx) => tx.type === transactionType);

  return (
    <Card className='border border-[#2d3f5e] bg-[#0a1021] shadow-lg'>
      <CardHeader className='pb-2'>
        <div className='flex flex-col md:flex-row justify-between md:items-center gap-2'>
          <div>
            <CardTitle className='text-lg font-medium text-white'>
              Transaction History
            </CardTitle>
            <CardDescription className='text-gray-300'>
              Recent solver activity
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-full md:w-48'>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'>
                  <SelectValue placeholder='Filter transactions' />
                </SelectTrigger>
                <SelectContent className='bg-[#0a1021] border border-[#2d3f5e] text-white'>
                  <SelectItem
                    value='all'
                    className='focus:bg-[#1e2b45] focus:text-white'
                  >
                    All Transactions
                  </SelectItem>
                  <SelectItem
                    value='deposit'
                    className='focus:bg-[#1e2b45] focus:text-white'
                  >
                    Deposits
                  </SelectItem>
                  <SelectItem
                    value='borrow'
                    className='focus:bg-[#1e2b45] focus:text-white'
                  >
                    Borrows
                  </SelectItem>
                  <SelectItem
                    value='repay'
                    className='focus:bg-[#1e2b45] focus:text-white'
                  >
                    Repays
                  </SelectItem>
                  <SelectItem
                    value='withdraw'
                    className='focus:bg-[#1e2b45] focus:text-white'
                  >
                    Withdraw
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              className="h-9 border-[#2d3f5e] bg-[#121a30] text-white hover:bg-[#1e2b45]"
            >
              View All
            </Button> */}
          </div>
        </div>
      </CardHeader>
      {/* Card Content without scroller */}
      {/* <CardContent>
        <div className='space-y-4'>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className='flex items-center justify-between p-3 rounded-lg bg-[#121a30] border border-[#1e2b45]'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#1e2b45]'>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      {getTransactionLabel(tx.type)}
                      {tx.chain && (
                        <Badge
                          variant='secondary'
                          className='text-xs bg-[#1e2b45] text-white'
                        >
                          {tx.chain}
                        </Badge>
                      )}
                    </div>
                    <div className='text-sm text-gray-300 mt-1'>
                      {formatTime(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-medium text-white'>
                    {tx.type === 'deposit'
                      ? '+'
                      : tx.type === 'borrow'
                      ? '-'
                      : '+'}
                    {tx.amount.toFixed(2)} ETH
                  </div>
                  <div className='text-xs text-[#3b82f6] mt-1'>
                    <a
                      href='#'
                      className='hover:underline hover:text-[#60a5fa]'
                    >
                      View Transaction
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-8 text-center text-gray-400'>
              No {transactionType !== 'all' ? transactionType : ''} transactions
              found
            </div>
          )}
        </div>
      </CardContent> */}
      <CardContent>
        {/* Scrollable container with fixed height */}
        <div className='max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2d3f5e] scrollbar-track-[#121a30]'>
          <div className='space-y-4'>
            {filteredTrx.length > 0 ? (
              filteredTrx.map((tx) => (
                <div
                  key={tx.id}
                  className='flex items-center justify-between p-3 rounded-lg bg-[#121a30] border border-[#1e2b45]'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#1e2b45]'>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className='flex items-center gap-2'>
                        {getTransactionLabel(tx.type)}
                        {tx.chainId && (
                          <Badge
                            variant='secondary'
                            className='text-xs bg-[#1e2b45] text-white'
                          >
                            {`${
                              tx.chainId === '11155420'
                                ? 'OP'
                                : tx.chainId === '84532'
                                ? 'Base'
                                : tx.chainId === '421614'
                                ? 'Arbitrum'
                                : 'Pharosss'
                            }`}
                          </Badge>
                        )}
                      </div>
                      <div className='text-sm text-gray-300 mt-1'>
                        {+tx.timestamp === 0
                          ? 'Now'
                          : calculateTimeAgo(+tx.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium text-white'>
                      {tx.type === 'deposit'
                        ? '+'
                        : tx.type === 'borrow'
                        ? '-'
                        : tx.type === 'withdraw'
                        ? '-'
                        : '+'}
                      {tx.deposit
                        ? formatEther(BigInt(tx.deposit.amount))
                        : tx.repay
                        ? formatEther(BigInt(tx.repay.amount))
                        : tx.borrow
                        ? formatEther(BigInt(tx.borrow.amount))
                        : tx.withdraw
                        ? formatEther(BigInt(tx.withdraw.amount))
                        : 0}{' '}
                      ETH
                    </div>
                    <div className='text-xs text-[#3b82f6] mt-1'>
                      <a
                        href={`https://${
                          tx.chainId === '84532'
                            ? 'sepolia.basescan.org'
                            : tx.chainId === '421614'
                            ? 'sepolia.arbiscan.io'
                            : tx.chainId === '11155420'
                            ? 'sepolia-optimism.etherscan.io'
                            : ''
                        }/tx/${tx.hash}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        View Transaction
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='p-8 text-center text-gray-400'>
                No {transactionType !== 'all' ? transactionType : ''}{' '}
                transactions found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
