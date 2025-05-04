export type ChainDebt = {
  id: string;
  solver: string;
  amount: string;
};

export type Transaction = {
  id: string;
  chainId: string;
  hash: string;
  timestamp: string;
  solver: string;
  deposit: ChainDebt | null;
  withdraw: ChainDebt | null;
  borrow: ChainDebt | null;
  repay: ChainDebt | null;
};

export type Debt = {
  id: string;
  solver: string;
  chainId: string;
  amount: string;
};

export type UserData = {
  id: string;
  collateralBalance: string;
  debtBalance: string;
  debts: Debt[];
  transactions: Transaction[];
};
