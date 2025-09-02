
// api/wallet.ts
import { PublicKey } from "@solana/web3.js";
import { appAxiosInstance, BaseResponse } from "./request";

// 定义请求和响应类型
interface WalletConnectRequest {
  signature: string;
  walletAddress: PublicKey;
  message: string;
}

interface WalletConnectResponse {
  token: string;
  userId: string;
  // 其他可能的返回字段
}

// 创建钱包连接请求函数
export const connectWallet = async (data: WalletConnectRequest): Promise<BaseResponse<WalletConnectResponse>> => {
  const response = await appAxiosInstance.request<BaseResponse<WalletConnectResponse>>({
    url: '/api/wallet/v1/connect',
    method: 'POST',
    data
  });

  console.log('response ===================>>>>>>>>>>> ', response);
  
  return response.data;
};
