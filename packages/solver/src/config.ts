import dotenv from 'dotenv';

dotenv.config();

export const SOLVER_PK = process.env.SOLVER_PK;
if (!SOLVER_PK) {
  throw new Error('SOLVER_PK is required');
}
