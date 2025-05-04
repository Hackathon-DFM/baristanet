'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/solverDashboard/ui/card';
import { Tabs, TabsContent } from '@/components/solverDashboard/ui/tabs';
// import { Progress } from '@/components/solverDashboard/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/solverDashboard/ui/select';
import { toast } from 'sonner';

// import datacontext
import { useDataContext } from '@/lib/solverDashboard/data-context';
// import { UserData, ChainDebt, Debt, Transaction } from '@/lib/types';
import { formatEther } from 'viem';
// // Define a type for chain debt
// type ChainDebt = {
//   id: string;
//   name: string;
//   amount: number;
// };

export function DataCards() {
  const { userData, isLoading } = useDataContext();
  // console.log(userData);
  const [selectedChain, setSelectedChain] = useState<string>('all');

  // Calculate total debt across all chains
  const totalDebtInWei = userData.debts.reduce(
    (sum, debt) => sum + BigInt(debt.amount),
    BigInt(0)
  );
  const totalDebt = parseFloat(formatEther(totalDebtInWei));
  // const utilizationRate = (1e18 / +userData.collateralBalance) * 100;
  const collateral = parseFloat(
    formatEther(BigInt(userData.collateralBalance))
  );

  const handleChainSelect = (value: string) => {
    setSelectedChain(value);
    if (value !== 'all') {
      const chain = userData.debts.find((c) => c.chainId);
      if (chain) {
        toast(
          `${
            chain.chainId === '11155420'
              ? 'OP'
              : chain.chainId === '84532'
              ? 'Base'
              : chain.chainId === '421614'
              ? 'Arbitrum'
              : '#'
          } Selected`,
          {
            description: `Viewing debt details for ${
              chain.chainId === '11155420'
                ? 'OP'
                : chain.chainId === '84532'
                ? 'Base'
                : chain.chainId === '421614'
                ? 'Arbitrum'
                : '#'
            }`,
          }
        );
      }
    }
  };

  // {`${
  //   chain.chainId === '11155420'
  //     ? 'OP'
  //     : chain.chainId === '84532'
  //     ? 'Base'
  //     : chain.chainId === '421614'
  //     ? 'Arbitrum'
  //     : '#'
  // }`}

  return (
    <>
      <Card className="border border-[#2d3f5e] bg-[#0a1021] shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-white">
            Collateral
          </CardTitle>
          <CardDescription className="text-gray-300">
            Available collateral for borrowing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">{`${(
              +collateral - +totalDebt
            ).toFixed(6)}`}</span>
            <span className="ml-1 text-xl text-gray-300">ETH</span>
          </div>
          {/* Progress Bar Utilization */}
          {/* <div className='mt-4'>
            <div className='flex justify-between text-sm mb-1'>
              <span className='text-white'>Utilization</span>
              <span className='text-white'>{utilizationRate.toFixed(0)}%</span>
            </div>
            <Progress
              value={utilizationRate}
              className='h-2 bg-[#1e2b45]'
              indicatorClassName='bg-[#10b981]'
            />
          </div> */}
        </CardContent>
      </Card>

      <Card className="border border-[#2d3f5e] bg-[#0a1021] shadow-lg col-span-2">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-lg font-medium text-white">
                Debt
              </CardTitle>
              <CardDescription className="text-gray-300">
                Current debt across chains
              </CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedChain} onValueChange={handleChainSelect}>
                <SelectTrigger className="bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]">
                  <SelectValue placeholder="Select a chain" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a1021] border border-[#2d3f5e] text-white">
                  <SelectItem
                    value="all"
                    className="focus:bg-[#1e2b45] focus:text-white"
                  >
                    All Chains
                  </SelectItem>
                  {/* {data.debt.map((chain) => (
                    <SelectItem
                      key={chain.id}
                      value={chain.id}
                      className='focus:bg-[#1e2b45] focus:text-white'
                    >
                      {chain.name}
                    </SelectItem>
                  ))} */}
                  {userData.debts.map((chain) => (
                    <SelectItem
                      key={chain.chainId}
                      value={`${chain.chainId}`}
                      className="focus:bg-[#1e2b45] focus:text-white"
                    >
                      {`${
                        chain.chainId === '11155420'
                          ? 'OP'
                          : chain.chainId === '84532'
                          ? 'Base'
                          : chain.chainId === '421614'
                          ? 'Arbitrum'
                          : '#'
                      }`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedChain} className="w-full">
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {userData.debts.map((chain) => (
                  <div
                    key={chain.chainId}
                    className="p-4 rounded-lg bg-[#121a30] border border-[#1e2b45]"
                  >
                    <div className="text-sm font-medium text-gray-300 mb-1">
                      {`${
                        chain.chainId === '11155420'
                          ? 'OP'
                          : chain.chainId === '84532'
                          ? 'Base'
                          : chain.chainId === '421614'
                          ? 'Arbitrum'
                          : '#'
                      }`}
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">
                        {`${formatEther(BigInt(chain.amount))}`}
                      </span>
                      <span className="ml-1 text-sm text-gray-300">ETH</span>
                    </div>
                  </div>
                ))}

                {/* Data di tampilan all chain */}
                {/* {data.debt.map((chain) => (
                  <div
                    key={chain.id}
                    className='p-4 rounded-lg bg-[#121a30] border border-[#1e2b45]'
                  >
                    <div className='text-sm font-medium text-gray-300 mb-1'>
                      {chain.name}
                    </div>
                    <div className='flex items-baseline'>
                      <span className='text-2xl font-bold text-white'>
                        {chain.amount}
                      </span>
                      <span className='ml-1 text-sm text-gray-300'>ETH</span>
                    </div>
                  </div>
                ))} */}
              </div>
              <div className="mt-4 p-4 rounded-lg bg-[#121a30] border border-[#1e2b45]">
                <div className="text-sm font-medium text-gray-300 mb-1">
                  Total Debt
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-white">
                    {totalDebt}
                  </span>
                  <span className="ml-1 text-sm text-gray-300">ETH</span>
                </div>
              </div>
            </TabsContent>

            {/* Data di pilihan chain */}
            {/* {data.debt.map((chain) => (
              <TabsContent key={chain.id} value={chain.id} className='mt-0'>
                <div className='p-4 rounded-lg bg-[#121a30] border border-[#1e2b45]'>
                  <div className='text-sm font-medium text-gray-300 mb-1'>
                    {chain.name} Debt
                  </div>
                  <div className='flex items-baseline'>
                    <span className='text-3xl font-bold text-white'>
                      {chain.amount}
                    </span>
                    <span className='ml-1 text-xl text-gray-300'>ETH</span>
                  </div>
                  <div className='mt-4'>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-white'>Percentage of Total</span>
                      <span className='text-white'>
                        {((chain.amount / totalDebt) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(chain.amount / totalDebt) * 100}
                      className='h-2 bg-[#1e2b45]'
                      indicatorClassName='bg-[#3b82f6]'
                    />
                  </div>
                </div>
              </TabsContent>
            ))} */}
            {userData.debts.map((chain) => (
              <TabsContent
                key={chain.chainId}
                value={chain.chainId}
                className="mt-0"
              >
                <div className="p-4 rounded-lg bg-[#121a30] border border-[#1e2b45]">
                  <div className="text-sm font-medium text-gray-300 mb-1">
                    {chain.chainId === '11155420'
                      ? 'OP'
                      : chain.chainId === '84532'
                      ? 'Base'
                      : chain.chainId === '421614'
                      ? 'Arbitrum'
                      : '#'}{' '}
                    Debt
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white">
                      {`${formatEther(BigInt(chain.amount))}`}
                    </span>
                    <span className="ml-1 text-xl text-gray-300">ETH</span>
                  </div>
                  {/* <div className='mt-4'>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-white'>Percentage of Total</span>
                      <span className='text-white'>
                        {((chain.amount / totalDebt) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(chain.amount / totalDebt) * 100}
                      className='h-2 bg-[#1e2b45]'
                      indicatorClassName='bg-[#3b82f6]'
                    />
                  </div> */}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
