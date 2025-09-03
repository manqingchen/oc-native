# 后端API对接指南

*版本: 1.0 | 创建时间: 2025-09-02*

## 📋 概述

本文档提供后端与Expo推送通知系统的完整对接方案，包括API设计、数据库设计、推送发送逻辑等。

## 🎯 对接目标

### 主要功能
1. **推送令牌管理** - 保存、更新、删除用户的Expo推送令牌
2. **推送消息发送** - 在业务事件触发时发送推送通知
3. **推送历史记录** - 记录推送发送历史和状态
4. **推送设置管理** - 用户推送偏好设置

## 🗄️ 数据库设计

### 1. 用户推送令牌表
```sql
CREATE TABLE user_push_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL COMMENT '用户ID',
    expo_push_token VARCHAR(500) NOT NULL COMMENT 'Expo推送令牌',
    device_id VARCHAR(255) COMMENT '设备唯一标识',
    device_name VARCHAR(255) COMMENT '设备名称',
    platform ENUM('ios', 'android', 'web') NOT NULL COMMENT '平台类型',
    app_version VARCHAR(50) COMMENT '应用版本',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后使用时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_device (user_id, device_id),
    INDEX idx_user_id (user_id),
    INDEX idx_token (expo_push_token),
    INDEX idx_active (is_active)
);
```

### 2. 推送消息记录表
```sql
CREATE TABLE push_notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL COMMENT '用户ID',
    title VARCHAR(255) NOT NULL COMMENT '推送标题',
    body TEXT NOT NULL COMMENT '推送内容',
    data JSON COMMENT '推送数据',
    message_type VARCHAR(100) COMMENT '消息类型',
    target_screen VARCHAR(100) COMMENT '目标页面',
    expo_ticket_id VARCHAR(255) COMMENT 'Expo票据ID',
    status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    error_message TEXT COMMENT '错误信息',
    sent_at TIMESTAMP NULL COMMENT '发送时间',
    delivered_at TIMESTAMP NULL COMMENT '送达时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_message_type (message_type),
    INDEX idx_created_at (created_at)
);
```

### 3. 用户推送设置表
```sql
CREATE TABLE user_push_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL COMMENT '用户ID',
    transaction_notifications BOOLEAN DEFAULT TRUE COMMENT '交易通知',
    system_notifications BOOLEAN DEFAULT TRUE COMMENT '系统通知',
    marketing_notifications BOOLEAN DEFAULT FALSE COMMENT '营销通知',
    quiet_hours_start TIME COMMENT '免打扰开始时间',
    quiet_hours_end TIME COMMENT '免打扰结束时间',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai' COMMENT '时区',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id)
);
```

## 🔌 API接口设计

### 1. 推送令牌管理

#### 1.1 保存/更新推送令牌
```http
POST /api/v1/push/token
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
    "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "deviceId": "device_unique_id",
    "deviceName": "iPhone 15 Pro",
    "platform": "ios",
    "appVersion": "1.0.0"
}
```

**响应示例:**
```json
{
    "code": 200,
    "message": "推送令牌保存成功",
    "data": {
        "tokenId": 12345,
        "isNewDevice": true
    }
}
```

#### 1.2 删除推送令牌
```http
DELETE /api/v1/push/token
Authorization: Bearer {jwt_token}

{
    "deviceId": "device_unique_id"
}
```

#### 1.3 获取用户所有设备
```http
GET /api/v1/push/devices
Authorization: Bearer {jwt_token}
```

**响应示例:**
```json
{
    "code": 200,
    "data": [
        {
            "id": 1,
            "deviceId": "device_1",
            "deviceName": "iPhone 15 Pro",
            "platform": "ios",
            "isActive": true,
            "lastUsedAt": "2025-09-02T10:00:00Z"
        }
    ]
}
```

### 2. 推送消息发送

#### 2.1 发送单个推送
```http
POST /api/v1/push/send
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "userId": "user123",
    "title": "交易提醒",
    "body": "您的申购已完成，点击查看详情",
    "data": {
        "screen": "transaction",
        "type": "transaction_complete",
        "orderId": "order_12345"
    },
    "messageType": "transaction_notification"
}
```

#### 2.2 批量发送推送
```http
POST /api/v1/push/send-batch
Content-Type: application/json
Authorization: Bearer {admin_token}

{
    "userIds": ["user1", "user2", "user3"],
    "title": "系统通知",
    "body": "系统将于今晚进行维护",
    "data": {
        "screen": "system-message",
        "type": "system_maintenance"
    },
    "messageType": "system_notification"
}
```

### 3. 推送历史查询

#### 3.1 用户推送历史
```http
GET /api/v1/push/history?page=1&limit=20&messageType=transaction_notification
Authorization: Bearer {jwt_token}
```

