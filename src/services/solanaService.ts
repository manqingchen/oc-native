/**
 * Solana 服务
 * 处理 Solana 区块链相关的操作
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { env } from '../config/env';
import { NETWORKS } from '../config/constants';
import type { NetworkType } from '../config/constants';

// Solana 连接管理器
export class SolanaConnectionManager {
  private connections: Map<NetworkType, Connection> = new Map();
  private currentNetwork: NetworkType = 'devnet';

  constructor() {
    this.initializeConnections();
  }

  // 初始化连接
  private initializeConnections(): void {
    // 开发网络
    this.connections.set(NETWORKS.DEVNET, new Connection('https://api.devnet.solana.com', 'confirmed'));
    
    // 测试网络
    this.connections.set(NETWORKS.TESTNET, new Connection('https://api.testnet.solana.com', 'confirmed'));
    
    // 主网络
    this.connections.set(NETWORKS.MAINNET, new Connection('https://api.mainnet-beta.solana.com', 'confirmed'));
    
    // 自定义 RPC
    if (env.SOLANA_RPC_URL) {
      this.connections.set(NETWORKS.DEVNET, new Connection(env.SOLANA_RPC_URL, 'confirmed'));
    }
  }

  // 获取当前连接
  getCurrentConnection(): Connection {
    const connection = this.connections.get(this.currentNetwork);
    if (!connection) {
      throw new Error(`No connection found for network: ${this.currentNetwork}`);
    }
    return connection;
  }

  // 切换网络
  switchNetwork(network: NetworkType): void {
    if (!this.connections.has(network)) {
      throw new Error(`Unsupported network: ${network}`);
    }
    this.currentNetwork = network;
  }

  // 获取当前网络
  getCurrentNetwork(): NetworkType {
    return this.currentNetwork;
  }

  // 测试连接
  async testConnection(network?: NetworkType): Promise<boolean> {
    try {
      const connection = network ? this.connections.get(network) : this.getCurrentConnection();
      if (!connection) return false;
      
      await connection.getVersion();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Solana 服务类
export class SolanaService {
  private connectionManager: SolanaConnectionManager;

  constructor() {
    this.connectionManager = new SolanaConnectionManager();
  }

  // 获取连接管理器
  getConnectionManager(): SolanaConnectionManager {
    return this.connectionManager;
  }

  // 获取账户余额
  async getBalance(publicKey: string): Promise<number> {
    try {
      const connection = this.connectionManager.getCurrentConnection();
      const pubKey = new PublicKey(publicKey);
      const balance = await connection.getBalance(pubKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get account balance');
    }
  }

  // 获取账户信息
  async getAccountInfo(publicKey: string) {
    try {
      const connection = this.connectionManager.getCurrentConnection();
      const pubKey = new PublicKey(publicKey);
      const accountInfo = await connection.getAccountInfo(pubKey);
      return accountInfo;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw new Error('Failed to get account information');
    }
  }

  // 获取交易历史
  async getTransactionHistory(publicKey: string, limit: number = 10) {
    try {
      const connection = this.connectionManager.getCurrentConnection();
      const pubKey = new PublicKey(publicKey);
      
      const signatures = await connection.getSignaturesForAddress(pubKey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });
          return {
            signature: sig.signature,
            slot: sig.slot,
            blockTime: sig.blockTime,
            transaction: tx,
          };
        })
      );
      
      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw new Error('Failed to get transaction history');
    }
  }

  // 验证地址格式
  isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  // 获取网络状态
  async getNetworkStatus() {
    try {
      const connection = this.connectionManager.getCurrentConnection();
      
      const [version, slot, blockTime] = await Promise.all([
        connection.getVersion(),
        connection.getSlot(),
        connection.getBlockTime(await connection.getSlot()),
      ]);
      
      return {
        version,
        slot,
        blockTime,
        network: this.connectionManager.getCurrentNetwork(),
      };
    } catch (error) {
      console.error('Error getting network status:', error);
      throw new Error('Failed to get network status');
    }
  }

  // 估算交易费用
  async estimateTransactionFee(transaction: Transaction): Promise<number> {
    try {
      const connection = this.connectionManager.getCurrentConnection();
      const fee = await connection.getFeeForMessage(transaction.compileMessage());
      return fee ? fee.value / LAMPORTS_PER_SOL : 0;
    } catch (error) {
      console.error('Error estimating transaction fee:', error);
      throw new Error('Failed to estimate transaction fee');
    }
  }

  // 获取代币账户
  async getTokenAccounts(publicKey: string) {
    try {
      const connection = this.connectionManager.getCurrentConnection();
      const pubKey = new PublicKey(publicKey);
      
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });
      
      return tokenAccounts.value.map(account => ({
        pubkey: account.pubkey.toString(),
        mint: account.account.data.parsed.info.mint,
        tokenAmount: account.account.data.parsed.info.tokenAmount,
      }));
    } catch (error) {
      console.error('Error getting token accounts:', error);
      throw new Error('Failed to get token accounts');
    }
  }
}

// 创建全局 Solana 服务实例
export const solanaService = new SolanaService();

// 导出类型
export type { NetworkType };
