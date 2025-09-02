// 主要的深度链接处理器 - 统一入口点

import type { DappKeyPair } from './deepLinkHandlers/types';
import { useWalletStore } from './store';
import { logUtils } from './utils';

// 导入各个处理器
import {
  handleConnect,
  handleDisconnect,
  handleError
} from './deepLinkHandlers/connectionHandlers';

import {
  handleSignAllTransactions,
  handleSignAndSendTransaction,
  handleSignMessage,
  handleSignTransaction
} from './deepLinkHandlers/transactionHandlers';

// 主要的深度链接处理函数
export const handleDeepLinkResponse = async (url: string, dappKeyPair: DappKeyPair, currentPathname?: string) => {
  const { addLog, setConnecting } = useWalletStore.getState();

  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // 处理错误
    if (params.get('errorCode')) {
      handleError(params);
      return;
    }

    // 根据 next 参数分发到对应的处理器
    const nextAction = params.get('next');

    switch (nextAction) {
      case 'connect':
      case 'login':
        await handleConnect(params, dappKeyPair, currentPathname);
        break;

      case 'disconnect':
        await handleDisconnect();
        break;

      case 'signAndSendTransaction':
        await handleSignAndSendTransaction(params);
        break;

      case 'signAllTransactions':
        await handleSignAllTransactions(params);
        break;

      case 'signTransaction':
        await handleSignTransaction(params);
        break;

      case 'signMessage':
        await handleSignMessage(params);
        break;

      default:
        // 如果没有 next 参数，尝试从 pathname 判断（兼容旧的方式）
        const pathname = urlObj.pathname || urlObj.host;

        if (/onConnect/.test(pathname)) {
          await handleConnect(params, dappKeyPair, currentPathname);
        } else if (/onDisconnect/.test(pathname)) {
          await handleDisconnect();
        } else if (/onSignAndSendTransaction/.test(pathname)) {
          await handleSignAndSendTransaction(params);
        } else if (/onSignAllTransactions/.test(pathname)) {
          await handleSignAllTransactions(params);
        } else if (/onSignTransaction/.test(pathname)) {
          await handleSignTransaction(params);
        } else if (/onSignMessage/.test(pathname)) {
          await handleSignMessage(params);
        } else {
          addLog(logUtils.formatLog(`Unknown deep link action: next=${nextAction}, pathname=${pathname}`, 'warn'));
        }
        break;
    }

  } catch (error) {
    console.error('Error handling deep link:', error);
    addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    setConnecting(false);
  }
};
