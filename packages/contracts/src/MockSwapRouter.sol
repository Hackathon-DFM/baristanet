// SPDX-License-Identifier: None
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockSwapRouter {
  struct ExactInputSingleParams {
    address tokenIn;
    address tokenOut;
    uint24 fee; // not used in mock
    address recipient;
    uint256 deadline;
    uint256 amountIn;
    uint256 amountOutMinimum;
    uint160 sqrtPriceLimitX96; // not used in mock
  }

  struct ExactOutputSingleParams {
    address tokenIn;
    address tokenOut;
    uint24 fee; // not used in mock
    address recipient;
    uint256 deadline;
    uint256 amountOut;
    uint256 amountInMaximum;
    uint160 sqrtPriceLimitX96; // not used in mock
  }

  function exactInputSingle(
    ExactInputSingleParams calldata params
  ) external payable returns (uint256 amountOut) {
    require(block.timestamp <= params.deadline, "Transaction expired");

    // 1. Take exact amountIn from msg.sender
    require(
      IERC20(params.tokenIn).transferFrom(
        msg.sender,
        address(this),
        params.amountIn
      ),
      "Transfer tokenIn failed"
    );

    // 2. Send exact amountOutMinimum to recipient
    require(
      IERC20(params.tokenOut).transfer(
        params.recipient,
        params.amountOutMinimum
      ),
      "Transfer tokenOut failed"
    );

    return params.amountOutMinimum;
  }

  function exactOutputSingle(
    ExactOutputSingleParams calldata params
  ) external payable returns (uint256 amountIn) {
    require(block.timestamp <= params.deadline, "Transaction expired");

    // 1. Take exact amountInMaximum from msg.sender
    require(
      IERC20(params.tokenIn).transferFrom(
        msg.sender,
        address(this),
        params.amountInMaximum
      ),
      "Transfer tokenIn failed"
    );

    // 2. Send exact amountOut to recipient
    require(
      IERC20(params.tokenOut).transfer(params.recipient, params.amountOut),
      "Transfer tokenOut failed"
    );

    return params.amountInMaximum;
  }
}
