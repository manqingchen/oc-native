# 🔐 生物识别认证 Demo

这是一个完整的 React Native + Expo 生物识别认证解决方案，支持 iOS Face ID/Touch ID 和 Android 指纹/面部识别。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装生物识别认证库
npx expo install expo-local-authentication

# 如果还没有安装其他依赖
yarn install
```

### 2. 配置权限

项目已经配置好了必要的权限，包括：

- **app.json**: 已添加 `expo-local-authentication` 插件配置
- **iOS**: Face ID 权限描述已配置
- **Android**: 生物识别权限会自动添加

### 3. 运行演示

```bash
# 启动开发服务器
expo start

# 在应用中导航到 /biometric-demo 页面
```

## 📱 功能演示

### 🎯 核心功能

1. **设备检测**
   - ✅ 自动检测设备是否支持生物识别
   - ✅ 检查用户是否已设置生物识别数据
   - ✅ 显示支持的认证类型（指纹/面部/虹膜）

2. **认证功能**
   - ✅ 生物识别认证
   - ✅ 安全凭证存储
   - ✅ 自动登录
   - ✅ 密码回退

3. **设置管理**
   - ✅ 启用/禁用生物识别登录
   - ✅ 凭证管理
   - ✅ 状态监控

### 🧪 演示页面功能

访问 `/biometric-demo` 页面可以体验：

- **状态检查**: 查看当前设备的生物识别支持状态
- **快速测试**: 一键测试各种认证场景
- **按钮演示**: 不同样式和尺寸的认证按钮
- **设置管理**: 完整的生物识别设置界面
- **实时反馈**: 查看操作结果和错误信息

## 🛠️ 技术架构

### 📁 文件结构

```
hooks/
├── useBiometricAuth.ts      # 基础生物识别认证 Hook
└── useBiometricLogin.ts     # 登录集成 Hook

components/biometric/
├── BiometricAuthButton.tsx      # 基础认证按钮
├── BiometricLoginButton.tsx     # 登录认证按钮
└── BiometricSettings.tsx        # 设置管理组件

app/
└── biometric-demo.tsx           # 演示页面

docs/
└── biometric-authentication.md # 详细文档
```

### 🔧 核心 Hooks

#### useBiometricAuth
基础的生物识别认证功能：
- 设备支持检测
- 认证执行
- 凭证存储管理
- 状态监控

#### useBiometricLogin
集成到登录流程的高级功能：
- 自动登录
- 登录状态管理
- 设置提示
- 错误处理

### 🎨 UI 组件

#### BiometricAuthButton
- 多种样式变体（solid/outline）
- 不同尺寸（sm/md/lg）
- 自动图标选择
- 状态指示

#### BiometricSettings
- 完整的设置界面
- 开关控制
- 状态显示
- 帮助信息

## 💡 使用示例

### 基础认证

```tsx
import { BiometricAuthButton } from '@/components/biometric/BiometricAuthButton';

<BiometricAuthButton
  onSuccess={(credentials) => {
    console.log('认证成功:', credentials);
  }}
  onError={(error) => {
    console.log('认证失败:', error);
  }}
/>
```

### 登录集成

```tsx
import { useBiometricLogin } from '@/hooks/useBiometricLogin';

const { tryAutoLogin, setupBiometricLogin } = useBiometricLogin();

// 应用启动时尝试自动登录
const result = await tryAutoLogin();
if (result.success) {
  // 登录成功
}

// 用户登录后设置生物识别
await setupBiometricLogin();
```

### 设置管理

```tsx
import { BiometricSettings } from '@/components/biometric/BiometricSettings';

<BiometricSettings
  userCredentials={{
    username: 'user123',
    token: 'auth_token',
    walletAddress: 'wallet_address',
    timestamp: Date.now(),
  }}
  onSettingsChange={(enabled) => {
    console.log('生物识别', enabled ? '已启用' : '已禁用');
  }}
/>
```

## 🔒 安全特性

### 数据保护
- ✅ 使用 Expo SecureStore 安全存储凭证
- ✅ 凭证自动过期机制（30天）
- ✅ 强生物识别安全等级
- ✅ 错误信息不暴露敏感数据

### 权限管理
- ✅ 最小权限原则
- ✅ 用户明确授权
- ✅ 权限状态检查
- ✅ 优雅的权限拒绝处理

## 📱 平台支持

### iOS
- ✅ Face ID (iPhone X+)
- ✅ Touch ID (iPhone 5s+)
- ⚠️ Face ID 需要开发构建测试（Expo Go 不支持）

### Android
- ✅ 指纹识别
- ✅ 面部识别
- ✅ 虹膜识别
- ✅ 强/弱生物识别等级

## 🧪 测试指南

### 设备要求
- **iOS**: 需要支持 Face ID 或 Touch ID 的设备
- **Android**: 需要支持指纹或面部识别的设备
- **开发**: 建议使用真机测试

### 测试场景
1. **首次使用**: 设备支持检测和设置流程
2. **正常认证**: 成功的生物识别认证
3. **认证失败**: 处理认证失败和重试
4. **权限拒绝**: 处理用户拒绝权限的情况
5. **设备变更**: 处理生物识别数据变更

### 调试技巧
```tsx
// 查看详细的设备支持信息
const { checkBiometricSupport } = useBiometricAuth();
const support = await checkBiometricSupport();
console.log('设备支持信息:', support);
```

## ⚠️ 注意事项

### 开发环境
- Face ID 在 Expo Go 中无法测试，需要开发构建
- 建议使用真机进行测试
- 确保设备已设置生物识别数据

### 生产环境
- 定期检查和更新权限配置
- 监控认证成功率和错误情况
- 提供清晰的用户指导

## 🔗 相关资源

- [Expo LocalAuthentication 文档](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- [详细技术文档](./docs/biometric-authentication.md)
- [React Native 生物识别最佳实践](https://reactnative.dev/docs/security)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个生物识别认证解决方案！

## 📄 许可证

MIT License - 详见 LICENSE 文件
