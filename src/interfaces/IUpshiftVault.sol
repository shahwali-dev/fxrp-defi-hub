// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

interface IUpshiftVault {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function instantRedeem(uint256 shares, address receiver) external returns (uint256 assets);
    function requestRedeem(uint256 shares, address receiver) external;
    function claim(uint256 year, uint256 month, uint256 day, address receiver) external;
    function asset() external view returns (address);
    function totalAssets() external view returns (uint256);
    function lpTokenAddress() external view returns (address);
    function getWithdrawalEpoch() external view returns (uint256 year, uint256 month, uint256 day, uint256 claimableEpoch);
    function getBurnableAmountByReceiver(uint256 year, uint256 month, uint256 day, address receiver) external view returns (uint256);
    function previewRedemption(uint256 shares, bool instant) external view returns (uint256 assetsBeforeFee, uint256 assetsAfterFee);
    function lagDuration() external view returns (uint256);
    function withdrawalFee() external view returns (uint256);
    function withdrawalsPaused() external view returns (bool);
    function maxWithdrawalAmount() external view returns (uint256);
}