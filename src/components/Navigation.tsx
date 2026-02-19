import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Recycle, MapPin, Truck, LayoutDashboard, User, Menu, ShieldCheck, Briefcase, Info } from 'lucide-react';
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
        
        {/* Desktop Links - Uber Style Expansion */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <MapPin className="h-3 w-3 group-hover:scale-110 transition-transform" /> Order
          </Link>
          <Link href="/collector" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <Truck className="h-3 w-3 group-hover:scale-110 transition-transform" /> Drive
          </Link>
          <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <Briefcase className="h-3 w-3 group-hover:scale-110 transition-transform" /> Business
          </Link>
          <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <ShieldCheck className="h-3 w-3 group-hover:scale-110 transition-transform" /> Safety
          </Link>
          <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <Info className="h-3 w-3 group-hover:scale-110 transition-transform" /> Impact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin" className="hidden md:flex">
             <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black">
               Fleet Command
             </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 hidden sm:flex">
            <User className="h-5 w-5" />
          </Button>
          <Link href="/dashboard">
             <Button className="bg-black text-white hover:bg-black/90 font-bold px-8 h-12 rounded-full shadow-lg btn-hover-effect">
               Request Pickup
             </Button>
          </Link>
          
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-black/5">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-4 border-primary">
                <div className="flex flex-col gap-8 pt-12">
                  <Link href="/dashboard" className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Book</Link>
                  <Link href="/collector" className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Drive</Link>
                  <Link href="/admin" className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Fleet Command</Link>
                  <div className="h-px bg-black/10 w-full" />
                  <Link href="#" className="text-xl font-bold uppercase tracking-widest text-black/40">Business</Link>
                  <Link href="#" className="text-xl font-bold uppercase tracking-widest text-black/40">Safety</Link>
                  <Link href="#" className="text-xl font-bold uppercase tracking-widest text-black/40">Impact</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
