// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./libs/HederaResponseCodes.sol";
import "./libs/IHederaTokenService.sol";
import "./libs/HederaTokenService.sol";
import "./libs/ExpiryHelper.sol";
import "./libs/KeyHelper.sol";

import {Ownable} from "./libs/Ownable.sol";

import {IReserve} from "./interfaces/IReserve.sol";
import {IResource} from "./interfaces/IResource.sol";

contract Reserve is
    Ownable,
    IReserve,
    ExpiryHelper,
    KeyHelper,
    HederaTokenService
{
    uint256 internal _price;
    address internal _lpToken;
    address internal _resource;
    uint256 internal _reserve;
    uint256 internal _lpSupply;
    uint256 internal constant MINIMAL_LIQUIDITY = 10_000 * 10 ** 2;

    constructor(
        address initResource,
        uint256 initPrice
    ) payable Ownable(msg.sender) {
        _price = initPrice;
        _resource = initResource;
        _initLpToken("EcoFusion Lp", "ELP", 2, 7_776_000);

        address resourceToken = IResource(_resource).token();
        associateToken(address(this), resourceToken);
    }

    // ======= MUTABLE FUNCTIONS ======= //

    function addLiquidity(uint256 units) external override returns (uint256) {
        address resourceToken = IResource(_resource).token();

        transferToken(
            resourceToken,
            msg.sender,
            address(this),
            int64(int256(units))
        );

        _reserve = _reserve + units;

        uint256 lpAmount;
        if (_lpSupply == 0) {
            lpAmount = MINIMAL_LIQUIDITY;
        } else {
            lpAmount = (units * _lpSupply) / _reserve;
        }

        _lpSupply = _lpSupply + lpAmount;

        (int response, , ) = mintToken(
            _lpToken,
            int64(int256(lpAmount)),
            new bytes[](0)
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to mint fungible token");
        }

        transferToken(
            _lpToken,
            address(this),
            msg.sender,
            int64(int256(lpAmount))
        );

        return lpAmount;
    }

    function removeLiquidity(
        uint256 lpAmount
    ) external override returns (uint256) {
        transferToken(
            _lpToken,
            msg.sender,
            address(this),
            int64(int256(lpAmount))
        );

        (int response, ) = burnToken(
            _lpToken,
            int64(int256(lpAmount)),
            new int64[](0)
        );

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to burn fungible token");
        }

        address resourceToken = IResource(_resource).token();

        uint256 units = (lpAmount * _reserve) / _lpSupply;

        transferToken(
            resourceToken,
            address(this),
            msg.sender,
            int64(int256(units))
        );

        uint256 shares = (lpAmount * address(this).balance) / _lpSupply;
        payable(msg.sender).transfer(shares);

        _reserve = _reserve - units;
        _lpSupply = _lpSupply - lpAmount;

        return shares;
    }

    function withdraw(uint256 units, address to) external override onlyOwner {
        address resourceToken = IResource(_resource).token();

        transferToken(resourceToken, address(this), to, int64(int256(units)));

        _lpSupply = _lpSupply - units;
    }

    function deposit() external payable override onlyOwner {}

    // ======= INTERNAL FUNCTIONS ======= //

    function _initLpToken(
        string memory name,
        string memory symbol,
        int32 decimals,
        int64 autoRenewPeriod
    ) internal {
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
            .createFungibleToken(hederaToken, 0, decimals);

        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to create fungible token");
        }

        _lpToken = createdToken;
    }

    // ======= VIEW FUNCTIONS ======= //

    function price() external view override returns (uint256) {
        return _price;
    }

    function lpSupply() external view override returns (uint256) {
        return _lpSupply;
    }

    function reservedUnits() external view override returns (uint256) {
        return _reserve;
    }

    function resource() external view override returns (address) {
        return _resource;
    }

    function lpToken() external view override returns (address) {
        return _lpToken;
    }
}
