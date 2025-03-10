import React, { useState, useEffect } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { Address, TokenPayment, ContractCallPayloadBuilder, TransactionPayload } from '@multiversx/sdk-core/out';
import { multiversxConfig } from '@/config/multiversx';
import { MultiversXService } from '@/services/multiversx.service';

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
        .addArg(fromToken)
        .addArg(amount)
        .addArg('swap')
        .addArg(toToken)
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
      
    } catch (error) {
      console.error('Error during swap:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
        <select
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          className="w-full p-2 border rounded"
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
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="0.0"
          disabled={loading}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
        <select
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          className="w-full p-2 border rounded"
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
      
      {fromToken && toToken && (
        <div className="mb-6 p-3 bg-gray-50 rounded">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Exchange Rate:</span>
            <span className="text-sm font-medium">
              1 {tokens.find(t => t.identifier === fromToken)?.name} = {exchangeRate} {tokens.find(t => t.identifier === toToken)?.name}
            </span>
          </div>
          {amount && (
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Estimated Return:</span>
              <span className="text-sm font-medium">{estimatedReturn} {tokens.find(t => t.identifier === toToken)?.name}</span>
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={handleSwap}
        disabled={!address || !fromToken || !toToken || !amount || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Swap'}
      </button>
    </div>
  );
}; 