import { getEnvParams, Environment } from '../fof_fund_sdk/src';
import phantomIcon from '@/assets/images/phantom.png'
// 当前使用的环境，可以根据需要修改
export const CURRENT_ENV: Environment = 'matrix_test1';
export const baseURL = `https://test1.onchain.channel/api`

// 获取当前环境的参数
export const getCurrentEnvParams = () => {
  return getEnvParams(CURRENT_ENV);
};

// 导出常用的配置
export const { RPC_URL, RPC_WS_URL, cashMint, assetMint, supplyProgramId, managementProgramId, lookupTableAddress } = getCurrentEnvParams();

// 连接配置
export const CONNECTION_CONFIG = {
  wsEndpoint: RPC_WS_URL,
  commitment: 'confirmed' as const,
};

// 切换环境的函数（开发时使用）
export const switchEnvironment = (env: Environment) => {
  console.warn(`Environment switching is only for development. Current: ${CURRENT_ENV}, Requested: ${env}`);
  console.warn('To change environment, modify CURRENT_ENV in lib/config.ts');
};

// 环境验证
export const validateEnvironment = () => {
  try {
    const params = getCurrentEnvParams();
    console.log(`✅ Environment: ${CURRENT_ENV}`);
    console.log(`✅ RPC URL: ${params.RPC_URL}`);
    console.log(`✅ WS URL: ${params.RPC_WS_URL}`);
    return true;
  } catch (error) {
    console.error(`❌ Invalid environment: ${CURRENT_ENV}`, error);
    return false;
  }
};

export const supportWallets = {
    name: 'Phantom',
    installUrl: 'https://phantom.com',
    icon: phantomIcon,
    mobileSupported: true,
    deepLink: 'phantom://',
    appStoreUrl: 'https://apps.apple.com/us/app/phantom-solana-wallet/id1598432977',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=app.phantom'
  }

