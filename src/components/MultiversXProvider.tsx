'use client';

import React from 'react';
import {
  DappProvider,
  AxiosInterceptorContextProvider
} from '@multiversx/sdk-dapp/wrappers';
import { NotificationModal } from '@multiversx/sdk-dapp/UI/NotificationModal';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals';
import { TransactionsToastList } from '@multiversx/sdk-dapp/UI/TransactionsToastList';
import { multiversxConfig } from '@/config/multiversx';

interface MultiversXProviderProps {
  children: React.ReactNode;
}

export const MultiversXProvider: React.FC<MultiversXProviderProps> = ({ children }) => {
  return (
    <AxiosInterceptorContextProvider>
      <DappProvider
        environment={multiversxConfig.chainId === 'D' ? 'devnet' : 'mainnet'}
        customNetworkConfig={{
          name: 'customConfig',
          apiTimeout: 10000,
          walletConnectV2ProjectId: 'your-project-id',
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
          logoutRoute: '/',
        }}
      >
        {/* Modern styled toast notifications */}
        <div className="z-50">
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals />
        </div>
        {children}
      </DappProvider>
    </AxiosInterceptorContextProvider>
  );
}; 