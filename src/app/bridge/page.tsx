'use client';

import React, { useState } from 'react';
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

const networks = [
  { id: 'multiversx', name: 'MultiversX', icon: '🔷' },
  { id: 'ethereum', name: 'Ethereum', icon: '🔹' },
  { id: 'binance', name: 'Binance Smart Chain', icon: '🟡' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
];

const tokens = [
  { id: 'egld', name: 'EGLD', decimals: 18 },
  { id: 'usdc', name: 'USDC', decimals: 6 },
  { id: 'usdt', name: 'USDT', decimals: 6 },
  { id: 'busd', name: 'BUSD', decimals: 18 },
];

export default function BridgePage() {
  const { address } = useGetAccountInfo();
  const [sourceNetwork, setSourceNetwork] = useState('multiversx');
  const [targetNetwork, setTargetNetwork] = useState('ethereum');
  const [selectedToken, setSelectedToken] = useState('egld');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNetworkSwap = () => {
    const temp = sourceNetwork;
    setSourceNetwork(targetNetwork);
    setTargetNetwork(temp);
  };

  const handleBridge = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Reset form or show success
      setAmount('');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="mb-8 flex items-center justify-between" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cross-Chain Bridge</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Transfer assets between MultiversX and other blockchains
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

        {/* Bridge Form */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          variants={itemVariants}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Bridge Assets</h2>
          </div>
          
          <form onSubmit={handleBridge} className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Networks Selection */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label htmlFor="sourceNetwork" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <select
                    id="sourceNetwork"
                    value={sourceNetwork}
                    onChange={(e) => setSourceNetwork(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {networks.map((network) => (
                      <option key={network.id} value={network.id}>
                        {network.icon} {network.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleNetworkSwap}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1">
                  <label htmlFor="targetNetwork" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <select
                    id="targetNetwork"
                    value={targetNetwork}
                    onChange={(e) => setTargetNetwork(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {networks.map((network) => (
                      <option key={network.id} value={network.id}>
                        {network.icon} {network.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Token Selection */}
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Token
                </label>
                <select
                  id="token"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {tokens.map((token) => (
                    <option key={token.id} value={token.id}>
                      {token.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                      {tokens.find(t => t.id === selectedToken)?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Fee Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Bridge Fee</span>
                  <span className="text-gray-900 dark:text-white font-medium">0.1%</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Estimated Time</span>
                  <span className="text-gray-900 dark:text-white font-medium">~15 minutes</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!amount || isProcessing || !address}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    (!amount || isProcessing || !address) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Bridge Assets'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
        
        {/* Information Card */}
        <motion.div 
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          variants={itemVariants}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About Cross-Chain Bridge</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            The MultiversX Bridge allows you to transfer assets between MultiversX and other blockchains securely. 
            Bridging typically takes 10-15 minutes to complete. Make sure you have enough funds to cover the gas fees on both networks.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
} 