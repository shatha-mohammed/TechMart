export interface ApiResponse<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T[];
}

export interface BasicStatusResponse {
  status: string;
  message?: string;
}

export interface RemoveCartProductResponse extends BasicStatusResponse {
  numOfCartItems?: number;
}

export interface UpdateCartCountResponse {
  status: string;
  data?: unknown;
}

export interface CreateReviewResponse {
  status: string;
  data?: unknown;
}

export interface ProductReviewsResponse {
  status?: string;
  data?: unknown;
}