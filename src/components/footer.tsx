
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} CampusBridge+. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Platform</h4>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-primary">
                Events
              </Link>
              <Link href="/collaborate" className="text-sm text-muted-foreground hover:text-primary">
                Collaborate
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Company</h4>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
