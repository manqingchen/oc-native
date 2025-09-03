# Expo Push Notifications 集成文档

*版本: 1.0 | 创建时间: 2025-09-02*

## 📋 概述

本文档描述如何在现有的Expo项目中集成推送通知功能，主要用于交易完成后的系统消息推送。

## 🎯 功能需求

### 推送类型
- **交易结果通知**: 申购完成、赎回完成
- **跳转目标**: 点击推送跳转到交易列表页面 (`/transaction`)

### 用户体验
- 优雅的推送权限请求
- 应用内和应用外推送处理
- 深度链接支持

## 🛠️ 技术方案

### 1. 依赖安装
```bash
npx expo install expo-notifications expo-device expo-constants
```

### 2. 配置文件修改

#### app.json 配置
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ],
    "notification": {
      "icon": "./assets/images/notification-icon.png",
      "color": "#ffffff"
    }
  }
}
```

### 3. 核心实现文件

#### 3.1 推送服务 (`services/push-notification.service.ts`)
- 推送权限管理
- 推送令牌获取和更新
- 推送事件监听
- 深度链接处理

#### 3.2 推送Hook (`hooks/usePushNotifications.ts`)
- 推送初始化
- 权限状态管理
- 推送处理逻辑

#### 3.3 配置文件更新 (`lib/config.ts`)
- 添加推送相关配置
- Expo推送令牌管理

### 4. 深度链接配置

#### URL Scheme
- 现有: `myapp://`
- 推送链接: `myapp://transaction`

#### 路由处理
- 在 `app/_layout.tsx` 中添加深度链接监听
- 推送点击后导航到交易页面

## 📱 实现流程

### 阶段一: 基础配置
1. 安装依赖包
2. 配置 app.json
3. 创建推送服务文件

### 阶段二: 核心功能
1. 实现推送权限请求
2. 获取和管理推送令牌
3. 设置推送事件监听

### 阶段三: 集成应用
1. 在应用启动时初始化推送
2. 集成到现有的交易流程
3. 实现深度链接跳转

### 阶段四: 测试验证
1. 使用Expo CLI测试推送
2. 验证深度链接跳转
3. 测试权限流程

## 🔧 关键代码结构

### 推送令牌获取
```typescript
import * as Notifications from 'expo-notifications';

const getExpoPushToken = async () => {
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-expo-project-id'
  });
  return token.data;
};
```

### 推送监听
```typescript
Notifications.addNotificationReceivedListener(notification => {
  // 应用在前台时的处理
});

Notifications.addNotificationResponseReceivedListener(response => {
  // 用户点击推送时的处理
  const data = response.notification.request.content.data;
  if (data?.screen === 'transaction') {
    router.push('/transaction');
  }
});
```

## 🔗 与现有系统集成

### 交易页面集成
- 在 `app/transaction.tsx` 中添加推送处理
- 与现有的交易状态管理集成

### 用户认证集成
- 在用户登录后获取推送令牌
- 将推送令牌发送给后端保存

## 📊 推送消息格式

### 标准格式
```json
{
  "to": "ExponentPushToken[xxx]",
  "title": "交易完成",
  "body": "您的申购已完成，点击查看详情",
  "data": {
    "screen": "transaction",
    "type": "transaction_complete",
    "orderId": "12345"
  },
  "sound": "default",
  "badge": 1
}
```

## 🚀 部署注意事项

### iOS
- 需要Apple Developer账号
- 推送证书配置
- App Store Connect配置

### Android
- Firebase Cloud Messaging配置
- Google Play Console设置

## 📈 监控和分析

### 推送效果追踪
- 推送发送成功率
- 用户点击率
- 应用打开率

### 错误处理
- 推送令牌失效处理
- 网络错误重试机制
- 权限被拒绝的处理

## 🔄 后续优化

### 功能扩展
- 推送消息本地化
- 推送时间优化
- 用户推送偏好设置

### 性能优化
- 推送令牌缓存
- 批量推送处理
- 推送去重机制
