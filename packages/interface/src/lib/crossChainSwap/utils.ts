import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Address,
  decodeAbiParameters,
  encodeAbiParameters,
  encodePacked,
  keccak256,
  numberToHex,
  pad,
} from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FILL_DEADLINE = 4294967295;
export const DESTINATION_ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_DESTINATION_ROUTER_ADDRESS;

export function addressToBytes32(address: Address): Address {
  const addrBigInt = BigInt(address);
  return pad(numberToHex(addrBigInt), { size: 32 });
}

export type OnchainCrossChainOrder = {
  fillDeadline: number;
  orderDataType: Address;
  orderData: Address;
};

export type OrderData = {
  sender: Address;
  recipient: Address;
  inputToken: Address;
  outputToken: Address;
  amountIn: bigint;
  amountOut: bigint;
  senderNonce: bigint;
  originDomain: number;
  destinationDomain: number;
  destinationSettler: Address;
  fillDeadline: number;
  data: Address;
};

const ORDER_DATA_TYPE_STRING = [
  'bytes32 sender',
  'bytes32 recipient',
  'bytes32 inputToken',
  'bytes32 outputToken',
  'uint256 amountIn',
  'uint256 amountOut',
  'uint256 senderNonce',
  'uint32 originDomain',
  'uint32 destinationDomain',
  'bytes32 destinationSettler',
  'uint32 fillDeadline',
  'bytes data',
].join(',');

const ORDER_DATA_TYPE_HASH = keccak256(
  encodePacked(['string'], [`OrderData(${ORDER_DATA_TYPE_STRING})`])
);

export const OrderEncoder = {
  orderDataType: () => ORDER_DATA_TYPE_HASH,

  // abi.encode(order)
  encode: (order: OrderData): Address => {
    const encodedStructBody = encodeAbiParameters(
      [
        { name: 'sender', type: 'bytes32' },
        { name: 'recipient', type: 'bytes32' },
        { name: 'inputToken', type: 'bytes32' },
        { name: 'outputToken', type: 'bytes32' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOut', type: 'uint256' },
        { name: 'senderNonce', type: 'uint256' },
        { name: 'originDomain', type: 'uint32' },
        { name: 'destinationDomain', type: 'uint32' },
        { name: 'destinationSettler', type: 'bytes32' },
        { name: 'fillDeadline', type: 'uint32' },
        { name: 'data', type: 'bytes' },
      ],
      [
        order.sender,
        order.recipient,
        order.inputToken,
        order.outputToken,
        order.amountIn,
        order.amountOut,
        order.senderNonce,
        order.originDomain,
        order.destinationDomain,
        order.destinationSettler,
        order.fillDeadline,
        order.data,
      ]
    );
    const offset =
      '0x0000000000000000000000000000000000000000000000000000000000000020';
    return `${offset}${encodedStructBody.slice(2)}`;
  },

  // (OrderData memory orderData) = abi.decode(orderBytes, (OrderData))
  decode: (encoded: Address): OrderData => {
    // Strip the first 32 bytes (offset)
    const encodedStruct = `0x${encoded.slice(66)}`;

    const [
      sender,
      recipient,
      inputToken,
      outputToken,
      amountIn,
      amountOut,
      senderNonce,
      originDomain,
      destinationDomain,
      destinationSettler,
      fillDeadline,
      data,
    ] = decodeAbiParameters(
      [
        { name: 'sender', type: 'bytes32' },
        { name: 'recipient', type: 'bytes32' },
        { name: 'inputToken', type: 'bytes32' },
        { name: 'outputToken', type: 'bytes32' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOut', type: 'uint256' },
        { name: 'senderNonce', type: 'uint256' },
        { name: 'originDomain', type: 'uint32' },
        { name: 'destinationDomain', type: 'uint32' },
        { name: 'destinationSettler', type: 'bytes32' },
        { name: 'fillDeadline', type: 'uint32' },
        { name: 'data', type: 'bytes' },
      ],
      encodedStruct as Address
    );

    return {
      sender,
      recipient,
      inputToken,
      outputToken,
      amountIn,
      amountOut,
      senderNonce,
      originDomain,
      destinationDomain,
      destinationSettler,
      fillDeadline,
      data,
    };
  },

  id: (order: OrderData): Address => {
    return keccak256(OrderEncoder.encode(order));
  },
};
