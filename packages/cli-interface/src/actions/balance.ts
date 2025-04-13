import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  zeroHash,
  erc20Abi,
  maxUint256,
  parseEther,
  formatEther,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia, baseSepolia } from 'viem/chains';
import {
  INTOKEN_ADDRESS,
  OUTTOKEN_ADDRESS,
  SENDER_ADDRESS,
  RECIPIENT_ADDRESS,
  SOLVER_ADDRESS,
} from '../config';

const arbiClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

const baseClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const actorBalance = async () => {
  const senderFooBalance = await arbiClient.readContract({
    address: INTOKEN_ADDRESS as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [SENDER_ADDRESS as Address],
  });
  const senderBarBalance = await baseClient.readContract({
    address: OUTTOKEN_ADDRESS as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [SENDER_ADDRESS as Address],
  });

  const recipientBarBalance = await baseClient.readContract({
    address: OUTTOKEN_ADDRESS as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [RECIPIENT_ADDRESS as Address],
  });
  const recipientFooBalance = await arbiClient.readContract({
    address: INTOKEN_ADDRESS as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [RECIPIENT_ADDRESS as Address],
  });

  const solverFooBalance = await arbiClient.readContract({
    address: INTOKEN_ADDRESS as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [SOLVER_ADDRESS as Address],
  });
  const solverBarBalance = await baseClient.readContract({
    address: OUTTOKEN_ADDRESS as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [SOLVER_ADDRESS as Address],
  });

  const balanceTable = [
    {
      name: 'Sender',
      address: SENDER_ADDRESS,
      fooBalance: formatEther(senderFooBalance),
      barBalance: formatEther(senderBarBalance),
    },
    {
      name: 'Solver',
      address: SOLVER_ADDRESS,
      fooBalance: formatEther(solverFooBalance),
      barBalance: formatEther(solverBarBalance),
    },
    {
      name: 'Recipient',
      address: RECIPIENT_ADDRESS,
      fooBalance: formatEther(recipientFooBalance),
      barBalance: formatEther(recipientBarBalance),
    },
  ];

  console.table(balanceTable);

};

