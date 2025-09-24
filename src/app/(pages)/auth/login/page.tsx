"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/src/components/ui/form";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FormControl, FormField, FormItem, FormLabel } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const form = useForm<LoginFormValues>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/products";
  const [signingIn, setSigningIn] = useState(false);

  async function onSubmit(values: LoginFormValues) {
    setSigningIn(true);
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (response?.ok) {
        router.push(callbackURL);
      }
    } catch (error: unknown) {
      alert(JSON.stringify(error));
    }
    setSigningIn(false);
  
}


return (
 <div className="min-h-screen gradient-animated flex items-center justify-center p-4">
   <div className="w-full max-w-md">
     <div className="glass rounded-2xl p-8 shadow-primary">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
         <p className="text-muted-foreground">Sign in to your account</p>
       </div>
       
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field} 
                    className="border-gradient focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
              </FormItem>
            )}
          /> 
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your password"  
                    type="password"
                    {...field} 
                    className="border-gradient focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            disabled={signingIn} 
            type="submit" 
            className="w-full btn-gradient h-12 text-base font-medium"
          >
            {signingIn && <Loader2 className="animate-spin mr-2"/>}
            Sign In
          </Button>
          
          <div className="text-center space-y-3">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-gradient hover:underline font-medium"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-muted-foreground">
              {"Don't have an account?"}{" "}
              <Link href="/auth/register" className="text-gradient hover:underline font-medium">Sign up</Link>
            </div>
          </div>
        </form>
      </Form>
     </div>
   </div>
 </div>
  
);
}
