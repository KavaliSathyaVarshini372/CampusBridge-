import { Mountain } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/events" className="flex items-center gap-2 font-semibold text-lg text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
      <Mountain className="h-6 w-6 text-primary" />
      <span>CampusBridge+</span>
    </Link>
  )
}
