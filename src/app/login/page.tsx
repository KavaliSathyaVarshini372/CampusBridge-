
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { signInWithEmail, signUpWithEmail } from "../actions/auth";

function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await signInWithEmail(formData);
      if (result.success) {
        // This will be handled by the useAuth effect
      } else {
        toast({
          title: "Sign In Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState('signup');

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await signUpWithEmail(formData);
      if (result.success) {
        toast({
          title: "Sign Up Successful",
          description: "Please sign in with your new account.",
        });
        // Note: The parent component will switch tabs or handle redirect
      } else {
        toast({
          title: "Sign Up Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };
  
  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input id="email-signup" name="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input id="password-signup" name="password" type="password" required minLength={6} />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.email === 'admin@example.com') {
        router.push('/events'); // Admin dashboard
      } else {
        router.push('/'); // Regular user landing page
      }
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Logo />
            <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary">
      <div className="mb-8">
        <Logo isLoginPage={true}/>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in or create an account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
