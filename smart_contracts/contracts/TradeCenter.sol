// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./libs/HederaTokenService.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Reserve} from "./Reserve.sol";
import {IReserve} from "./interfaces/IReserve.sol";
import {IResource} from "./interfaces/IResource.sol";

abstract contract TradeCenter is Ownable, HederaTokenService {
    mapping(address => Firm) internal _firms;
    mapping(address => Artisan) internal _artisans;

    mapping(uint256 => Project) internal _projects;

    // Mapping of resource to their reserves.
    mapping(address => address[]) internal _reserves;

    uint256 internal CREATE_FIRM_FEES;
    uint256 internal CREATE_ARTISAN_FEES;

    struct Firm {
        bool approved;
        string metadata;
        uint256 impactScore;
    }

    struct Artisan {
        bool approved;
        string metadata;
        uint256 impactScore;
    }

    struct Project {
        uint256 donationMax;
        uint256 donationOut;
        uint256 donationIn;
        string metadata;
        address creator;
    }

    constructor() Ownable(msg.sender) {}

    // ======= MUTABLE FUNCTIONS ======= //

    function _trade(
        address artisan,
        address resource,
        uint256 price,
        uint256 units
    ) internal returns (address, uint256) {
        address reserve = _getReserve(resource, price);

        uint256 reservedUnits = IReserve(reserve).reservedUnits();
        require(units <= reservedUnits, "Insufficient liquidity");

        IReserve(reserve).withdraw(units, artisan);

        uint256 amount = units * IReserve(reserve).price();
        IReserve(reserve).deposit{value: amount}();

        return (reserve, amount);
    }

    function _createOrGetReserve(
        address resource,
        uint256 price
    ) internal returns (address, address) {
        address[] memory reserves = _reserves[resource];

        for (uint256 index = 0; index < reserves.length; index++) {
            uint256 reservePrice = IReserve(reserves[index]).price();
            if (reservePrice == price) {
                address lpToken = IReserve(reserves[index]).lpToken();
                return (reserves[index], lpToken);
            }
        }

        return _createReserve(resource, price);
    }

    function _createReserve(
        address resource,
        uint256 price
    ) internal returns (address, address) {
        address reserve = address(
            new Reserve{value: msg.value}(resource, price)
        );

        _reserves[resource].push(reserve);

        return (reserve, IReserve(reserve).lpToken());
    }

    function _createProject(
        uint256 projectId,
        uint256 donationMax,
        string memory metadata,
        address creator
    ) internal {
        require(
            _projects[projectId].creator == address(0),
            "Id already choosen"
        );

        _projects[projectId] = Project({
            donationMax: donationMax,
            donationOut: 0,
            donationIn: 0,
            metadata: metadata,
            creator: creator
        });
    }

    function _donateToProject(uint256 projectId) internal {
        require(msg.value > 0, "Zero amount");
        require(
            _projects[projectId].donationIn < _projects[projectId].donationMax,
            "Already reached max"
        );

        _projects[projectId].donationIn += msg.value;
    }

    function _withdrawFromProject(uint256 projectId, uint256 amount) internal {
        require(amount > 0, "Zero amount");
        require(_projects[projectId].creator == msg.sender);
        require(
            amount <=
                _projects[projectId].donationIn -
                    _projects[projectId].donationOut,
            "Insuficient amount"
        );

        payable(msg.sender).transfer(amount);

        _projects[projectId].donationOut += amount;
    }

    function _createArtisan(address artisan, string memory metadata) internal {
        require(msg.value >= CREATE_ARTISAN_FEES, "Insufficient funds");
        require(_artisans[artisan].impactScore == 0);

        _artisans[artisan] = Artisan({
            approved: true,
            metadata: metadata,
            impactScore: 0
        });
    }

    function _createFirm(address firm, string memory metadata) internal {
        require(msg.value >= CREATE_FIRM_FEES, "Insufficient funds");
        require(_firms[firm].impactScore == 0);

        _firms[firm] = Firm({
            approved: true,
            metadata: metadata,
            impactScore: 0
        });
    }

    // ======= VIEW FUNCTIONS ======= //

    function _getReserves(
        address resource
    ) internal view returns (address[] memory) {
        return _reserves[resource];
    }

    function _getReserveIdx(
        address resource,
        uint256 index
    ) internal view returns (address) {
        return _reserves[resource][index];
    }

    function _lookUpReserve(
        address resource,
        uint256 units
    ) internal view returns (address, uint256) {
        address[] memory reserves = _reserves[resource];
        uint256 reserveIdx;
        uint256 price;

        for (uint256 index = 0; index < reserves.length; index++) {
            uint256 reservePrice = IReserve(reserves[index]).price();
            uint256 reservedUnits = IReserve(reserves[index]).reservedUnits();

            if (
                price == 0 || (reservePrice <= price && units <= reservedUnits)
            ) {
                price = reservePrice;
                reserveIdx = index;
            }
        }

        return (reserves[reserveIdx], price);
    }

    function _getReserve(
        address resource,
        uint256 price
    ) internal view returns (address) {
        address[] memory reserves = _reserves[resource];

        for (uint256 index = 0; index < reserves.length; index++) {
            uint256 reservePrice = IReserve(reserves[index]).price();
            if (reservePrice == price) return reserves[index];
        }

        return address(0);
    }

    function _isSafeArtisan(address artisan) internal view returns (bool) {
        return _artisans[artisan].approved;
    }

    function _isSafeFirm(address firm) internal view returns (bool) {
        return _firms[firm].approved;
    }

    function _getArtisan(
        address artisan
    ) internal view returns (Artisan memory) {
        return _artisans[artisan];
    }

    function _getFirm(address firm) internal view returns (Firm memory) {
        return _firms[firm];
    }
}
