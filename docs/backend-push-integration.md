# 后端推送集成文档

*版本: 1.0 | 创建时间: 2025-09-02*

## 📋 概述

本文档描述后端如何与Expo Push Notifications集成，实现交易完成后的自动推送通知。

## 🎯 集成目标

### 推送触发场景
- **交易完成**: 申购/赎回订单状态变更为完成时
- **身份验证**: KYC验证成功/失败时
- **结单信息**: 月度结单生成时

### 推送内容
- 中英文双语支持
- 跳转到对应页面
- 包含订单/交易相关信息

## 🛠️ 技术实现

### 1. Expo Push Token管理

#### 1.1 数据库表设计
```sql
-- 用户推送令牌表
CREATE TABLE user_push_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    expo_push_token VARCHAR(500) NOT NULL,
    device_id VARCHAR(255),
    platform ENUM('ios', 'android') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_device (user_id, device_id),
    INDEX idx_user_id (user_id),
    INDEX idx_token (expo_push_token)
);
```

#### 1.2 API接口设计

##### 保存/更新推送令牌
```http
POST /api/v1/push/token
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
    "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "deviceId": "device_unique_id",
    "platform": "ios"
}
```

**响应:**
```json
{
    "code": 200,
    "message": "Token saved successfully",
    "data": {
        "tokenId": "12345"
    }
}
```

##### 删除推送令牌
```http
DELETE /api/v1/push/token
Authorization: Bearer {jwt_token}

{
    "deviceId": "device_unique_id"
}
```

### 2. 推送发送服务

#### 2.1 Expo Push API集成

##### 依赖安装 (Node.js示例)
```bash
npm install expo-server-sdk
```

##### 推送服务实现
```javascript
const { Expo } = require('expo-server-sdk');

class PushNotificationService {
    constructor() {
        this.expo = new Expo();
    }

    async sendPushNotification(tokens, title, body, data = {}) {
        // 验证推送令牌
        const validTokens = tokens.filter(token => 
            Expo.isExpoPushToken(token)
        );

        if (validTokens.length === 0) {
            throw new Error('No valid push tokens');
        }

        // 构建推送消息
        const messages = validTokens.map(token => ({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data,
            badge: 1
        }));

        // 发送推送
        const chunks = this.expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Push notification error:', error);
            }
        }

        return tickets;
    }
}
```

#### 2.2 推送消息模板

##### 交易完成推送
```javascript
const transactionMessages = {
    subscription_complete: {
        zh: {
            title: "交易提醒",
            body: "申购完成，点击查看详情"
        },
        en: {
            title: "Transaction message", 
            body: "Subscription successful, see more"
        }
    },
    redemption_complete: {
        zh: {
            title: "交易提醒", 
            body: "赎回完成，点击查看详情"
        },
        en: {
            title: "Transaction message",
            body: "Redemption successful, see more"
        }
    }
};
```

### 3. 业务集成点

#### 3.1 交易状态变更触发

```javascript
// 订单状态更新时触发推送
async function updateOrderStatus(orderId, newStatus) {
    // 更新订单状态
    await orderService.updateStatus(orderId, newStatus);
    
    // 如果是完成状态，发送推送
    if (newStatus === 'SEND_USER_SUCCESS') {
        const order = await orderService.getById(orderId);
        const user = await userService.getById(order.userId);
        
        await sendTransactionCompletePush(user, order);
    }
}

async function sendTransactionCompletePush(user, order) {
    // 获取用户的推送令牌
    const tokens = await pushTokenService.getUserTokens(user.id);
    
    if (tokens.length === 0) return;
    
    // 获取用户语言偏好
    const language = user.language || 'zh';
    
    // 选择消息模板
    const messageType = order.type === 'subscription' ? 
        'subscription_complete' : 'redemption_complete';
    
    const message = transactionMessages[messageType][language];
    
    // 发送推送
    await pushService.sendPushNotification(
        tokens.map(t => t.expo_push_token),
        message.title,
        message.body,
        {
            screen: 'transaction',
            type: 'transaction_complete',
            orderId: order.id
        }
    );
}
```

#### 3.2 推送结果处理

```javascript
// 处理推送回执
async function handlePushReceipts(tickets) {
    const receiptIds = tickets
        .filter(ticket => ticket.status === 'ok')
        .map(ticket => ticket.id);
    
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    
    for (const chunk of receiptIdChunks) {
        try {
            const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            
            for (const receiptId in receipts) {
                const receipt = receipts[receiptId];
                
                if (receipt.status === 'error') {
                    console.error('Push notification error:', receipt.message);
                    
                    // 如果是设备令牌无效，从数据库删除
                    if (receipt.details?.error === 'DeviceNotRegistered') {
                        await pushTokenService.deactivateToken(receiptId);
                    }
                }
            }
        } catch (error) {
            console.error('Receipt handling error:', error);
        }
    }
}
```

### 4. API接口规范

#### 4.1 推送历史查询
```http
GET /api/v1/push/history?page=1&limit=20
Authorization: Bearer {jwt_token}
```

**响应:**
```json
{
    "code": 200,
    "data": {
        "list": [
            {
                "id": "12345",
                "title": "交易提醒",
                "body": "申购完成，点击查看详情",
                "type": "transaction_complete",
                "status": "delivered",
                "createdAt": "2025-09-02T10:00:00Z"
            }
        ],
        "total": 50,
        "page": 1,
        "limit": 20
    }
}
```

#### 4.2 推送设置管理
```http
PUT /api/v1/push/settings
Authorization: Bearer {jwt_token}

{
    "transactionNotifications": true,
    "systemNotifications": true,
    "marketingNotifications": false
}
```

### 5. 错误处理和重试机制

#### 5.1 推送失败处理
```javascript
class PushRetryService {
    async sendWithRetry(tokens, message, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await pushService.sendPushNotification(tokens, message);
                return result;
            } catch (error) {
                console.error(`Push attempt ${attempt} failed:`, error);
                
                if (attempt === maxRetries) {
                    // 记录最终失败
                    await this.logPushFailure(tokens, message, error);
                    throw error;
                }
                
                // 指数退避重试
                await this.delay(Math.pow(2, attempt) * 1000);
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

### 6. 监控和日志

#### 6.1 推送统计
- 推送发送总数
- 推送成功率
- 用户点击率
- 设备令牌有效性

#### 6.2 日志记录
```javascript
// 推送日志表
CREATE TABLE push_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255),
    push_token VARCHAR(500),
    message_type VARCHAR(100),
    title VARCHAR(255),
    body TEXT,
    data JSON,
    status ENUM('sent', 'delivered', 'failed'),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 部署配置

### 环境变量
```bash
# Expo推送服务配置
EXPO_ACCESS_TOKEN=your_expo_access_token

# 推送服务配置
PUSH_BATCH_SIZE=100
PUSH_RETRY_ATTEMPTS=3
PUSH_RETRY_DELAY=1000
```

### 定时任务
```javascript
// 清理无效推送令牌 (每日执行)
cron.schedule('0 2 * * *', async () => {
    await pushTokenService.cleanupInvalidTokens();
});

// 推送统计报告 (每周执行)
cron.schedule('0 9 * * 1', async () => {
    await pushAnalyticsService.generateWeeklyReport();
});
```
