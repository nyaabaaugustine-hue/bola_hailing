import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle, MapPin, Truck, LayoutDashboard, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navigation() {
  return (
    <nav className="fixed top-0 z-50 w-full glass-nav h-20">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-xl group-hover:bg-primary transition-colors">
            <Recycle className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-black tracking-tighter text-black uppercase">
            Borla<span className="text-primary">Haze</span>
          </span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2">
            <MapPin className="h-3 w-3" /> Book Pickup
          </Link>
          <Link href="/collector" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2">
            <Truck className="h-3 w-3" /> Drive With Us
          </Link>
          <Link href="/admin" className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-3 w-3" /> Fleet Command
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 hidden sm:flex">
            <User className="h-5 w-5" />
          </Button>
          <Link href="/dashboard">
             <Button className="bg-black text-white hover:bg-black/90 font-bold px-8 h-12 rounded-full shadow-lg btn-hover-effect">
               Request Now
             </Button>
          </Link>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 pt-12">
                  <Link href="/dashboard" className="text-2xl font-black uppercase tracking-tighter">Book</Link>
                  <Link href="/collector" className="text-2xl font-black uppercase tracking-tighter">Drive</Link>
                  <Link href="/admin" className="text-2xl font-black uppercase tracking-tighter">Admin</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}