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
export const storage = typeof window !== 'undefined' 
  ? window.localStorage 
  : createNoopStorage();

// Patch localStorage for redux-persist
if (typeof window !== 'undefined') {
  // Override localStorage.getItem to handle errors
  const originalGetItem = window.localStorage.getItem;
  window.localStorage.getItem = function(key) {
    try {
      return originalGetItem.call(window.localStorage, key);
    } catch (e) {
      console.warn('localStorage.getItem error:', e);
      return null;
    }
  };

  // Override localStorage.setItem to handle errors
  const originalSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function(key, value) {
    try {
      return originalSetItem.call(window.localStorage, key, value);
    } catch (e) {
      console.warn('localStorage.setItem error:', e);
    }
  };

  // Override localStorage.removeItem to handle errors
  const originalRemoveItem = window.localStorage.removeItem;
  window.localStorage.removeItem = function(key) {
    try {
      return originalRemoveItem.call(window.localStorage, key);
    } catch (e) {
      console.warn('localStorage.removeItem error:', e);
    }
  };
} 