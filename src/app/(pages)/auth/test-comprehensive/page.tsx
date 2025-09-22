"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authApiService } from "@/src/services/auth-api";
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ComprehensiveAuthTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    passwordConfirm: "" 
  });
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: "" });
  const [verifyCodeForm, setVerifyCodeForm] = useState({ resetCode: "" });
  const [resetPasswordForm, setResetPasswordForm] = useState({ 
    password: "", 
    passwordConfirm: "" 
  });
  const [changePasswordForm, setChangePasswordForm] = useState({ 
    currentPassword: "", 
    password: "", 
    passwordConfirm: "" 
  });
  const [updateProfileForm, setUpdateProfileForm] = useState({ 
    name: "", 
    email: "", 
    phone: "" 
  });

  const [authToken, setAuthToken] = useState("");

  const testEndpoint = async (name: string, testFunction: () => Promise<any>) => {
    setLoading(name);
    try {
      const result = await testFunction();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
      toast.success(`${name} test passed!`);
    } catch (error: any) {
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }));
      toast.error(`${name} test failed: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLogin = async () => {
    await testEndpoint("Login", async () => {
      const result = await authApiService.login(loginForm.email, loginForm.password);
      if (result.token) {
        setAuthToken(result.token);
      }
      return result;
    });
  };

  const handleRegister = async () => {
    await testEndpoint("Register", async () => {
      return await authApiService.register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        passwordConfirm: registerForm.passwordConfirm
      });
    });
  };

  const handleForgotPassword = async () => {
    await testEndpoint("Forgot Password", async () => {
      return await authApiService.forgotPassword({ email: forgotPasswordForm.email });
    });
  };

  const handleVerifyResetCode = async () => {
    await testEndpoint("Verify Reset Code", async () => {
      return await authApiService.verifyResetCode({ resetCode: verifyCodeForm.resetCode });
    });
  };

  const handleResetPassword = async () => {
    await testEndpoint("Reset Password", async () => {
      return await authApiService.resetPassword({
        token: "sample-token", // In real app, this would come from URL params
        password: resetPasswordForm.password,
        passwordConfirm: resetPasswordForm.passwordConfirm
      });
    });
  };

  const handleChangePassword = async () => {
    if (!authToken) {
      toast.error("Please login first to test change password");
      return;
    }
    await testEndpoint("Change Password", async () => {
      return await authApiService.changePassword(changePasswordForm, authToken);
    });
  };

  const handleUpdateProfile = async () => {
    if (!authToken) {
      toast.error("Please login first to test update profile");
      return;
    }
    await testEndpoint("Update Profile", async () => {
      return await authApiService.updateProfile(updateProfileForm, authToken);
    });
  };

  const handleGetProfile = async () => {
    if (!authToken) {
      toast.error("Please login first to test get profile");
      return;
    }
    await testEndpoint("Get Profile", async () => {
      return await authApiService.getProfile(authToken);
    });
  };

  const handleDeleteAccount = async () => {
    if (!authToken) {
      toast.error("Please login first to test delete account");
      return;
    }
    await testEndpoint("Delete Account", async () => {
      return await authApiService.deleteAccount(authToken);
    });
  };

  const handleLogout = async () => {
    await testEndpoint("Logout", async () => {
      await authApiService.logout();
      setAuthToken("");
      return { message: "Logged out successfully" };
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Authentication API Test Suite</CardTitle>
            <CardDescription>
              Test all authentication endpoints with proper error handling and React input controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Authentication Status */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Authentication Status</h3>
              <p className="text-sm">
                {authToken ? (
                  <span className="text-green-600">✅ Authenticated (Token: {authToken.slice(0, 20)}...)</span>
                ) : (
                  <span className="text-red-600">❌ Not Authenticated</span>
                )}
              </p>
            </div>

            {/* Public Endpoints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Login Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter email"
                      value={loginForm.email || ""}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPasswords.login ? "text" : "password"}
                        placeholder="Enter password"
                        value={loginForm.password || ""}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => togglePasswordVisibility('login')}
                      >
                        {showPasswords.login ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleLogin} disabled={loading !== null} className="w-full">
                    {loading === "Login" && <Loader2 className="animate-spin mr-2" />}
                    Test Login
                  </Button>
                </CardContent>
              </Card>

              {/* Register Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Register</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter name"
                      value={registerForm.name || ""}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter email"
                      value={registerForm.email || ""}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type={showPasswords.register ? "text" : "password"}
                      placeholder="Enter password"
                      value={registerForm.password || ""}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      type={showPasswords.register ? "text" : "password"}
                      placeholder="Confirm password"
                      value={registerForm.passwordConfirm || ""}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleRegister} disabled={loading !== null} className="w-full">
                    {loading === "Register" && <Loader2 className="animate-spin mr-2" />}
                    Test Register
                  </Button>
                </CardContent>
              </Card>

              {/* Forgot Password Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Forgot Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter email"
                      value={forgotPasswordForm.email || ""}
                      onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleForgotPassword} disabled={loading !== null} className="w-full">
                    {loading === "Forgot Password" && <Loader2 className="animate-spin mr-2" />}
                    Test Forgot Password
                  </Button>
                </CardContent>
              </Card>

              {/* Verify Reset Code Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">4. Verify Reset Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="verify-code">Reset Code</Label>
                    <Input
                      id="verify-code"
                      type="text"
                      placeholder="Enter reset code"
                      value={verifyCodeForm.resetCode || ""}
                      onChange={(e) => setVerifyCodeForm(prev => ({ ...prev, resetCode: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleVerifyResetCode} disabled={loading !== null} className="w-full">
                    {loading === "Verify Reset Code" && <Loader2 className="animate-spin mr-2" />}
                    Test Verify Reset Code
                  </Button>
                </CardContent>
              </Card>

              {/* Reset Password Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5. Reset Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reset-password">New Password</Label>
                    <Input
                      id="reset-password"
                      type={showPasswords.reset ? "text" : "password"}
                      placeholder="Enter new password"
                      value={resetPasswordForm.password || ""}
                      onChange={(e) => setResetPasswordForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reset-confirm">Confirm Password</Label>
                    <Input
                      id="reset-confirm"
                      type={showPasswords.reset ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={resetPasswordForm.passwordConfirm || ""}
                      onChange={(e) => setResetPasswordForm(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleResetPassword} disabled={loading !== null} className="w-full">
                    {loading === "Reset Password" && <Loader2 className="animate-spin mr-2" />}
                    Test Reset Password
                  </Button>
                </CardContent>
              </Card>

              {/* Change Password Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">6. Change Password (Auth Required)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="change-current">Current Password</Label>
                    <Input
                      id="change-current"
                      type={showPasswords.change ? "text" : "password"}
                      placeholder="Enter current password"
                      value={changePasswordForm.currentPassword || ""}
                      onChange={(e) => setChangePasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="change-new">New Password</Label>
                    <Input
                      id="change-new"
                      type={showPasswords.change ? "text" : "password"}
                      placeholder="Enter new password"
                      value={changePasswordForm.password || ""}
                      onChange={(e) => setChangePasswordForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="change-confirm">Confirm New Password</Label>
                    <Input
                      id="change-confirm"
                      type={showPasswords.change ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={changePasswordForm.passwordConfirm || ""}
                      onChange={(e) => setChangePasswordForm(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={loading !== null} className="w-full">
                    {loading === "Change Password" && <Loader2 className="animate-spin mr-2" />}
                    Test Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Update Profile Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">7. Update Profile (Auth Required)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="update-name">Name</Label>
                    <Input
                      id="update-name"
                      type="text"
                      placeholder="Enter name"
                      value={updateProfileForm.name || ""}
                      onChange={(e) => setUpdateProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="update-email">Email</Label>
                    <Input
                      id="update-email"
                      type="email"
                      placeholder="Enter email"
                      value={updateProfileForm.email || ""}
                      onChange={(e) => setUpdateProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="update-phone">Phone</Label>
                    <Input
                      id="update-phone"
                      type="tel"
                      placeholder="Enter phone"
                      value={updateProfileForm.phone || ""}
                      onChange={(e) => setUpdateProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleUpdateProfile} disabled={loading !== null} className="w-full">
                    {loading === "Update Profile" && <Loader2 className="animate-spin mr-2" />}
                    Test Update Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Other Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">8. Other Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleGetProfile} disabled={loading !== null || !authToken} className="w-full">
                    {loading === "Get Profile" && <Loader2 className="animate-spin mr-2" />}
                    Test Get Profile
                  </Button>
                  <Button onClick={handleLogout} disabled={loading !== null} className="w-full">
                    {loading === "Logout" && <Loader2 className="animate-spin mr-2" />}
                    Test Logout
                  </Button>
                  <Button 
                    onClick={handleDeleteAccount} 
                    disabled={loading !== null || !authToken} 
                    variant="destructive"
                    className="w-full"
                  >
                    {loading === "Delete Account" && <Loader2 className="animate-spin mr-2" />}
                    Test Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            {Object.keys(results).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Test Results</h3>
                {Object.entries(results).map(([name, result]) => (
                  <Card key={name}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">{name}</span>
                        <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.success ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="text-sm overflow-auto">
                          {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* API Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Public Endpoints</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>POST /api/v1/auth/signup</li>
                      <li>POST /api/v1/auth/signin</li>
                      <li>POST /api/v1/auth/forgotPassword</li>
                      <li>POST /api/v1/auth/verifyResetCode</li>
                      <li>PATCH /api/v1/auth/resetPassword/:token</li>
                      <li>PUT /api/v1/auth/resetPassword</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Authenticated Endpoints</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>PUT /api/v1/users/changeMyPassword</li>
                      <li>PUT /api/v1/users/updateMe</li>
                      <li>GET /api/v1/users/me</li>
                      <li>DELETE /api/v1/users/deleteMe</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
