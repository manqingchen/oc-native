// import { OrderService } from "@/services/order.service";
// import { useMutation } from "@tanstack/react-query";

// 订单相关类型定义
// interface OrderRequest {
//   productId: number;
//   totalAmount: number;
//   productQuantity: number;
//   fundNetValue: string;
// }

// interface OrderResponse {
//   orderId: string;
//   // 其他可能的返回字段
// }

// interface PayOrderRequest {
//   orderId: string;
//   tx: string;
// }

// interface PayOrderResponse {
//   // 支付订单响应字段
//   status: string;
//   // 其他可能的返回字段
// }

// interface RedeemOrderRequest {
//   productId: number;
//   redeemAmount: number;
//   productQuantity: number;
//   fundNetValue: string;
// }

// 创建订阅订单Hook
// export const useSubscribeOrder = () => {
//   const mutation = useMutation({
//     mutationFn: OrderService.subscribeOrder
//   });

//   return mutation;
// };

// // 创建支付订阅订单Hook
// export const usePaySubscriptionOrder = () => {
//   const mutation = useMutation({
//     mutationFn: OrderService.paySubscriptionOrder
//   });

//   return mutation;
// };

// // 创建赎回订单Hook
// export const useRedeemOrder = () => {
//   const mutation = useMutation({
//     mutationFn: OrderService.redemptionOrder
//   });
//   return mutation;
// };

// // 创建支付赎回订单Hook
// export const usePayRedeemOrder = () => {
//   const mutation = useMutation({
//     mutationFn: OrderService.payRedemptionOrder
//   });

//   return mutation;
// }; 