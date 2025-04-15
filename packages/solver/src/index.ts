import { baseSepolia } from 'viem/chains';
import { SECRET_MESSAGE } from './config';
import { todoListListener, listener } from './listener';
import { solver } from './solver';
import { AbiEvent, createPublicClient, http, PublicClient } from 'viem';

async function main() {
  console.log(SECRET_MESSAGE);
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
  todoListListener({
    publicClient: publicClient as PublicClient,
    contractAddress: '0xfca3819dd85017a11aa23ed08f57cd31db8e96cd',
  });
  // listener({ msg: 'hearing things', ms: 1000, solver });
  // listener({ msg: 'hated visionary', ms: 2000, solver });
}

main();
