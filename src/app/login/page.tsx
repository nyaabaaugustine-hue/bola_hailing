"use client";

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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

  return (
    <div className="min-h-screen bg-background font-body">
      <Navigation />
      <main className="container mx-auto pt-32 pb-12 px-4 md:pt-48">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="font-headline text-5xl font-black tracking-tighter uppercase">Portal Entry</h1>
            <p className="text-xl text-muted-foreground font-medium">Select your role to access your dashboard.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {roles.map((role, i) => (
              <Card key={i} className="uber-shadow border-none hover:translate-y-[-8px] transition-all duration-300 group overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform ${role.color}`}>
                    <role.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline text-2xl uppercase tracking-tighter">{role.title}</CardTitle>
                  <CardDescription className="font-medium text-black/60 pt-2">{role.desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <Link href={role.href}>
                    <Button className="w-full h-14 rounded-xl font-black bg-black text-white hover:bg-black/90 group-hover:bg-primary transition-colors">
                      LOGIN NOW <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center pt-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Secure Multi-Role Access • DEMO Infrastructure</p>
          </div>
        </div>
      </main>
    </div>
  );
}
