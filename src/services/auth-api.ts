/**
 * Comprehensive Authentication API Implementation
 * Based on standard ecommerce API patterns
 */

import { 
  AuthResponse, 
  ForgotPasswordRequest, 
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordWithEmailRequest,
  ResetPasswordWithEmailResponse,
  RegisterRequest,
  LoginRequest
} from '../interfaces';

class AuthApiService {
  #baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!;

  constructor() {
    console.log('Auth API Base URL:', this.#baseUrl);
    if (!this.#baseUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not set!');
    }
  }

  #getPublicHeaders() {
    return {
      "Content-Type": "application/json"
    };
  }

  #getAuthHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  }

  // ============================================================================
  // 1. USER REGISTRATION
  // ============================================================================
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('🔐 Register request:', {
      url: this.#baseUrl + "api/v1/auth/signup",
      data: userData
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/signup", {
      method: 'POST',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify(userData)
    });

    console.log('Register response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Register error:', errorText);
      throw new Error(`Registration failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 2. USER LOGIN
  // ============================================================================
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('🔑 Login request:', {
      url: this.#baseUrl + "api/v1/auth/signin",
      data: { email, password }
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/signin", {
      method: 'POST',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify({ email, password })
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error:', errorText);
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 3. FORGOT PASSWORD
  // ============================================================================
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    console.log('📧 Forgot password request:', {
      url: this.#baseUrl + "api/v1/auth/forgotPassword",
      data
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/forgotPassword", {
      method: 'POST',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify(data)
    });

    console.log('Forgot password response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Forgot password error:', errorText);
      throw new Error(`Forgot password failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 4. VERIFY RESET CODE
  // ============================================================================
  async verifyResetCode(data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> {
    console.log('🔍 Verify reset code request:', {
      url: this.#baseUrl + "api/v1/auth/verifyResetCode",
      data
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/verifyResetCode", {
      method: 'POST',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify(data)
    });

    console.log('Verify reset code response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Verify reset code error:', errorText);
      throw new Error(`Verify reset code failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 5. RESET PASSWORD WITH TOKEN
  // ============================================================================
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    console.log('🔄 Reset password request:', {
      url: this.#baseUrl + "api/v1/auth/resetPassword/" + data.token,
      data
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/resetPassword/" + data.token, {
      method: 'PATCH',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify({
        password: data.password,
        passwordConfirm: data.passwordConfirm
      })
    });

    console.log('Reset password response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reset password error:', errorText);
      throw new Error(`Reset password failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 6. RESET PASSWORD WITH EMAIL
  // ============================================================================
  async resetPasswordWithEmail(data: ResetPasswordWithEmailRequest): Promise<ResetPasswordWithEmailResponse> {
    console.log('📧 Reset password with email request:', {
      url: this.#baseUrl + "api/v1/auth/resetPassword",
      data
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/resetPassword", {
      method: 'PUT',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify(data)
    });

    console.log('Reset password with email response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reset password with email error:', errorText);
      throw new Error(`Reset password with email failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 7. CHANGE PASSWORD (Authenticated)
  // ============================================================================
  async changePassword(data: ChangePasswordRequest, token: string): Promise<AuthResponse> {
    console.log('🔐 Change password request:', {
      url: this.#baseUrl + "api/v1/users/changeMyPassword",
      data
    });

    const response = await fetch(this.#baseUrl + "api/v1/users/changeMyPassword", {
      method: 'PUT',
      headers: this.#getAuthHeaders(token),
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        password: data.password,
        rePassword: data.passwordConfirm
      })
    });

    console.log('Change password response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Change password error:', errorText);
      throw new Error(`Change password failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 8. UPDATE USER PROFILE (Authenticated)
  // ============================================================================
  async updateProfile(userData: Partial<{ name: string; email: string; phone: string }>, token: string): Promise<AuthResponse> {
    console.log('👤 Update profile request:', {
      url: this.#baseUrl + "api/v1/users/updateMe",
      data: userData
    });

    const response = await fetch(this.#baseUrl + "api/v1/users/updateMe", {
      method: 'PUT',
      headers: this.#getAuthHeaders(token),
      body: JSON.stringify(userData)
    });

    console.log('Update profile response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update profile error:', errorText);
      throw new Error(`Update profile failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 9. GET USER PROFILE (Authenticated)
  // ============================================================================
  async getProfile(token: string): Promise<AuthResponse> {
    console.log('👤 Get profile request:', {
      url: this.#baseUrl + "api/v1/users/me"
    });

    const response = await fetch(this.#baseUrl + "api/v1/users/me", {
      method: 'GET',
      headers: this.#getAuthHeaders(token)
    });

    console.log('Get profile response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get profile error:', errorText);
      throw new Error(`Get profile failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 10. DELETE USER ACCOUNT (Authenticated)
  // ============================================================================
  async deleteAccount(token: string): Promise<{ status: string; message: string }> {
    console.log('🗑️ Delete account request:', {
      url: this.#baseUrl + "api/v1/users/deleteMe"
    });

    const response = await fetch(this.#baseUrl + "api/v1/users/deleteMe", {
      method: 'DELETE',
      headers: this.#getAuthHeaders(token)
    });

    console.log('Delete account response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete account error:', errorText);
      throw new Error(`Delete account failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================================================
  // 11. LOGOUT (Clear local storage)
  // ============================================================================
  async logout(): Promise<void> {
    console.log('🚪 Logout request');
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    console.log('✅ Logout successful');
  }

  // ============================================================================
  // 12. REFRESH TOKEN
  // ============================================================================
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    console.log('🔄 Refresh token request:', {
      url: this.#baseUrl + "api/v1/auth/refresh-token"
    });

    const response = await fetch(this.#baseUrl + "api/v1/auth/refresh-token", {
      method: 'POST',
      headers: this.#getPublicHeaders(),
      body: JSON.stringify({ refreshToken })
    });

    console.log('Refresh token response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refresh token error:', errorText);
      throw new Error(`Refresh token failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }
}

export const authApiService = new AuthApiService();
export default authApiService;
