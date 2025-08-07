# OC-Native - Solana 移动 dApp 项目

## 项目概述
基于 Expo + React Native 的 Solana 移动 dApp，支持多钱包连接和管理。

## 项目初始化命令
```bash
npm install --global eas-cli && npx create-expo-app oc-native && cd oc-native && eas init --id 0323bcf8-6095-4119-8121-01092f2d126f
```

## 技术栈
- **框架**: Expo + React Native
- **包管理器**: pnpm
- **区块链**: Solana
- **状态管理**: Zustand
- **目标平台**: iOS + Android（无需 Web 版本）

## 核心功能需求
### 1. 钱包连接和管理
- 支持 Phantom 钱包连接
- 支持 MetaMask 钱包连接
- 支持 OKX 钱包连接
- 钱包状态管理和持久化

### 2. 数据请求功能
- 使用 Axios 进行 HTTP 请求
- 统一的请求拦截器和响应处理
- 请求重试和错误处理机制
- API 接口类型安全

### 3. 国际化功能
- 支持中英文双语切换
- 自动检测设备语言设置
- 动态语言包加载
- 数字、日期、货币格式化

### 4. 图表功能
- 基于 ECharts 的数据可视化
- 支持多种图表类型（折线图、柱状图、饼图等）
- 响应式图表设计
- 实时数据更新和动画效果

### 5. UI 设计系统
- **Gluestack UI**: 现代化的 React Native UI 组件库
- **主题定制**: 支持深色/浅色模式切换
- **响应式设计**: 适配不同屏幕尺寸
- **无障碍支持**: 内置可访问性功能
- **TypeScript 支持**: 完整的类型定义

### 6. 存储架构
- **MMKV**: 高性能本地存储，用于用户设置、应用配置
- **Expo SecureStore**: 敏感数据加密存储（私钥、密码）
- **React Query**: API 数据缓存和状态管理
- **Zustand + MMKV**: 状态持久化，性能优于 AsyncStorage

### 6. 开发规范
- **严禁硬编码**: 所有配置项必须通过环境变量或配置文件管理
- 使用 TypeScript 确保类型安全
- 统一的错误处理机制
- 代码规范和格式化工具

## 技术实现规划

### 依赖包清单
```json
{
  "solana": [
    "@solana/web3.js",
    "@solana/wallet-adapter-base",
    "@solana/wallet-adapter-react",
    "@solana-mobile/wallet-adapter-mobile"
  ],
  "钱包集成": [
    "@solana/wallet-adapter-phantom",
    "@solana/wallet-adapter-walletconnect",
    "react-native-url-polyfill"
  ],
  "状态管理": [
    "zustand",
    "react-native-mmkv",
    "expo-secure-store"
  ],
  "数据请求": [
    "axios",
    "react-query"
  ],
  "国际化": [
    "react-i18next",
    "i18next",
    "react-native-localize"
  ],
  "UI组件库": [
    "react-native-svg",
    "react-native-safe-area-context",
    "nativewind"
  ],
  "图表组件": [
    "react-native-echarts-wrapper",
    "react-native-webview",
    "react-native-svg"
  ],
  "开发工具": [
    "typescript",
    "@types/react",
    "@types/react-native",
    "eslint",
    "prettier"
  ]
}
```

