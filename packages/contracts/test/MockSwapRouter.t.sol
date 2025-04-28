// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/MockSwapRouter.sol";

contract MockSwapRouterTest is Test {
  MockSwapRouter public swapRouter;

  function setUp() public {
    swapRouter = new MockSwapRouter();
  }

  function test_SwapExactOutput() public {}
}
