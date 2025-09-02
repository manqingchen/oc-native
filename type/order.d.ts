namespace Order {
  interface ISubscribeOrder {
    orderId: string;
    product: Product;
    points: null;
    totalAmount: number;
    productQuantity: number;
    fundNetValue: number;
    orderTime: null;
    address: null;
    status: null;
    assetStatusList: null;
  }

  interface Product {
    productId: number;
    detailContent: string;
    network: string;
    networkIcon: string;
  }


  interface IRedemptionOrder {
    orderId: string;
    product: Product;
    points: null;
    totalAmount: number;
    productQuantity: number;
    fundNetValue: number;
    orderTime: null;
  }
  interface ISubscribeOrderResponse extends API.BaseResponse<ISubscribeOrder> { }
  interface IRedemptionOrderResponse extends API.BaseResponse<IRedemptionOrder> { }

}