"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { apiServices } from "@/src/services/api";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await apiServices.forgotPassword({ email });
    setIsSubmitted(true);
    toast.success("Password reset email sent!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to send reset email");
    }
  } finally {
    setIsLoading(false);
  }
};


  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Try Different Email
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/auth/login">
                    Back to Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a reset link
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
