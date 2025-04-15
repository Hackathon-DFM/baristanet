import { Address, PublicClient } from 'viem';
import todoListAbi from './abis/TodoList.json';
import { openEventAbi } from './types';

type ListenerParams = {
  msg: string;
  ms: number;
  solver: (msg: string) => Promise<void>;
};

export async function listener({ msg, ms, solver }: ListenerParams) {
  setInterval(() => {
    solver(msg);
  }, ms);
}

type ClientListenerParams = {
  publicClient: PublicClient;
  contractAddress: Address;
};

export async function todoListListener({
  publicClient,
  contractAddress,
}: ClientListenerParams) {
  // listening block number
  let fromBlock = await publicClient.getBlockNumber();
  while (true) {
    const toBlock = await publicClient.getBlockNumber();
    const logs = await publicClient.getLogs({
      address: contractAddress,
      events: todoListAbi.filter((abi) => abi.type === 'event'),
      fromBlock,
      toBlock,
    });
    if (logs.length) console.log(logs);
    fromBlock = toBlock;
  }
}

export async function openIntentListener({
  publicClient,
  contractAddress,
}: ClientListenerParams) {
  // listening block number
  let fromBlock = await publicClient.getBlockNumber();
  while (true) {
    const toBlock = await publicClient.getBlockNumber();
    const logs = await publicClient.getLogs({
      address: contractAddress,
      event: openEventAbi,
      fromBlock,
      toBlock,
    });

    if (logs.length) {
      const [openEvent] = logs;
      const { orderId, maxSpent, fillInstructions } =
        openEvent.args.resolvedOrder!;
      const { originData } = fillInstructions[0];
      const {
        token, // token to send to destination (need to delete left zero padding)
        amount, // amount to send to destination
        chainId, // destination chain id
        recipient, // need this address to be approved
      } = maxSpent[0];
      console.log(openEvent);
    }

    fromBlock = toBlock;
  }
}
