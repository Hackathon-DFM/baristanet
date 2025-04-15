import {
  Address,
  createPublicClient,
  createWalletClient,
  erc20Abi,
  formatUnits,
  http,
  stringToHex,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia, baseSepolia } from 'viem/chains';
import { SOLVER_PK } from './config';
import { addressToBytes32, sleep } from './utils';
import routerAbi from './abis/Hyperlane7683.json';

export type SolverParams = {
  originChainId: bigint;
  destChainId: bigint;
  token: Address;
  amount: bigint;
  destRouter: Address;
  originRouter: Address;
  originData: Address; // ABI-encoded blob (bytes)
  orderId: Address;
};

function createClient(chainId: bigint) {
  let walletClient, publicClient;
  const walletAccount = privateKeyToAccount(SOLVER_PK as Address);

  if (chainId === 421614n) {
    walletClient = createWalletClient({
      account: walletAccount,
      chain: arbitrumSepolia,
      transport: http(),
    });
    publicClient = createPublicClient({
      chain: arbitrumSepolia,
      transport: http(),
    });
  } else if (chainId === 84532n) {
    walletClient = createWalletClient({
      account: walletAccount,
      chain: baseSepolia,
      transport: http(),
    });
    publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });
  } else {
    throw new Error('chainId not found');
  }
  return { walletClient, publicClient, walletAccount };
}

export async function openIntentSolver({
  originChainId,
  destChainId,
  token,
  amount,
  originRouter,
  destRouter,
  originData,
  orderId,
}: SolverParams) {
  const originClient = createClient(originChainId);
  const destClient = createClient(destChainId);

  type OrderStatus = 'FILLED' | 'OPENED' | 'SETTLED' | 'UNKNOWN';
  const getOrderStatus = async (
    orderId: Address,
  ): Promise<{
    originOrderStatus: OrderStatus;
    destOrderStatus: OrderStatus;
  }> => {
    const hexToOrderStatus = (orderStatusHex: Address): OrderStatus => {
      const orderStatusMap = {
        OPENED: stringToHex('OPENED', { size: 32 }),
        FILLED: stringToHex('FILLED', { size: 32 }),
        SETTLED: stringToHex('SETTLED', { size: 32 }),
      };

      let orderStatus: OrderStatus = 'UNKNOWN';
      if (orderStatusHex === orderStatusMap.OPENED) {
        orderStatus = 'OPENED';
      } else if (orderStatusHex === orderStatusMap.FILLED) {
        orderStatus = 'FILLED';
      } else if (orderStatusHex === orderStatusMap.SETTLED) {
        orderStatus = 'SETTLED';
      }
      return orderStatus;
    };
    const originOrderStatusHex = (await originClient.publicClient.readContract({
      address: originRouter,
      abi: routerAbi,
      functionName: 'orderStatus',
      args: [orderId],
    })) as Address;

    const destOrderStatusHex = (await destClient.publicClient.readContract({
      address: destRouter,
      abi: routerAbi,
      functionName: 'orderStatus',
      args: [orderId],
    })) as Address;

    const originOrderStatus = hexToOrderStatus(originOrderStatusHex);
    const destOrderStatus = hexToOrderStatus(destOrderStatusHex);
    return { originOrderStatus, destOrderStatus };
  };

  let orderStatus;
  orderStatus = await getOrderStatus(orderId);

  if (
    orderStatus.originOrderStatus === 'OPENED' &&
    orderStatus.destOrderStatus !== 'FILLED'
  ) {
    // APPROVE
    const approveTxHash = await destClient.walletClient.writeContract({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [destRouter, amount],
    });

    console.log('approve txHash', approveTxHash);

    await sleep(2000);

    // CHECK TOKEN BALANCE

    const balance = await destClient.publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [destClient.walletAccount.address],
    });

    if (balance < amount) {
      console.log('balance not enough');
      return;
    }

    // FILL

    const fillerData = addressToBytes32(destClient.walletAccount.address);
    const fillTxHash = await destClient.walletClient.writeContract({
      address: destRouter as Address,
      abi: routerAbi,
      functionName: 'fill',
      args: [orderId, originData, fillerData],
    });
    console.log('fill txHash', fillTxHash);

    await sleep(2000);
  } else {
    console.log('order already filled');
  }

  if ((await getOrderStatus(orderId)).originOrderStatus !== 'SETTLED') {
    // CHECK SETTLE BALANCE

    const quoteGasPayment = (await destClient.publicClient.readContract({
      address: destRouter as Address,
      abi: routerAbi,
      functionName: 'quoteGasPayment',
      args: [421614],
    })) as bigint;

    console.log(
      'quoteGasPayment: ',
      formatUnits(quoteGasPayment as bigint, 18),
    );

    // eth balance
    const ethBalance = await destClient.publicClient.getBalance({
      address: destClient.walletAccount.address,
    });

    if (ethBalance < quoteGasPayment) {
      console.log('eth balance not enough');
      return;
    }

    // SETTLE

    await sleep(2000);

    const txHash = await destClient.walletClient.writeContract({
      address: destRouter as Address,
      abi: routerAbi,
      functionName: 'settle',
      args: [[orderId]],
      value: quoteGasPayment as bigint,
    });

    console.log('txHash: https://explorer.hyperlane.xyz/?search=' + txHash);
  } else {
    console.log('order already settled');
  }
}
