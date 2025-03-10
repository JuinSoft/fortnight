'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

interface Token {
  identifier: string;
  name: string;
  ticker: string;
  balance: string;
  decimals: number;
  price?: number;
}

export default function TokensPage() {
  const { address } = useGetAccountInfo();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockTokens: Token[] = [
      {
        identifier: 'WEGLD-bd4d79',
        name: 'Wrapped EGLD',
        ticker: 'WEGLD',
        balance: '125000000000000000000',
        decimals: 18,
        price: 42.15
      },
      {
        identifier: 'MEX-455c57',
        name: 'MultiversX Exchange Token',
        ticker: 'MEX',
        balance: '9500000000000000000000',
        decimals: 18,
        price: 0.00015
      },
      {
        identifier: 'USDC-c76f1f',
        name: 'USD Coin',
        ticker: 'USDC',
        balance: '500000000',
        decimals: 6,
        price: 1.00
      },
      {
        identifier: 'RIDE-7d18e9',
        name: 'Holoride',
        ticker: 'RIDE',
        balance: '750000000000000000000',
        decimals: 18,
        price: 0.0235
      }
    ];

    setTimeout(() => {
      setTokens(mockTokens);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatBalance = (balance: string, decimals: number) => {
    return (parseFloat(balance) / Math.pow(10, decimals)).toFixed(decimals > 6 ? 4 : 2);
  };

  const formatDollarValue = (balance: string, decimals: number, price?: number) => {
    if (!price) return '-';
    return '$' + ((parseFloat(balance) / Math.pow(10, decimals)) * price).toFixed(2);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="mb-8 flex items-center justify-between" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tokens</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your ESDT tokens on MultiversX
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </motion.div>

        {/* Wallet Info */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Wallet Address</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 font-mono text-sm break-all">
            {address || 'Not connected'}
          </div>
        </motion.div>

        {/* Tokens List */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          variants={itemVariants}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">ESDT Tokens</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Token</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tokens.map((token) => (
                    <tr key={token.identifier} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-300 font-medium">{token.ticker.substring(0, 2)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{token.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{token.ticker}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatBalance(token.balance, token.decimals)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{token.ticker}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatDollarValue(token.balance, token.decimals, token.price)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">USD</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">Send</button>
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Swap</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
} 