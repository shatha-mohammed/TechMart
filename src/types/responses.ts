import { Product, Brand, Category, ApiResponse, Order, WishlistItem } from '@/src/interfaces';

export type ProductsResponse = ApiResponse<Product>;
export type BrandsResponse = ApiResponse<Brand>;
export type CategoriesResponse = ApiResponse<Category>;
export type OrdersResponse = ApiResponse<Order>;
export type WishlistResponse = ApiResponse<WishlistItem>;

// Single item responses
export type SingleBrandResponse = {
  data: Brand;
}

export type SingleCategoryResponse = {
  data: Category;
}

export type SingleProductResponse = {
  data: Product;
}

export type SingleOrderResponse = {
  data: Order;
}