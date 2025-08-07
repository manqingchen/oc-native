/**
 * WalletConnect 配置
 * 跨链钱包连接的核心配置
 */

import { env } from './env';

// WalletConnect 项目配置
export const WALLETCONNECT_CONFIG = {
  projectId: env.WALLET_CONNECT_PROJECT_ID || 'your_project_id_here',
  relayUrl: 'wss://relay.walletconnect.com',
  metadata: {
    name: env.APP_NAME,
    description: 'OC-Native - Cross-chain Solana dApp',
    url: 'https://oc-native.app',
    icons: ['https://oc-native.app/icon.png'],
  },
};

// 支持的钱包配置
export const SUPPORTED_WALLETS = {
  phantom: {
    id: 'phantom',
    name: 'Phantom',
    homepage: 'https://phantom.app',
    chains: ['solana:mainnet', 'solana:devnet'],
    app: {
      browser: 'https://phantom.app',
      ios: 'https://apps.apple.com/app/phantom-solana-wallet/id1598432977',
      android: 'https://play.google.com/store/apps/details?id=app.phantom',
      mac: '',
      windows: '',
      linux: '',
    },
    mobile: {
      native: 'phantom://',
      universal: 'https://phantom.app/ul/',
    },
    desktop: {
      native: '',
      universal: '',
    },
    metadata: {
      shortName: 'Phantom',
      colors: {
        primary: '#AB9FF2',
        secondary: '#9945FF',
      },
    },
  },
  okx: {
    id: 'okx',
    name: 'OKX Wallet',
    homepage: 'https://www.okx.com/web3',
    chains: ['solana:mainnet', 'solana:devnet', 'eip155:1', 'eip155:56'],
    app: {
      browser: 'https://www.okx.com/web3',
      ios: 'https://apps.apple.com/app/okx-buy-bitcoin-eth-crypto/id1327268470',
      android: 'https://play.google.com/store/apps/details?id=com.okinc.okex.gp',
      mac: '',
      windows: '',
      linux: '',
    },
    mobile: {
      native: 'okx://',
      universal: 'https://www.okx.com/download',
    },
    desktop: {
      native: '',
      universal: '',
    },
    metadata: {
      shortName: 'OKX',
      colors: {
        primary: '#000000',
        secondary: '#1E1E1E',
      },
    },
  },
  metamask: {
    id: 'metamask',
    name: 'MetaMask',
    homepage: 'https://metamask.io',
    chains: ['eip155:1', 'eip155:56', 'eip155:137'],
    app: {
      browser: 'https://metamask.io',
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      mac: '',
      windows: '',
      linux: '',
    },
    mobile: {
      native: 'metamask://',
      universal: 'https://metamask.app.link',
    },
    desktop: {
      native: '',
      universal: '',
    },
    metadata: {
      shortName: 'MetaMask',
      colors: {
        primary: '#F6851B',
        secondary: '#E2761B',
      },
    },
  },
  trustwallet: {
    id: 'trustwallet',
    name: 'Trust Wallet',
    homepage: 'https://trustwallet.com',
    chains: ['solana:mainnet', 'eip155:1', 'eip155:56'],
    app: {
      browser: 'https://trustwallet.com',
      ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
      android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
      mac: '',
      windows: '',
      linux: '',
    },
    mobile: {
      native: 'trust://',
      universal: 'https://link.trustwallet.com',
    },
    desktop: {
      native: '',
      universal: '',
    },
    metadata: {
      shortName: 'Trust',
      colors: {
        primary: '#3375BB',
        secondary: '#2E5A87',
      },
    },
  },
} as const;

// WalletConnect 会话配置
export const SESSION_CONFIG = {
  requiredNamespaces: {
    solana: {
      methods: [
        'solana_signTransaction',
        'solana_signMessage',
        'solana_signAndSendTransaction',
      ],
      chains: ['solana:mainnet', 'solana:devnet'],
      events: ['accountsChanged', 'chainChanged'],
    },
    eip155: {
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      chains: ['eip155:1', 'eip155:56'],
      events: ['accountsChanged', 'chainChanged'],
    },
  },
  optionalNamespaces: {
    solana: {
      methods: [
        'solana_requestAirdrop',
        'solana_getBalance',
      ],
      chains: ['solana:testnet'],
      events: [],
    },
    eip155: {
      methods: [
        'wallet_switchEthereumChain',
        'wallet_addEthereumChain',
      ],
      chains: ['eip155:137', 'eip155:97'],
      events: [],
    },
  },
};

// 钱包连接选项
export const WALLET_CONNECT_OPTIONS = {
  projectId: WALLETCONNECT_CONFIG.projectId,
  metadata: WALLETCONNECT_CONFIG.metadata,
  sessionConfig: SESSION_CONFIG,
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', // Phantom
  ],
  excludeWalletIds: [],
  enableAnalytics: true,
  enableExplorer: true,
  explorerRecommendedWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
  ],
  explorerExcludedWalletIds: [],
};

// 获取钱包配置
export const getWalletConfig = (walletId: keyof typeof SUPPORTED_WALLETS) => {
  return SUPPORTED_WALLETS[walletId];
};

// 获取支持指定链的钱包
export const getWalletsForChain = (chainId: string) => {
  return Object.values(SUPPORTED_WALLETS).filter(wallet =>
    wallet.chains.includes(chainId)
  );
};

// 检查钱包是否支持指定链
export const isWalletSupportedForChain = (
  walletId: keyof typeof SUPPORTED_WALLETS,
  chainId: string
): boolean => {
  const wallet = SUPPORTED_WALLETS[walletId];
  return wallet.chains.includes(chainId);
};
