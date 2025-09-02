declare namespace API {
  // 基础响应类型
  interface BaseResponse<T> {
    code: number;
    message: string;
    data: T;
    success: boolean;
    trace_id: string;
  }

  interface BaseRequest {
    language?: number;
  }

  // 分页参数类型
  interface PaginationParams extends BaseRequest {
    page?: number;
    limit?: number;
    cursor?: number;
  }

  // 分页响应类型
  interface PaginationResponse<T> {
    total: number;
    products: T[];
    page: number;
    limit: number;
  }

}
