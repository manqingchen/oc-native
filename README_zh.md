# Privy Expo 启动模板

这是一个在全新 Expo 应用中最小化安装 Privy SDK 的演示项目。我们建议阅读[文档](https://docs.privy.io/guide/expo/dashboard)获取更详细的指南。

## 设置

1. 安装依赖

   ```sh
   yarn
   ```

2. 在你的[控制台](https://dashboard.privy.io/apps?page=settings&setting=clients)中配置应用客户端，并在 `app.json` 中添加你的 Privy 应用 ID 和应用客户端 ID

   ```json
   ...
    "extra": {
      "privyAppId": "<你的应用ID>",
      "privyClientId": "<你的客户端ID>"
    }
   ...
   ```

   如果你使用 Expo Go，请确保在[控制台](https://dashboard.privy.io/apps?page=settings&setting=clients)的应用客户端设置中将 `host.exp.Exponent` 添加到允许的应用标识符中。

3. 在 `app.json` 中配置你的应用程序标识符。这应该与你在应用商店中的应用包标识符匹配。

   ```json
   ...
    "ios": {
      "bundleIdentifier": "com.example.myapp"
    },
    "android": {
      "package": "com.example.myapp"
    }
   ...
   ```

4. 如果你要使用通行密钥（passkeys），请确保为你的应用程序配置了[关联网站](https://docs.privy.io/guide/expo/setup/passkey#_3-update-native-app-settings)。配置完成后，你的 `app.json` 应该按如下方式更新：

   ```json
   ...
   "associatedDomains": ["webcredentials:<你的关联域名>"],
   ...
   "extra": {
      ...
      "passkeyAssociatedDomain": "https://<你的关联域名>"
    },
   ...
   ```

## 运行应用

```sh
# expo go
yarn run start

# ios
yarn run ios

# android
yarn run android
```