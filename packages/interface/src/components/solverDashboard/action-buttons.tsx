'use client';

import { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/solverDashboard/ui/card';
import { Button } from '@/components/solverDashboard/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/solverDashboard/ui/dialog';
import { Input } from '@/components/solverDashboard/ui/input';
import { Label } from '@/components/solverDashboard/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/solverDashboard/ui/select';
import { toast } from 'sonner';

import { Address, parseEther } from 'viem';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi';

// import ABIs
import { BrewHouseAbi } from '@/abis/BrewHouseAbi';
import { LattePoolAbi } from '@/abis/LattePoolAbi';

// import API
import {
  getSignatureFromAPI,
  getBorrowSignatureFromAPI,
  getRepaySignatureFromAPI,
} from '@/api/api-calls';

import { viemClient } from '../../app/App';
import { estimateGas } from '@wagmi/core';

type ChainDebt = {
  id: string;
  name: string;
  contractAddress: string;
  rpcUrl: string;
};

// Contract addresses
const DEPOSIT_AND_WITHDRAW_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DEPOSIT_AND_WITHDRAW_CONTRACT_ADDRESS;
const BASE_CONTRACT_ADDRESS = '0x56545f21dff77950e9fbfc27725f82150a4d7512';
const ARBITRUM_CONTRACT_ADDRESS = '0xfca3819dd85017a11aa23ed08f57cd31db8e96cd';

export function ActionButtons() {
  const { address, chain } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayChain, setRepayChain] = useState('');
  const [borrowChain, setBorrowChain] = useState('');
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isRepayOpen, setIsRepayOpen] = useState(false);
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBorrowChainConnected, setIsBorrowChainConnected] = useState(false);
  const [isRepayChainConnected, setIsRepayChainConnected] = useState(false);
  const [isDepositChainConnected, setIsDepositChainConnected] = useState(false);
  const [isWithdrawChainConnected, setIsWithdrawChainConnected] =
    useState(false);

  // Transaction hashes
  const [depositTxHash, setDepositTxHash] = useState<
    `0x${string}` | undefined
  >();
  const [borrowTxHash, setBorrowTxHash] = useState<`0x${string}` | undefined>();
  const [withdrawTxHash, setWithdrawTxHash] = useState<
    `0x${string}` | undefined
  >();
  const [repayTxHash, setRepayTxHash] = useState<`0x${string}` | undefined>();

  const [chains, setChains] = useState<ChainDebt[]>([
    {
      id: '421614',
      name: 'Arbitrum Sepolia',
      contractAddress: ARBITRUM_CONTRACT_ADDRESS,
      rpcUrl: 'https://arbitrum-sepolia-rpc.publicnode.com',
    },
    {
      id: '84532',
      name: 'Base Sepolia',
      contractAddress: BASE_CONTRACT_ADDRESS,
      rpcUrl: 'https://base-sepolia-rpc.publicnode.com',
    },
  ]);

  // Set default repay chain when chains are loaded
  useEffect(() => {
    if (chains.length > 0 && !repayChain && !borrowChain) {
      setRepayChain(chains[0].id);
      setBorrowChain(chains[0].id);
    }
  }, [chains, repayChain, borrowChain]);

  const { switchChain } = useSwitchChain();

  // Setup contract writing
  const {
    writeContract: writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Setup transaction receipt watching
  const {
    isLoading: isDepositTxLoading,
    isSuccess: isDepositSuccess,
    error: depositTxError,
  } = useWaitForTransactionReceipt({
    hash: depositTxHash,
    confirmations: 1,
  });

  const {
    isLoading: isBorrowTxLoading,
    isSuccess: isBorrowSuccess,
    error: borrowTxError,
  } = useWaitForTransactionReceipt({
    hash: borrowTxHash,
    confirmations: 1,
  });

  const {
    isLoading: isWithdrawTxLoading,
    isSuccess: isWithdrawSuccess,
    error: withdrawTxError,
  } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
    confirmations: 1,
  });

  const {
    isLoading: isRepayTxLoading,
    isSuccess: isRepaySuccess,
    error: repayTxError,
  } = useWaitForTransactionReceipt({
    hash: repayTxHash,
    confirmations: 1,
  });

  // Watch for transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Contract write error:', writeError);
      toast.error('Transaction error', {
        description: 'Failed to submit transaction to the blockchain',
      });
      setIsLoading(false);
    }

    if (depositTxError) {
      console.error('Deposit transaction error:', depositTxError);
      toast.error('Deposit failed', {
        description: 'Transaction was submitted but failed to complete',
      });
      setIsLoading(false);
    }

    if (borrowTxError) {
      console.error('Borrow transaction error:', borrowTxError);
      toast.error('Borrow failed', {
        description: 'Transaction was submitted but failed to complete',
      });
      setIsLoading(false);
    }

    if (withdrawTxError) {
      console.error('Withdraw transaction error:', withdrawTxError);
      toast.error('Withdraw failed', {
        description: 'Transaction was submitted but failed to complete',
      });
      setIsLoading(false);
    }

    if (repayTxError) {
      console.error('Repay transaction error:', repayTxError);
      toast.error('Repay failed', {
        description: 'Transaction was submitted but failed to complete',
      });
      setIsLoading(false);
    }
  }, [
    writeError,
    depositTxError,
    borrowTxError,
    withdrawTxError,
    repayTxError,
  ]);

  // Watch for transaction success
  useEffect(() => {
    if (isDepositSuccess) {
      toast.success('Deposit successful', {
        description: `Successfully deposited ${depositAmount} ETH to Pharos`,
      });
      setDepositAmount('');
      setIsDepositOpen(false);
      setIsLoading(false);
      setDepositTxHash(undefined);
    }

    if (isBorrowSuccess) {
      toast.success('Borrow successful', {
        description: `Successfully borrowed ${borrowAmount} ETH on ${
          chains.find((chain) => chain.id === borrowChain)?.name
        }`,
      });
      setBorrowAmount('');
      setIsBorrowOpen(false);
      setIsLoading(false);
      setBorrowTxHash(undefined);
    }

    if (isWithdrawSuccess) {
      toast.success('Withdraw successful', {
        description: `Successfully withdrew funds`,
      });
      setWithdrawAmount('');
      setIsWithdrawOpen(false);
      setIsLoading(false);
      setWithdrawTxHash(undefined);
    }

    if (isRepaySuccess) {
      toast.success('Repay successful', {
        description: `Successfully repaid loan`,
      });
      setRepayAmount('');
      setIsRepayOpen(false);
      setIsLoading(false);
      setRepayTxHash(undefined);
    }
  }, [
    isDepositSuccess,
    isBorrowSuccess,
    isWithdrawSuccess,
    isRepaySuccess,
    depositAmount,
    borrowAmount,
    chains,
    repayChain,
    borrowChain,
  ]);

  async function estimateGasFee() {
    const result = await viemClient.estimateContractGas({
      account: address as Address,
      address: DEPOSIT_AND_WITHDRAW_CONTRACT_ADDRESS as `0x${string}`,
      abi: BrewHouseAbi,
      functionName: 'depositCollateral',
      value: parseEther(depositAmount),
    });
    console.log(result);
    return result;
  }

  const handleDeposit = async () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid deposit amount',
      });
      return;
    }

    try {
      setIsLoading(true);

      writeContract(
        {
          address: DEPOSIT_AND_WITHDRAW_CONTRACT_ADDRESS as `0x${string}`,
          abi: BrewHouseAbi,
          functionName: 'depositCollateral',
          value: parseEther(depositAmount),
          gas: ((await estimateGasFee()) * 12n) / 10n,
        },
        {
          onSuccess(tx) {
            console.log('Deposit transaction hash:', tx);
            setDepositTxHash(tx);
          },
        }
      );
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Deposit failed', {
        description: 'There was an error processing your deposit',
      });
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid withdrawal amount',
      });
      return;
    }

    try {
      setIsLoading(true);

      const amount = parseEther(withdrawAmount);

      const { signature, deadline } = await getSignatureFromAPI({
        solver: address as `0x${string}`,
        amount: amount.toString(),
        contractAddress: DEPOSIT_AND_WITHDRAW_CONTRACT_ADDRESS as Address,
      });

      writeContract(
        {
          address: DEPOSIT_AND_WITHDRAW_CONTRACT_ADDRESS as `0x${string}`,
          abi: BrewHouseAbi,
          functionName: 'withdrawWithSig',
          args: [amount, deadline, signature],
        },
        {
          onSuccess(tx) {
            setWithdrawTxHash(tx);
          },
        }
      );
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Withdrawal failed', {
        description: 'There was an error processing your withdrawal',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!repayAmount || Number.parseFloat(repayAmount) <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid repayment amount',
      });
      return;
    }

    try {
      setIsLoading(true);

      const repay = parseEther(repayAmount);

      const {
        signature,
        contractAddress,
        repayData: { amount, currentDebt, deadline },
      } = await getRepaySignatureFromAPI({
        solver: address as `0x${string}`,
        amount: repay.toString(),
        contractAddress:
          repayChain === '421614'
            ? ARBITRUM_CONTRACT_ADDRESS
            : repayChain === '84532'
            ? BASE_CONTRACT_ADDRESS
            : '',
      });

      switchChain({ chainId: +repayChain });

      writeContract(
        {
          address: contractAddress as `0x${string}`,
          abi: LattePoolAbi,
          functionName: 'repayWithSig',
          args: [amount, currentDebt, deadline, signature],
          value: amount,
        },
        {
          onSuccess(tx) {
            setRepayTxHash(tx);
          },
        }
      );
    } catch (error) {
      console.error('Borrow error:', error);
      toast.error('Borrow failed', {
        description: 'There was an error processing your borrow request',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!borrowAmount || Number.parseFloat(borrowAmount) <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid borrow amount',
      });
      return;
    }

    try {
      setIsLoading(true);

      const borrow = parseEther(borrowAmount);

      const {
        signature,
        contractAddress,
        borrowData: { amount, maxDebt, deadline },
      } = await getBorrowSignatureFromAPI({
        solver: address as `0x${string}`,
        amount: borrow.toString(),
        contractAddress:
          borrowChain === '421614'
            ? ARBITRUM_CONTRACT_ADDRESS
            : borrowChain === '84532'
            ? BASE_CONTRACT_ADDRESS
            : '',
      });

      switchChain({ chainId: +borrowChain });

      writeContract(
        {
          address: contractAddress as `0x${string}`,
          abi: LattePoolAbi,
          functionName: 'borrowWithSig',
          args: [amount, maxDebt, deadline, signature],
        },
        {
          onSuccess(tx) {
            setBorrowTxHash(tx);
          },
        }
      );
    } catch (error) {
      console.error('Borrow error:', error);
      toast.error('Borrow failed', {
        description: 'There was an error processing your borrow request',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Repay with collateral handle
  // const handleRepayWithCollateral = async () => {
  //   if (!repayAmount || Number.parseFloat(repayAmount) <= 0) {
  //     toast.error('Invalid amount', {
  //       description: 'Please enter a valid repayment amount',
  //     });
  //     return;
  //   }

  //   const selectedChain = chains.find((chain) => chain.id === repayChain);
  //   if (!selectedChain) {
  //     toast.error('Invalid chain', {
  //       description: 'Please select a valid chain',
  //     });
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     // Add your repay with collateral logic here when you have the contract method

  //     // For now, we'll just simulate a successful transaction
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     toast.success('Collateral repayment successful', {
  //       description: `Successfully used collateral to repay ${repayAmount} ETH on ${selectedChain.name}`,
  //     });
  //     setRepayAmount('');
  //     setIsRepayOpen(false);
  //   } catch (error) {
  //     console.error('Repay with collateral error:', error);
  //     toast.error('Collateral repayment failed', {
  //       description: 'There was an error processing your collateral repayment',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSwitchBorrowChain = async () => {
    try {
      await switchChain({ chainId: +borrowChain });
      setIsBorrowChainConnected(true);
      toast.success('Switch chain successful', {
        description: `Successfully switched to ${
          borrowChain === '421614'
            ? 'Arbitrum'
            : borrowChain === '84532'
            ? 'Base'
            : ''
        }`,
      });
    } catch (error) {
      console.error('Switch chain error:', error);
      toast.error('Switch chain failed', {
        description: 'There was an error processing your switch chain request',
      });
    }
  };

  const handleSwitchRepayChain = async () => {
    try {
      await switchChain({ chainId: +repayChain });
      setIsRepayChainConnected(true);
      toast.success('Switch chain successful', {
        description: `Successfully switched to ${
          repayChain === '421614'
            ? 'Arbitrum'
            : repayChain === '84532'
            ? 'Base'
            : ''
        }`,
      });
    } catch (error) {
      console.error('Switch chain error:', error);
      toast.error('Switch chain failed', {
        description: 'There was an error processing your switch chain request',
      });
    }
  };

  const handleSwitchDepositChain = async () => {
    try {
      await switchChain({
        chainId: Number(process.env.NEXT_PUBLIC_DEPOSIT_AND_WITHDRAW_CHAIN_ID),
      });
      setIsDepositChainConnected(true);
      toast.success('Switch chain successful', {
        description: `Successfully switched to Pharos`,
      });
    } catch (error) {
      console.error('Switch chain error:', error);
      toast.error('Switch chain failed', {
        description: 'There was an error processing your switch chain request',
      });
    }
  };

  const handleSwitchWithdrawChain = async () => {
    try {
      await switchChain({
        chainId: Number(process.env.NEXT_PUBLIC_DEPOSIT_AND_WITHDRAW_CHAIN_ID),
      });
      setIsWithdrawChainConnected(true);
      toast.success('Switch chain successful', {
        description: `Successfully switched to Pharos`,
      });
    } catch (error) {
      console.error('Switch chain error:', error);
      toast.error('Switch chain failed', {
        description: 'There was an error processing your switch chain request',
      });
    }
  };

  const openBorrowModal = () => {
    setIsBorrowOpen(true);
    setIsBorrowChainConnected(false);
  };

  const openRepayModal = () => {
    setIsRepayOpen(true);
    setIsRepayChainConnected(false);
  };

  const openDepositModal = () => {
    setIsDepositOpen(true);
    setIsDepositChainConnected(
      chain?.id ===
        Number(process.env.NEXT_PUBLIC_DEPOSIT_AND_WITHDRAW_CHAIN_ID)
    );
  };

  const openWithdrawModal = () => {
    setIsWithdrawOpen(true);
    setIsWithdrawChainConnected(
      chain?.id ===
        Number(process.env.NEXT_PUBLIC_DEPOSIT_AND_WITHDRAW_CHAIN_ID)
    );
  };

  return (
    <Card className='border border-[#2d3f5e] bg-[#0a1021] shadow-lg'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg font-medium text-white'>
          Actions
        </CardTitle>
        <CardDescription className='text-gray-300'>
          Manage your solver operations
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Button
          className='w-full justify-start bg-[#121a30] hover:bg-[#1e2b45] text-white border border-[#2d3f5e]'
          onClick={openDepositModal}
        >
          <ArrowDownToLine className='mr-2 h-4 w-4 text-[#10b981]' />
          Deposit
        </Button>

        <Button
          className='w-full justify-start bg-[#121a30] hover:bg-[#1e2b45] text-white border border-[#2d3f5e]'
          onClick={openWithdrawModal}
        >
          <ArrowUpFromLine className='mr-2 h-4 w-4 text-[#ff2c2c]' />
          Withdraw
        </Button>

        <Button
          className='w-full justify-start bg-[#121a30] hover:bg-[#1e2b45] text-white border border-[#2d3f5e]'
          onClick={openRepayModal}
        >
          <RefreshCw className='mr-2 h-4 w-4 text-[#8b5cf6]' />
          Repay Debt
        </Button>

        <Button
          className='w-full justify-start bg-[#121a30] hover:bg-[#1e2b45] text-white border border-[#2d3f5e]'
          onClick={openBorrowModal}
        >
          <ArrowUpFromLine className='mr-2 h-4 w-4 text-[#fbbf24]' />
          Borrow
        </Button>

        {/* Deposit Modal */}
        <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
          <DialogContent className='sm:max-w-[425px] bg-[#0a1021] border border-[#2d3f5e] text-white'>
            {!isDepositChainConnected && (
              <DialogHeader>
                <DialogTitle className='text-white'>
                  Deposit Collateral
                </DialogTitle>
                <p></p>
                <DialogDescription className='text-gray-300'>
                  Chain is not available, switch to the available chain!
                </DialogDescription>
              </DialogHeader>
            )}
            {isDepositChainConnected && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-white'>
                    Deposit Collateral
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    Add ETH collateral to your solver through Pharos
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='deposit-amount' className='text-white'>
                      Amount (ETH)
                    </Label>
                    <Input
                      id='deposit-amount'
                      type='number'
                      placeholder='0.00'
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'
                    />
                  </div>
                  <div className='text-sm text-gray-300'>
                    Deposited collateral will be available for borrowing across
                    all supported chains.
                  </div>
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsDepositOpen(false)}
                className='border-[#2d3f5e] bg-[#121a30] text-white hover:bg-[#1e2b45]'
                disabled={isLoading || isWritePending || isDepositTxLoading}
              >
                Cancel
              </Button>
              {isDepositChainConnected ? (
                <Button
                  onClick={handleDeposit}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium'
                  disabled={isLoading || isWritePending || isDepositTxLoading}
                >
                  {isLoading || isWritePending || isDepositTxLoading
                    ? 'Processing...'
                    : 'Deposit to Pharos'}
                </Button>
              ) : (
                <Button
                  onClick={handleSwitchDepositChain}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium'
                  disabled={isLoading || isWritePending || isDepositTxLoading}
                >
                  Switch to Pharos
                </Button>
              )}
              {/* <Button
                onClick={handleDeposit}
                className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium'
                disabled={isLoading || isWritePending || isDepositTxLoading}
              >
                {isLoading || isWritePending || isDepositTxLoading
                  ? 'Processing...'
                  : 'Deposit to Pharos'}
              </Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Modal */}
        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogContent className='sm:max-w-[425px] bg-[#0a1021] border border-[#2d3f5e] text-white'>
            {!isWithdrawChainConnected && (
              <DialogHeader>
                <DialogTitle className='text-white'>
                  Withdraw Collateral
                </DialogTitle>
                <p></p>
                <DialogDescription className='text-gray-300'>
                  Chain is not available, switch to the available chain!
                </DialogDescription>
              </DialogHeader>
            )}
            {isWithdrawChainConnected && (
              <>
                <DialogHeader>
                  <DialogTitle className='text-white'>
                    Withdraw Collateral
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    Withdraw ETH collateral from your solver through Pharos
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='withdraw-amount' className='text-white'>
                      Amount (ETH)
                    </Label>
                    <Input
                      id='withdraw-amount'
                      type='number'
                      placeholder='0.00'
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'
                    />
                  </div>
                  <div className='text-sm text-gray-300'>
                    You can only withdraw collateral that is not being used to
                    back outstanding debt.
                  </div>
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsWithdrawOpen(false)}
                className='border-[#2d3f5e] bg-[#121a30] text-white hover:bg-[#1e2b45]'
                disabled={isLoading || isWritePending || isWithdrawTxLoading}
              >
                Cancel
              </Button>
              {isWithdrawChainConnected ? (
                <Button
                  onClick={handleWithdraw}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium'
                  disabled={isLoading || isWritePending || isWithdrawTxLoading}
                >
                  {isLoading || isWritePending || isWithdrawTxLoading
                    ? 'Processing...'
                    : 'Withdraw from Pharos'}
                </Button>
              ) : (
                <Button
                  onClick={handleSwitchWithdrawChain}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium'
                  disabled={isLoading || isWritePending || isWithdrawTxLoading}
                >
                  Switch to Pharos
                </Button>
              )}
              {/* <Button
                onClick={handleWithdraw}
                className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium'
                disabled={isLoading || isWritePending || isWithdrawTxLoading}
              >
                {isLoading || isWritePending || isWithdrawTxLoading
                  ? 'Processing...'
                  : 'Withdraw from Pharos'}
              </Button> */}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Repay Modal */}
        <Dialog open={isRepayOpen} onOpenChange={setIsRepayOpen}>
          <DialogContent className='sm:max-w-[425px] bg-[#0a1021] border border-[#2d3f5e] text-white'>
            <DialogHeader>
              <DialogTitle className='text-white'>Repay Debt</DialogTitle>
              <DialogDescription className='text-gray-300'>
                Repay your outstanding debt on a specific chain
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='repay-chain' className='text-white'>
                  Select Chain
                </Label>
                <Select
                  value={repayChain}
                  onValueChange={(value) => {
                    setRepayChain(value);
                    setIsRepayChainConnected(false);
                  }}
                >
                  <SelectTrigger className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'>
                    <SelectValue placeholder='Select a chain' />
                  </SelectTrigger>
                  <SelectContent className='bg-[#0a1021] border border-[#2d3f5e] text-white'>
                    {chains.map((chain) => (
                      <SelectItem
                        key={chain.id}
                        value={chain.id}
                        className='focus:bg-[#1e2b45] focus:text-white'
                      >
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isRepayChainConnected && (
                <div className='grid gap-2'>
                  <Label htmlFor='repay-amount' className='text-white'>
                    Amount (ETH)
                  </Label>
                  <Input
                    id='repay-amount'
                    type='number'
                    placeholder='0.00'
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'
                  />
                </div>
              )}
            </div>

            <DialogFooter className='flex flex-col sm:flex-row gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsRepayOpen(false)}
                className='border-[#2d3f5e] bg-[#121a30] text-white hover:bg-[#1e2b45] w-full sm:w-auto order-3 sm:order-1'
                disabled={isLoading || isRepayTxLoading}
              >
                Cancel
              </Button>
              {/* Repay with Collateral Button */}
              {/* <Button
                variant='secondary'
                onClick={handleRepayWithCollateral}
                className='bg-[#1e2b45] hover:bg-[#2d3f5e] text-white font-medium w-full sm:w-auto order-2'
                disabled={isLoading || isRepayTxLoading}
              >
                {isLoading || isRepayTxLoading
                  ? 'Processing...'
                  : 'Repay with Collateral'}
              </Button> */}
              {/* <Button
                onClick={handleRepay}
                className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium w-full sm:w-auto order-1 sm:order-3'
                disabled={isLoading || isRepayTxLoading}
              >
                {isLoading || isRepayTxLoading ? 'Processing...' : 'Repay Debt'}
              </Button> */}
              {!isRepayChainConnected ? (
                <Button
                  onClick={handleSwitchRepayChain}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium w-full sm:w-auto order-1 sm:order-3'
                >
                  Switch Chain
                </Button>
              ) : (
                <Button
                  onClick={handleRepay}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium w-full sm:w-auto order-1 sm:order-3'
                  disabled={isLoading || isRepayTxLoading}
                >
                  {isLoading || isRepayTxLoading
                    ? 'Processing...'
                    : 'Repay Debt'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Borrow Modal */}
        <Dialog open={isBorrowOpen} onOpenChange={setIsBorrowOpen}>
          <DialogContent className='sm:max-w-[425px] bg-[#0a1021] border border-[#2d3f5e] text-white'>
            <DialogHeader>
              <DialogTitle className='text-white'>Borrow</DialogTitle>
              <DialogDescription className='text-gray-300'>
                Borrow debt on a specific chain
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='borrow-chain' className='text-white'>
                  Select Chain
                </Label>
                <Select
                  value={borrowChain}
                  onValueChange={(value) => {
                    setBorrowChain(value);
                    setIsBorrowChainConnected(false);
                  }}
                >
                  <SelectTrigger className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'>
                    <SelectValue placeholder='Select a chain' />
                  </SelectTrigger>
                  <SelectContent className='bg-[#0a1021] border border-[#2d3f5e] text-white'>
                    {chains.map((chain) => (
                      <SelectItem
                        key={chain.id}
                        value={chain.id}
                        className='focus:bg-[#1e2b45] focus:text-white'
                      >
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isBorrowChainConnected && (
                <div className='grid gap-2'>
                  <Label htmlFor='borrow-amount' className='text-white'>
                    Amount (ETH)
                  </Label>
                  <Input
                    id='borrow-amount'
                    type='number'
                    placeholder='0.00'
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    className='bg-[#121a30] border-[#2d3f5e] text-white focus:border-[#3b82f6] focus:ring-[#3b82f6]'
                  />
                </div>
              )}
            </div>
            <DialogFooter className='flex flex-col sm:flex-row gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsBorrowOpen(false)}
                className='border-[#2d3f5e] bg-[#121a30] text-white hover:bg-[#1e2b45] w-full sm:w-auto order-3 sm:order-1'
                disabled={isLoading || isWritePending || isBorrowTxLoading}
              >
                Cancel
              </Button>
              {/* <Button
                onClick={handleBorrow}
                className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium w-full sm:w-auto order-1 sm:order-3'
                disabled={isLoading || isWritePending || isBorrowTxLoading}
              >
                {isLoading || isWritePending || isBorrowTxLoading
                  ? 'Processing...'
                  : 'Borrow'}
              </Button> */}
              {!isBorrowChainConnected ? (
                <Button
                  onClick={handleSwitchBorrowChain}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium w-full sm:w-auto order-1 sm:order-3'
                >
                  Switch Chain
                </Button>
              ) : (
                <Button
                  onClick={handleBorrow}
                  className='bg-[#10b981] hover:bg-[#0d9668] text-white font-medium w-full sm:w-auto order-1 sm:order-3'
                  disabled={isLoading || isWritePending || isBorrowTxLoading}
                >
                  {isLoading || isWritePending || isBorrowTxLoading
                    ? 'Processing...'
                    : 'Borrow'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
