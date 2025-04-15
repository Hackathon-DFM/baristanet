import dotenv from 'dotenv';

dotenv.config();

export const SECRET_MESSAGE = process.env.SECRET_MESSAGE;
if (!SECRET_MESSAGE) {
  throw new Error('SECRET_MESSAGE is required');
}

export const SOLVER_PK = process.env.SOLVER_PK;
if (!SOLVER_PK) {
  throw new Error('SOLVER_PK is required');
}
