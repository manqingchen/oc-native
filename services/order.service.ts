import { request } from './http-client';

export const OrderService = {
  subscribeOrder: (data: any) => {
    return request<Order.ISubscribeOrderResponse>({
      method: 'POST',
      url: `/order/v1/subscribe`,
      data,
    })
  }
  ,

  paySubscriptionOrder: (data: any) => {
    return request<Order.ISubscribeOrderResponse>({
      method: 'POST',
      url: `/order/v1/paySubscriptionOrder`,
      data
    })
  }
  ,

  redemptionOrder: (data: any) => {
    return request<Order.ISubscribeOrderResponse>({
      method: 'POST',
      url: `/order/v1/redemption`,
      data
    })
  },
  
  payRedemptionOrder: (data: any) => {
    return request<Order.ISubscribeOrderResponse>({
      method: 'POST',
      url: `/order/v1/payRedemptionOrder`,
      data
    })
  }
}; 