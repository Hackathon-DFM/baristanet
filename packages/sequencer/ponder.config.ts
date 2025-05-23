import { createConfig } from 'ponder';
import { http } from 'viem';
import { BrewHouseAbi } from './abis/BrewHouseAbi';
import { LattePoolAbi } from './abis/LattePoolAbi';

export default createConfig({
  networks: {
    optimism: {
      chainId: 11155420,
      transport: http('https://sepolia.optimism.io'),
    },
    arbitrum: {
      chainId: 421614,
      transport: http('https://arbitrum-sepolia-rpc.publicnode.com'),
    },
    base: {
      chainId: 84532,
      transport: http('https://base-sepolia-rpc.publicnode.com'),
    },
    pharos: {
      chainId: 50002,
      transport: http('https://devnet.dplabs-internal.com'),
    },
  },
  contracts: {
    BrewHouse: {
      network: 'pharos',
      abi: BrewHouseAbi,
      address: '0xffe5d16f77912d8dab047a1e0346944573f3d15b',
      startBlock: 18985169,
    },
    // BrewHouse: {
    //   network: 'optimism',
    //   abi: BrewHouseAbi,
    //   address: '0x0E376F9a367BD9148d97F4195b017E78999fB554',
    //   startBlock: 26273960,
    // },
    LattePool1: {
      network: 'arbitrum',
      abi: LattePoolAbi,
      address: '0xfca3819dd85017a11aa23ed08f57cd31db8e96cd',
      startBlock: 138269370,
    },
    LattePool2: {
      network: 'base',
      abi: LattePoolAbi,
      address: '0x56545f21dff77950e9fbfc27725f82150a4d7512',
      startBlock: 23893007,
    },
  },
});
