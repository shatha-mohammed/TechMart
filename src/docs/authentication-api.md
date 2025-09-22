# Authentication API Documentation

## Overview
This document provides comprehensive documentation for all authentication endpoints implemented in the TechMart ecommerce application.

## Base URL
```
https://ecommerce.routemisr.com/api/v1
```

## Authentication Endpoints

### 1. User Registration
**Endpoint:** `POST /api/v1/auth/signup`
**Description:** Register a new user account
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "phone": "1234567890"
}
```
**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 2. User Login
**Endpoint:** `POST /api/v1/auth/signin`
**Description:** Authenticate user and return JWT token
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 3. Forgot Password
**Endpoint:** `POST /api/v1/auth/forgotPassword`
**Description:** Send password reset email to user
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Reset code sent to email"
}
```

### 4. Verify Reset Code
**Endpoint:** `POST /api/v1/auth/verifyResetCode`
**Description:** Verify the reset code sent to user's email
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "resetCode": "123456"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Reset code verified"
}
```

### 5. Reset Password with Token
**Endpoint:** `PATCH /api/v1/auth/resetPassword/:token`
**Description:** Reset password using token from email
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```
**Response:**
```json
{
  "status": "success",
  "token": "new_jwt_token",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 6. Reset Password with Email
**Endpoint:** `PUT /api/v1/auth/resetPassword`
**Description:** Reset password using email and new password
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "email": "john@example.com",
  "newPassword": "newpassword123"
}
```
**Response:**
```json
{
  "status": "success",
  "token": "new_jwt_token",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

## Authenticated Endpoints

### 7. Change Password
**Endpoint:** `PUT /api/v1/users/changeMyPassword`
**Description:** Change user's password (requires authentication)
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer <token>`
**Body:**
```json
{
  "currentPassword": "oldpassword123",
  "password": "newpassword123",
  "rePassword": "newpassword123"
}
```
**Response:**
```json
{
  "status": "success",
  "token": "new_jwt_token",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 8. Update Profile
**Endpoint:** `PUT /api/v1/users/updateMe`
**Description:** Update user profile information (requires authentication)
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer <token>`
**Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "9876543210"
}
```
**Response:**
```json
{
  "status": "success",
  "token": "jwt_token",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "phone": "9876543210",
      "role": "user"
    }
  }
}
```

### 9. Get User Profile
**Endpoint:** `GET /api/v1/users/me`
**Description:** Get current user's profile (requires authentication)
**Headers:** 
- `Authorization: Bearer <token>`
**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user",
      "active": true,
      "addresses": []
    }
  }
}
```

### 10. Delete Account
**Endpoint:** `DELETE /api/v1/users/deleteMe`
**Description:** Delete user account (requires authentication)
**Headers:** 
- `Authorization: Bearer <token>`
**Response:**
```json
{
  "status": "success",
  "message": "Account deleted successfully"
}
```

## Error Handling

### Common Error Responses
```json
{
  "status": "fail",
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Implementation Notes

### 1. Authentication Flow
1. User registers or logs in
2. Server returns JWT token
3. Client stores token and includes in authenticated requests
4. Token expires after specified time

### 2. Password Requirements
- Minimum 8 characters
- Must contain letters and numbers
- Special characters recommended

### 3. Rate Limiting
- Forgot password: 3 attempts per hour per email
- Login attempts: 5 attempts per 15 minutes per IP

### 4. Security Features
- JWT tokens with expiration
- Password hashing with bcrypt
- Email verification for password reset
- Rate limiting on sensitive endpoints

## Testing

### Test Page
Navigate to `/auth/test-comprehensive` to test all endpoints with a comprehensive UI.

### Manual Testing
Use the provided test forms to verify each endpoint works correctly.

### Error Scenarios
Test with invalid credentials, expired tokens, and malformed requests to ensure proper error handling.

## Usage Examples

### JavaScript/TypeScript
```typescript
import { authApiService } from '@/src/services/auth-api';

// Login
const loginResult = await authApiService.login('user@example.com', 'password');

// Register
const registerResult = await authApiService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
});

// Forgot Password
const forgotResult = await authApiService.forgotPassword({
  email: 'user@example.com'
});

// Change Password (authenticated)
const changeResult = await authApiService.changePassword({
  currentPassword: 'oldpass',
  password: 'newpass',
  passwordConfirm: 'newpass'
}, token);
```

### React Components
```tsx
// Login Form
const [loginForm, setLoginForm] = useState({ email: "", password: "" });

const handleLogin = async () => {
  try {
    const result = await authApiService.login(loginForm.email, loginForm.password);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Troubleshooting

### Common Issues
1. **400 Bad Request**: Check request body format and required fields
2. **401 Unauthorized**: Verify token is valid and not expired
3. **404 Not Found**: Check endpoint URL is correct
4. **500 Internal Server Error**: Server-side issue, check logs

### Debug Tips
1. Enable console logging in API service
2. Check network tab in browser dev tools
3. Verify request headers and body
4. Test with Postman or similar tools

## Security Considerations

1. **Never store passwords in plain text**
2. **Use HTTPS in production**
3. **Implement proper CORS policies**
4. **Validate all input data**
5. **Use secure JWT secrets**
6. **Implement proper session management**
