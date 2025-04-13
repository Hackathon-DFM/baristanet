import { SECRET_MESSAGE } from './config';
import { listener } from './listener';
import { solver } from './solver';

async function main() {
  console.log(SECRET_MESSAGE);
  listener({ msg: 'hearing things', ms: 1000, solver });
  listener({ msg: 'hated visionary', ms: 2000, solver });
}

main();
