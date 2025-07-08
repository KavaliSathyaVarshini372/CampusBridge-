import { Mountain } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/events" className={cn("flex items-center gap-2 font-semibold text-lg text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors", className)}>
      <Mountain className="h-6 w-6 text-primary" />
      <span>CampusBridge+</span>
    </Link>
  )
}
