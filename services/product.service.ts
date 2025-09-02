import { request } from './http-client';

export const ProductService = {
  getList: (params?: Product.ListParams) => {
    return request<Product.ListResponse>({
      method: 'GET',
      url: `/product/v1/list`,
      params,
    })
  }
  ,

  getDetail: (params: Product.DetailParams) => {
    const url = `/product/v1/getProductDetail?productId=${params.id}&dwm=${params.dwm}`
    console.log('url', url)
    return request<Product.DetailResponse>({
      method: 'GET',
      url,
    })
  },

  getUserFundBalance: (params: {
    userAddress: string;
    fundName: string
  }) => {
    const url = `/user/v1/getUserFundBalance?userAddress=${params.userAddress}&fundName=${params.fundName}`
    console.log('getUserFundBalance url', url)
    return request<{
      data
    }>({
      method: 'GET',
      url,
    })
  }
}; 