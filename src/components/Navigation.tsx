'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Truck, ShieldCheck, LogOut, User, Globe, Moon, Sun } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as 'light' | 'dark' | null : null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 z-50 w-full glass-nav h-24">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          {logo ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-[7%]">
              <Image 
                src={logo.imageUrl} 
                alt="WasteGo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-[7%] bg-primary text-white shadow-xl group-hover:bg-primary/90 transition-colors">
              <span className="font-headline text-2xl font-black italic">W</span>
            </div>
          )}
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <MapPin className="h-3 w-3 group-hover:scale-110 transition-transform" /> Order
          </Link>
          <Link href="/collector" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <Truck className="h-3 w-3 group-hover:scale-110 transition-transform" /> Drive
          </Link>
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <ShieldCheck className="h-3 w-3 group-hover:scale-110 transition-transform" /> Command
          </Link>
          <Link href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
            <Globe className="h-3 w-3 group-hover:scale-110 transition-transform" /> Impact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="hidden sm:flex items-center gap-2 font-bold text-sm">
                      <User className="h-4 w-4" /> {user.displayName?.split(' ')[0] || 'Account'}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link href="/login">
                    <Button variant="ghost" className="font-bold text-sm px-4">Log in</Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-black text-white dark:bg-primary dark:text-white hover:bg-black/90 font-bold px-6 h-11 rounded-full shadow-lg btn-hover-effect">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
          
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-black/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-4 border-primary">
                <SheetTitle className="text-left font-black uppercase tracking-tighter text-2xl mb-8">Navigation</SheetTitle>
                <div className="flex flex-col gap-6">
                  <Link href="/dashboard" className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Book Pickup</Link>
                  <Link href="/collector" className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Drive</Link>
                  <Link href="/admin" className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors">Command</Link>
                  <div className="h-px bg-black/10 w-full" />
                  {user ? (
                    <Button variant="outline" className="h-14 rounded-xl font-black border-2" onClick={handleLogout}>LOGOUT</Button>
                  ) : (
                    <Link href="/login" className="w-full">
                      <Button className="w-full h-14 rounded-xl font-black bg-black text-white dark:bg-primary">GET STARTED</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
