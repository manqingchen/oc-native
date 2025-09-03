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

// 推送通知配置
export const PUSH_NOTIFICATION_CONFIG = {
  // 推送消息类型
  MESSAGE_TYPES: {
    TRANSACTION_COMPLETE: 'transaction_complete',
    IDENTITY_VERIFICATION: 'identity_verification',
    STATEMENT_INFO: 'statement_info',
  },

  // 推送跳转页面
  SCREENS: {
    TRANSACTION: 'transaction',
    SYSTEM_MESSAGE: 'system-message',
    IDENTITY: 'identity',
  },

  // 推送消息模板
  MESSAGES: {
    SUBSCRIPTION_COMPLETE: {
      zh: {
        title: '交易提醒',
        body: '申购完成，点击查看详情'
      },
      en: {
        title: 'Transaction message',
        body: 'Subscription successful, see more'
      }
    },
    REDEMPTION_COMPLETE: {
      zh: {
        title: '交易提醒',
        body: '赎回完成，点击查看详情'
      },
      en: {
        title: 'Transaction message',
        body: 'Redemption successful, see more'
      }
    },
    IDENTITY_SUCCESS: {
      zh: {
        title: '身份认证成功',
        body: '恭喜您，您的身份认证成功'
      },
      en: {
        title: 'Identity verification successful',
        body: 'Congratulations, your identity verification has been successful'
      }
    },
    IDENTITY_FAILED: {
      zh: {
        title: '身份认证失败',
        body: '抱歉，您的身份认证失败'
      },
      en: {
        title: 'Identity verification failed',
        body: 'Sorry, your identity verification has been failed'
      }
    },
    STATEMENT_GENERATED: {
      zh: {
        title: '结单信息',
        body: '9月结单已经生成，点击查看'
      },
      en: {
        title: 'Statement Information',
        body: 'The September statement has been generated. Click to view.'
      }
    }
  }
}

