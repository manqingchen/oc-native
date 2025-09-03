#!/usr/bin/env node

/**
 * Expo推送测试脚本
 * 使用方法: node scripts/test-push.js <push-token> [title] [body]
 */

const https = require('https');

// 默认推送消息
const DEFAULT_TITLE = '测试推送';
const DEFAULT_BODY = '这是一条来自命令行的测试推送消息';

// Expo Push API URL
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * 发送推送通知
 */
async function sendPushNotification(token, title = DEFAULT_TITLE, body = DEFAULT_BODY) {
  return new Promise((resolve, reject) => {
    // 验证令牌格式
    if (!token || !token.startsWith('ExponentPushToken[')) {
      reject(new Error('无效的推送令牌格式。令牌应该以 ExponentPushToken[ 开头'));
      return;
    }

    // 构建推送消息
    const message = {
      to: token,
      title: title,
      body: body,
      data: {
        screen: 'transaction',
        type: 'test_push',
        timestamp: Date.now(),
        source: 'command_line'
      },
      sound: 'default',
      badge: 1,
      priority: 'high'
    };

    // 准备请求数据
    const postData = JSON.stringify(message);
    
    // 解析URL
    const url = new URL(EXPO_PUSH_URL);
    
    // 配置请求选项
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('🚀 正在发送推送通知...');
    console.log('📱 目标令牌:', token.substring(0, 30) + '...');
    console.log('📝 标题:', title);
    console.log('📄 内容:', body);
    console.log('');

    // 发送请求
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 200) {
            if (result.data && result.data.status === 'ok') {
              console.log('✅ 推送发送成功!');
              console.log('📋 票据ID:', result.data.id);
              resolve(result);
            } else {
              console.log('❌ 推送发送失败:');
              console.log('📋 响应:', JSON.stringify(result, null, 2));
              reject(new Error('推送发送失败: ' + JSON.stringify(result)));
            }
          } else {
            console.log('❌ HTTP请求失败:');
            console.log('📋 状态码:', res.statusCode);
            console.log('📋 响应:', data);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          console.log('❌ 响应解析失败:');
          console.log('📋 原始响应:', data);
          reject(new Error('响应解析失败: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 网络请求失败:');
      console.log('📋 错误:', error.message);
      reject(error);
    });

    // 发送请求数据
    req.write(postData);
    req.end();
  });
}

/**
 * 显示使用帮助
 */
function showHelp() {
  console.log('');
  console.log('🔔 Expo推送测试工具');
  console.log('');
  console.log('使用方法:');
  console.log('  node scripts/test-push.js <push-token> [title] [body]');
  console.log('');
  console.log('参数说明:');
  console.log('  push-token  必需，Expo推送令牌 (ExponentPushToken[...])');
  console.log('  title       可选，推送标题 (默认: "测试推送")');
  console.log('  body        可选，推送内容 (默认: "这是一条来自命令行的测试推送消息")');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/test-push.js "ExponentPushToken[abc123...]"');
  console.log('  node scripts/test-push.js "ExponentPushToken[abc123...]" "交易提醒" "申购完成"');
  console.log('');
  console.log('获取推送令牌:');
  console.log('  1. 在手机上打开应用');
  console.log('  2. 进入推送测试页面');
  console.log('  3. 复制显示的推送令牌');
  console.log('');
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  // 检查参数
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  const token = args[0];
  const title = args[1] || DEFAULT_TITLE;
  const body = args[2] || DEFAULT_BODY;

  try {
    await sendPushNotification(token, title, body);
    console.log('');
    console.log('🎉 推送测试完成!');
    console.log('📱 请检查您的设备是否收到推送通知');
    console.log('');
  } catch (error) {
    console.log('');
    console.log('💥 推送测试失败:');
    console.log('📋 错误信息:', error.message);
    console.log('');
    console.log('🔧 故障排除:');
    console.log('  1. 检查推送令牌格式是否正确');
    console.log('  2. 确保设备有网络连接');
    console.log('  3. 确认应用已获得推送权限');
    console.log('  4. 检查设备是否在线');
    console.log('');
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { sendPushNotification };
