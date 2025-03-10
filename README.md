# AI-Powered MultiversX DeFi Platform

A comprehensive AI-driven DeFi platform built on the MultiversX blockchain that enables seamless token transfers, cross-chain swaps, advanced market analysis, and autonomous AI agents for portfolio management.

## Features

### AI-Powered DeFi Operations
- **Autonomous Trading Agents**: AI agents that can execute trades, manage liquidity, and optimize yield farming strategies
- **Market Sentiment Analysis**: Real-time analysis of social media and news to predict market movements
- **Risk Assessment**: AI-driven risk scoring for tokens and protocols
- **Portfolio Optimization**: Intelligent rebalancing suggestions based on market conditions

### ESDT Token Operations
- **Token Transfers**: Seamless ESDT token transfers
- **Token Management**: Issue, mint, and burn ESDT tokens
- **NFT Support**: Create and manage NFTs and SFTs

### Cross-Chain Bridge
- **Bridge Integration**: Connect with MultiversX's native bridge
- **Cross-Chain Swaps**: Swap tokens between MultiversX and other blockchains

### ElizaOS Integration
- **Custom AI Agents**: Create and deploy custom AI agents for specific DeFi tasks
- **Agent Marketplace**: Browse and use pre-built agents for different strategies
- **Agent Collaboration**: Enable multiple agents to work together for complex strategies

### Advanced Analytics
- **Real-time Analytics**: Live price tracking and market metrics
- **Technical Indicators**: Advanced trading indicators and signals
- **AI-Powered Insights**: Intelligent market analysis and predictions
- **On-Chain Data Analysis**: Deep insights from blockchain data

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Blockchain**: MultiversX SDK (sdk-core, sdk-dapp, sdk-network-providers, sdk-wallet)
- **Smart Contracts**: Written in Rust using MultiversX's smart contract framework
- **AI Integration**: ElizaOS for AI agents, OpenAI API for sentiment analysis and market predictions
- **Data Sources**: MultiversX API, CoinGecko, Twitter, Discord, and other social platforms

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MultiversX wallet (xPortal, Web Wallet, or Browser Extension)
- OpenAI API key for AI features
- Basic knowledge of MultiversX blockchain

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-multiversx-defi.git
   cd ai-multiversx-defi
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
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Agent Development

Our platform leverages ElizaOS to create and manage AI agents that can interact with the MultiversX blockchain. To create your own agent:

1. Navigate to the agents directory:
   ```bash
   cd src/agents
   ```

2. Use the agent template to create a new agent:
   ```bash
   npm run create-agent -- --name "MyTradingAgent"
   ```

3. Configure your agent's personality, goals, and capabilities in the generated files.

4. Deploy your agent:
   ```bash
   npm run deploy-agent -- --name "MyTradingAgent"
   ```

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