**响应示例:**
```json
{
    "code": 200,
    "data": {
        "list": [
            {
                "id": 1,
                "title": "交易提醒",
                "body": "申购完成，点击查看详情",
                "messageType": "transaction_notification",
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

### 4. 推送设置管理

#### 4.1 获取推送设置
```http
GET /api/v1/push/settings
Authorization: Bearer {jwt_token}
```

#### 4.2 更新推送设置
```http
PUT /api/v1/push/settings
Authorization: Bearer {jwt_token}

{
    "transactionNotifications": true,
    "systemNotifications": true,
    "marketingNotifications": false,
    "quietHoursStart": "22:00",
    "quietHoursEnd": "08:00"
}
```

## 🚀 后端实现示例 (Node.js)

### 1. 安装依赖
```bash
npm install expo-server-sdk axios
```

### 2. 推送服务实现
```javascript
const { Expo } = require('expo-server-sdk');

class PushNotificationService {
    constructor() {
        this.expo = new Expo();
    }

    // 保存推送令牌
    async saveToken(userId, tokenData) {
        const { expoPushToken, deviceId, deviceName, platform, appVersion } = tokenData;
        
        // 验证令牌格式
        if (!Expo.isExpoPushToken(expoPushToken)) {
            throw new Error('无效的推送令牌格式');
        }

        // 保存到数据库
        const result = await db.query(`
            INSERT INTO user_push_tokens 
            (user_id, expo_push_token, device_id, device_name, platform, app_version)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            expo_push_token = VALUES(expo_push_token),
            device_name = VALUES(device_name),
            app_version = VALUES(app_version),
            is_active = TRUE,
            last_used_at = CURRENT_TIMESTAMP
        `, [userId, expoPushToken, deviceId, deviceName, platform, appVersion]);

        return result;
    }

