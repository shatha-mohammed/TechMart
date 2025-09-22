import { ProductsResponse,SingleProductResponse, BrandsResponse, CategoriesResponse, SingleBrandResponse, SingleCategoryResponse } from "../types/responses";
import { AddToCartResponse,GetUserCartResponse, OrdersResponse, SingleOrderResponse, WishlistResponse, AddToWishlistResponse, RemoveFromWishlistResponse, AuthResponse, ForgotPasswordResponse, ResetPasswordResponse, CreateOrderRequest, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest, LoginRequest, RegisterRequest, VerifyResetCodeRequest, VerifyResetCodeResponse, ResetPasswordWithEmailRequest, ResetPasswordWithEmailResponse } from "../interfaces";







  class ApiServices {
   #baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

   constructor() {
     console.log('API Base URL:', this.#baseUrl);
     if (!this.#baseUrl) {
       console.error('NEXT_PUBLIC_API_BASE_URL is not set!');
     }
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
async removeCartProduct(productId: string): Promise<any> {
  return await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
    headers: this.#getHeaders(),
    method: 'delete'
  }).then(res => res.json());
}
async clearCart(): Promise<any> {
  return await fetch(this.#baseUrl + "api/v1/cart/", {
    headers: this.#getHeaders(),
    method: 'delete'
  }).then(res => res.json());
}
async updateCartProductCount(productId: string, count: number): Promise<any> {
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
  console.log('Login request:', {
    url: this.#baseUrl + "api/v1/auth/signin",
    data: { email, password },
    headers: this.#getPublicHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/auth/signin", {
    body: JSON.stringify({
      email,
      password
    }),
    headers: this.#getPublicHeaders(),
    method: 'post'
  });
  
  console.log('Login response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Login error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
}

async register(userData: RegisterRequest): Promise<AuthResponse> {
  console.log('Register request:', {
    url: this.#baseUrl + "api/v1/auth/signup",
    data: userData,
    headers: this.#getPublicHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/auth/signup", {
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      rePassword: userData.passwordConfirm,
      phone: userData.phone
    }),
    headers: this.#getPublicHeaders(),
    method: 'post'
  });
  
  console.log('Register response status:', response.status);
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const json = await response.json();
      // Common shapes: { message: 'fail', errors: {...} } OR { statusMsg: 'fail', message: '...' }
      const apiMsg = json?.message || json?.statusMsg || json?.error || undefined;
      if (typeof apiMsg === 'string') {
        errorMessage = apiMsg;
      }
      // Try nested errors
      if (!apiMsg && json?.errors) {
        const firstKey = Object.keys(json.errors)[0];
        const first = json.errors[firstKey];
        if (typeof first?.msg === 'string') {
          errorMessage = first.msg;
        }
      }
    } catch (_e) {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    console.error('Register error response:', errorMessage);
    throw new Error(errorMessage);
  }
  
  return await response.json();
}

async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  console.log('Forgot password request:', {
    url: this.#baseUrl + "api/v1/auth/forgotPasswords",
    data,
    headers: this.#getPublicHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/auth/forgotPasswords", {
    body: JSON.stringify(data),
    headers: this.#getPublicHeaders(),
    method: 'post'
  });
  
  console.log('Forgot password response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Forgot password error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
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
  console.log('Verify reset code request:', {
    url: this.#baseUrl + "api/v1/auth/verifyResetCode",
    data,
    headers: this.#getPublicHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/auth/verifyResetCode", {
    body: JSON.stringify(data),
    headers: this.#getPublicHeaders(),
    method: 'post'
  });
  
  console.log('Verify reset code response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Verify reset code error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
}

async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
  console.log('Change password request:', {
    url: this.#baseUrl + "api/v1/users/changeMyPassword",
    data,
    headers: this.#getHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/users/changeMyPassword", {
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      password: data.password,
      rePassword: data.passwordConfirm
    }),
    headers: this.#getHeaders(),
    method: 'put'
  });
  
  console.log('Change password response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Change password error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
}

async resetPasswordWithEmail(data: ResetPasswordWithEmailRequest): Promise<ResetPasswordWithEmailResponse> {
  console.log('Reset password with email request:', {
    url: this.#baseUrl + "api/v1/auth/resetPassword",
    data,
    headers: this.#getPublicHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/auth/resetPassword", {
    body: JSON.stringify(data),
    headers: this.#getPublicHeaders(),
    method: 'put'
  });
  
  console.log('Reset password with email response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Reset password with email error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
}

async updateMe(userData: Partial<{ name: string; email: string; phone: string }>): Promise<AuthResponse> {
  console.log('Update profile request:', {
    url: this.#baseUrl + "api/v1/users/updateMe",
    data: userData,
    headers: this.#getHeaders()
  });
  
  const response = await fetch(this.#baseUrl + "api/v1/users/updateMe", {
    body: JSON.stringify(userData),
    headers: this.#getHeaders(),
    method: 'put'
  });
  
  console.log('Update profile response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update profile error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  return await response.json();
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
async createReview(productId: string, review: { rating: number; comment: string }): Promise<any> {
  return await fetch(this.#baseUrl + "api/v1/products/" + productId + "/reviews", {
    body: JSON.stringify(review),
    headers: this.#getHeaders(),
    method: 'post'
  }).then(res => res.json());
}

async getProductReviews(productId: string): Promise<any> {
  return await fetch(this.#baseUrl + "api/v1/products/" + productId + "/reviews", {
    headers: this.#getHeaders()
  }).then(res => res.json());
}
 }
export const apiServices = new ApiServices();
