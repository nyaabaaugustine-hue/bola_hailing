import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle, MapPin, Truck, LayoutDashboard, User } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform">
            <Recycle className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-black tracking-tighter text-foreground">
            BORLA<span className="text-primary font-light tracking-widest">HAZE</span>
          </span>
        </Link>
        
        {/* Mobile Hidden Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <MapPin className="h-4 w-4" /> Book
          </Link>
          <Link href="/collector" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <Truck className="h-4 w-4" /> Drive
          </Link>
          <Link href="/admin" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex rounded-full h-10 w-10 p-0 hover:bg-muted">
            <User className="h-5 w-5" />
          </Button>
          <Link href="/dashboard">
             <Button className="bg-black text-white hover:bg-black/90 font-bold px-6 rounded-full shadow-lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}