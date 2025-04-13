import dotenv from 'dotenv';

dotenv.config();

export const SENDER_ADDRESS = process.env.SENDER_ADDRESS;
if (!SENDER_ADDRESS) {
  throw new Error('SENDER_ADDRESS is required');
}

export const SOLVER_ADDRESS = process.env.SOLVER_ADDRESS;
if (!SOLVER_ADDRESS) {
  throw new Error('SOLVER_ADDRESS is required');
}

export const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;
if (!RECIPIENT_ADDRESS) {
  throw new Error('RECIPIENT_ADDRESS is required');
}

export const SENDER_PK = process.env.SENDER_PK;
if (!SENDER_PK) {
  throw new Error('SENDER_PK is required');
}

export const SOLVER_PK = process.env.SOLVER_PK;
if (!SOLVER_PK) {
  throw new Error('SOLVER_PK is required');
}

export const INTOKEN_ADDRESS = process.env.INTOKEN_ADDRESS;
if (!INTOKEN_ADDRESS) {
  throw new Error('INTOKEN_ADDRESS is required');
}

export const OUTTOKEN_ADDRESS = process.env.OUTTOKEN_ADDRESS;
if (!OUTTOKEN_ADDRESS) {
  throw new Error('OUTTOKEN_ADDRESS is required');
}

export const ORIGIN_ROUTER_ADDRESS = process.env.ORIGIN_ROUTER_ADDRESS;
if (!ORIGIN_ROUTER_ADDRESS) {
  throw new Error('ORIGIN_ROUTER_ADDRESS is required');
}

export const DESTINATION_ROUTER_ADDRESS =
  process.env.DESTINATION_ROUTER_ADDRESS;
if (!DESTINATION_ROUTER_ADDRESS) {
  throw new Error('DESTINATION_ROUTER_ADDRESS is required');
}
