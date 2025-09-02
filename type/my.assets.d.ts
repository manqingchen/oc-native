namespace MyAssets {

  interface IMyAssets {
    userId: string;
    walletAddress: string;
    userWalletAddressList: UserWalletAddressList[];
    assetValue: string;
    assetGap: string;
    yield: string;
    points: string;
    messageList: IMyNoticeList[];
    avatar: string;
    userAssetList: IUserAsset[];
    haveMessage: boolean;
  }
  interface IUserAsset {
    id:         null;
    txHash: string;
    userId:     null;
    productId:  null;
    assetDay:   string;
    asset:      number;
    yield:      null;
    nav:        null;
    createTime: null;
    updateTime: null;
}

  interface IMyNoticeList {
    id:          number;
    userId:      number;
    type:        number;
    productName: string;
    productId:   number;
    orderId:     string;
    orderState:  string;
    orderAmount: number;
    userAddress: string;
    sendTime:    string;
    txTime:      string;
    settleDate:  null;
    createdAt:   Date;
    isRead:      number;
    delFlag:     number;
}

  interface UserWalletAddressList {
    version: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    id: number;
    userId: number;
    walletAddress: string;
    walletType: string;
    chain: string;
  }
  interface IMyAssetsParams extends API.PaginationParams {
    dwm: 'day' | 'week' | 'month';
  }

  interface IMyAssetsListParams extends API.PaginationParams {
    language?: number;
  }
  interface IMyAssetList {
    cursor: string;
    hasMore: boolean;
    assetList: IUserAsset[]
  }

  interface IUserAsset {
    assetType: "Redemption" | "Subscription"
    type: 'subscribe' | 'redeem';
    orderId: string;
    product: IProduct;
    points: number | null;
    totalAmount: number;
    productQuantity: number;
    fundNetValue: number;
    orderTime: number;
    address: null;
    status: string;
    assetStatusList: AssetStatusList[];
    assetYeild: string;
  }

  interface AssetStatusList {
    enState: string;
    cnState: string;
    isProcess: boolean;
  }

  interface Product {
    productId: number;
    productName: string;
    icon: string;
    subtitle: string;
    networkIcon: string;
  }


  interface IMyAssetsResponse extends API.BaseResponse<IMyAssets> { }
  interface IMyAssetListResponse extends API.BaseResponse<IMyAssetList> { }

}
