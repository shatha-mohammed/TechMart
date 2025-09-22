"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { apiServices } from "@/src/services/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    if (t) setToken(t);
  }, []);

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

  const handleLogin = async () => {
    await testEndpoint("Login (for protected)", async () => {
      const res: any = await apiServices.login(loginForm.email, loginForm.password);
      const apiToken = res?.token || res?.data?.token;
      if (apiToken && typeof window !== 'undefined') {
        localStorage.setItem('token', apiToken);
        setToken(apiToken);
      }
      return res;
    });
  };

  const testForgotPassword = async () => {
    return await apiServices.forgotPassword({
      email: "routeegyptnodejs@gmail.com"
    });
  };

  const testVerifyResetCode = async () => {
    return await apiServices.verifyResetCode({
      resetCode: "535863"
    });
  };

  const testChangePassword = async () => {
    return await apiServices.changePassword({
      currentPassword: "123456",
      password: "pass1234",
      passwordConfirm: "pass1234"
    });
  };

  const testResetPasswordWithEmail = async () => {
    return await apiServices.resetPasswordWithEmail({
      email: "ahmedmutti@gmail.com",
      newPassword: "Ahmed@123"
    });
  };

  const testUpdateProfile = async () => {
    return await apiServices.updateMe({
      name: "Ahmed Abd Al-Muti",
      email: "ahmedmutt2i2@gmail.com",
      phone: "01010700700"
    });
  };

  const testAllEndpoints = async () => {
    const endpoints = [
      { name: "Forgot Password", test: testForgotPassword },
      { name: "Verify Reset Code", test: testVerifyResetCode },
      { name: "Change Password", test: testChangePassword },
      { name: "Reset Password with Email", test: testResetPasswordWithEmail },
      { name: "Update Profile", test: testUpdateProfile }
    ];

    for (const endpoint of endpoints) {
      await testEndpoint(endpoint.name, endpoint.test);
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const protectedDisabled = !token || loading !== null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication API Test Suite</CardTitle>
            <CardDescription>
              Test all authentication endpoints to ensure they work correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick login for protected calls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Login (for protected requests)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="q-email">Email</Label>
                    <Input id="q-email" type="email" value={loginForm.email} onChange={(e)=>setLoginForm(prev=>({...prev,email:e.target.value}))} />
                  </div>
                  <div>
                    <Label htmlFor="q-pass">Password</Label>
                    <Input id="q-pass" type="password" value={loginForm.password} onChange={(e)=>setLoginForm(prev=>({...prev,password:e.target.value}))} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleLogin} disabled={loading !== null}>
                    {loading === "Login (for protected)" && <Loader2 className="animate-spin mr-2" />}
                    Login and Save Token
                  </Button>
                  {token && <span className="text-xs text-muted-foreground">Token saved</span>}
                </div>
              </CardContent>
            </Card>
            
            {/* Test All Button */}
            <div className="flex gap-4">
              <Button 
                onClick={testAllEndpoints}
                disabled={loading !== null}
                className="flex-1"
              >
                {loading === "all" && <Loader2 className="animate-spin mr-2" />}
                Test All Endpoints
              </Button>
            </div>

            {/* Individual Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => testEndpoint("Forgot Password", testForgotPassword)}
                disabled={loading !== null}
                variant="outline"
              >
                {loading === "Forgot Password" && <Loader2 className="animate-spin mr-2" />}
                Test Forgot Password
              </Button>

              <Button 
                onClick={() => testEndpoint("Verify Reset Code", testVerifyResetCode)}
                disabled={loading !== null}
                variant="outline"
              >
                {loading === "Verify Reset Code" && <Loader2 className="animate-spin mr-2" />}
                Test Verify Reset Code
              </Button>

              <Button 
                onClick={() => testEndpoint("Change Password", testChangePassword)}
                disabled={protectedDisabled}
                variant="outline"
              >
                {loading === "Change Password" && <Loader2 className="animate-spin mr-2" />}
                Test Change Password (auth)
              </Button>

              <Button 
                onClick={() => testEndpoint("Reset Password with Email", testResetPasswordWithEmail)}
                disabled={loading !== null}
                variant="outline"
              >
                {loading === "Reset Password with Email" && <Loader2 className="animate-spin mr-2" />}
                Test Reset Password with Email
              </Button>

              <Button 
                onClick={() => testEndpoint("Update Profile", testUpdateProfile)}
                disabled={protectedDisabled}
                variant="outline"
                className="md:col-span-2"
              >
                {loading === "Update Profile" && <Loader2 className="animate-spin mr-2" />}
                Test Update Profile (auth)
              </Button>
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
                <div>
                  <h4 className="font-medium">1. Forgot Password</h4>
                  <p className="text-sm text-muted-foreground">
                    POST /api/v1/auth/forgotPasswords<br/>
                    Body: {`{ "email": "user@example.com" }`}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">2. Verify Reset Code</h4>
                  <p className="text-sm text-muted-foreground">
                    POST /api/v1/auth/verifyResetCode<br/>
                    Body: {`{ "resetCode": "123456" }`}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">3. Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    PUT /api/v1/users/changeMyPassword<br/>
                    Body: {`{ "currentPassword": "old", "password": "new", "rePassword": "new" }`}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">4. Reset Password with Email</h4>
                  <p className="text-sm text-muted-foreground">
                    PUT /api/v1/auth/resetPassword<br/>
                    Body: {`{ "email": "user@example.com", "newPassword": "newpass" }`}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">5. Update Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    PUT /api/v1/users/updateMe<br/>
                    Body: {`{ "name": "New Name", "email": "new@email.com", "phone": "1234567890" }`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
