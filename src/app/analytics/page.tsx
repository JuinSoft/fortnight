'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

// Mock data for charts
const mockPriceData = [
  { date: 'Jan', price: 42.5 },
  { date: 'Feb', price: 45.2 },
  { date: 'Mar', price: 40.8 },
  { date: 'Apr', price: 43.1 },
  { date: 'May', price: 47.6 },
  { date: 'Jun', price: 45.9 },
  { date: 'Jul', price: 48.2 },
];

const mockVolumeData = [
  { date: 'Jan', volume: 12500000 },
  { date: 'Feb', volume: 15700000 },
  { date: 'Mar', volume: 14200000 },
  { date: 'Apr', volume: 18900000 },
  { date: 'May', volume: 21500000 },
  { date: 'Jun', volume: 19800000 },
  { date: 'Jul', volume: 23400000 },
];

const mockTokens = [
  { name: 'WEGLD', price: 42.15, change: 2.5, volume: 8750000, marketCap: 845000000 },
  { name: 'MEX', price: 0.00015, change: -1.2, volume: 3250000, marketCap: 15000000 },
  { name: 'USDC', price: 1.00, change: 0.01, volume: 12500000, marketCap: 1000000000 },
  { name: 'RIDE', price: 0.0235, change: 5.8, volume: 950000, marketCap: 23500000 },
  { name: 'UTK', price: 0.12, change: -0.8, volume: 1850000, marketCap: 60000000 },
];

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency
  const formatCurrency = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Analytics</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Real-time market data and analytics
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

        {/* Market Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Total Volume (24h)</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                +12.5%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$48.2M</p>
            <div className="mt-4 h-10 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Active Users</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                +8.3%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">12,845</p>
            <div className="mt-4 h-10 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg"
                style={{ width: '78%' }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Total Value Locked</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                +5.2%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$124.5M</p>
            <div className="mt-4 h-10 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Price Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
          variants={itemVariants}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">EGLD Price</h2>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d', '1y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedTimeframe === timeframe
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <div className="h-64 relative">
                {/* Simple chart visualization */}
                <div className="absolute inset-0 flex items-end">
                  {mockPriceData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full max-w-[30px] bg-primary-500 dark:bg-primary-600 rounded-t"
                        style={{ 
                          height: `${(data.price / 50) * 100}%`,
                          opacity: 0.7 + (index / mockPriceData.length) * 0.3
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.date}</div>
                    </div>
                  ))}
                </div>
                
                {/* Price labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-2">
                  <div>$50</div>
                  <div>$45</div>
                  <div>$40</div>
                  <div>$35</div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$48.20</div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  <span>+2.5%</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: Jul 15, 2024
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Tokens Table */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          variants={itemVariants}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Top Tokens</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Token</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">24h Change</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Volume</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Market Cap</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {mockTokens.map((token, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-300 font-medium">{token.name.substring(0, 2)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">${token.price.toFixed(token.price < 0.01 ? 6 : 2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${token.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {token.change >= 0 ? '+' : ''}{token.change}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(token.volume)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(token.marketCap)}</div>
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