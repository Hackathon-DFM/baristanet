export const getSignatureFromAPI = async ({
  solver,
  amount,
  contractAddress,
}: {
  solver: string;
  amount: string;
  contractAddress: string;
}) => {
  const response = await fetch(
    'https://baristenet-sequencer-pharos-advance.fly.dev/withdraw',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        solver,
        amount,
        contractAddress,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get signature from server');
  }

  const data = await response.json();

  return {
    signature: data.signature as `0x${string}`,
    sequencer: data.sequencer as `0x${string}`,
    deadline: data.data.deadline,
  };
};

export const getBorrowSignatureFromAPI = async ({
  solver,
  amount,
  contractAddress,
}: {
  solver: string;
  amount: string;
  contractAddress: string;
}) => {
  const response = await fetch(
    'https://baristenet-sequencer-pharos-advance.fly.dev/borrow',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ solver, amount, contractAddress }),
    }
  );

  if (!response.ok) throw new Error('Failed to get borrow signature');

  const data = await response.json();

  return {
    signature: data.signature as `0x${string}`,
    sequencer: data.sequencer as `0x${string}`,
    contractAddress: data.contractAddress as `0x${string}`,
    borrowData: {
      solver: data.data.solver,
      amount: BigInt(data.data.amount),
      maxDebt: BigInt(data.data.maxDebt),
      deadline: data.data.deadline,
    },
  };
};

export const getRepaySignatureFromAPI = async ({
  solver,
  amount,
  contractAddress,
}: {
  solver: string;
  amount: string;
  contractAddress: string;
}) => {
  const response = await fetch(
    'https://baristenet-sequencer-pharos-advance.fly.dev/repay',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        solver,
        amount,
        contractAddress,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get repay signature from server');
  }

  const data = await response.json();

  return {
    signature: data.signature as `0x${string}`,
    sequencer: data.sequencer as `0x${string}`,
    contractAddress: data.contractAddress as `0x${string}`,
    repayData: {
      solver: data.data.solver as `0x${string}`,
      amount: data.data.amount,
      currentDebt: data.data.currentDebt,
      deadline: data.data.deadline,
    },
  };
};