### 项目结构规划
```
src/
├── components/          # 可复用组件
│   ├── wallet/         # 钱包相关组件
│   ├── charts/         # 图表组件
│   └── common/         # 通用组件
├── screens/            # 页面组件
├── stores/             # Zustand 状态管理
│   ├── walletStore.ts  # 钱包状态
│   ├── chartStore.ts   # 图表数据状态
│   └── appStore.ts     # 应用全局状态
├── services/           # 业务逻辑服务
│   ├── walletService.ts # 钱包服务
│   ├── solanaService.ts # Solana 交互服务
│   └── apiService.ts   # API 请求服务
├── api/                # API 接口定义
│   ├── endpoints.ts    # API 端点配置
│   └── types.ts        # API 数据类型
├── locales/            # 国际化文件
│   ├── en.json         # 英文语言包
│   ├── zh.json         # 中文语言包
│   └── index.ts        # 国际化配置
├── styles/             # 样式配置
│   ├── index.ts        # 样式入口文件
│   ├── colors.ts       # 颜色配置
│   └── typography.ts   # 字体配置
├── config/             # 配置文件
│   ├── env.ts          # 环境变量管理
│   ├── constants.ts    # 常量定义
│   ├── axios.ts        # Axios 配置
│   ├── i18n.ts         # 国际化配置
│   ├── storage.ts      # 存储配置
│   └── security.ts     # 安全存储配置
├── types/              # TypeScript 类型定义
│   ├── wallet.ts       # 钱包相关类型
│   ├── chart.ts        # 图表相关类型
│   └── common.ts       # 通用类型
└── utils/              # 工具函数
    ├── formatters.ts   # 数据格式化工具
    ├── validators.ts   # 数据验证工具
    ├── storage.ts      # 存储工具函数
    └── encryption.ts   # 加密工具函数
```

### 环境变量配置
```bash
# .env 文件示例
# Solana 配置
SOLANA_RPC_URL=https://api.devnet.solana.com
WALLET_CONNECT_PROJECT_ID=bd4997ce3ede37c95770ba10a3804dad

# 应用基础信息
APP_NAME=OC-Native
APP_VERSION=1.0.0

# API 配置
API_BASE_URL=https://api.example.com
API_TIMEOUT=10000
API_RETRY_COUNT=3

# 国际化配置
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,zh

# 图表配置
CHART_THEME=default
CHART_ANIMATION_DURATION=1000

# 存储配置
MMKV_ENCRYPTION_KEY=your_encryption_key_here
STORAGE_VERSION=1.0
CACHE_EXPIRY_TIME=86400000

# UI 主题配置
DEFAULT_THEME=light
ENABLE_DARK_MODE=true
ANIMATION_DURATION=300
FONT_SCALE_FACTOR=1.0
```

### 开发阶段规划
1. **基础环境搭建**
   - 项目初始化和 pnpm 配置
   - TypeScript 和开发工具配置
   - 基础项目结构创建
   - MMKV 存储系统配置
   - Axios 和请求拦截器配置

2. **UI 设计系统搭建**
   - Gluestack UI 安装和配置
   - 主题系统设计（浅色/深色模式）
   - 自定义组件库创建
   - 响应式布局配置
   - 字体和颜色系统定义

3. **国际化系统搭建**
   - react-i18next 配置
   - 多语言文件结构创建
   - 语言切换功能实现
   - 设备语言自动检测

4. **Solana 集成**
   - Solana Web3.js 集成
   - 基础连接和配置
   - API 服务层搭建

5. **钱包适配器实现**
   - Phantom 钱包集成
   - MetaMask 钱包集成
   - OKX 钱包集成
   - 钱包状态管理

6. **图表系统开发**
   - ECharts 组件封装
   - 图表数据处理服务
   - 响应式图表配置
   - 图表主题和样式定制

7. **状态管理实现**
   - Zustand store 设计
   - 钱包状态持久化
   - 图表数据状态管理
   - 全局应用状态

8. **UI 界面开发**
   - 基于 Gluestack UI 的页面开发
   - 钱包连接界面设计
   - 钱包管理界面实现
   - 数据图表展示页面
   - 主题切换功能
   - 多语言界面适配

9. **数据集成和优化**
   - API 数据获取和缓存
   - 图表数据实时更新
   - 性能优化和错误处理
   - UI 动画和交互优化

## 参考文档
- **Solana 开发**: https://solana.com/nl/developers/courses/mobile/solana-mobile-dapps-with-expo#react-native-expo
- **Solana Wallet Adapter**: https://github.com/solana-labs/wallet-adapter
- **Expo 文档**: https://docs.expo.dev/
- **Gluestack UI**: https://gluestack.io/ui/docs/home/overview/introduction
- **MMKV 存储**: https://github.com/mrousavy/react-native-mmkv
- **React Query**: https://tanstack.com/query/latest
- **Zustand**: https://github.com/pmndrs/zustand
