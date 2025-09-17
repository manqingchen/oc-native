import { appAxiosInstance, BaseResponse } from './request';

export interface SetPushTokenRequest {
  deviceToken: string;
  deviceName: string;
  language: string; // e.g., 'en' | 'zh'
}

export interface SetPushTokenResponse {
  success: boolean;
}

export const setPushToken = async (
  payload: SetPushTokenRequest
): Promise<BaseResponse<SetPushTokenResponse>> => {
  const response = await appAxiosInstance.request<BaseResponse<SetPushTokenResponse>>({
    url: '/api/user/v1/setPushToken',
    method: 'POST',
    data: payload,
  });
  return response.data;
};

