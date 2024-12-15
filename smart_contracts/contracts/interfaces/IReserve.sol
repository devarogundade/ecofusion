// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IReserve {
    function price() external view returns (uint256);

    function lpSupply() external view returns (uint256);

    function reservedUnits() external view returns (uint256);

    function resource() external view returns (address);

    function lpToken() external view returns (address);

    function addLiquidity(uint256 units) external returns (uint256);

    function removeLiquidity(uint256 lpToken) external returns (uint256);

    function withdraw(uint256 units, address to) external;

    function deposit() external payable;
}
