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
      <div className="flex flex-col space-y-2">
        <ExtensionLoginButton
          {...commonProps}
          loginButtonText="Extension"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
        <WebWalletLoginButton
          {...commonProps}
          loginButtonText="Web Wallet"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        />
        <LedgerLoginButton
          {...commonProps}
          loginButtonText="Ledger"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        />
      </div>
    );
  };

  const renderAccountInfo = () => {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-sm font-medium text-gray-500">Connected Address</div>
        <div className="text-sm font-mono bg-gray-100 p-2 rounded">
          {address.slice(0, 6)}...{address.slice(-6)}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Disconnect
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
      {isLoggedIn ? renderAccountInfo() : renderLoginButtons()}
    </div>
  );
}; 