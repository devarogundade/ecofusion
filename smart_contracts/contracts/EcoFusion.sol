// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {TradeCenter} from "./TradeCenter.sol";

contract EcoFusion is TradeCenter {
    constructor() payable {}

    function initReserve(
        address resource,
        uint256 price
    ) external payable returns (address, address) {
        require(_isSafeFirm(msg.sender));

        return _createOrGetReserve(resource, price);
    }

    function trade(
        address resource,
        uint256 price,
        uint256 units
    ) external payable returns (uint256) {
        require(_isSafeArtisan(msg.sender));

        (, uint256 amount) = _trade(msg.sender, resource, price, units);
        return amount;
    }

    function registerAsArtisan(string memory metadata) external payable {
        _createArtisan(msg.sender, metadata);
    }

    function registerAsFirm(string memory metadata) external payable {
        _createFirm(msg.sender, metadata);
    }

    function registerAProject(
        uint256 projectId,
        uint256 donationMax,
        string memory metadata
    ) external {
        require(_isSafeArtisan(msg.sender));

        _createProject(projectId, donationMax, metadata, msg.sender);
    }

    function donateToProject(uint256 projectId) external payable {
        _donateToProject(projectId);
    }

    function withdrawFromProject(uint256 projectId, uint256 amount) external {
        _withdrawFromProject(projectId, amount);
    }

    function getArtisan(address artisan) external view returns (string memory) {
        return _getArtisan(artisan).metadata;
    }

    function getFirm(address firm) external view returns (string memory) {
        return _getFirm(firm).metadata;
    }

    function getReserves(
        address resource
    ) external view returns (address[] memory) {
        return _getReserves(resource);
    }

    function getReserve(
        address resource,
        uint256 index
    ) external view returns (address) {
        return _getReserveIdx(resource, index);
    }

    function lookUpReserve(
        address resource,
        uint256 units
    ) external view returns (address, uint256) {
        return _lookUpReserve(resource, units);
    }
}
