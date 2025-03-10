# MultiversX DeFi Platform

A comprehensive DeFi platform built on the MultiversX blockchain that enables seamless token transfers, cross-chain swaps, and advanced market analysis.

## Features

### ESDT Token Operations
- **Token Transfers**: Seamless ESDT token transfers
- **Token Management**: Issue, mint, and burn ESDT tokens
- **NFT Support**: Create and manage NFTs and SFTs

### Cross-Chain Bridge
- **Bridge Integration**: Connect with MultiversX's native bridge
- **Cross-Chain Swaps**: Swap tokens between MultiversX and other blockchains

### Market Analysis
- **Real-time Analytics**: Live price tracking and market metrics
- **Technical Indicators**: Advanced trading indicators and signals
- **AI-Powered Insights**: Intelligent market analysis and predictions

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: MultiversX SDK (sdk-core, sdk-dapp, sdk-network-providers, sdk-wallet)
- **Smart Contracts**: Written in Rust using MultiversX's smart contract framework

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MultiversX wallet (xPortal, Web Wallet, or Browser Extension)
- Basic knowledge of MultiversX blockchain

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/multiversx-defi.git
   cd multiversx-defi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_MULTIVERSX_API=https://devnet-api.multiversx.com
   NEXT_PUBLIC_MULTIVERSX_GATEWAY=https://devnet-gateway.multiversx.com
   NEXT_PUBLIC_MULTIVERSX_EXPLORER=https://devnet-explorer.multiversx.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Development

Smart contracts for this project are written in Rust using MultiversX's smart contract framework. To work with the smart contracts:

1. Install mxpy (MultiversX Python SDK):
   ```bash
   pip install mxpy
   ```

2. Navigate to the contracts directory:
   ```bash
   cd contracts
   ```

3. Build the smart contract:
   ```bash
   mxpy contract build
   ```

4. Deploy the smart contract to devnet:
   ```bash
   mxpy contract deploy --bytecode=output/contract.wasm --pem=wallet.pem --gas-limit=60000000 --proxy=https://devnet-gateway.multiversx.com --chain=D --recall-nonce --send
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 