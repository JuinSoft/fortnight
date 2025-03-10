'use client';

import React, { useState, useEffect } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { Address, TokenPayment, ContractCallPayloadBuilder, StringValue } from '@multiversx/sdk-core/out';
import { multiversxConfig } from '@/config/multiversx';
import { MultiversXService } from '@/services/multiversx.service';
import { motion } from 'framer-motion';

interface Token {
  identifier: string;
  name: string;
  decimals: number;
  balance: string;
}

export const TokenSwap: React.FC = () => {
  const { address } = useGetAccountInfo();
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<string>('0');
  const [estimatedReturn, setEstimatedReturn] = useState<string>('0');

  const multiversxService = new MultiversXService();

  useEffect(() => {
    if (address) {
      fetchTokens();
    }
  }, [address]);

  useEffect(() => {
    if (fromToken && toToken) {
      fetchExchangeRate();
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    if (amount && exchangeRate) {
      calculateEstimatedReturn();
    }
  }, [amount, exchangeRate]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      // This is a simplified example - in a real app, you would fetch the user's tokens
      // from the MultiversX API or blockchain
      const mockTokens: Token[] = [
        {
          identifier: 'EGLD-123456',
          name: 'MultiversX',
          decimals: 18,
          balance: '1000000000000000000', // 1 EGLD
        },
        {
          identifier: 'USDC-123456',
          name: 'USD Coin',
          decimals: 6,
          balance: '1000000', // 1 USDC
        },
        {
          identifier: 'MEX-123456',
          name: 'MEX Token',
          decimals: 18,
          balance: '10000000000000000000', // 10 MEX
        },
      ];
      
      setTokens(mockTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      if (!fromToken || !toToken) return;
      
      // In a real app, you would fetch the exchange rate from your smart contract
      // This is a mock implementation
      setExchangeRate('1.5');
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const calculateEstimatedReturn = () => {
    if (!amount || !exchangeRate) return;
    
    const estimated = parseFloat(amount) * parseFloat(exchangeRate);
    setEstimatedReturn(estimated.toString());
  };

  const handleSwap = async () => {
    try {
      if (!address || !fromToken || !toToken || !amount) return;
      
      setLoading(true);
      
      const data = new ContractCallPayloadBuilder()
        .setFunction('ESDTTransfer')
        .addArg(new StringValue(fromToken))
        .addArg(new StringValue(amount))
        .addArg(new StringValue('swap'))
        .addArg(new StringValue(toToken))
        .build();
      
      const tx = {
        value: '0',
        data: data,
        receiver: multiversxConfig.contracts.tokenSwap,
        gasLimit: 60000000,
      };
      
      await refreshAccount();
      
      const { sessionId, error } = await sendTransactions({
        transactions: tx,
        transactionsDisplayInfo: {
          processingMessage: 'Processing swap transaction',
          errorMessage: 'An error has occurred during swap',
          successMessage: 'Swap successful',
        },
      });
      
      if (error) {
        throw error;
      }
      
    } catch (error: any) {
      console.error('Error during swap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Fortnight Token Swap</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
        <select
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={loading}
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.identifier} value={token.identifier}>
              {token.name} ({token.identifier})
            </option>
          ))}
        </select>
      </div>
      
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          placeholder="0.0"
          disabled={loading}
        />
      </motion.div>
      
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
        <select
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={loading}
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.identifier} value={token.identifier}>
              {token.name} ({token.identifier})
            </option>
          ))}
        </select>
      </motion.div>
      
      {fromToken && toToken && (
        <motion.div 
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              1 {tokens.find(t => t.identifier === fromToken)?.name} = {exchangeRate} {tokens.find(t => t.identifier === toToken)?.name}
            </span>
          </div>
          {amount && (
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Return:</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{estimatedReturn} {tokens.find(t => t.identifier === toToken)?.name}</span>
            </div>
          )}
        </motion.div>
      )}
      
      <motion.button
        onClick={handleSwap}
        disabled={!address || !fromToken || !toToken || !amount || loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : 'Swap Tokens'}
      </motion.button>
    </motion.div>
  );
}; 