import { ProductsResponse,SingleProductResponse, BrandsResponse, CategoriesResponse, SingleBrandResponse, SingleCategoryResponse } from "../types/responses";
import { AddToCartResponse,GetUserCartResponse, OrdersResponse, SingleOrderResponse, WishlistResponse, AddToWishlistResponse, RemoveFromWishlistResponse, AuthResponse, ForgotPasswordResponse, ResetPasswordResponse, CreateOrderRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, LoginRequest, RegisterRequest, VerifyResetCodeRequest, VerifyResetCodeResponse, ResetPasswordWithEmailRequest, ResetPasswordWithEmailResponse } from "../interfaces";
import { RemoveCartProductResponse, BasicStatusResponse, UpdateCartCountResponse, CreateReviewResponse, ProductReviewsResponse } from "../interfaces";






  class ApiServices {
   #baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

   constructor() {
     console.log('API Base URL:', this.#baseUrl);
     if (!this.#baseUrl) {
       console.error('NEXT_PUBLIC_API_BASE_URL is not set!');
     }
   }

   // Centralized typed fetch with error handling
   async #fetchJson<T>(url: string, init: RequestInit, errorContext: string): Promise<T> {
     const response = await fetch(url, init);

     let parsed: unknown = undefined;
     try {
       parsed = await response.json();
     } catch {
       // ignore JSON parse error; may read text below
     }

     if (!response.ok) {
       let message = errorContext;
       if (parsed && typeof parsed === 'object') {
         const obj = parsed as Record<string, unknown> & { errors?: Record<string, { msg?: string }> };
         message = (typeof obj.message === 'string' && obj.message)
           || (typeof obj.statusMsg === 'string' && obj.statusMsg)
           || (typeof obj.error === 'string' && obj.error)
           || message;
         if (message === errorContext && obj.errors) {
           const firstKey = Object.keys(obj.errors)[0];
           if (firstKey && typeof obj.errors[firstKey]?.msg === 'string') {
             message = obj.errors[firstKey]!.msg as string;
           }
         }
       } else {
         try {
           const txt = await response.text();
           if (txt) message = txt;
         } catch {
           // ignore
         }
       }
       throw new Error(message);
     }

     return parsed as T;
   }
 


  async getAllProducts(): Promise<ProductsResponse> {
    try {
      console.log('Fetching products from:', this.#baseUrl + "api/v1/products");
      const response = await fetch(
        this.#baseUrl + "api/v1/products" ,{
          next:{
            revalidate:5,
            },
            cache:"no-cache"
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products API raw response:', data);
      return data;
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  }
  async getProductDetails(productId: string): Promise<SingleProductResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/products/" + productId
    ).then((res) => res.json());
  }

  async getAllBrands(): Promise<BrandsResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/brands", {
        next:{
          revalidate:5,
          },
          cache:"no-cache"
      }
    ).then((res) => res.json());
  }

  async getBrandDetails(brandId: string): Promise<SingleBrandResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/brands/" + brandId
    ).then((res) => res.json());
  }

  async getAllCategories(): Promise<CategoriesResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/categories", {
        next:{
          revalidate:5,
          },
          cache:"no-cache"
      }
    ).then((res) => res.json());
  }

  async getCategoryDetails(categoryId: string): Promise<SingleCategoryResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/categories/" + categoryId
    ).then((res) => res.json());
  }

  async getProductsByBrand(brandId: string): Promise<ProductsResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/products?brand=" + brandId, {
        next:{
          revalidate:5,
          },
          cache:"no-cache"
      }
    ).then((res) => res.json());
  }

  async getProductsByCategory(categoryId: string): Promise<ProductsResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/products?category=" + categoryId, {
        next:{
          revalidate:5,
          },
          cache:"no-cache"
      }
    ).then((res) => res.json());
  }


#getHeaders(){
  return{
    "Content-Type": "application/json",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Yjk2ODg4Y2E0NWFiOWY5MWE3ZDJmZSIsIm5hbWUiOiJZb3Vzc2VmIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTY5ODEzODUsImV4cCI6MTc2NDc1NzM4NX0.m3RhVsYzIef3CDuUo04J3VdXmbHnWl67ai1pXpmh9mI"
  } 
}

#getPublicHeaders(){
  return{
    "Content-Type": "application/json"
  } 
}

  
 async addProductToCart(productId: string): Promise<AddToCartResponse> {
  return await fetch(this.#baseUrl + "api/v1/cart", {
    method: 'post',
    body: JSON.stringify({
      productId
    }),
    headers: this.#getHeaders()
  }).then(res => res.json())
}
async getUserToCart(): Promise<GetUserCartResponse> {
  return await fetch(this.#baseUrl + "api/v1/cart", {
    headers: this.#getHeaders()
  }).then(res => res.json())
}
async removeCartProduct(productId: string): Promise<RemoveCartProductResponse> {
  return await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
    headers: this.#getHeaders(),
    method: 'delete'
  }).then(res => res.json());
}
async clearCart(): Promise<BasicStatusResponse> {
  return await fetch(this.#baseUrl + "api/v1/cart/", {
    headers: this.#getHeaders(),
    method: 'delete'
  }).then(res => res.json());
}
async updateCartProductCount(productId: string, count: number): Promise<UpdateCartCountResponse> {
  return await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
    method: 'put',
    body: JSON.stringify({ count }),
    headers: this.#getHeaders(),
  }).then(res => res.json());
}
async checkout(cartId: string) {
  return await fetch(
    this.#baseUrl + "api/v1/orders/checkout-session/" + cartId + "?url=http://localhost:3000",
    {
      method: "post",
      body: JSON.stringify({
        "shippingAddress": {
          "details": "details",
          "phone": "01010700999",
          "city": "Cairo"
        }
      }),
      headers: this.#getHeaders()
    }
  ).then(res => res.json());
}
async login(email: string, password: string): Promise<AuthResponse> {
  return await this.#fetchJson<AuthResponse>(
    this.#baseUrl + "api/v1/auth/signin",
    {
      body: JSON.stringify({ email, password }),
      headers: this.#getPublicHeaders(),
      method: 'post'
    },
    'Login failed'
  );
}




