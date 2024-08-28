// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract AquariStakingContest is ReentrancyGuard, Ownable {
    IERC20 public aquariToken;
    AggregatorV3Interface public priceFeed;

    uint256 public constant CONTEST_START = 1723315200; // August 10th, 2024
    uint256 public constant CONTEST_END = 1728172800; // October 10th, 2024
    uint256 public constant CALCULATION_TIME = 1731292800; // November 10th, 2024

    mapping(address => uint256) public stakedBalances;
    address[] public participants;
    address public winner;
    bool public isContestFinalized;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event WinnerDeclared(address indexed winner, uint256 points);

    constructor(address _aquariToken, address _priceFeed) Ownable(msg.sender) {
        aquariToken = IERC20(_aquariToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function stake(uint256 amount) external nonReentrant {
        require(
            block.timestamp >= CONTEST_START && block.timestamp <= CONTEST_END,
            "Contest is not active"
        );
        require(amount > 0, "Cannot stake 0 tokens");

        aquariToken.transferFrom(msg.sender, address(this), amount);

        if (stakedBalances[msg.sender] == 0) {
            participants.push(msg.sender);
        }
        stakedBalances[msg.sender] += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(
            stakedBalances[msg.sender] >= amount,
            "Insufficient staked balance"
        );

        stakedBalances[msg.sender] -= amount;
        aquariToken.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function finalizeContest() external onlyOwner {
        require(block.timestamp >= CALCULATION_TIME, "Too early to finalize");
        require(!isContestFinalized, "Contest already finalized");

        uint256 highestPoints = 0;
        address currentWinner;

        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            uint256 stakedAmount = stakedBalances[participant];
            uint256 stakedValue = getUSDValue(stakedAmount);
            uint256 points = stakedValue / 100;

            if (points > highestPoints) {
                highestPoints = points;
                currentWinner = participant;
            }
        }

        winner = currentWinner;
        isContestFinalized = true;

        emit WinnerDeclared(winner, highestPoints);
    }

    function getWinner() external view returns (address) {
        require(isContestFinalized, "Contest not yet finalized");
        return winner;
    }

    function getUSDValue(uint256 amount) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");
        return (amount * uint256(price)) / 1e8; // Assuming 8 decimals for price feed
    }
}
