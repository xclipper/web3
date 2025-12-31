const knownNetworks = {
  1: 'Ethereum Mainnet',
  56: 'Binance Smart Chain (BSC)',
  137: 'Polygon Mainnet',
  43114: 'Avalanche C-Chain',
  10: 'Optimism',
  42161: 'Arbitrum One',
  250: 'Fantom Opera',
  100: 'Gnosis Chain',
  11155111: 'Sepolia Testnet',
  59141: 'Linea Sepolia',
  59144: 'Linea Network',
};

export function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  });
}

export function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

export function getNetworkName(chainId) {
  return knownNetworks[chainId] || `Unknow Network -> (Chain ID: ${chainId})`;
}
