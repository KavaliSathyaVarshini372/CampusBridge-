
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" {...props}>
      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c22.69-21.568 35.277-53.798 35.277-91.017z" />
      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.34 221.722 79.82 261.1 130.55 261.1z" />
      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.907 13.925 58.602l42.356-32.782z" />
      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.052 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.82 0 35.34 39.378 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251z" />
    </svg>
);

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const result = await signInWithGoogle();
    
    if (result.success) {
      toast({ title: "Success", description: "Signed in successfully!" });
      // The onAuthStateChanged listener in useAuth will handle the redirect
    } else if (result.message) {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome to CampusBridge+</CardTitle>
          <CardDescription>Sign in with your Google account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button 
            className="w-full"
            onClick={handleGoogleSignIn} 
            disabled={isSubmitting}
            variant="outline"
           >
            <GoogleIcon className="h-5 w-5 mr-2" />
            {isSubmitting ? "Signing in..." : "Sign in with Google"}
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
