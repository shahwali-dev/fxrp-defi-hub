// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IFtso} from "flare-periphery/src/coston2/IFtso.sol";
import {ContractRegistry} from "flare-periphery/src/coston2/ContractRegistry.sol";
import {IERC20} from "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import {IFirelightVault} from "./interfaces/IFirelightVault.sol";
import {IUpshiftVault} from "./interfaces/IUpshiftVault.sol";

contract MyHackathonProject {
    // ----- FTSO -----
    IFtso public ftso;

    // ----- FXRP Token -----
    IERC20 public fxrp;

    // ----- Vaults (Coston2 Addresses) -----
    IFirelightVault public firelightVault;
    IUpshiftVault public upshiftVault;

    // ----- User Balances (for tracking) -----
    mapping(address => uint256) public userFXRPBalance;
    mapping(address => uint256) public userFirelightShares;
    mapping(address => uint256) public userUpshiftShares;

    // ----- Events -----
    event FXRPDeposited(address indexed user, uint256 amount);
    event FXRPWithdrawn(address indexed user, uint256 amount);
    event FirelightDeposited(address indexed user, uint256 assets, uint256 shares);
    event UpshiftDeposited(address indexed user, uint256 assets, uint256 shares);
    event UpshiftRedeemRequested(address indexed user, uint256 shares, uint256 year, uint256 month, uint256 day);
    event UpshiftClaimed(address indexed user, uint256 assets);

    // ----- Constructor -----
    constructor(
        address _fxrpAddress,
        address _firelightVaultAddress,
        address _upshiftVaultAddress,
        address _ftsoAddress
    ) {
        ftso = IFtso(_ftsoAddress);
        fxrp = IERC20(_fxrpAddress);
        firelightVault = IFirelightVault(_firelightVaultAddress);
        upshiftVault = IUpshiftVault(_upshiftVaultAddress);
    }

    // ============================================
    // 1. FXRP TOKEN INTERACTIONS
    // ============================================

    function depositFXRP(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        bool success = fxrp.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        userFXRPBalance[msg.sender] += amount;
        emit FXRPDeposited(msg.sender, amount);
    }

    function withdrawFXRP(uint256 amount) external {
        require(userFXRPBalance[msg.sender] >= amount, "Insufficient balance");
        userFXRPBalance[msg.sender] -= amount;
        bool success = fxrp.transfer(msg.sender, amount);
        require(success, "Transfer failed");
        emit FXRPWithdrawn(msg.sender, amount);
    }

    function getFXRPBalance(address user) public view returns (uint256) {
        return userFXRPBalance[user];
    }

    // ============================================
    // 2. FIRLIGHT VAULT (Yield)
    // ============================================

    function depositFirelight(uint256 assets) external {
        require(assets > 0, "Assets must be > 0");
        require(userFXRPBalance[msg.sender] >= assets, "Insufficient FXRP balance");

        // Move FXRP from user balance to this contract
        userFXRPBalance[msg.sender] -= assets;

        // Approve vault to spend FXRP
        fxrp.approve(address(firelightVault), assets);

        // Deposit into Firelight vault
        uint256 shares = firelightVault.deposit(assets, msg.sender);
        userFirelightShares[msg.sender] += shares;

        emit FirelightDeposited(msg.sender, assets, shares);
    }

    function getFirelightShares(address user) public view returns (uint256) {
        return userFirelightShares[user];
    }

    // ============================================
    // 3. UPSHIFT VAULT (Yield + Flexible Redemption)
    // ============================================

    function depositUpshift(uint256 assets) external {
        require(assets > 0, "Assets must be > 0");
        require(userFXRPBalance[msg.sender] >= assets, "Insufficient FXRP balance");

        userFXRPBalance[msg.sender] -= assets;
        fxrp.approve(address(upshiftVault), assets);

        uint256 shares = upshiftVault.deposit(assets, msg.sender);
        userUpshiftShares[msg.sender] += shares;

        emit UpshiftDeposited(msg.sender, assets, shares);
    }

    function requestRedeemUpshift(uint256 shares) external {
        require(userUpshiftShares[msg.sender] >= shares, "Insufficient shares");

        // Approve LP tokens to vault
        address lpToken = upshiftVault.lpTokenAddress();
        IERC20(lpToken).approve(address(upshiftVault), shares);

        upshiftVault.requestRedeem(shares, msg.sender);

        (uint256 year, uint256 month, uint256 day,) = upshiftVault.getWithdrawalEpoch();
        emit UpshiftRedeemRequested(msg.sender, shares, year, month, day);
    }

    function claimUpshift(uint256 year, uint256 month, uint256 day) external {
        upshiftVault.claim(year, month, day, msg.sender);
        emit UpshiftClaimed(msg.sender, 0); // amount not known here
    }

    function getUpshiftShares(address user) public view returns (uint256) {
        return userUpshiftShares[user];
    }

    // ============================================
    // 4. FTSO PRICE FEEDS
    // ============================================

    function getFLRPrice() public view returns (uint256) {
        (uint256 price,) = ftso.getCurrentPrice();
        return price;
    }

    // ============================================
    // 5. VAULT STATUS
    // ============================================

    function getFirelightTotalAssets() public view returns (uint256) {
        return firelightVault.totalAssets();
    }

    function getUpshiftVaultStatus()
        public
        view
        returns (uint256 totalAssets, uint256 lagDuration, uint256 withdrawalFee, bool paused)
    {
        return (
            upshiftVault.totalAssets(),
            upshiftVault.lagDuration(),
            upshiftVault.withdrawalFee(),
            upshiftVault.withdrawalsPaused()
        );
    }

    function getUpshiftWithdrawalEpoch()
        public
        view
        returns (uint256 year, uint256 month, uint256 day, uint256 claimableEpoch)
    {
        return upshiftVault.getWithdrawalEpoch();
    }
}
