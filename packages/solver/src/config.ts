import dotenv from 'dotenv';

dotenv.config();

const SECRET_MESSAGE = process.env.SECRET_MESSAGE;
if (!SECRET_MESSAGE) {
  throw new Error('SECRET_MESSAGE is required');
}

export { SECRET_MESSAGE };
