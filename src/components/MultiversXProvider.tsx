import React from 'react';
import {
  DappProvider,
  AxiosInterceptorContext,
  NotificationModal,
  SignTransactionsModals,
  TransactionsToastList,
} from '@multiversx/sdk-dapp/wrappers';
import { multiversxConfig } from '@/config/multiversx';

interface MultiversXProviderProps {
  children: React.ReactNode;
}

export const MultiversXProvider: React.FC<MultiversXProviderProps> = ({ children }) => {
  return (
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
      <AxiosInterceptorContext.Listener />
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals />
      {children}
    </DappProvider>
  );
}; 