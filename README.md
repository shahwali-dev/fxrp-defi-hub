<p align="center">
  <a href="https://flare.network/" target="_blank">
    <img src="https://content.flare.network/Flare-2.svg" width="410" height="106" alt="Flare Logo" />
  </a>
</p>

<h1 align="center">🚀 FXRP DeFi Hub</h1>

<p align="center">
  <strong>Flare Summer Signal Hackathon 2026 — Bounty 1: Interoperable Asset Products</strong>
</p>

<p align="center">
  <a href="https://github.com/shahwali-dev/fxrp-defi-hub">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://fxrp-defi-hub.vercel.app">
    <img src="https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Website" />
  </a>
  <a href="https://coston2-explorer.flare.network/address/0xF7Aa71aF0f4FBDEd0F81565F55E85518907F69A6">
    <img src="https://img.shields.io/badge/Contract-FF6B00?style=for-the-badge&logo=flare&logoColor=white" alt="Contract" />
  </a>
</p>

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Solution](#-solution)
* [Key Features](#-key-features)
* [Technical Architecture](#-technical-architecture)
* [Flare Integration](#-flare-integration)
* [Deployed Contracts](#-deployed-contracts)
* [Testing](#-testing)
* [Frontend](#-frontend)
* [Future Roadmap](#-future-roadmap)
* [Team](#-team)
* [Links](#-links)
* [License](#-license)

---

## 📖 Overview

**FXRP DeFi Hub** is a unified platform that bridges XRP holders to Flare's DeFi ecosystem.

It provides a simple, user-friendly interface to deposit FXRP into yield-generating vaults such as **Firelight** and **Upshift**, while monitoring real-time price data from Flare's decentralized oracle, **FTSO**.

The project demonstrates the power of Flare's infrastructure by integrating:

* **FAssets (FXRP)** — Cross-chain asset representation for XRP
* **Firelight Vaults** — Yield generation through the FAssets ecosystem
* **Upshift Vaults** — Flexible yield strategies with instant and requested redemptions
* **FTSO (Flare Time Series Oracle)** — Decentralized real-time price feeds

---

## 🎯 Problem Statement

XRP holders currently face limited DeFi opportunities because XRP does not have native smart contract capabilities.

While Flare Network addresses this through **FAssets (FXRP)**, there is no unified platform that allows users to easily:

1. Onboard XRP to Flare as FXRP
2. Deposit FXRP into yield-generating vaults
3. Track their portfolio and yields in real time
4. Access price data from Flare's decentralized oracle (FTSO)

---

## 💡 Solution

**FXRP DeFi Hub** solves this by providing a **single, user-friendly interface** that connects XRP holders to Flare's DeFi ecosystem.

Users can deposit FXRP into **Firelight** and **Upshift** vaults to access yield-generating strategies, while monitoring their positions and real-time FLR price data from FTSO.

---

## ✨ Key Features

| Feature                  | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| **Wallet Connect**       | Seamless MetaMask integration                                    |
| **Real-time Price Data** | Live FLR price data from FTSO                                    |
| **FXRP Deposit**         | Deposit FXRP into the platform                                   |
| **Firelight Vault**      | Earn yield through the FAssets ecosystem (ERC-4626 compliant)    |
| **Upshift Vault**        | Flexible yield strategies with instant and requested redemptions |
| **Portfolio Tracking**   | Real-time balance and vault share tracking                       |

---

## 🏗️ Technical Architecture

### Smart Contracts

The project consists of a main `MyHackathonProject.sol` contract that integrates the following Flare ecosystem components:

```solidity
contract MyHackathonProject {
    IFtso public ftso;                         // FTSO for price data
    IERC20 public fxrp;                        // FXRP token
    IFirelightVault public firelightVault;     // Firelight vault
    IUpshiftVault public upshiftVault;         // Upshift vault
}
```

### Frontend

Built with:

* **React + TypeScript** — Modern frontend framework
* **Vite** — Fast build tool and development server
* **Wagmi + Viem** — EVM wallet and blockchain interaction
* **Tailwind CSS** — Utility-first styling
* **MetaMask** — Wallet connection

### Project Structure

```text
fxrp-defi-hub/
├── src/                              # Smart contracts
│   ├── MyHackathonProject.sol        # Main contract
│   └── interfaces/                   # Vault interfaces
├── script/                           # Foundry deployment scripts
├── test/                             # Forge tests
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── App.tsx                   # Main application
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   └── package.json
├── foundry.toml                      # Foundry configuration
└── README.md
```

---

## 🔗 Flare Integration

| Protocol            | Integration | Description                      |
| ------------------- | ----------- | -------------------------------- |
| **FTSO**            | ✅           | Real-time FLR price data         |
| **FAssets (FXRP)**  | ✅           | Cross-chain asset representation |
| **Firelight Vault** | ✅           | ERC-4626 yield vault             |
| **Upshift Vault**   | ✅           | Flexible yield strategy vault    |
| **FDC**             | ✅           | Cross-chain data verification    |

---

## 📍 Deployed Contracts

| Network     | Contract Address                             | Explorer                                                                                                      |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Coston2** | `0xF7Aa71aF0f4FBDEd0F81565F55E85518907F69A6` | [View on Explorer](https://coston2-explorer.flare.network/address/0xF7Aa71aF0f4FBDEd0F81565F55E85518907F69A6) |

### Contract Addresses — Coston2

| Component           | Address                                      |
| ------------------- | -------------------------------------------- |
| **FXRP Token**      | `0x0b6A3645c240605887a5532109323A3E12273dc7` |
| **Firelight Vault** | `0xC90D6847747b85d1fa2E07859869fb9fB72c0361` |
| **Upshift Vault**   | `0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81` |

---

## 🧪 Testing

All tests pass successfully with Foundry:

```bash
forge test
```

Test results:

```text
Ran 3 tests for test/MyHackathonProject.t.sol:MyHackathonProjectTest

[PASS] test_DepositFXRP()
[PASS] test_GetFLRPrice()
[PASS] test_VaultAddresses()

Suite result: ok. 3 passed; 0 failed; 0 skipped
```

---

## 🎨 Frontend

The frontend is deployed at:

**https://fxrp-defi-hub.vercel.app**

### Features

* 🔗 **Connect Wallet** — Seamless MetaMask integration
* 📊 **FLR Price** — Live price data from FTSO
* 💰 **Deposit FXRP** — Deposit FXRP into the platform
* 🔥 **Firelight Vault** — Access yield-generating strategies
* ⬆️ **Upshift Vault** — Access flexible yield strategies

### Screenshot

<p align="center">
  <img width="1821" height="1053" alt="Image" src="https://github.com/user-attachments/assets/5f9d22f0-56e2-4395-be3a-d709c5f23e1a" />
</p>

---

## 🗺️ Future Roadmap

### 1. Multi-Asset Support

Add support for additional FAssets, including:

* FDOGE
* FLTC

### 2. Confidential Compute

Integrate **Flare Confidential Compute (FCC)** for private vault strategies.

### 3. Cross-Chain Bridge

Enable bridging of FXRP to other blockchain networks through **LayerZero OFT**.

### 4. Mobile App

Build a mobile application for FXRP management and DeFi interactions.

### 5. Gasless Transactions

Explore the **x402 protocol** to enable gasless payment experiences.

---

## 👥 Team

| Name         | Role                 | GitHub                                           |
| ------------ | -------------------- | ------------------------------------------------ |
| **Shahwali** | Full Stack Developer | [@shahwali-dev](https://github.com/shahwali-dev) |

---

## 🔗 Links

| Resource                | Link                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **GitHub Repository**   | [github.com/shahwali-dev/fxrp-defi-hub](https://github.com/shahwali-dev/fxrp-defi-hub)                              |
| **Live Demo**           | [fxrp-defi-hub.vercel.app](https://fxrp-defi-hub.vercel.app)                                                        |
| **Contract — Coston2**  | [View on Flare Explorer](https://coston2-explorer.flare.network/address/0xF7Aa71aF0f4FBDEd0F81565F55E85518907F69A6) |
| **Flare Network**       | [flare.network](https://flare.network)                                                                              |
| **Flare Developer Hub** | [dev.flare.network](https://dev.flare.network)                                                                      |

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <strong>🏆 Built for Flare Summer Signal Hackathon 2026</strong>
</p>
