import { arbitrumSepolia } from 'viem/chains';
import { SECRET_MESSAGE } from './config';
import { openIntentListener } from './listener';
import { createPublicClient, http } from 'viem';
import { openIntentSolver } from './solver';

async function main() {
  console.log(SECRET_MESSAGE);
  openIntentListener({
    publicClient: createPublicClient({
      chain: arbitrumSepolia,
      transport: http(),
    }),
    contractAddress: '0x576ba9ea0dc68f8b18ff8443a1d0aa1425459ef5',
    solver: openIntentSolver,
    blockNumber: 142851806n,
  });
}

main();
