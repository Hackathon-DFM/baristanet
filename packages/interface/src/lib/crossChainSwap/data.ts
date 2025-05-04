import type { Token, Network } from './types';
import { baseSepolia, arbitrumSepolia } from 'wagmi/chains';

export const networks: Network[] = [
  {
    chainId: arbitrumSepolia.id,
    name: 'ARB Sepolia',
    logoURI: '/arbitrumSepolia.png',
    // nativeCurrency: {
    //   name: 'ETH',
    //   symbol: 'ETH',
    //   decimals: 18,
    // },
  },
  {
    chainId: baseSepolia.id,
    name: 'Base Sepolia',
    logoURI: '/baseSepolia.png',
    // nativeCurrency: {
    //   name: 'ETH',
    //   symbol: 'ETH',
    //   decimals: 18,
    // },
  },

  // {
  //   chainId: sepolia.id,
  //   name: 'Sepolia',
  //   logoURI: '/sepoliaEth.png',
  //   // nativeCurrency: {
  //   //   name: 'Ether',
  //   //   symbol: 'ETH',
  //   //   decimals: 18,
  //   // },
  // },
  // {
  //   chainId: eduChainTestnet.id,
  //   name: 'Edu Chain Testnet',
  //   logoURI: '/educhainLogo.png',
  //   // nativeCurrency: {
  //   //   name: 'EDU',
  //   //   symbol: 'EDU',
  //   //   decimals: 18,
  //   // },
  // },

  // {
  //   id: 'arbitrum',
  //   name: 'Arbitrum',
  //   chainId: 42161,
  //   logoURI: '/placeholder.svg?height=32&width=32&text=ARB',
  //   nativeCurrency: {
  //     name: 'Ether',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  // },
];

export const tokens: Token[] = [
  // Ethereum tokens
  {
    chainId: 421614,
    address: '0x41f4652B1FA5992a9e16f5c7c1B983d5Eca898C3',
    name: 'FOO Token',
    symbol: 'FOO',
    decimals: 18,
    logoURI: '/T1.jpg',
    // balance: '0',
    usdPrice: 1,
    network: networks[0].name,
  },
  {
    chainId: 84532,
    address: '0xb7630fd5b9A14eC489440518679bE9ae438F4Eb7',
    name: 'BAR Token',
    symbol: 'BAR',
    decimals: 18,
    logoURI: '/T1.jpg',
    // balance: '0',
    usdPrice: 1,
    network: networks[1].name,
  },
  // {
  //   chainId: 11155111,
  //   address: '0x0daAe4993EFB4a5940eBb24E527584a939B3dBf9',
  //   name: 'T1 Token',
  //   symbol: 'T1',
  //   decimals: 18,
  //   logoURI: '/T1.jpg',
  //   // balance: '0.989081',
  //   usdPrice: 1,
  //   network: networks[0].name,
  // },
  // {
  //   chainId: 656476,
  //   address: '0x200a8D0E6c872FDE20B122B846DC17fB0E3f8f88',
  //   name: 'T1 Token',
  //   symbol: 'T1',
  //   decimals: 18,
  //   logoURI: '/T1.jpg',
  //   // balance: '0',
  //   usdPrice: 1,
  //   network: networks[1].name,
  // },

  // {
  //   id: "usdc-eth",
  //   name: "USD Coin",
  //   symbol: "USDC",
  //   decimals: 6,
  //   logoURI: "/placeholder.svg?height=32&width=32&text=USDC",
  //   balance: "0",
  //   usdPrice: 1,
  //   network: "Ethereum",
  // },
  // {
  //   id: "usdt-eth",
  //   name: "Tether USD",
  //   symbol: "USDT",
  //   decimals: 6,
  //   logoURI: "/placeholder.svg?height=32&width=32&text=USDT",
  //   balance: "0",
  //   usdPrice: 1,
  //   network: "Ethereum",
  // },
];
