
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./logo";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./user-nav";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {loading ? (
                <Skeleton className="h-9 w-24" />
            ) : user ? (
                <UserNav />
            ) : (
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/login">Sign Up</Link>
                    </Button>
                </nav>
            )}
        </div>
      </div>
    </header>
  );
}
