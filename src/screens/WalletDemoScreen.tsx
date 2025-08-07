/**
 * 钱包连接 Demo 页面
 * 展示多链多钱包连接功能
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { WalletConnectButton } from '../components/wallet/WalletConnectButton';
import { WalletSelectionModal } from '../components/wallet/WalletSelectionModal';
// 移除 Zustand store 依赖，使用简单的本地状态
import { getChainDisplayName, getSupportedChains } from '../config/chains';
import { SUPPORTED_WALLETS } from '../config/walletconnect';

export const WalletDemoScreen: React.FC = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  // 简单的本地状态管理
  const [connectionState] = useState({
    isConnected: false,
    address: null as string | null,
    chainId: null as string | null,
    walletId: null as string | null,
    chainType: null,
  });
  const [isConnecting] = useState(false);
  const [error] = useState(null);
  const [balance] = useState(null);
  const [isLoadingBalance] = useState(false);
  const supportedChains = getSupportedChains(true);
  const [selectedChain] = useState(null);

  // 简单的操作函数
  const disconnect = async () => console.log('Disconnect');
  const switchChain = async (chainId: string) => console.log('Switch chain:', chainId);
  const refreshBalance = async () => console.log('Refresh balance');
  const clearError = () => console.log('Clear error');

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: disconnect },
      ]
    );
  };

  const handleSwitchChain = (chainId: string) => {
    Alert.alert(
      'Switch Network',
      `Switch to ${getChainDisplayName(chainId)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => switchChain(chainId) },
      ]
    );
  };

  const renderConnectionStatus = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Connection Status</Text>
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View style={[
            styles.statusBadge, 
            connectionState.isConnected ? styles.statusConnected : styles.statusDisconnected
          ]}>
            <Text style={[
              styles.statusText,
              connectionState.isConnected ? styles.statusTextConnected : styles.statusTextDisconnected
            ]}>
              {connectionState.isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>

        {connectionState.isConnected && (
          <>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Address:</Text>
              <Text style={styles.statusValue}>
                {connectionState.address 
                  ? `${connectionState.address.slice(0, 8)}...${connectionState.address.slice(-6)}`
                  : 'N/A'
                }
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Network:</Text>
              <Text style={styles.statusValue}>
                {connectionState.chainId ? getChainDisplayName(connectionState.chainId) : 'N/A'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Wallet:</Text>
              <Text style={styles.statusValue}>
                {connectionState.walletId || 'N/A'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Balance:</Text>
              <Text style={styles.statusValue}>
                {isLoadingBalance ? 'Loading...' : (balance || 'N/A')}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const renderSupportedChains = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Supported Networks</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chainScroll}>
        {getSupportedChains(true).map((chain) => (
          <TouchableOpacity
            key={chain.id}
            style={[
              styles.chainCard,
              connectionState.chainId === chain.id && styles.chainCardActive,
              !connectionState.isConnected && styles.chainCardDisabled,
            ]}
            onPress={() => connectionState.isConnected && handleSwitchChain(chain.id)}
            disabled={!connectionState.isConnected}
          >
            <Text style={[
              styles.chainName,
              connectionState.chainId === chain.id && styles.chainNameActive,
            ]}>
              {chain.displayName}
            </Text>
            <Text style={styles.chainSymbol}>{chain.nativeCurrency.symbol}</Text>
            {chain.testnet && (
              <View style={styles.testnetBadge}>
                <Text style={styles.testnetText}>Test</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSupportedWallets = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Supported Wallets</Text>
      <View style={styles.walletGrid}>
        {Object.values(SUPPORTED_WALLETS).map((wallet) => (
          <View key={wallet.id} style={styles.walletCard}>
            <View style={[
              styles.walletIcon, 
              { backgroundColor: wallet.metadata.colors.primary }
            ]} />
            <Text style={styles.walletName}>{wallet.name}</Text>
            <Text style={styles.walletChains}>
              {wallet.chains.length} networks
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Actions</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowWalletModal(true)}
        >
          <Text style={styles.actionButtonText}>Select Wallet</Text>
        </TouchableOpacity>

        {connectionState.isConnected && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={refreshBalance}
              disabled={isLoadingBalance}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                {isLoadingBalance ? 'Refreshing...' : 'Refresh Balance'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={handleDisconnect}
            >
              <Text style={styles.actionButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        )}

        {error && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={clearError}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              Clear Error
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet Connection Demo</Text>
          <Text style={styles.subtitle}>
            Test multi-chain wallet connections with Phantom, OKX, and MetaMask
          </Text>
        </View>

        {/* 主要连接按钮 */}
        <View style={styles.section}>
          <WalletConnectButton />
        </View>

        {/* 错误显示 */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 连接状态 */}
        {renderConnectionStatus()}

        {/* 支持的链 */}
        {renderSupportedChains()}

        {/* 支持的钱包 */}
        {renderSupportedWallets()}

        {/* 操作按钮 */}
        {renderActions()}
      </ScrollView>

      {/* 钱包选择模态框 */}
      <WalletSelectionModal
        visible={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusConnected: {
    backgroundColor: '#D1FAE5',
  },
  statusDisconnected: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusTextConnected: {
    color: '#065F46',
  },
  statusTextDisconnected: {
    color: '#991B1B',
  },
  chainScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  chainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  chainCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  chainCardDisabled: {
    opacity: 0.5,
  },
  chainName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  chainNameActive: {
    color: '#3B82F6',
  },
  chainSymbol: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  testnetBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  testnetText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  walletChains: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  actionButtonDanger: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    color: '#374151',
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
  },
});