    // 发送推送消息
    async sendNotification(userId, notification) {
        const { title, body, data, messageType } = notification;

        // 获取用户的活跃推送令牌
        const tokens = await this.getUserActiveTokens(userId);
        
        if (tokens.length === 0) {
            console.log(`用户 ${userId} 没有活跃的推送令牌`);
            return;
        }

        // 检查用户推送设置
        const settings = await this.getUserPushSettings(userId);
        if (!this.shouldSendNotification(messageType, settings)) {
            console.log(`用户 ${userId} 已关闭此类型推送: ${messageType}`);
            return;
        }

        // 构建推送消息
        const messages = tokens.map(token => ({
            to: token.expo_push_token,
            sound: 'default',
            title: title,
            body: body,
            data: data || {},
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
                console.error('推送发送失败:', error);
            }
        }

        // 保存推送记录
        await this.savePushRecord(userId, notification, tickets);

        return tickets;
    }

    // 获取用户活跃令牌
    async getUserActiveTokens(userId) {
        const result = await db.query(`
            SELECT expo_push_token, device_id, platform
            FROM user_push_tokens
            WHERE user_id = ? AND is_active = TRUE
        `, [userId]);
        
        return result;
    }

    // 获取用户推送设置
    async getUserPushSettings(userId) {
        const result = await db.query(`
            SELECT * FROM user_push_settings WHERE user_id = ?
        `, [userId]);
        
        return result[0] || {
            transaction_notifications: true,
            system_notifications: true,
            marketing_notifications: false
        };
    }

    // 判断是否应该发送推送
    shouldSendNotification(messageType, settings) {
        const typeMapping = {
            'transaction_notification': settings.transaction_notifications,
            'system_notification': settings.system_notifications,
            'marketing_notification': settings.marketing_notifications
        };

        return typeMapping[messageType] !== false;
    }

    // 保存推送记录
    async savePushRecord(userId, notification, tickets) {
        const { title, body, data, messageType } = notification;
        
        for (const ticket of tickets) {
            await db.query(`
                INSERT INTO push_notifications
                (user_id, title, body, data, message_type, expo_ticket_id, status, sent_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                userId, 
                title, 
                body, 
                JSON.stringify(data), 
                messageType,
                ticket.id,
                ticket.status === 'ok' ? 'sent' : 'failed'
            ]);
        }
    }
}

module.exports = PushNotificationService;

## 📱 使用Expo Go测试推送功能

### 方法一：使用应用内测试页面

1. **启动应用**
   ```bash
   npx expo start
   ```

2. **在手机上打开Expo Go**
   - 扫描终端显示的二维码
   - 或者在浏览器打开 http://localhost:8081

3. **访问测试页面**
   - 在主页面点击"🔔 推送测试"按钮
   - 或者直接访问 `/push-test` 路由

4. **测试流程**
   ```
   1. 点击"初始化推送服务" → 初始化推送功能
   2. 点击"请求推送权限" → 获取推送权限
   3. 选择测试推送类型 → 发送本地测试推送
   4. 点击推送通知 → 验证深度链接跳转
   ```

### 方法二：使用Expo推送工具

1. **获取推送令牌**
   - 在测试页面查看推送令牌
   - 复制完整的 `ExponentPushToken[...]` 字符串

2. **使用Expo推送工具发送**
   ```bash
   # 安装expo-cli
   npm install -g @expo/cli

   # 发送测试推送
   npx expo push:android:send --to="ExponentPushToken[your-token]" --title="测试推送" --body="这是一条测试消息"
   ```

3. **或者使用在线工具**
   - 访问: https://expo.dev/notifications
   - 输入推送令牌和消息内容
   - 点击发送测试推送

### 方法三：使用curl命令测试

```bash
curl -H "Content-Type: application/json" \
     -X POST \
     -d '{
       "to": "ExponentPushToken[your-token-here]",
       "title": "交易提醒",
       "body": "申购完成，点击查看详情",
       "data": {
         "screen": "transaction",
         "type": "transaction_complete",
         "orderId": "test-12345"
       },
       "sound": "default",
       "badge": 1
     }' \
     https://exp.host/--/api/v2/push/send
```

### 方法四：使用Postman测试

1. **创建POST请求**
   - URL: `https://exp.host/--/api/v2/push/send`
   - Method: POST
   - Headers: `Content-Type: application/json`

2. **请求体示例**
   ```json
   {
     "to": "ExponentPushToken[your-token-here]",
     "title": "交易提醒",
     "body": "申购完成，点击查看详情",
     "data": {
       "screen": "transaction",
       "type": "transaction_complete",
       "orderId": "test-12345"
     },
     "sound": "default",
     "badge": 1
   }
   ```

## 🔧 测试注意事项

### 1. 设备要求
- **真实设备**: 推送通知只在真实设备上工作，模拟器不支持
- **网络连接**: 确保设备有稳定的网络连接
- **Expo Go版本**: 使用最新版本的Expo Go应用

### 2. 权限设置
- **iOS**: 首次使用时会弹出推送权限请求
- **Android**: 通常默认允许推送通知
- **权限被拒绝**: 需要到系统设置中手动开启

### 3. 推送令牌
- **令牌格式**: 必须是 `ExponentPushToken[...]` 格式
- **令牌有效性**: 令牌可能会过期，需要定期刷新
- **设备绑定**: 每个设备有唯一的推送令牌

### 4. 深度链接测试
- **应用状态**: 测试应用在前台、后台、关闭状态下的推送处理
- **跳转验证**: 确认点击推送后能正确跳转到目标页面
- **数据传递**: 验证推送数据能正确传递到目标页面

## 🚨 常见问题排查

### 1. 推送令牌获取失败
```
原因: 权限被拒绝或网络问题
解决: 检查权限设置，重新请求权限
```

### 2. 推送发送失败
```
原因: 令牌无效或格式错误
解决: 验证令牌格式，刷新令牌
```

### 3. 推送收不到
```
原因: 设备离线或应用被杀死
解决: 确保设备在线，重启应用
```

### 4. 深度链接不工作
```
原因: URL scheme配置错误
解决: 检查app.json中的scheme配置
```

## 📊 推送效果监控

### 1. 关键指标
- **发送成功率**: 推送发送成功的比例
- **送达率**: 推送实际送达设备的比例
- **点击率**: 用户点击推送的比例
- **转化率**: 推送带来的业务转化

### 2. 监控实现
```javascript
// 推送效果统计
async function trackPushMetrics(userId, notificationId, action) {
    await db.query(`
        INSERT INTO push_metrics (user_id, notification_id, action, created_at)
        VALUES (?, ?, ?, NOW())
    `, [userId, notificationId, action]);
}

// 使用示例
trackPushMetrics(userId, notificationId, 'sent');     // 发送
trackPushMetrics(userId, notificationId, 'delivered'); // 送达
trackPushMetrics(userId, notificationId, 'clicked');   // 点击
```

## 🎯 最佳实践

### 1. 推送时机
- **避免打扰**: 尊重用户的免打扰时间设置
- **频率控制**: 避免过于频繁的推送
- **内容相关**: 确保推送内容对用户有价值

### 2. 消息内容
- **标题简洁**: 控制在20字以内
- **内容明确**: 清楚说明推送目的
- **行动引导**: 包含明确的行动指引

### 3. 技术优化
- **批量发送**: 使用批量API提高效率
- **错误重试**: 实现推送失败重试机制
- **令牌管理**: 定期清理无效令牌
```

### 3. 业务集成示例
```javascript
// 交易完成时发送推送
async function onTransactionComplete(orderId) {
    const order = await getOrderById(orderId);
    const user = await getUserById(order.userId);
    
    if (order.status === 'SEND_USER_SUCCESS') {
        const pushService = new PushNotificationService();
        
        const messageType = order.type === 'subscription' ? 
            'SUBSCRIPTION_COMPLETE' : 'REDEMPTION_COMPLETE';
        
        const language = user.language || 'zh';
        const message = getMessageTemplate(messageType, language);
        
        await pushService.sendNotification(user.id, {
            title: message.title,
            body: message.body,
            data: {
                screen: 'transaction',
                type: 'transaction_complete',
                orderId: order.id
            },
            messageType: 'transaction_notification'
        });
    }
}
```
