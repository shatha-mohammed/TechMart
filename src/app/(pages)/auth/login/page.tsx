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
 <div className="max-w-2xl mx-auto my-12">
   <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
          </FormItem>
        )}
      /> <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>password</FormLabel>
            <FormControl>
              <Input placeholder="************"  type="password"{...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button disabled={signingIn} type="submit">
        {signingIn && <Loader2 className="animate-spin"/>}
        Signin</Button>
      
      <div className="text-center space-y-2">
        <Link 
          href="/auth/forgot-password" 
          className="text-sm text-primary hover:underline"
        >
          Forgot your password?
        </Link>
        <div className="text-sm text-muted-foreground">
          {"Don't have an account?"}{" "}
          <Link href="/auth/register" className="text-primary hover:underline">Sign up</Link>
        </div>
      </div>
    </form>
  </Form>
 </div>
  
);
}
