// Custom redux store configuration
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

// Custom storage for redux-persist to handle SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    }
  };
};

// Use localStorage in browser, otherwise use noop storage
const storage = typeof window !== 'undefined' 
  ? window.localStorage 
  : createNoopStorage();

// Create a custom persist config
export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['dapp']
};

// This function will be used by the MultiversX SDK
export const createCustomStore = (rootReducer: any) => {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  const store = createStore(
    persistedReducer,
    compose(applyMiddleware(thunk))
  );
  
  const persistor = persistStore(store);
  
  return { store, persistor };
}; 