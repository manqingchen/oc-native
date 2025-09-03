/**
 * 推送测试工具
 * 提供直接发送Expo推送的功能，用于开发和测试
 */

export interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  ttl?: number;
}

export interface ExpoPushResponse {
  data?: {
    status: 'ok' | 'error';
    id?: string;
    message?: string;
    details?: any;
  };
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

/**
 * 推送测试助手类
 */
export class PushTestHelper {
  private static readonly EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

  /**
   * 发送单个推送消息
   */
  static async sendPushNotification(message: ExpoPushMessage): Promise<ExpoPushResponse> {
    try {
      console.log('🚀 发送推送消息:', message);

      const response = await fetch(this.EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ 推送发送成功:', result);
        return { data: result.data };
      } else {
        console.error('❌ 推送发送失败:', result);
        return { errors: result.errors || [{ code: 'UNKNOWN', message: '推送发送失败' }] };
      }
    } catch (error) {
      console.error('❌ 推送发送异常:', error);
      return { 
        errors: [{ 
          code: 'NETWORK_ERROR', 
          message: error instanceof Error ? error.message : '网络错误' 
        }] 
      };
    }
  }

  /**
   * 批量发送推送消息
   */
  static async sendBatchPushNotifications(messages: ExpoPushMessage[]): Promise<ExpoPushResponse[]> {
    try {
      console.log('🚀 批量发送推送消息:', messages.length, '条');

      const response = await fetch(this.EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ 批量推送发送成功:', result);
        return result.data || [];
      } else {
        console.error('❌ 批量推送发送失败:', result);
        return messages.map(() => ({ 
          errors: result.errors || [{ code: 'UNKNOWN', message: '推送发送失败' }] 
        }));
      }
    } catch (error) {
      console.error('❌ 批量推送发送异常:', error);
      return messages.map(() => ({ 
        errors: [{ 
          code: 'NETWORK_ERROR', 
          message: error instanceof Error ? error.message : '网络错误' 
        }] 
      }));
    }
  }

  /**
   * 验证推送令牌格式
   */
  static isValidExpoPushToken(token: string): boolean {
    return /^ExponentPushToken\[.+\]$/.test(token);
  }

  /**
   * 创建交易完成推送消息
   */
  static createTransactionCompleteMessage(
    token: string, 
    orderType: 'subscription' | 'redemption',
    orderId: string,
    language: 'zh' | 'en' = 'zh'
  ): ExpoPushMessage {
    const messages = {
      subscription: {
        zh: { title: '交易提醒', body: '申购完成，点击查看详情' },
        en: { title: 'Transaction message', body: 'Subscription successful, see more' }
      },
      redemption: {
        zh: { title: '交易提醒', body: '赎回完成，点击查看详情' },
        en: { title: 'Transaction message', body: 'Redemption successful, see more' }
      }
    };

    const message = messages[orderType][language];

    return {
      to: token,
      title: message.title,
      body: message.body,
      data: {
        screen: 'transaction',
        type: 'transaction_complete',
        orderId: orderId,
        orderType: orderType
      },
      sound: 'default',
      badge: 1,
      priority: 'high'
    };
  }

  /**
   * 创建身份认证推送消息
   */
  static createIdentityVerificationMessage(
    token: string,
    success: boolean,
    language: 'zh' | 'en' = 'zh'
  ): ExpoPushMessage {
    const messages = {
      success: {
        zh: { title: '身份认证成功', body: '恭喜您，您的身份认证成功' },
        en: { title: 'Identity verification successful', body: 'Congratulations, your identity verification has been successful' }
      },
      failed: {
        zh: { title: '身份认证失败', body: '抱歉，您的身份认证失败' },
        en: { title: 'Identity verification failed', body: 'Sorry, your identity verification has been failed' }
      }
    };

    const message = messages[success ? 'success' : 'failed'][language];

    return {
      to: token,
      title: message.title,
      body: message.body,
      data: {
        screen: 'system-message',
        type: 'identity_verification',
        success: success
      },
      sound: 'default',
      badge: 1,
      priority: 'high'
    };
  }

  /**
   * 创建结单信息推送消息
   */
  static createStatementMessage(
    token: string,
    month: string,
    language: 'zh' | 'en' = 'zh'
  ): ExpoPushMessage {
    const messages = {
      zh: { title: '结单信息', body: `${month}结单已经生成，点击查看` },
      en: { title: 'Statement Information', body: `The ${month} statement has been generated. Click to view.` }
    };

    const message = messages[language];

    return {
      to: token,
      title: message.title,
      body: message.body,
      data: {
        screen: 'system-message',
        type: 'statement_generated',
        month: month
      },
      sound: 'default',
      badge: 1,
      priority: 'normal'
    };
  }

  /**
   * 创建自定义推送消息
   */
  static createCustomMessage(
    token: string,
    title: string,
    body: string,
    data?: any,
    options?: {
      sound?: string;
      badge?: number;
      priority?: 'default' | 'normal' | 'high';
      ttl?: number;
    }
  ): ExpoPushMessage {
    return {
      to: token,
      title: title,
      body: body,
      data: data || {},
      sound: options?.sound || 'default',
      badge: options?.badge || 1,
      priority: options?.priority || 'normal',
      ttl: options?.ttl
    };
  }

  /**
   * 获取推送发送统计
   */
  static analyzePushResults(results: ExpoPushResponse[]): {
    total: number;
    success: number;
    failed: number;
    errors: string[];
  } {
    const total = results.length;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.data?.status === 'ok') {
        success++;
      } else {
        failed++;
        if (result.errors) {
          result.errors.forEach(error => {
            errors.push(`[${index}] ${error.code}: ${error.message}`);
          });
        }
      }
    });

    return { total, success, failed, errors };
  }

  /**
   * 格式化推送令牌显示
   */
  static formatTokenForDisplay(token: string): string {
    if (!token) return '无令牌';
    
    if (token.length > 50) {
      return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
    }
    
    return token;
  }

  /**
   * 生成测试用的推送令牌（仅用于开发测试）
   */
  static generateMockToken(): string {
    const randomString = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    return `ExponentPushToken[${randomString}]`;
  }
}


