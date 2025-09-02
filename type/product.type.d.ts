// 产品相关类型
namespace Product {
  // 产品基础信息接口
  interface Base {
    productId: number;
    relevanceId: string;
    icon: string;
    badge: string;
    language: number;
    productName: string;
    subtitle: string;
    network: string;
    redeemMinNum: number;
    supplierId: number;
    pointsConfig: string;
    briefContent: string;
    apy: string;
    nav: number;
    tvl: number;
    issuer: string;
    assetType: string;
    aum: number;
    minSubscribeAmount: number;
    effectiveTime: string;
    deadlineTime: Date;
    uai: string;
    showNavChart: boolean;
    status: string;
    delFlag: string;
    createTime: Date;
    updateTime: Date;
  }

  // 财务相关信息接口
  interface Financial {
    subscribeFeesPlatform: number;
    subscribeFeesPartner: number;
    subscribeFixedFees: number;
    subscribeMinFees: number;
    redeemFeesPlatform: number;
    redeemFeesPartner: number;
    redeemFixedFees: number;
    redeemMinFees: number;
    custodyFees: number;
  }

  // 产品完整信息（包含关联数据）
  interface ProductList extends Base, Financial {
    productId: number;
    relevanceId: string;
    icon: string;
    badge: string;
    language: number;
    productName: string;
    subtitle: string;
    network: string;
    redeemMinNum: number;
    supplierId: number;
    pointsConfig: string;
    briefContent: string;
    apy: string;
    nav: number;
    tvl: number;
    issuer: string;
    assetType: string;
    aum: number;
    minSubscribeAmount: number;
    effectiveTime: string;
    deadlineTime: Date;
    uai: string;
    showNavChart: boolean;
    subscribeFeesPlatform: number;
    subscribeFeesPartner: number;
    subscribeFixedFees: number;
    subscribeMinFees: number;
    redeemFeesPlatform: number;
    redeemFeesPartner: number;
    redeemFixedFees: number;
    redeemMinFees: number;
    custodyFees: number;
    assetSlice: string;
    status: string;
    delFlag: string;
    detailContent: string;
    publisherContent: string;
    protocolContent: string;
    createTime: Date;
    updateTime: Date;
    productNoticeList: ProductNoticeList[];
    productCommentList: ProductCommentList[];
    productDetailList: IProductDetailList[];
    navList: NavList[];
    logo: string;
  }

  interface NavList {
    productId: number;
    productToken: string;
    navDay: Date;
    nav: number;
  }

  interface ProductCommentList {
    productId: number;
    profilePicture: string;
    nickname: string;
    comment: string;
    createTime: Date;
    updateTime: Date;
  }

  interface ProductNoticeList {
    noticeId: number;
    productId: number;
    noticeName: string;
    noticeContent: string;
    createTime: Date;
    updateTime: Date;
  }

  // 产品列表项
  interface ListItem extends Base, Financial { }

  // API 请求参数类型
  interface ListParams extends API.BaseRequest {
    limit?: number;
    cursor?: number;
    language?: number;
  }

  // API 响应类型
  interface ListResponseData {
    hasMore: boolean;
    productList: ProductList[];
  }

  interface ListResponse extends API.BaseResponse<ListResponseData> { }

  interface Detail {
    productId: number;
    relevanceId: string;
    icon: string;
    redeemMinNum: number;
    badge: string;
    fixed: number;
    transactionFees: number;
    language: number;
    subscribeIncrement: number;
    redeemIncrement: number
    productName: string;
    subtitle: string;
    network: string;
    supplierId: number;
    pointsConfig: string;
    token: string;
    briefContent: string;
    apy: string;
    redeemFixedFeesPlatform: number;
    redeemMinFeesPlatform: number;
    subscribeFixedFeesPlatform: number;
    subscribeMinFeesPlatform: number;
    nav: number;
    tvl: number;
    issuer: string;
    assetType: string;
    aum: number;
    minSubscribeAmount: number;
    effectiveTime: string;
    deadlineTime: Date;
    uai: string;
    showNavChart: boolean;
    subscribeFeesPlatform: number;
    subscribeFeesPartner: number;
    subscribeFixedFees: number;
    subscribeMinFees: number;
    redeemFeesPlatform: number;
    redeemFeesPartner: number;
    redeemFixedFees: number;
    redeemMinFees: number;
    custodyFees: number;
    assetSlice: string;
    status: string;
    delFlag: string;
    detailContent: string;
    publisherContent: string;
    protocolContent: string;
    createTime: Date;
    updateTime: Date;
    productNoticeList: ProductNoticeList[];
    productCommentList: ProductCommentList[];
    productDetailList: IProductDetailList[];
    navList: NavList[];
  }
  interface IProductDetailList {
    id: number;
    productId: string;
    name: string;
    language: number;
    subtitle: string;
    briefContent: string;
    issuer: string;
    uai: string;
    assetType: string;
    assetSlice: string;
    status: string;
    delFlag: string;
    detailContent: string;
    publisherContent: string;
    protocolContent: string;
  }


  interface NavList {
    productId: number;
    productToken: string;
    navDay: Date;
    nav: number;
  }

  interface ProductCommentList {
    productId: number;
    profilePicture: string;
    nickname: string;
    comment: string;
    createTime: Date;
    updateTime: Date;
  }

  interface ProductNoticeList {
    noticeId: number;
    productId: number;
    noticeName: string;
    noticeContent: string;
    createTime: Date;
    updateTime: Date;
  }
  // API 请求参数类型
  interface DetailParams extends API.PaginationParams { dwm: 'day' | 'week' | 'month', id: string }
  interface DetailResponse extends API.BaseResponse<Detail> { }
}