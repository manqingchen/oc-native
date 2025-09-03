import { isValidObject } from '@/utils/data-helpers';
import { request } from './http-client';

export const MyAssetsService = {
  getMyInfo: (params?: MyAssets.IMyAssetsParams) => {
    return request<MyAssets.IMyAssetsResponse>({
      method: 'GET',
      url: `/user/v1/getMyInfo`,
      params,
    })
  },
  getMyAsset: (params?: MyAssets.IMyAssetsListParams) => {
    const url = `/user/v1/listMyAsset?limit=${params?.limit}&cursor=${params.cursor}&language=${params.language}`
    return request<MyAssets.IMyAssetListResponse>({
      method: 'GET',
      url,
      params,
    })
  },
  getMyTransactionList: (params?: MyAssets.IMyAssetsListParams) => {
    return request<MyAssets.IMyAssetListResponse>({
      method: 'GET',
      url: `/user/v1/myTransactionList`,
      params,
    })
  },
  readNotice: () => {
    return request<boolean>({
      method: 'GET',
      url: `/user/v1/updateMyMessageIsRead`,
    })
  },
  deleteNotice: (id: number) => {
    return request<boolean>({
      method: 'GET',
      url: `/user/v1/deleteMyMessageById`,
      params: {
        id,
      },
    })
  }
}; 



export const useRenderMyAssetList = (myAssetList?: MyAssets.IMyAssetListResponse) => {
  if (!isValidObject(myAssetList?.data)) return [];

  const { assetList } = myAssetList!.data;
  return assetList || [];
}