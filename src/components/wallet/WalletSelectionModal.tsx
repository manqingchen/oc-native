/**
 * 钱包选择模态框组件
 * 显示支持的钱包和链选择
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
// 移除 Zustand store 依赖
import { SUPPORTED_WALLETS } from '../../config/walletconnect';
import { getChainDisplayName } from '../../config/chains';

interface WalletSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  visible,
  onClose,
}) => {
  // 简单的本地状态
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  // 模拟数据
  const supportedChains = [
    { id: 'solana', name: 'Solana' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'polygon', name: 'Polygon' },
  ];

  // 简单的操作函数
  const selectChain = (chainId: string) => setSelectedChain(chainId);
  const connectWallet = async (chainId?: string) => console.log('Connect wallet:', chainId);

  const handleChainSelect = (chainId: string) => {
    selectChain(chainId);
  };

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    try {
      await connectWallet(selectedChain || undefined);
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setSelectedWallet(null);
    }
  };

  const getWalletsForSelectedChain = () => {
    if (!selectedChain) return [];
    
    return Object.values(SUPPORTED_WALLETS).filter(wallet =>
      wallet.chains.includes(selectedChain)
    );
  };

  const renderChainItem = (chain: any) => {
    const isSelected = selectedChain === chain.id;
    
    return (
      <TouchableOpacity
        key={chain.id}
        style={[styles.chainItem, isSelected && styles.chainItemSelected]}
        onPress={() => handleChainSelect(chain.id)}
      >
        <View style={styles.chainInfo}>
          <Text style={[styles.chainName, isSelected && styles.chainNameSelected]}>
            {chain.displayName}
          </Text>
          <Text style={[styles.chainSymbol, isSelected && styles.chainSymbolSelected]}>
            {chain.nativeCurrency.symbol}
          </Text>
        </View>
        {chain.testnet && (
          <View style={styles.testnetBadge}>
            <Text style={styles.testnetText}>Testnet</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWalletItem = (wallet: any) => {
    const isConnecting = selectedWallet === wallet.id;
    
    return (
      <TouchableOpacity
        key={wallet.id}
        style={[styles.walletItem, isConnecting && styles.walletItemConnecting]}
        onPress={() => handleWalletSelect(wallet.id)}
        disabled={isConnecting}
      >
        <View style={styles.walletInfo}>
          <View style={[styles.walletIcon, { backgroundColor: wallet.metadata.colors.primary }]} />
          <View style={styles.walletDetails}>
            <Text style={styles.walletName}>{wallet.name}</Text>
            <Text style={styles.walletDescription}>
              {isConnecting ? 'Connecting...' : 'Tap to connect'}
            </Text>
          </View>
        </View>
        <View style={styles.walletArrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Connect Wallet</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 链选择部分 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Network</Text>
            <View style={styles.chainList}>
              {supportedChains.map(renderChainItem)}
            </View>
          </View>

          {/* 钱包选择部分 */}
          {selectedChain && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Select Wallet for {getChainDisplayName(selectedChain)}
              </Text>
              <View style={styles.walletList}>
                {getWalletsForSelectedChain().map(renderWalletItem)}
              </View>
            </View>
          )}

          {/* 提示信息 */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>What is a wallet?</Text>
            <Text style={styles.infoText}>
              A wallet is used to send, receive, store, and display digital assets. 
              It's also a new way to log into apps without having to create new accounts and passwords on every website.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  chainList: {
    gap: 8,
  },
  chainItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  chainItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  chainInfo: {
    flex: 1,
  },
  chainName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  chainNameSelected: {
    color: '#007AFF',
  },
  chainSymbol: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  chainSymbolSelected: {
    color: '#007AFF',
  },
  testnetBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FF9500',
  },
  testnetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletList: {
    gap: 12,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  walletItemConnecting: {
    opacity: 0.6,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  walletDetails: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  walletDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  walletArrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  infoSection: {
    marginTop: 32,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
