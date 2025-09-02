import { WalletInfo } from "@/fof_fund_sdk/src";
import { useCallback, useRef, useMemo } from "react";
import { useFofStore } from "@/stores/fof.store";
import { errorUtils, logUtils } from "@/lib/utils";
import { Connection, PublicKey } from "@solana/web3.js";
import { usePhantomWallet } from '@/stores/phantomWalletStore'
import bs58 from 'bs58';
/**
 * Solana 钱包 Hook
 *
 * 提供符合 WalletInfo 接口的钱包功能，用于与 FOF SDK 集成
 * 使用项目统一的钱包状态管理和错误处理模式
 */
export const useSolanaWallet = (): WalletInfo => {
  const { wallet } = usePhantomWallet()
  // const { publicKey, signTransaction, signMessage } = useWallet();
  const { address, signTransaction, signMessage } = wallet || {}
  const publicKey = address ? new PublicKey(address || '') : null
  const { fof } = useFofStore();

  // 获取连接实例，优先使用 fof 的连接
  const connection = useMemo(() => {
    return fof?.getConnection();
  }, [fof]);

  const connectionRef = useRef<any>(connection);

  // 更新连接引用
  const setConnection = useCallback((newConnection: Connection) => {
    connectionRef.current = newConnection;
    console.log(logUtils.formatLog('连接已更新', 'info'));
  }, []);

  /**
   * 签名消息
   */
  const handleSignMessage = useCallback(async (message: string): Promise<string> => {
    try {
      if (!signMessage) {
        throw new Error("钱包不支持消息签名");
      }

      console.log(logUtils.formatLog(`开始签名消息: ${logUtils.truncateText(message, 50)}`, 'info'));

      // 直接传递字符串消息，让底层钱包处理编码
      const signedMessage = await signMessage(message);

      // 处理不同类型的签名响应
      let result: string;
      if (typeof signedMessage === 'string') {
        result = signedMessage;
      } else if (signedMessage && typeof signedMessage === 'object' && 'signature' in signedMessage) {
        result = Buffer.from((signedMessage as any).signature).toString('base64');
      } else {
        result = Buffer.from(signedMessage as any).toString('base64');
      }

      console.log(logUtils.formatLog('消息签名成功', 'info'));
      return result;
    } catch (error: any) {
      const errorMsg = '消息签名失败';
      console.error(logUtils.formatLog(errorMsg, 'error'), error);
      errorUtils.logError(error, 'handleSignMessage');

      // 检查是否是用户拒绝
      if (error?.message?.includes('User rejected') || error?.code === 4001) {
        throw new Error('用户拒绝了签名请求');
      }

      throw new Error(error?.message || errorMsg);
    }
  }, [signMessage]);

  /**
   * 部分签名交易（Legacy Transaction）
   */
  const partialSign = useCallback(async (transaction: any): Promise<any> => {
    try {
      if (!signTransaction) {
        throw new Error("钱包不支持交易签名");
      }
      console.log('transaction', transaction)
      console.log(logUtils.formatLog('开始签名 Legacy 交易', 'info',));
      const signedTransaction = await signTransaction(transaction as any);
      console.log(logUtils.formatLog('Legacy 交易签名成功', 'info'));

      return signedTransaction;
    } catch (error: any) {
      const errorMsg = 'Legacy 交易签名失败';
      console.error(logUtils.formatLog(errorMsg, 'error'), error);
      errorUtils.logError(error, 'partialSign');

      // 检查是否是用户拒绝签名
      if (error?.message?.includes('User rejected') || error?.code === 4001) {
        throw new Error('用户拒绝了交易签名');
      }

      throw new Error(error?.message || errorMsg);
    }
  }, [signTransaction]);

  /**
   * 签名并发送交易（Legacy Transaction）
   */

const signAndSendTransaction = useCallback(async (transaction: any): Promise<string> => {
  const signedTx = await partialSign(transaction);

  let serializedTx: Uint8Array;

  if (signedTx && typeof signedTx === 'object' && signedTx.transaction) {
    const txStr: string = signedTx.transaction;

    // 简单判断是 base58 还是 base64
    const isBase58 = /^[1-9A-HJ-NP-Za-km-z]+$/.test(txStr);
    const bytes = isBase58 ? bs58.decode(txStr) : Buffer.from(txStr, 'base64');

    serializedTx = Uint8Array.from(bytes);
    console.log('✅ Using Privy deeplink transaction data');
    console.log('📦 Encoded string length:', txStr.length);
    console.log('📦 Decoded transaction length:', serializedTx.length);
    console.log('📦 First 10 bytes:', Array.from(serializedTx.slice(0, 10)));
  } else if (signedTx && typeof signedTx.serialize === 'function') {
    serializedTx = signedTx.serialize();
    console.log('✅ Using normal transaction object');
  } else {
    throw new Error('Invalid signed transaction format from Privy');
  }

  console.log('🚀 Final serialized transaction length:', serializedTx.length);

  try {
    const txSignature = await connectionRef.current.sendRawTransaction(serializedTx);
    console.log('✅ Transaction sent successfully:', txSignature);
    return txSignature;
  } catch (e: any) {
    console.error('❌ Failed to send transaction:', e);
    if (e && typeof e === 'object' && 'getLogs' in e) {
      try {
        const logs = await e.getLogs();
        console.error('📋 Transaction logs:', logs);
      } catch (logErr) {
        console.error('Failed to get transaction logs:', logErr);
      }
    }
    throw e;
  }
}, [partialSign]);
  /**
   * 部分签名交易（Versioned Transaction V0）
   */
  const partialSignV0 = useCallback(async (transaction: any): Promise<any> => {
    try {
      if (!signTransaction) {
        throw new Error("钱包不支持交易签名");
      }

      console.log(logUtils.formatLog('开始签名 V0 交易', 'info'));
      const signedTransaction = await signTransaction(transaction as any);
      console.log(logUtils.formatLog('V0 交易签名成功', 'info'));

      return signedTransaction;
    } catch (error: any) {
      const errorMsg = 'V0 交易签名失败';
      console.error(logUtils.formatLog(errorMsg, 'error'), error);
      errorUtils.logError(error, 'partialSignV0');

      // 检查是否是用户拒绝签名
      if (error?.message?.includes('User rejected') || error?.code === 4001) {
        throw new Error('用户拒绝了交易签名');
      }

      throw new Error(error?.message || errorMsg);
    }
  }, [signTransaction]);


  const signAndSendTransactionV0 = useCallback(async (transaction: any): Promise<string> => {
    console.log('transction.message.recentBlockhash ===================>>>>>>>>>>> ', transaction.message.recentBlockhash);
    const signedTx = await partialSignV0(transaction);
    console.log('signedTx ===================>>>>>>>>>>> ', signedTx);

    let serializedTx: Uint8Array;

    // 检查是否是 deeplink 返回的格式
    if (signedTx && typeof signedTx === 'object' && signedTx.transaction) {
      const txBuffer = Buffer.from(signedTx.transaction, 'base64');
      serializedTx = txBuffer;
      console.log("tx1:size", serializedTx.length);
    } else {
      serializedTx = signedTx.serialize();
      console.log("tx1:size", serializedTx.length);
    }

    const txSignature = await connectionRef.current.sendRawTransaction(serializedTx);
    return txSignature;
  }, [partialSignV0]);

  // 返回符合 WalletInfo 接口的对象
  return {
    publicKey: publicKey as any,
    setConnection,
    signMessage: handleSignMessage,
    partialSign,
    signAndSendTransaction,
    partialSignV0,
    signAndSendTransactionV0,
  };
};

/**
 * 导出类型定义，用于其他组件使用
 */
export type UseWalletReturn = WalletInfo;
