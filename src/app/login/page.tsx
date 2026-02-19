
'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Truck, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      title: "Customer",
      desc: "I want to request a trash pickup",
      icon: User,
      href: "/dashboard",
      color: "bg-primary"
    },
    {
      title: "Collector",
      desc: "I want to earn by collecting waste",
      icon: Truck,
      href: "/collector",
      color: "bg-secondary"
    },
    {
      title: "Admin",
      desc: "I am managing fleet operations",
      icon: ShieldCheck,
      href: "/admin",
      color: "bg-black"
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-body overflow-x-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        {loginBg && (
          <Image
            src={loginBg.imageUrl}
            alt={loginBg.description}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <Navigation />

      <main className="relative z-10 container mx-auto pt-32 pb-12 px-4 md:pt-48 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-5xl space-y-12">
          {!user ? (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <Card className="uber-shadow border-none max-w-md mx-auto overflow-hidden rounded-[2.5rem] bg-white/95 shadow-2xl">
                <CardHeader className="p-12 pb-6 text-center">
                  <CardTitle className="font-headline text-4xl font-black uppercase tracking-tighter mb-4">Welcome</CardTitle>
                  <CardDescription className="text-lg font-medium text-black/60">Log in or sign up to access the DEMO infrastructure.</CardDescription>
                </CardHeader>
                <CardContent className="p-12 pt-6 space-y-6">
                  <Button 
                    className="w-full h-16 rounded-2xl font-black bg-black text-white hover:bg-black/90 text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-black/10"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-white/95 px-4 text-black/40">Secure Infrastructure</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-black/40 px-8 font-bold uppercase tracking-tighter">
                    Sustainable Waste Hailing for Ghana
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-4 mb-12">
                <h1 className="font-headline text-5xl font-black tracking-tighter uppercase text-white shadow-sm">Select Your Workspace</h1>
                <p className="text-xl text-white/80 font-medium">Signed in as <span className="text-primary font-black">{user.displayName}</span>.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {roles.map((role, i) => (
                  <Card key={i} className="uber-shadow border-none hover:translate-y-[-8px] transition-all duration-300 group overflow-hidden rounded-[2.5rem] bg-white/95">
                    <CardHeader className="p-8 pb-4">
                      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform ${role.color} shadow-lg`}>
                        <role.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="font-headline text-2xl uppercase tracking-tighter">{role.title}</CardTitle>
                      <CardDescription className="font-medium text-black/60 pt-2">{role.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                      <Link href={role.href}>
                        <Button className="w-full h-14 rounded-xl font-black bg-black text-white hover:bg-primary transition-colors active:scale-95 shadow-lg">
                          ENTER DASHBOARD <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center pt-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Verified Multi-Role Entry • Sustainable Ghana • © 2025 DEMO</p>
          </div>
        </div>
      </main>
    </div>
  );
}
