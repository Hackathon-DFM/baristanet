import { fillIntent, openIntent, settleIntent, actorBalance } from './actions';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

async function main() {
  const isOpen = args._.includes('open');
  const isFill = args._.includes('fill');
  const isSettle = args._.includes('settle');
  const isBalance = args._.includes('balance');

  if (isOpen) await openIntent();
  if (isFill) await fillIntent();
  if (isSettle) await settleIntent();
  if (isBalance) await actorBalance();
}

main();
