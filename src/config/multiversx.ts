export const multiversxConfig = {
  apiUrl: process.env.NEXT_PUBLIC_MULTIVERSX_API || 'https://devnet-api.multiversx.com',
  gatewayUrl: process.env.NEXT_PUBLIC_MULTIVERSX_GATEWAY || 'https://devnet-gateway.multiversx.com',
  explorerUrl: process.env.NEXT_PUBLIC_MULTIVERSX_EXPLORER || 'https://devnet-explorer.multiversx.com',
  chainId: 'D',
  egldLabel: 'xEGLD',
  decimals: 18,
  gasPrice: 1000000000,
  gasLimit: 50000,
  gasPerDataByte: 1500,
  contracts: {
    tokenSwap: process.env.NEXT_PUBLIC_TOKEN_SWAP_CONTRACT || '',
    liquidityPool: process.env.NEXT_PUBLIC_LIQUIDITY_POOL_CONTRACT || '',
  },
  dApp: {
    name: process.env.NEXT_PUBLIC_DAPP_NAME || 'MultiversX DeFi',
    description: process.env.NEXT_PUBLIC_DAPP_DESCRIPTION || 'A comprehensive DeFi platform on MultiversX',
    url: process.env.NEXT_PUBLIC_DAPP_URL || 'http://localhost:3000',
  },
}; 