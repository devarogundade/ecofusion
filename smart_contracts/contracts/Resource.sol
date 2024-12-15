// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./libs/HederaResponseCodes.sol";
import "./libs/IHederaTokenService.sol";
import "./libs/HederaTokenService.sol";
import "./libs/ExpiryHelper.sol";
import "./libs/KeyHelper.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IResource} from "./interfaces/IResource.sol";

contract Resource is
    Ownable,
    IResource,
    ExpiryHelper,
    KeyHelper,
    HederaTokenService
{
    address internal _underlyingToken;

    constructor(
        string memory name,
        string memory symbol,
        int32 decimals,
        int64 autoRenewPeriod
    ) payable Ownable(msg.sender) {
        IHederaTokenService.TokenKey[]
            memory keys = new IHederaTokenService.TokenKey[](1);

        // Set this contract as supply for the token
        keys[0] = getSingleKey(
            KeyType.SUPPLY,
            KeyValueType.CONTRACT_ID,
            address(this)
        );

        IHederaTokenService.HederaToken memory hederaToken;
        hederaToken.name = name;
        hederaToken.symbol = symbol;
        hederaToken.treasury = address(this);
        hederaToken.tokenSupplyType = false; // set supply to INFINITE
        hederaToken.tokenKeys = keys;
        hederaToken.freezeDefault = false;
        hederaToken.expiry = createAutoRenewExpiry(
            address(this),
            autoRenewPeriod
        ); // Contract auto-renews the token

        (int response, address createdToken) = HederaTokenService
            .createFungibleToken(hederaToken, 1_000_000, decimals);

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to create fungible token");
        }

        _underlyingToken = createdToken;
    }

    function mint(int64 amount, address to) external onlyOwner returns (int64) {
        (int response, , ) = mintToken(
            _underlyingToken,
            amount,
            new bytes[](0)
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to mint fungible token");
        }

        transferToken(_underlyingToken, address(this), to, amount);

        return amount;
    }

    function token() external view override returns (address) {
        return _underlyingToken;
    }
}
