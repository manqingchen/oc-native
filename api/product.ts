import { createRequest } from "./request";

export const productList = createRequest<
	null, 
	{
		products: Product.Base[]
	}
>(
	'productList',
	() => ({
		url: `/api/product/v1/list`,
		method: 'GET',
		params: {
			limit: 10,
		}
	})
);

export const productDetail = createRequest<
	{ id: string },
	Product.Detail
>(
	'productDetail',
	(params) => ({
		url: `/api/product/v1/detail`,
		method: 'GET',
		params
	})
);
