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
