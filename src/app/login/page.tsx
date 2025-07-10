"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading, isFirebaseReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/events');
    }
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4 p-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-block mx-auto">
             <Logo className="text-foreground hover:text-foreground/80" />
          </div>
          <CardTitle className="text-2xl">Welcome to CampusBridge+</CardTitle>
          <CardDescription>
            Sign in with your Google account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFirebaseReady ? (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Firebase Not Configured</AlertTitle>
                <AlertDescription>
                 Authentication is currently disabled. Please add your Firebase credentials to the 
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                     .env.local
                  </code>
                   file to enable sign-in.
                </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                Sign in with Google
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
