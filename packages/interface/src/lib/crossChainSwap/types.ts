export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  usdPrice: number;
  network?: string;
}

export interface Network {
  // id: string;
  chainId: number;
  name: string;
  logoURI?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export type TransactionStatus =
  | 'processing'
  | 'swapping'
  | 'completed'
  | 'error';

export interface SwapTransaction {
  sourceToken: Token;
  destinationToken: Token;
  sourceAmount: string;
  destinationAmount: string;
  sourceChain: Network;
  status: TransactionStatus;
  timestamp: Date;
  transactionHash: string | null;
  solverTransactionHash: string | null;
  error?: string | null;
}
