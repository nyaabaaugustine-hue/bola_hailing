import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle, MapPin, Truck, LayoutDashboard } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Recycle className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
            Borla<span className="text-primary">Haze</span>
          </span>
        </Link>
        <div className="hidden md:flex md:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <MapPin className="h-4 w-4" /> Request Pickup
          </Link>
          <Link href="/collector" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Truck className="h-4 w-4" /> Collector Portal
          </Link>
          <Link href="/admin" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Admin
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:inline-flex border-primary text-primary hover:bg-primary/10">Log In</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
        </div>
      </div>
    </nav>
  );
}