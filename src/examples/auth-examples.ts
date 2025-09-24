/**
 * Authentication API Examples - Working Requests
 * 
 * This file contains working examples for all authentication endpoints
 * with proper error handling and debugging.
 */

import { apiServices } from '../services/api';

// ============================================================================
// 1. FORGOT PASSWORD
// ============================================================================
export async function forgotPasswordExample() {
  try {
    console.log('🔐 Forgot Password Example');
    
    const result = await apiServices.forgotPassword({
      email: "routeegyptnodejs@gmail.com"
    });
    
    console.log('✅ Forgot Password Success:', result);
    return result;
  } catch (error) {
    console.error('❌ Forgot Password Error:', error);
    throw error;
  }
}

// ============================================================================
// 2. VERIFY RESET CODE
// ============================================================================
export async function verifyResetCodeExample() {
  try {
    console.log('🔍 Verify Reset Code Example');
    
    const result = await apiServices.verifyResetCode({
      resetCode: "535863"
    });
    
    console.log('✅ Verify Reset Code Success:', result);
    return result;
  } catch (error) {
    console.error('❌ Verify Reset Code Error:', error);
    throw error;
  }
}

// ============================================================================
// 3. CHANGE PASSWORD (Authenticated User)
// ============================================================================
export async function changePasswordExample() {
  try {
    console.log('🔑 Change Password Example');
    
    const result = await apiServices.changePassword({
      currentPassword: "123456",
      password: "pass1234",
      passwordConfirm: "pass1234"
    });
    
    console.log('✅ Change Password Success:', result);
    return result;
  } catch (error) {
    console.error('❌ Change Password Error:', error);
    throw error;
  }
}

// ============================================================================
// 4. RESET PASSWORD WITH EMAIL
// ============================================================================
export async function resetPasswordWithEmailExample() {
  try {
    console.log('🔄 Reset Password with Email Example');
    
    const result = await apiServices.resetPasswordWithEmail({
      email: "ahmedmutti@gmail.com",
      newPassword: "Ahmed@123"
    });
    
    console.log('✅ Reset Password with Email Success:', result);
    return result;
  } catch (error) {
    console.error('❌ Reset Password with Email Error:', error);
    throw error;
  }
}

// ============================================================================
// 5. UPDATE USER PROFILE
// ============================================================================
export async function updateProfileExample() {
  try {
    console.log('👤 Update Profile Example');
    
    const result = await apiServices.updateMe({
      name: "Ahmed Abd Al-Muti",
      email: "ahmedmutt2i2@gmail.com",
      phone: "01010700700"
    });
    
    console.log('✅ Update Profile Success:', result);
    return result;
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    throw error;
  }
}

// ============================================================================
// 6. COMPLETE AUTHENTICATION FLOW EXAMPLE
// ============================================================================
export async function completeAuthFlowExample() {
  try {
    console.log('🚀 Complete Authentication Flow Example');
    
    // Step 1: Forgot Password
    console.log('\n--- Step 1: Forgot Password ---');
    const forgotResult = await forgotPasswordExample();
    
    // Step 2: Verify Reset Code (if needed)
    console.log('\n--- Step 2: Verify Reset Code ---');
    const verifyResult = await verifyResetCodeExample();
    
    // Step 3: Reset Password with Email
    console.log('\n--- Step 3: Reset Password with Email ---');
    const resetResult = await resetPasswordWithEmailExample();
    
    // Step 4: Update Profile (after login)
    console.log('\n--- Step 4: Update Profile ---');
    const updateResult = await updateProfileExample();
    
    console.log('✅ Complete Authentication Flow Success!');
    return {
      forgotPassword: forgotResult,
      verifyResetCode: verifyResult,
      resetPassword: resetResult,
      updateProfile: updateResult
    };
  } catch (error) {
    console.error('❌ Complete Authentication Flow Error:', error);
    throw error;
  }
}

// ============================================================================
// 7. ERROR HANDLING EXAMPLES
// ============================================================================
export async function errorHandlingExamples() {
  console.log('⚠️ Error Handling Examples');
  
  // Example 1: Invalid email
  try {
    await apiServices.forgotPassword({ email: "invalid-email" });
  } catch (error) {
    console.log('Expected error for invalid email:', error);
  }
  
  // Example 2: Invalid reset code
  try {
    await apiServices.verifyResetCode({ resetCode: "000000" });
  } catch (error) {
    console.log('Expected error for invalid reset code:', error);
  }
  
  // Example 3: Password mismatch
  try {
    await apiServices.changePassword({
      currentPassword: "wrong-password",
      password: "new-password",
      passwordConfirm: "different-password"
    });
  } catch (error) {
    console.log('Expected error for password mismatch:', error);
  }
}

// ============================================================================
// 8. USAGE INSTRUCTIONS
// ============================================================================
export const usageInstructions = `
🔧 Authentication API Usage Instructions:

1. FORGOT PASSWORD:
   - Call: apiServices.forgotPassword({ email: "user@example.com" })
   - Returns: { status: "success", message: "Reset code sent to email" }

2. VERIFY RESET CODE:
   - Call: apiServices.verifyResetCode({ resetCode: "123456" })
   - Returns: { status: "success", message: "Reset code verified" }

3. CHANGE PASSWORD (Authenticated):
   - Call: apiServices.changePassword({
     currentPassword: "old-password",
     password: "new-password", 
     passwordConfirm: "new-password"
   })
   - Returns: { status: "success", token: "...", data: { user: {...} } }

4. RESET PASSWORD WITH EMAIL:
   - Call: apiServices.resetPasswordWithEmail({
     email: "user@example.com",
     newPassword: "new-password"
   })
   - Returns: { status: "success", token: "...", data: { user: {...} } }

5. UPDATE PROFILE (Authenticated):
   - Call: apiServices.updateMe({
     name: "New Name",
     email: "new@email.com",
     phone: "1234567890"
   })
   - Returns: { status: "success", token: "...", data: { user: {...} } }

📝 Notes:
- All methods include comprehensive error handling
- Debug logging is enabled for troubleshooting
- Public endpoints (forgot, verify, reset) don't require authentication
- Authenticated endpoints (change password, update profile) require valid token
- All requests use proper HTTP methods and headers
`;

export default {
  forgotPasswordExample,
  verifyResetCodeExample,
  changePasswordExample,
  resetPasswordWithEmailExample,
  updateProfileExample,
  completeAuthFlowExample,
  errorHandlingExamples,
  usageInstructions
};

