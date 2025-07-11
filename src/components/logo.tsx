
import { Mountain } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className, isLoginPage = false }: { className?: string, isLoginPage?: boolean }) {
  const textColor = isLoginPage ? 'text-foreground' : 'text-sidebar-foreground';

  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold text-lg transition-colors", className)}>
      <Mountain className="h-6 w-6 text-primary" />
      <span className={isLoginPage ? 'text-foreground' : 'text-inherit'}>CampusBridge+</span>
    </Link>
  )
}
