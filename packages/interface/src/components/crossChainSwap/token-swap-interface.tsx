'use client';

import { useState, useEffect } from 'react';
import {
  ArrowDownIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
} from '@/components/crossChainSwap/icons';
import { Button } from '@/components/crossChainSwap/ui/button';
import { Card, CardContent } from '@/components/crossChainSwap/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/crossChainSwap/ui/tabs';
// import NetworkSelector from '@/components/network-selector';
import TokenSelector from '@/components/crossChainSwap/token-selector';
import TransactionStatusDialog from '@/components/crossChainSwap/transaction-status-dialog';
import TransactionStatusBadge from '@/components/crossChainSwap/transaction-status-badge';

import type {
  Token,
  Network,
  TransactionStatus,
  SwapTransaction,
} from '@/lib/crossChainSwap/types';
import { networks, tokens } from '@/lib/crossChainSwap/data';

// import { ConnectButton } from '@rainbow-me/rainbowkit';

import ERC20ABI from '@/abis/ERC20ABI.json';
import routerAbi from '@/abis/Hyperlane7683.json';

// Wagmi config
import {
  useAccount,
  useBalance,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { watchContractEvent } from '@wagmi/core';
import { CustomConnectButton } from './custom-connect-button';
import { Address, fromRlp, Log, parseUnits } from 'viem';

import {
  addressToBytes32,
  cn,
  DESTINATION_ROUTER_ADDRESS,
  FILL_DEADLINE,
  OnchainCrossChainOrder,
  OrderData,
  OrderEncoder,
} from '@/lib/crossChainSwap/utils';
import { writeContract } from 'viem/actions';
import { config } from '../../lib/crossChainSwap/config';

export default function TokenSwapInterface() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);
  const [fromToken, setFromToken] = useState<Token | null>(tokens[0]);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');

  const [isFromTokenModalOpen, setIsFromTokenModalOpen] = useState(false);
  const [isToTokenModalOpen, setIsToTokenModalOpen] = useState(false);
  // const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isSwapping, setIsSwapping] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // const [slippage, setSlippage] = useState('0.5');

  // Transaction status tracking
  const [currentTransaction, setCurrentTransaction] =
    useState<SwapTransaction | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isStatusBadgeVisible, setIsStatusBadgeVisible] = useState(false);

  // approval state tracker
  const [approvalState, setApprovalState] = useState({
    tokenAddress: '',
    approvedAmount: '0',
    isApproved: false,
  });

  // wagmi config
  const {
    address: wallet,
    isConnected: walletConnected,
    chain: currentChain,
  } = useAccount();

  const { switchChain } = useSwitchChain();

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: wallet,
    token: fromToken?.address as `0x${string}`,
    chainId: selectedNetwork?.chainId,
  });

  // useEffect(() => {
  //   if (wallet && fromToken) {
  //     refetchBalance();
  //   }
  // }, [selectedNetwork, fromToken, wallet, refetchBalance]);

  useEffect(() => {
    if (wallet && fromToken?.address && selectedNetwork?.chainId) {
      refetchBalance();
    }
  }, [wallet, fromToken?.address, selectedNetwork?.chainId, refetchBalance]);

  // Reset approval state when token or amount changes
  useEffect(() => {
    if (fromToken?.address !== approvalState.tokenAddress) {
      setApprovalState({
        tokenAddress: fromToken?.address || '',
        approvedAmount: '0',
        isApproved: false,
      });
    }
  }, [fromToken, approvalState.tokenAddress]);

  // useEffect(() => {
  //   if (selectedNetwork && fromToken) {
  //     // Try to find the same token on the new network
  //     const sameTokenOnNewNetwork = tokens.find(
  //       (t) =>
  //         t.symbol === fromToken.symbol && t.network === selectedNetwork.name
  //     );

  //     if (sameTokenOnNewNetwork) {
  //       // If the same token exists on the new network, use it
  //       setFromToken(sameTokenOnNewNetwork);
  //     } else {
  //       // Otherwise, use the native token of the new network
  //       const nativeToken = tokens.find(
  //         (t) => t.network === selectedNetwork.name
  //       );

  //       if (nativeToken) {
  //         setFromToken(nativeToken);
  //       }
  //     }
  //   }
  // }, [fromToken, selectedNetwork]);
  useEffect(() => {
    if (selectedNetwork && fromToken) {
      // Try to find the same token on the new network
      const sameTokenOnNewNetwork = tokens.find(
        (t) =>
          t.symbol === fromToken.symbol && t.network === selectedNetwork.name
      );

      if (sameTokenOnNewNetwork) {
        // If the same token exists on the new network, use it
        setFromToken(sameTokenOnNewNetwork);
      } else {
        // Otherwise, use the first available token on the new network
        const networkToken = tokens.find(
          (t) => t.network === selectedNetwork.name
        );

        if (networkToken) {
          setFromToken(networkToken);
        }
      }
    }
  }, [selectedNetwork, fromToken]);

  // Add this new effect to handle chain changes
  useEffect(() => {
    // When the chain changes, update the selected network
    if (currentChain) {
      const matchingNetwork = networks.find(
        (n) => n.chainId === currentChain.id
      );
      if (
        matchingNetwork &&
        matchingNetwork.chainId !== selectedNetwork?.chainId
      ) {
        setSelectedNetwork(matchingNetwork);
        // Then find a token for this network and update it
        const networkToken = tokens.find(
          (t) => t.network === matchingNetwork.name
        );
        if (networkToken) {
          setToToken(fromToken);
          setFromToken(networkToken);
          // Reset approval state
          setApprovalState({
            tokenAddress: networkToken.address || '',
            approvedAmount: '0',
            isApproved: false,
          });
        }
      }
    }
  }, [currentChain, selectedNetwork?.chainId]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);

    if (parseFloat(value || '0') > parseFloat(approvalState.approvedAmount)) {
      setApprovalState((prev) => ({
        ...prev,
        isApproved: false,
      }));
    }

    // In a real app, this would call an API to get the exchange rate
    if (fromToken && toToken) {
      // Simulate exchange rate with a small slippage
      const rate = 1;
      setToAmount(Number.parseFloat(value || '0') * rate + '');
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (parseFloat(value || '0') > parseFloat(approvalState.approvedAmount)) {
      setApprovalState((prev) => ({
        ...prev,
        isApproved: false,
      }));
    }
    // In a real app, this would call an API to get the exchange rate
    if (fromToken && toToken) {
      // Simulate exchange rate with a small slippage
      const rate = 1;
      setFromAmount(Number.parseFloat(value || '0') * rate + '');
    }
  };

  const {
    writeContract: approveToken,
    data: approveData,
    isPending: isPendingApprove,
    error: approveError,
  } = useWriteContract();

  const {
    writeContract: openIntent,
    data: openIntentData,
    isPending: isPendingIntent,
    error: intentError,
  } = useWriteContract();

  const {
    isSuccess: isApproveConfirmed,
    isLoading: isLoadingTransactionApprove,
    isError: isErrorApprove,
  } = useWaitForTransactionReceipt({
    hash: approveData,
  });

  const {
    isSuccess: isIntentSuccess,
    isLoading: isLoadingTransactionIntent,
    isError: isErrorIntent,
  } = useWaitForTransactionReceipt({
    hash: openIntentData,
  });

  // For approval transactions
  useEffect(() => {
    // When approve transaction completes
    if (isApproveConfirmed && approveData) {
      setIsApproving(false);
      if (fromToken) {
        setApprovalState({
          tokenAddress: fromToken.address || '',
          approvedAmount: fromAmount,
          isApproved: true,
        });
      }
    }

    // When approve transaction fails
    if (isErrorApprove) {
      setIsApproving(false);
    }
  }, [approveData, isApproveConfirmed, isErrorApprove]);

  // If the user cancels the approval
  useEffect(() => {
    if (isPendingApprove) {
      // Transaction is pending in the wallet
      setIsApproving(true);
    } else if (isApproving && !approveData) {
      // Transaction was pending but now it's not, and we don't have a hash
      // This means the user likely canceled the transaction
      setIsApproving(false);
    }
  }, [isPendingApprove, approveData]);

  // Reset approval state if approval transaction fails
  useEffect(() => {
    if (isErrorApprove) {
      setApprovalState({
        tokenAddress: fromToken?.address || '',
        approvedAmount: '0',
        isApproved: false,
      });
      setIsApproving(false);
    }
  }, [isErrorApprove]);

  // If the user cancels the swap
  useEffect(() => {
    if (isPendingIntent) {
      // Transaction is pending in the wallet
      setIsSwapping(true);
    } else if (isSwapping && !openIntentData) {
      // Transaction was pending but now it's not, and we don't have a hash
      // This means the user likely canceled the transaction
      setIsSwapping(false);
      if (intentError) {
        const userRejectedRegex = 'User rejected the request.';
        if (intentError.message.includes(userRejectedRegex)) {
          updateTransactionStatus('error', userRejectedRegex);
        } else {
          updateTransactionStatus(
            'error',
            'There was an error processing your swap.'
          );
        }
        // console.log(intentError);
      }
    }
  }, [isPendingIntent, openIntentData]);

  // Handle errors in if swap transaction fail
  useEffect(() => {
    if (isErrorIntent) {
      // You could show an error message here
      console.error('Swap transaction failed');
      setIsSwapping(false);
    }
  }, [isErrorIntent]);

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const {
    writeContract: mintToken,
    // data: mintedData,
    isPending: isPendingMint,
  } = useWriteContract();

  const handleMintToken = () => {
    if (!wallet || !currentChain) return;

    const amountToMintInWei = parseUnits('100', 18);

    let tokenAddress = '';

    if (currentChain?.id === 421614) {
      tokenAddress = '0x41f4652b1fa5992a9e16f5c7c1b983d5eca898c3';
    } else if (currentChain?.id === 84532) {
      tokenAddress = '0xb7630fd5b9a14ec489440518679be9ae438f4eb7';
    }
    mintToken({
      address: tokenAddress as `0x${string}`,
      abi: ERC20ABI,
      functionName: 'mint',
      args: [wallet, amountToMintInWei],
    });
  };

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const approveSwap = (amount: string) => {
    if (!fromToken?.address || !currentChain) return false;

    const amountInWei = parseUnits(amount, 18); // Convert to correct decimals
    let swapContractAddress = '';
    if (currentChain?.id === 421614) {
      swapContractAddress = '0x576ba9ea0dc68f8b18ff8443a1d0aa1425459ef5'; // origin router address (ARB)
    } else if (currentChain?.id === 84532) {
      swapContractAddress = '0xabb2e3cc9ef0c41f3c076afd2701684f8418e7d8'; // destination router address (BASE)
    } else {
      throw new Error('Unsupported chain');
    }
    approveToken({
      address: fromToken?.address as `0x${string}`,
      abi: ERC20ABI,
      functionName: 'approve',
      args: [swapContractAddress, amountInWei],
    });

    // console.log(`Approving ${amount} tokens`);
  };

  const handleSwap = () => {
    if (!wallet || !fromToken?.address || !toToken?.address || !currentChain)
      return;

    if (currentTransaction) setCurrentTransaction(null);

    let recipient;
    let sourceRouterAddress: Address;

    if (currentChain?.id === 421614) {
      sourceRouterAddress = '0x576ba9ea0dc68f8b18ff8443a1d0aa1425459ef5';
    } else if (currentChain?.id === 84532) {
      sourceRouterAddress = '0xabb2e3cc9ef0c41f3c076afd2701684f8418e7d8';
    } else {
      console.error('Unsupported chain for event watching');
      return;
    }

    if (!toAddress) {
      recipient = wallet;
    } else {
      recipient = toAddress;
    }
    const sender = wallet;
    const inputToken = fromToken?.address;
    const amountIn = parseUnits(fromAmount, 18);
    const outputToken = toToken?.address;
    const amountOut = parseUnits(toAmount, 18);

    const rawOrderData: OrderData = {
      sender: sender as Address,
      recipient: recipient as Address,
      inputToken: inputToken as Address,
      outputToken: outputToken as Address,
      amountIn: amountIn,
      amountOut: amountOut,
      senderNonce: BigInt(Date.now()),
      originDomain: currentChain.id,
      destinationDomain: toToken.chainId,
      destinationSettler: DESTINATION_ROUTER_ADDRESS as Address,
      fillDeadline: FILL_DEADLINE,
      data: '0x',
    };

    const orderData: OrderData = {
      ...rawOrderData,
      sender: addressToBytes32(rawOrderData.sender),
      recipient: addressToBytes32(rawOrderData.recipient),
      inputToken: addressToBytes32(rawOrderData.inputToken),
      outputToken: addressToBytes32(rawOrderData.outputToken),
      destinationSettler: addressToBytes32(rawOrderData.destinationSettler),
    };

    const order: OnchainCrossChainOrder = {
      fillDeadline: orderData.fillDeadline,
      orderDataType: OrderEncoder.orderDataType(),
      orderData: OrderEncoder.encode(orderData),
    };

    const newTransaction: SwapTransaction = {
      sourceToken: fromToken,
      destinationToken: toToken,
      sourceAmount: fromAmount,
      destinationAmount: toAmount,
      sourceChain: selectedNetwork,
      status: 'processing',
      timestamp: new Date(),
      transactionHash: null,
      solverTransactionHash: null,
      error: null,
    };

    // const decodeOrderData = OrderEncoder.decode(order.orderData);
    // console.log('decodeOrderData', decodeOrderData);

    setCurrentTransaction(newTransaction);

    updateTransactionStatus('processing');

    setIsStatusDialogOpen(true);
    setIsStatusBadgeVisible(false);

    openIntent({
      address: sourceRouterAddress as Address,
      abi: routerAbi,
      functionName: 'open',
      args: [order],
    });
  };

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  useEffect(() => {
    if (!openIntentData) return;

    setIsSwapping(false);
    setApprovalState({
      tokenAddress: fromToken?.address || '',
      approvedAmount: '0',
      isApproved: false,
    });

    setCurrentTransaction((prev) =>
      prev ? { ...prev, transactionHash: openIntentData! } : null
    );

    let sourceRouterAddress: Address;
    if (currentChain?.id === 421614) {
      sourceRouterAddress = '0x576ba9ea0dc68f8b18ff8443a1d0aa1425459ef5';
    } else if (currentChain?.id === 84532) {
      sourceRouterAddress = '0xabb2e3cc9ef0c41f3c076afd2701684f8418e7d8';
    } else {
      console.error('Unsupported chain');
      return;
    }

    // console.log('the effect is running');

    updateTransactionStatus('swapping');

    const unwatchSource = watchContractEvent(config, {
      address: sourceRouterAddress,
      abi: routerAbi,
      eventName: 'Open',
      chainId: currentChain.id,
      pollingInterval: 2000,
      onLogs(logs) {
        // console.log('The open events:', logs);
        if (!logs.length) {
          // console.log('No logs received in this poll cycle.');
        }

        const ourLog = logs.find(
          (log) => log.transactionHash === openIntentData
        ) as Log & {
          args: { orderId: string };
        };

        if (ourLog) {
          // console.log('Open event matched:', ourLog);
          setOrderId(ourLog.args.orderId);
          // console.log(orderId);

          unwatchSource();
        }
      },
    });
  }, [openIntentData]);

  useEffect(() => {
    const unwatchDest = watchContractEvent(config, {
      address: DESTINATION_ROUTER_ADDRESS as Address,
      abi: routerAbi,
      eventName: 'Filled',
      chainId: 84532,
      args: { orderId },
      onLogs(fillLogs) {
        // console.log('Fill logs:', fillLogs);

        const solverTxHash = fillLogs[0].transactionHash;

        // console.log(solverTxHash);

        setCurrentTransaction((prev) =>
          prev
            ? {
                ...prev,
                solverTransactionHash: solverTxHash,
                status: 'completed',
              }
            : null
        );

        updateTransactionStatus('completed');
        unwatchDest();
      },
    });
  }, [orderId]);

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  const updateTransactionStatus = (
    status: TransactionStatus,
    error?: string
  ) => {
    setCurrentTransaction((prev) =>
      prev ? { ...prev, status, error: error || prev.error } : null
    );
  };

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  const calculateUsdValue = (amount: string, token: Token | null) => {
    if (!token || !amount || isNaN(Number.parseFloat(amount))) return '$0.00';
    return `$${(Number.parseFloat(amount) * token.usdPrice).toFixed(2)}`;
  };

  const handleSwitchToken = (token: Token) => {
    // Don't allow switching during transactions
    if (isApproving || isSwapping) {
      return;
    }
    if (!fromToken || !token || fromToken === token) return;
    if (token.chainId !== selectedNetwork.chainId) {
      switchChain({ chainId: token.chainId });
    }

    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);

    setApprovalState({
      tokenAddress: toToken?.address || '',
      approvedAmount: '0',
      isApproved: false,
    });
  };

  const handleFromTokenSelect = (token: Token) => {
    if (token.chainId !== selectedNetwork.chainId) {
      try {
        switchChain({ chainId: token.chainId });
      } catch (error) {
        console.error('Failed to switch chain:', error);
      }
    }

    // Always update the token selection and reset approval state
    setFromToken(token);
    setApprovalState({
      tokenAddress: token.address || '',
      approvedAmount: '0',
      isApproved: false,
    });
  };

  const handleToTokenSelect = (token: Token) => {
    setToToken(token);
  };

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network);

    setApprovalState({
      tokenAddress: '',
      approvedAmount: '0',
      isApproved: false,
    });
  };

  const handleMaxAmount = () => {
    if (fromToken) {
      setFromAmount(balanceData?.formatted as string);
      // Reset approval state if max amount is greater than previously approved
      if (
        parseFloat(balanceData?.formatted as string) >
        parseFloat(approvalState.approvedAmount)
      ) {
        setApprovalState((prev) => ({
          ...prev,
          isApproved: false,
        }));
      }
      if (toToken) {
        // Simulate exchange rate with a small slippage
        const rate = 1;
        setToAmount(
          Number.parseFloat(balanceData?.formatted as string) * rate + ''
        );
      }
    }
  };

  const handleHideStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setIsStatusBadgeVisible(true);
  };

  const handleCloseBadge = () => {
    setIsStatusBadgeVisible(false);
  };

  const needsApproval = () => {
    return (
      !approvalState.isApproved ||
      fromToken?.address !== approvalState.tokenAddress ||
      parseFloat(fromAmount) > parseFloat(approvalState.approvedAmount)
    );
  };

  const isSwapButtonDisabled = () => {
    return (
      !fromToken ||
      !toToken ||
      !fromAmount ||
      fromToken === toToken ||
      isPendingIntent ||
      isPendingApprove ||
      isApproving ||
      isSwapping ||
      isNaN(Number(fromAmount)) ||
      Number(fromAmount) <= 0
    );
  };

  // Get the correct text for the swap button
  const getSwapButtonText = () => {
    if (!walletConnected) return 'Connect Wallet';
    if (!fromToken || !toToken) return 'Select Tokens';
    if (isApproving) return 'Approving Token...';
    if (isSwapping) return 'Swapping Token...';
    if (needsApproval()) return 'Approve Token';
    return 'Swap Token';
  };

  // Handle the swap button click
  const handleSwapButtonClick = () => {
    if (!walletConnected) return;

    if (needsApproval()) {
      approveSwap(fromAmount);
    } else {
      handleSwap();
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Mint Test Token Button */}
      <div className="flex justify-center mb-10">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md"
          onClick={handleMintToken}
          disabled={!wallet || !currentChain || isPendingMint}
        >
          Mint 100 Test Token
        </Button>
      </div>

      {/* Header with logo and wallet connection */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <div className="text-2xl font-bold truncate">CaramelSwap</div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <CustomConnectButton
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={handleNetworkChange}
          />
          {/* <Button variant="ghost" size="icon">
            <Cog6ToothIcon className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
      {/* Main swap card */}
      <Card className="bg-[#111827] border-gray-800">
        <CardContent className="p-0">
          <Tabs defaultValue="swap" className="w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <TabsList className="bg-gray-800/50">
                <TabsTrigger
                  value="swap"
                  className="data-[state=active]:bg-gray-700"
                >
                  Swap
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="swap" className="mt-0">
              <div className="p-4">
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-gray-400">You pay</div>
                  {fromToken && walletConnected && (
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                      Balance: {balanceData?.formatted}
                      <button
                        onClick={handleMaxAmount}
                        className="text-blue-400 font-medium ml-1 hover:text-blue-300"
                      >
                        MAX
                      </button>
                    </div>
                  )}
                </div>
                <div className="bg-gray-900 rounded-xl p-3 mb-2">
                  <div className="flex justify-between mb-2">
                    <button
                      onClick={() => setIsFromTokenModalOpen(true)}
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-2 py-1 text-white"
                    >
                      {fromToken ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                            <img
                              src={fromToken.logoURI}
                              alt={fromToken.symbol}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{fromToken.symbol}</span>
                        </>
                      ) : (
                        <span>Select token</span>
                      )}
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      className="bg-transparent text-right outline-none w-1/2 text-xl text-white"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    {fromToken && (
                      <div className="flex items-center gap-1">
                        <span>
                          on {fromToken.network || selectedNetwork.name}
                        </span>
                      </div>
                    )}
                    <div>{calculateUsdValue(fromAmount, fromToken)}</div>
                  </div>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                  <Button
                    onMouseEnter={() => {
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                      setIsHovered(false);
                    }}
                    onClick={() => {
                      handleSwitchToken(toToken as Token);
                    }}
                    variant="outline"
                    size="icon"
                    // className="rounded-full border-gray-700 h-10 w-10"
                    className={cn(
                      'rounded-full bg-white transition-transform duration-200 hover:scale-110 hover:bg-white active:scale-90 h-10 w-10',
                      isHovered ? 'rotate-180' : ''
                    )}
                    disabled={!fromToken || !toToken}
                  >
                    <ArrowDownIcon className="h-8 w-8" />
                  </Button>
                </div>

                <div className="mt-1 mb-1 text-sm text-gray-400">
                  You receive
                </div>
                <div className="bg-gray-900 rounded-xl p-3 mb-4">
                  {toToken ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <button
                          onClick={() => setIsToTokenModalOpen(true)}
                          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-2 py-1 text-white"
                        >
                          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center overflow-hidden">
                            <img
                              src={
                                toToken.logoURI ||
                                '/placeholder.svg?height=24&width=24'
                              }
                              alt={toToken.symbol}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{toToken.symbol}</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={toAmount}
                          onChange={(e) => handleToAmountChange(e.target.value)}
                          className="bg-transparent text-right outline-none w-1/2 text-xl text-white"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <span>
                            on {toToken.network || selectedNetwork.name}
                          </span>
                        </div>
                        <div>{calculateUsdValue(toAmount, toToken)}</div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsToTokenModalOpen(true)}
                      className="w-full py-2 text-center text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center gap-2"
                    >
                      <span>Select a token</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {fromToken && toToken && wallet && (
                  <div className="bg-gray-900 rounded-xl p-4 mb-4 text-sm text-white flex justify-between items-center">
                    Address To
                    <input
                      type="text"
                      name="wallet"
                      placeholder={
                        wallet?.slice(0, 7) + '...' + wallet?.slice(-4)
                      }
                      className="bg-transparent text-right outline-none w-3/5 text-base text-white font-mono"
                      autoComplete="off"
                      pattern="^0x[a-fA-F0-9]{40}$"
                      title="Enter a valid address"
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                    />
                  </div>
                )}
                {/* {fromToken && toToken && ( */}
                {/* <div className="bg-gray-900 rounded-xl p-3 mb-4 text-sm text-white">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Rate</span>
                      <span>
                        1 {fromToken.symbol} = 1{toToken.symbol}
                      </span>
                    </div> */}
                {/* Transaction status can be shown here */}
                {/* {isErrorApprove && ( */}
                {/* <div className="text-red-500 mt-2">
                        Approval failed. Please try again.
                      </div> */}
                {/* )} */}
                {/* {isErrorIntent && ( */}
                {/* <div className="text-red-500 mt-2">
                        Swap failed. Please try again.
                      </div> */}
                {/* )} */}
                {/* <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Fee</span>
                      <span>0.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Slippage Tolerance</span>
                      <span>{slippage}%</span>
                    </div> */}
                {/* </div> */}
                {/* )} */}

                <Button
                  onClick={handleSwapButtonClick}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl"
                  disabled={isSwapButtonDisabled()}
                >
                  {getSwapButtonText()}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Token selectors */}
      <TokenSelector
        isOpen={isFromTokenModalOpen}
        setIsOpen={setIsFromTokenModalOpen}
        onSelect={handleFromTokenSelect}
        selectedToken={fromToken}
        excludeToken={toToken}
        title="Select token to pay"
      />
      <TokenSelector
        isOpen={isToTokenModalOpen}
        setIsOpen={setIsToTokenModalOpen}
        onSelect={handleToTokenSelect}
        selectedToken={toToken}
        excludeToken={fromToken}
        title="Select token to receive"
      />
      {currentTransaction && (
        <TransactionStatusDialog
          isOpen={isStatusDialogOpen}
          setIsOpen={handleHideStatusDialog}
          sourceToken={currentTransaction.sourceToken}
          destinationToken={currentTransaction.destinationToken}
          sourceAmount={currentTransaction.sourceAmount}
          destinationAmount={currentTransaction.destinationAmount}
          sourceChain={currentTransaction.sourceChain}
          destinationChain={currentTransaction.destinationToken}
          transactionHash={openIntentData!}
          solverTransactionHash={currentTransaction.solverTransactionHash}
          status={currentTransaction.status}
          error={currentTransaction.error}
        />
      )}
      {/* Transaction status badge */}
      {currentTransaction && isStatusBadgeVisible && (
        <TransactionStatusBadge
          transaction={currentTransaction}
          onClick={() => setIsStatusDialogOpen(true)}
          onClose={handleCloseBadge}
        />
      )}

      <footer className="w-full mt-6 bg-blue-50 text-center pt-1 pb-1 text-xs text-blue-700 border-t border-blue-200 rounded-2xl shadow-inner">
        <div className="flex flex-col items-center gap-1 tracking-wide">
          <span>© {new Date().getFullYear()} Caramel Swap</span>
          <span className="flex items-center gap-1">
            Powered by <span className="font-semibold">BaristaNet</span> ☕️
          </span>
        </div>
      </footer>
    </div>
  );
}
