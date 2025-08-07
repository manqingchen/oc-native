/**
 * 钱包连接按钮组件
 * 支持多链多钱包连接
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// 移除 Zustand store 依赖
import { getChainDisplayName } from '../../config/chains';

interface WalletConnectButtonProps {
  chainId?: string;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  chainId,
  style,
  textStyle,
  disabled = false,
}) => {
  // 简单的本地状态
  const connectionState = {
    isConnected: false,
    address: null as string | null,
    chainId: null as string | null,
    walletId: null as string | null,
    chainType: null,
  };
  const isConnecting = false;
  const error = null;

  // 简单的操作函数
  const connectWallet = async (chainId?: string) => console.log('Connect wallet:', chainId);
  const disconnect = async () => console.log('Disconnect');

  const handlePress = async () => {
    if (connectionState.isConnected) {
      await disconnect();
    } else {
      await connectWallet(chainId);
    }
  };

  const getButtonText = () => {
    if (isConnecting) {
      return 'Connecting...';
    }
    
    if (connectionState.isConnected) {
      const chainName = connectionState.chainId 
        ? getChainDisplayName(connectionState.chainId)
        : 'Unknown Chain';
      const shortAddress = connectionState.address
        ? `${connectionState.address.slice(0, 6)}...${connectionState.address.slice(-4)}`
        : '';
      return `${shortAddress} (${chainName})`;
    }
    
    return chainId ? `Connect to ${getChainDisplayName(chainId)}` : 'Connect Wallet';
  };

  const getButtonStyle = () => {
    if (disabled || isConnecting) {
      return [styles.button, styles.buttonDisabled, style];
    }
    
    if (connectionState.isConnected) {
      return [styles.button, styles.buttonConnected, style];
    }
    
    return [styles.button, styles.buttonDefault, style];
  };

  const getTextStyle = () => {
    if (disabled || isConnecting) {
      return [styles.text, styles.textDisabled, textStyle];
    }
    
    if (connectionState.isConnected) {
      return [styles.text, styles.textConnected, textStyle];
    }
    
    return [styles.text, styles.textDefault, textStyle];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={handlePress}
        disabled={disabled || isConnecting}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {isConnecting && (
            <ActivityIndicator 
              size="small" 
              color={connectionState.isConnected ? "#FFFFFF" : "#007AFF"} 
              style={styles.loader}
            />
          )}
          <Text style={getTextStyle()}>
            {getButtonText()}
          </Text>
        </View>
      </TouchableOpacity>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDefault: {
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonConnected: {
    backgroundColor: '#34C759',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textDefault: {
    color: '#FFFFFF',
  },
  textConnected: {
    color: '#FFFFFF',
  },
  textDisabled: {
    color: '#8E8E93',
  },
  errorContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
});
