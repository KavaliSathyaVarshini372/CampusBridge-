"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const AuthSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormValues = z.infer<typeof AuthSchema>;

function AuthForm({ mode, onSubmit, isSubmitting }: { mode: 'login' | 'signup', onSubmit: SubmitHandler<AuthFormValues>, isSubmitting: boolean }) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting
            ? mode === 'login' ? "Signing In..." : "Signing Up..."
            : mode === 'login' ? "Sign In" : "Sign Up"}
        </Button>
      </form>
    </Form>
  )
}

export default function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/events');
    }
  }, [user, loading, router]);
  
  if (loading || user) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Logo />
            <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAuth = (mode: 'login' | 'signup'): SubmitHandler<AuthFormValues> => async (data) => {
    setIsSubmitting(true);
    if (mode === 'login') {
      await signInWithEmail(data.email, data.password);
    } else {
      await signUpWithEmail(data.email, data.password);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Access your account or create a new one.</CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
              <AuthForm mode="login" onSubmit={handleAuth('login')} isSubmitting={isSubmitting} />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <AuthForm mode="signup" onSubmit={handleAuth('signup')} isSubmitting={isSubmitting} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
