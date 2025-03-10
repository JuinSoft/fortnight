'use client';

import React from 'react';
import { useGetAccountInfo, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { logout } from '@multiversx/sdk-dapp/utils';
import { ExtensionLoginButton, WebWalletLoginButton, LedgerLoginButton } from '@multiversx/sdk-dapp/UI';
import { multiversxConfig } from '@/config/multiversx';

export const ConnectWallet: React.FC = () => {
  const { address } = useGetAccountInfo();
  const { isLoggedIn } = useGetLoginInfo();

  const commonProps = {
    callbackRoute: '/',
    logoutRoute: '/',
  };

  const handleLogout = () => {
    logout(commonProps.logoutRoute);
  };

  const renderLoginButtons = () => {
    return (
      <div className="flex flex-col space-y-3">
        <ExtensionLoginButton
          {...commonProps}
          loginButtonText="Extension"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded transition-all duration-300 hover:shadow-lg"
        />
        <WebWalletLoginButton
          {...commonProps}
          loginButtonText="Web Wallet"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded transition-all duration-300 hover:shadow-lg"
        />
        <LedgerLoginButton
          {...commonProps}
          loginButtonText="Ledger"
          className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded transition-all duration-300 hover:shadow-lg"
        />
      </div>
    );
  };

  const renderAccountInfo = () => {
    return (
      <div className="flex flex-col items-center space-y-3">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Connected Address</div>
        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-inner w-full text-center overflow-hidden text-ellipsis">
          {address.slice(0, 10)}...{address.slice(-10)}
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          Disconnect
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Fortnight Wallet</h2>
      {isLoggedIn ? renderAccountInfo() : renderLoginButtons()}
    </div>
  );
}; 