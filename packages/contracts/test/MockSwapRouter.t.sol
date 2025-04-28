// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/MockSwapRouter.sol";
import "../src/MockToken.sol";

contract MockSwapRouterTest is Test {
  MockSwapRouter public swapRouter;
  MockToken public tokenIn;
  MockToken public tokenOut;
  address public user = address(1);

  function setUp() public {
    swapRouter = new MockSwapRouter();
    tokenIn = new MockToken("TIN", 18);
    tokenOut = new MockToken("TOUT", 18);

    // Mint tokens to user and router
    tokenIn.mint(user, 1_000 ether);
    tokenOut.mint(address(swapRouter), 1_000 ether);

    // Label addresses for better trace output
    vm.label(user, "User");
    vm.label(address(tokenIn), "TokenIn");
    vm.label(address(tokenOut), "TokenOut");
  }

  function testExactInputSingle() public {
    vm.startPrank(user);

    uint256 amountIn = 100 ether;
    uint256 amountOutMinimum = 200 ether;

    // Approve router to spend user's tokenIn
    tokenIn.approve(address(swapRouter), amountIn);

    // Perform exactInputSingle swap
    uint256 amountOut = swapRouter.exactInputSingle(
      MockSwapRouter.ExactInputSingleParams({
        tokenIn: address(tokenIn),
        tokenOut: address(tokenOut),
        fee: 0,
        recipient: user,
        deadline: block.timestamp + 1 hours,
        amountIn: amountIn,
        amountOutMinimum: amountOutMinimum,
        sqrtPriceLimitX96: 0
      })
    );

    assertEq(amountOut, amountOutMinimum, "Incorrect amountOut returned");
    assertEq(
      tokenOut.balanceOf(user),
      amountOutMinimum,
      "User did not receive correct tokenOut"
    );
    assertEq(
      tokenIn.balanceOf(user),
      1_000 ether - amountIn,
      "User tokenIn balance incorrect"
    );

    vm.stopPrank();
  }

  function testExactOutputSingle() public {
    vm.startPrank(user);

    uint256 amountInMaximum = 100 ether;
    uint256 amountOut = 50 ether;

    // Approve router to spend user's tokenIn
    tokenIn.approve(address(swapRouter), amountInMaximum);

    // Perform exactOutputSingle swap
    uint256 amountIn = swapRouter.exactOutputSingle(
      MockSwapRouter.ExactOutputSingleParams({
        tokenIn: address(tokenIn),
        tokenOut: address(tokenOut),
        fee: 0,
        recipient: user,
        deadline: block.timestamp + 1 hours,
        amountOut: amountOut,
        amountInMaximum: amountInMaximum,
        sqrtPriceLimitX96: 0
      })
    );

    assertEq(amountIn, amountInMaximum, "Incorrect amountIn returned");
    assertEq(
      tokenOut.balanceOf(user),
      amountOut,
      "User did not receive correct tokenOut"
    );
    assertEq(
      tokenIn.balanceOf(user),
      1_000 ether - amountInMaximum,
      "User tokenIn balance incorrect"
    );

    vm.stopPrank();
  }
}
