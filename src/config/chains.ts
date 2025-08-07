/**
 * 区块链网络配置
 * 支持多链的统一配置管理
 */

// 链类型定义
export interface ChainConfig {
  id: string;
  name: string;
  displayName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrl?: string;
  testnet?: boolean;
}

// Solana 链配置
export const SOLANA_CHAINS: Record<string, ChainConfig> = {
  'solana:mainnet': {
    id: 'solana:mainnet',
    name: 'solana',
    displayName: 'Solana Mainnet',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
    },
    rpcUrls: ['https://api.mainnet-beta.solana.com'],
    blockExplorerUrls: ['https://explorer.solana.com'],
    iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  },
  'solana:devnet': {
    id: 'solana:devnet',
    name: 'solana',
    displayName: 'Solana Devnet',
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
    },
    rpcUrls: ['https://api.devnet.solana.com'],
    blockExplorerUrls: ['https://explorer.solana.com/?cluster=devnet'],
    iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    testnet: true,
  },
};

// Ethereum 链配置
export const ETHEREUM_CHAINS: Record<string, ChainConfig> = {
  'eip155:1': {
    id: 'eip155:1',
    name: 'ethereum',
    displayName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://ethereum.publicnode.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  'eip155:11155111': {
    id: 'eip155:11155111',
    name: 'ethereum',
    displayName: 'Ethereum Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    testnet: true,
  },
};

// BSC 链配置
export const BSC_CHAINS: Record<string, ChainConfig> = {
  'eip155:56': {
    id: 'eip155:56',
    name: 'bsc',
    displayName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    iconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
  },
  'eip155:97': {
    id: 'eip155:97',
    name: 'bsc',
    displayName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    iconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    testnet: true,
  },
};

// 所有支持的链
export const ALL_CHAINS: Record<string, ChainConfig> = {
  ...SOLANA_CHAINS,
  ...ETHEREUM_CHAINS,
  ...BSC_CHAINS,
};

// 默认链配置
export const DEFAULT_CHAINS = {
  SOLANA: 'solana:devnet',
  ETHEREUM: 'eip155:11155111',
  BSC: 'eip155:97',
} as const;

// 链类型枚举
export enum ChainType {
  SOLANA = 'solana',
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
}

// 获取链配置的工具函数
export const getChainConfig = (chainId: string): ChainConfig | undefined => {
  return ALL_CHAINS[chainId];
};

// 获取链类型
export const getChainType = (chainId: string): ChainType | undefined => {
  if (chainId.startsWith('solana:')) return ChainType.SOLANA;
  if (chainId.startsWith('eip155:')) {
    const config = getChainConfig(chainId);
    if (config?.name === 'ethereum') return ChainType.ETHEREUM;
    if (config?.name === 'bsc') return ChainType.BSC;
  }
  return undefined;
};

// 获取链的显示名称
export const getChainDisplayName = (chainId: string): string => {
  const config = getChainConfig(chainId);
  return config?.displayName || chainId;
};

// 检查是否为测试网
export const isTestnet = (chainId: string): boolean => {
  const config = getChainConfig(chainId);
  return config?.testnet || false;
};

// 获取支持的链列表
export const getSupportedChains = (includeTestnets: boolean = true): ChainConfig[] => {
  return Object.values(ALL_CHAINS).filter(chain => 
    includeTestnets || !chain.testnet
  );
};

// 按链类型分组
export const getChainsByType = (): Record<ChainType, ChainConfig[]> => {
  const result: Record<ChainType, ChainConfig[]> = {
    [ChainType.SOLANA]: [],
    [ChainType.ETHEREUM]: [],
    [ChainType.BSC]: [],
  };

  Object.values(ALL_CHAINS).forEach(chain => {
    const type = getChainType(chain.id);
    if (type) {
      result[type].push(chain);
    }
  });

  return result;
};