async register(userData: RegisterRequest): Promise<AuthResponse> {
  return await this.#fetchJson<AuthResponse>(
    this.#baseUrl + "api/v1/auth/signup",
    {
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        rePassword: userData.passwordConfirm,
        phone: userData.phone
      }),
      headers: this.#getPublicHeaders(),
      method: 'post'
    },
    'Registration failed'
  );
}

async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  return await this.#fetchJson<ForgotPasswordResponse>(
    this.#baseUrl + "api/v1/auth/forgotPasswords",
    {
      body: JSON.stringify(data),
      headers: this.#getPublicHeaders(),
      method: 'post'
    },
    'Forgot password failed'
  );
}

async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  return await fetch(this.#baseUrl + "api/v1/auth/resetPassword/" + data.token, {
    body: JSON.stringify({
      password: data.password,
      passwordConfirm: data.passwordConfirm
    }),
    headers: this.#getPublicHeaders(),
    method: 'patch'
  }).then(res => res.json());
}

async verifyResetCode(data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> {
  return await this.#fetchJson<VerifyResetCodeResponse>(
    this.#baseUrl + "api/v1/auth/verifyResetCode",
    {
      body: JSON.stringify(data),
      headers: this.#getPublicHeaders(),
      method: 'post'
    },
    'Verify reset code failed'
  );
}

async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
  return await this.#fetchJson<AuthResponse>(
    this.#baseUrl + "api/v1/users/changeMyPassword",
    {
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        password: data.password,
        rePassword: data.passwordConfirm
      }),
      headers: this.#getHeaders(),
      method: 'put'
    },
    'Change password failed'
  );
}

async resetPasswordWithEmail(data: ResetPasswordWithEmailRequest): Promise<ResetPasswordWithEmailResponse> {
  return await this.#fetchJson<ResetPasswordWithEmailResponse>(
    this.#baseUrl + "api/v1/auth/resetPassword",
    {
      body: JSON.stringify(data),
      headers: this.#getPublicHeaders(),
      method: 'put'
    },
    'Reset password failed'
  );
}

async updateMe(userData: Partial<{ name: string; email: string; phone: string }>): Promise<AuthResponse> {
  return await this.#fetchJson<AuthResponse>(
    this.#baseUrl + "api/v1/users/updateMe",
    {
      body: JSON.stringify(userData),
      headers: this.#getHeaders(),
      method: 'put'
    },
    'Update profile failed'
  );
}

async deleteMe(): Promise<{ status: string; message: string }> {
  return await fetch(this.#baseUrl + "api/v1/users/deleteMe", {
    headers: this.#getHeaders(),
    method: 'delete'
  }).then(res => res.json());
}

// Orders API
async createOrder(orderData: CreateOrderRequest): Promise<SingleOrderResponse> {
  return await fetch(this.#baseUrl + "api/v1/orders", {
    body: JSON.stringify(orderData),
    headers: this.#getHeaders(),
    method: 'post'
  }).then(res => res.json());
}

async getAllOrders(): Promise<OrdersResponse> {
  return await fetch(this.#baseUrl + "api/v1/orders", {
    headers: this.#getHeaders()
  }).then(res => res.json());
}

async getOrder(orderId: string): Promise<SingleOrderResponse> {
  return await fetch(this.#baseUrl + "api/v1/orders/" + orderId, {
    headers: this.#getHeaders()
  }).then(res => res.json());
}

// Wishlist API
async getWishlist(): Promise<WishlistResponse> {
  return await fetch(this.#baseUrl + "api/v1/wishlist", {
    headers: this.#getHeaders()
  }).then(res => res.json());
}

async addToWishlist(productId: string): Promise<AddToWishlistResponse> {
  return await fetch(this.#baseUrl + "api/v1/wishlist", {
    body: JSON.stringify({ productId }),
    headers: this.#getHeaders(),
    method: 'post'
  }).then(res => res.json());
}

async removeFromWishlist(productId: string): Promise<RemoveFromWishlistResponse> {
  return await fetch(this.#baseUrl + "api/v1/wishlist/" + productId, {
    headers: this.#getHeaders(),
    method: 'delete'
  }).then(res => res.json());
}

// Reviews API
async createReview(productId: string, review: { rating: number; comment: string }): Promise<CreateReviewResponse> {
  return await fetch(this.#baseUrl + "api/v1/products/" + productId + "/reviews", {
    body: JSON.stringify(review),
    headers: this.#getHeaders(),
    method: 'post'
  }).then(res => res.json());
}

async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
  return await fetch(this.#baseUrl + "api/v1/products/" + productId + "/reviews", {
    headers: this.#getHeaders()
  }).then(res => res.json());
}
 } 
export const apiServices = new ApiServices();
