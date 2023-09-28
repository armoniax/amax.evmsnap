# Amax MetaMask Snap
Manage your account, tokens and NFTs and access DAPPs (xChain, Swap, TrueDEX etc.) of Armonia Meta Chain from your MetaMask EVM wallet.

## Install & Initialize
```javascript
// Check if the Snap is installed
let result = await window.ethereum.request({ method: 'wallet_getSnaps' });
const installed = Object.keys(result).includes("npm:@amax/amaxsnap");

// Install Snap
if (!installed) {
    const result = await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
            'npm:@amax/amaxsnap': {
            version: '^0.1.0',
            },
        },
    });
}

// Initialize the Snap with default chains
await ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
        snapId: 'npm:@amax/amaxsnap',
        request: {
            method: 'initialize',
        },
    },
});
```

## Check If Initialized
```javascript
// Boolean is returned
const initialized = await ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
        snapId: 'npm:@amax/amaxsnap',
        request: {
            method: 'initialized',
        },
    },
});
```

## Get Accounts 
```javascript
await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
        snapId: 'npm:@amax/amaxsnap',
        request: {
            method: 'signTransaction',
            params: {
                paths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100] // get accounts by derive path 
            }
        },
    },
});
```

## Sign or Push Transaction
```javascript
await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
        snapId: 'npm:@amax/amaxsnap',
        request: {
            method: 'getAccounts',
            params: {
              actions: [], // action array
              network: '', // network
              path: 0, // signer derive path 
              transactConfig: { // config: @amax/amaxjs-v2/dist/eosjs-api-interfaces
                 broadcast: false,
                 ...
              } 
            },
        },
    },
});
```

## Sign Message
```javascript
await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
        snapId: 'npm:@amax/amaxsnap',
        request: {
            method: 'signMessage',
            params: {
              message: '', // sign string
              path: 0, // signer derive path 
            },
        },
    },
});
```