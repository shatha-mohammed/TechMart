export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImg?: string;
  role: 'user' | 'admin';
  active: boolean;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface ResetPasswordResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface VerifyResetCodeResponse {
  status: string;
  message: string;
}

export interface ResetPasswordWithEmailRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordWithEmailResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}
