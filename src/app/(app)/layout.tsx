
"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Calendar,
  Users,
  MessageSquare,
  Newspaper,
  Shield,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/collaborate', icon: Users, label: 'Collaborate' },
  { href: '/blog', icon: Newspaper, label: 'Blog' },
  { href: '/contact', icon: MessageSquare, label: 'Contact Us' },
  { href: '/admin', icon: Shield, label: 'Admin', admin: true },
];

function NavSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut, isFirebaseReady } = useAuth();
  
  useEffect(() => {
    if (isFirebaseReady && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, isFirebaseReady]);

  if (!isFirebaseReady || loading || !user) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Logo />
            <Skeleton className="h-8 w-48 mt-4" />
        </div>
      </div>
    );
  }
  
  const userRole = user?.email === 'admin@example.com' ? 'admin' : 'user';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.admin && userRole !== 'admin') return null;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{
                        children: item.label,
                        side: 'right',
                        align: 'center',
                      }}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} tooltip={{children: "Logout", side: "right", align: "center"}}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1"></div>
            <UserNav />
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
